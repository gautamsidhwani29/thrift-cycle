import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  "Clothing",
  "Home & Living",
  "Electronics",
  "Books",
  "Bags",
  "Sports & Outdoors",
  "Toys & Games",
  "Accessories",
];

const listingSeeds = [
  { id: "linen-shirt", seller: "maya@thriftcycle.test", category: "Clothing", title: "Relaxed linen shirt", description: "Soft sage linen shirt, freshly washed and ready for a new wardrobe.", condition: "LIKE_NEW", disposition: "RESALE", price: 650, city: "Indiranagar", status: "APPROVED" },
  { id: "reading-chair", seller: "arjun@thriftcycle.test", category: "Home & Living", title: "Mid-century reading chair", description: "A comfortable solid wood chair with plenty of life left in it.", condition: "GOOD", disposition: "RESALE", price: 2800, city: "Jayanagar", status: "APPROVED" },
  { id: "camera", seller: "maya@thriftcycle.test", category: "Electronics", title: "Film camera, ready to shoot", description: "Working film camera with a carry case. Great for a first roll.", condition: "GOOD", disposition: "RESALE", price: 3400, city: "Koramangala", status: "APPROVED" },
  { id: "cookbooks", seller: "arjun@thriftcycle.test", category: "Books", title: "A little cookbook collection", description: "A bundle of well-loved cookbooks looking for a new kitchen shelf.", condition: "GOOD", disposition: "DONATION", price: null, city: "Malleshwaram", status: "APPROVED" },
  { id: "plant-stand", seller: "maya@thriftcycle.test", category: "Home & Living", title: "Handmade wooden plant stand", description: "A handmade stand for a favourite plant and a sunny corner.", condition: "LIKE_NEW", disposition: "RESALE", price: 900, city: "Whitefield", status: "APPROVED" },
  { id: "backpack", seller: "arjun@thriftcycle.test", category: "Bags", title: "Everyday canvas backpack", description: "Roomy canvas backpack, sturdy straps, and freshly cleaned.", condition: "GOOD", disposition: "RESALE", price: 500, city: "HSR Layout", status: "APPROVED" },
  { id: "yoga-mat", seller: "maya@thriftcycle.test", category: "Sports & Outdoors", title: "Cork yoga mat", description: "A gently used cork yoga mat ready for a new routine.", condition: "LIKE_NEW", disposition: "DONATION", price: null, city: "Indiranagar", status: "APPROVED" },
  { id: "desk-lamp", seller: "arjun@thriftcycle.test", category: "Home & Living", title: "Brass-tone desk lamp", description: "Working desk lamp with a warm glow and a clean shade.", condition: "GOOD", disposition: "RESALE", price: 750, city: "Basavanagudi", status: "APPROVED" },
  { id: "sneakers", seller: "maya@thriftcycle.test", category: "Clothing", title: "Classic canvas sneakers", description: "Comfortable canvas sneakers, size 39, with plenty of wear left.", condition: "FAIR", disposition: "RESALE", price: 350, city: "JP Nagar", status: "PENDING_REVIEW" },
  { id: "puzzle", seller: "arjun@thriftcycle.test", category: "Toys & Games", title: "Garden birds jigsaw puzzle", description: "A complete 500-piece puzzle with a colourful garden birds print.", condition: "LIKE_NEW", disposition: "DONATION", price: null, city: "Rajajinagar", status: "PENDING_REVIEW" },
  { id: "headphones", seller: "maya@thriftcycle.test", category: "Electronics", title: "Over-ear studio headphones", description: "Tested over-ear headphones with clear sound and a comfortable fit.", condition: "GOOD", disposition: "RESALE", price: 1200, city: "Electronic City", status: "APPROVED" },
  { id: "dining-set", seller: "arjun@thriftcycle.test", category: "Home & Living", title: "Four ceramic side plates", description: "A matching set of four ceramic plates, ready for another table.", condition: "GOOD", disposition: "DONATION", price: null, city: "Malleshwaram", status: "PENDING_REVIEW" },
];

