import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        created_at: "desc"
      }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST a new product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, quantity_in_stock } = body;

    const newProduct = await prisma.product.create({
      data: { name, description, price, quantity_in_stock },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
