"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type PurchaseResult = { error?: string; orderId?: string; deliveryStart?: string; deliveryEnd?: string; paymentMethod?: string };

export async function createDemoPayment(listingId: string): Promise<{ error?: string; token?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in again." };
  const listing = await prisma.listing.findUnique({ where: { id: listingId }, select: { price: true, disposition: true, status: true, sellerId: true } });
  if (!listing || listing.status !== "APPROVED" || listing.disposition === "DONATION" || listing.sellerId === session.user.id) return { error: "This item cannot be paid for right now." };
  if (listing.price === null || listing.price <= 0) return { error: "This listing does not have a valid price." };
  const token = await prisma.demoPayment.create({ data: { listingId, buyerId: session.user.id, amount: listing.price } });
  return { token: token.token };
}

export async function confirmDemoPayment(formData: FormData): Promise<void> {
  const token = formData.get("token");
  if (typeof token !== "string" || !token) return;
  await prisma.demoPayment.updateMany({ where: { token, status: "PENDING", createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) } }, data: { status: "PAID" } });
  revalidatePath(`/demo-pay/${token}`);
  redirect(`/demo-pay/${token}`);
}

export async function placeOrder(_previous: PurchaseResult, formData: FormData): Promise<PurchaseResult> {
  const listingId = formData.get("listingId");
  const phone = formData.get("phone");
  const fulfillmentMethod = formData.get("fulfillmentMethod");
  const address = formData.get("address");
  const city = formData.get("city");
  const postalCode = formData.get("postalCode");
  const paymentMethod = formData.get("paymentMethod");
  const demoPaymentToken = formData.get("demoPaymentToken");
  if (typeof listingId !== "string" || !listingId) return { error: "This listing could not be found." };
  if (typeof phone !== "string" || !/^\+?[0-9\s()-]{8,20}$/.test(phone.trim())) return { error: "Enter a valid contact phone number." };
  if (fulfillmentMethod !== "PICKUP" && fulfillmentMethod !== "DELIVERY") return { error: "Choose pickup or delivery." };
  if (paymentMethod !== "QR" && paymentMethod !== "COD") return { error: "Choose QR payment or cash on delivery." };
  if (paymentMethod === "QR" && (typeof demoPaymentToken !== "string" || !demoPaymentToken)) return { error: "Scan the QR code and complete the payment on your phone first." };
  if (fulfillmentMethod === "DELIVERY" && [address, city, postalCode].some((value) => typeof value !== "string" || !value.trim())) {
    return { error: "Enter the delivery address, city, and postal code." };
  }

  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in before placing an order." };
  const buyer = await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, role: true, verificationStatus: true } });
  if (!buyer) return { error: "Your session has expired. Please sign in again." };
  if (buyer.role !== "ADMIN" && buyer.verificationStatus !== "VERIFIED") return { error: "Your account must be verified before you can place an order." };

  let orderId: string;
  try {
    const order = await prisma.$transaction(async (tx) => {
      const listing = await tx.listing.findUnique({ where: { id: listingId } });
      if (!listing || listing.status !== "APPROVED") throw new Error("LISTING_UNAVAILABLE");
      if (listing.disposition !== "DONATION" && (listing.price === null || listing.price <= 0)) throw new Error("INVALID_PRICE");
      if (listing.sellerId === buyer.id) throw new Error("OWN_LISTING");
      const reserved = await tx.listing.updateMany({ where: { id: listing.id, status: "APPROVED" }, data: { status: "RESERVED" } });
      if (reserved.count !== 1) throw new Error("LISTING_UNAVAILABLE");

      const isDonation = listing.disposition === "DONATION";
      const isCashOnDelivery = !isDonation && paymentMethod === "COD";
      if (!isDonation && !isCashOnDelivery) {
        const payment = await tx.demoPayment.findFirst({ where: { token: demoPaymentToken as string, listingId: listing.id, buyerId: buyer.id, amount: listing.price ?? 0, status: "PAID", createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) } } });
        if (!payment) throw new Error("PAYMENT_REQUIRED");
        await tx.demoPayment.update({ where: { token: payment.token }, data: { status: "USED" } });
      }
      const order = await tx.order.create({
        data: {
          listingId: listing.id,
          buyerId: buyer.id,
          sellerId: listing.sellerId,
          status: isDonation || isCashOnDelivery ? "PLACED" : "PAYMENT_CONFIRMED",
          amount: isDonation ? 0 : (listing.price ?? 0),
          paymentType: isDonation ? "DONATION" : isCashOnDelivery ? "COD" : "QR_DEMO",
          buyerPhone: phone.trim(),
          fulfillmentMethod,
          shippingAddress: fulfillmentMethod === "DELIVERY" && typeof address === "string" ? address.trim() : null,
          shippingCity: fulfillmentMethod === "DELIVERY" && typeof city === "string" ? city.trim() : null,
          shippingPostalCode: fulfillmentMethod === "DELIVERY" && typeof postalCode === "string" ? postalCode.trim() : null,
          events: { create: isDonation ? [
            { from: null, to: "PLACED", note: "Donation claimed", actorId: buyer.id },
          ] : isCashOnDelivery ? [
            { from: null, to: "PLACED", note: "Order placed. Cash payment of ₹" + (listing.price ?? 0).toLocaleString("en-IN") + " is due at handoff.", actorId: buyer.id },
          ] : [
            { from: null, to: "PLACED", note: "Order placed", actorId: buyer.id },
            { from: "PLACED", to: "PAYMENT_CONFIRMED", note: "Simulated QR payment confirmed. No real payment was collected.", actorId: buyer.id },
          ] },
        },
      });
      return order;
    });

    revalidatePath(`/listing/${listingId}`);
    revalidatePath("/browse");
    revalidatePath("/dashboard");
    revalidatePath("/my-listings");
    orderId = order.id;
  } catch (error) {
    if (error instanceof Error && error.message === "OWN_LISTING") return { error: "You can’t place an order for your own listing." };
    if (error instanceof Error && error.message === "LISTING_UNAVAILABLE") return { error: "This listing is no longer available. Browse to find another." };
    if (error instanceof Error && error.message === "INVALID_PRICE") return { error: "This listing does not have a valid price and cannot be checked out." };
    if (error instanceof Error && error.message === "PAYMENT_REQUIRED") return { error: "The phone payment is not confirmed yet. Scan the QR and try again." };
    console.error("Order placement failed", error);
    return { error: "We couldn’t place this order. Please try again." };
  }
  revalidatePath(`/orders/${orderId}`);
  redirect(`/orders/${orderId}?placed=1`);
}

