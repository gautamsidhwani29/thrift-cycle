import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const payment = await prisma.demoPayment.findFirst({
    where: { token, createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) } },
    select: { status: true },
  });
  if (!payment) return NextResponse.json({ error: "Payment session expired." }, { status: 404 });
  return NextResponse.json({ status: payment.status });
}
