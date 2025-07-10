import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET all products


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const searchName = searchParams.get("searchName");
    const searchDescription = searchParams.get("searchDescription");
    const sortParam = searchParams.get("sort"); // createdAt | updatedAt

    // Map client-provided sort fields to Prisma fields
    const sortFieldMap: Record<string, keyof typeof prisma.product.fields> = {
      createdAt: "created_at",
      updatedAt: "updated_at",
    };

    // Default sort field is "created_at"
    const sortField = sortFieldMap[sortParam || ""] || "created_at";

    const products = await prisma.product.findMany({
      where: {
        AND: [
          searchName
            ? {
                name: {
                  contains: searchName,
                  mode: "insensitive",
                },
              }
            : {},
          searchDescription
            ? {
                description: {
                  contains: searchDescription,
                  mode: "insensitive",
                },
              }
            : {},
        ],
      },
      orderBy: {
        [sortField]: "desc",
      },
    });

    if (products.length === 0) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
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