async function main() {
  const passwordHash = await bcrypt.hash("Admin@12345", 12);
  const demoPasswordHash = await bcrypt.hash("CycleDemo123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@thriftcycle.test" },
    update: { name: "THRIFTCYCLE Admin", passwordHash, role: "ADMIN", verificationStatus: "VERIFIED" },
    create: { name: "THRIFTCYCLE Admin", email: "admin@thriftcycle.test", passwordHash, role: "ADMIN", verificationStatus: "VERIFIED", city: "Bengaluru" },
  });
  const maya = await prisma.user.upsert({
    where: { email: "maya@thriftcycle.test" },
    update: { name: "Maya Rao", passwordHash: demoPasswordHash, role: "USER", verificationStatus: "VERIFIED", city: "Bengaluru" },
    create: { name: "Maya Rao", email: "maya@thriftcycle.test", passwordHash: demoPasswordHash, role: "USER", verificationStatus: "VERIFIED", city: "Bengaluru" },
  });
  const arjun = await prisma.user.upsert({
    where: { email: "arjun@thriftcycle.test" },
    update: { name: "Arjun Nair", passwordHash: demoPasswordHash, role: "USER", verificationStatus: "VERIFIED", city: "Bengaluru" },
    create: { name: "Arjun Nair", email: "arjun@thriftcycle.test", passwordHash: demoPasswordHash, role: "USER", verificationStatus: "VERIFIED", city: "Bengaluru" },
  });
  await prisma.user.upsert({
    where: { email: "tara@thriftcycle.test" },
    update: { name: "Tara Kapoor", passwordHash: demoPasswordHash, role: "USER", verificationStatus: "UNVERIFIED", city: "Bengaluru" },
    create: { name: "Tara Kapoor", email: "tara@thriftcycle.test", passwordHash: demoPasswordHash, role: "USER", verificationStatus: "UNVERIFIED", city: "Bengaluru" },
  });

  const categoryByName = new Map<string, string>();
  for (const name of categories) {
    const category = await prisma.category.upsert({
      where: { slug: name.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-") },
      update: { name },
      create: { name, slug: name.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-") },
    });
    categoryByName.set(name, category.id);
  }

  await prisma.order.deleteMany({ where: { id: { in: ["demo-order-buy", "demo-order-donation"] } } });
  for (const item of listingSeeds) {
    const { seller, category, ...listingData } = item;
    const categoryId = categoryByName.get(category);
    if (!categoryId) throw new Error(`Missing category: ${category}`);
    const sellerId = seller === maya.email ? maya.id : arjun.id;
    await prisma.listing.upsert({
      where: { id: item.id },
      update: { ...listingData, sellerId, categoryId },
      create: { ...listingData, sellerId, categoryId },
    });
  }

  const buyOrder = await prisma.order.create({
    data: {
      id: "demo-order-buy", listingId: "headphones", buyerId: arjun.id, sellerId: maya.id,
      status: "COLLECTION_SCHEDULED", amount: 1200, paymentType: "TEST",
      events: { create: [
        { from: null, to: "PLACED", note: "Buyer placed the order", actorId: arjun.id },
        { from: "PLACED", to: "PAYMENT_CONFIRMED", note: "Test payment confirmed", actorId: arjun.id },
        { from: "PAYMENT_CONFIRMED", to: "COLLECTION_SCHEDULED", note: "Collection arranged by THRIFTCYCLE", actorId: admin.id },
      ] },
    },
  });
  const donationOrder = await prisma.order.create({
    data: {
      id: "demo-order-donation", listingId: "cookbooks", buyerId: maya.id, sellerId: arjun.id,
      status: "COLLECTED", amount: 0, paymentType: "DONATION",
      events: { create: [
        { from: null, to: "PLACED", note: "Donation claimed", actorId: maya.id },
        { from: "PLACED", to: "COLLECTION_SCHEDULED", note: "Collection arranged by THRIFTCYCLE", actorId: admin.id },
        { from: "COLLECTION_SCHEDULED", to: "COLLECTED", note: "Donation collected", actorId: admin.id },
      ] },
    },
  });

  console.log(`Seeded admin plus 3 users, ${categories.length} categories, ${listingSeeds.length} listings, and ${[buyOrder, donationOrder].length} orders.`);
  console.log("Admin: admin@thriftcycle.test / Admin@12345");
  console.log("Verified user: maya@thriftcycle.test / CycleDemo123!");
  console.log("Verified user: arjun@thriftcycle.test / CycleDemo123!");
  console.log("Unverified user: tara@thriftcycle.test / CycleDemo123!");
}

main().finally(async () => prisma.$disconnect());
