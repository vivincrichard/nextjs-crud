import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const productId = Number(params.id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const productId = Number(params.id);
  const idExist = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!idExist) {
    return NextResponse.json({ error: "Product Id invalid" }, { status: 404 });
  }
  const body = await req.json();
  const { name, description, price, quantity_in_stock } = body;

  const updated = await prisma.product.update({
    where: { id: productId },
    data: { name, description, price, quantity_in_stock },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = Number(params.id);

    const idExist = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!idExist) {
      return NextResponse.json(
        { error: "Product Id invalid" },
        { status: 404 }
      );
    }

    await prisma.product.delete({ where: { id: productId } });

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to Delete" }, { status: 400 });
  }
}