export type OrderUpdateResult = { error?: string; success?: string };

export async function advanceOrder(_previous: OrderUpdateResult, formData: FormData): Promise<OrderUpdateResult> {
  const orderId = formData.get("orderId");
  if (typeof orderId !== "string" || !orderId) return { error: "Order not found." };
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in again." };

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return { error: "Order not found." };
    const isSeller = order.sellerId === session.user.id;
    const isBuyer = order.buyerId === session.user.id;
    let nextStatus: string;
    let note: string;
    if (isSeller && ["PLACED", "PAYMENT_CONFIRMED"].includes(order.status)) {
      nextStatus = "PREPARING";
      note = "Seller is preparing the item";
    } else if (isSeller && order.status === "PREPARING") {
      nextStatus = order.fulfillmentMethod === "DELIVERY" ? "SHIPPED" : "READY_FOR_PICKUP";
      note = order.fulfillmentMethod === "DELIVERY" ? "Seller marked the item as shipped" : "Item is ready for pickup";
    } else if (isBuyer && order.status === "READY_FOR_PICKUP") {
      nextStatus = "COMPLETED";
      note = "Buyer confirmed pickup";
    } else if (isBuyer && order.status === "SHIPPED") {
      nextStatus = "DELIVERED";
      note = "Buyer confirmed delivery";
    } else {
      return { error: "There’s no order update available for your account right now." };
    }

    await prisma.$transaction(async (tx) => {
      const updated = await tx.order.updateMany({ where: { id: order.id, status: order.status }, data: { status: nextStatus } });
      if (updated.count !== 1) throw new Error("ORDER_CHANGED");
      await tx.orderEvent.create({ data: { orderId: order.id, from: order.status, to: nextStatus, note, actorId: session.user.id } });
    });
    revalidatePath(`/orders/${order.id}`);
    revalidatePath("/dashboard");
    return { success: "Order updated." };
  } catch (error) {
    console.error("Order update failed", error);
    return { error: "We couldn’t update this order. Refresh and try again." };
  }
}
