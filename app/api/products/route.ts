import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET all products



export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const searchName = searchParams.get("searchName");
    const searchDescription = searchParams.get("searchDescription");
    const sortParam = searchParams.get("sort"); // e.g., -createdAt or updatedAt

    // Define mapping from API sort keys to Prisma field names
    const sortFieldMap: Record<string, string> = {
      createdAt: "created_at",
      updatedAt: "updated_at",
    };

    // Determine sort direction and Prisma field name
    let sortOrder: "asc" | "desc" = "desc";
    let sortKey = sortParam || "createdAt";

    if (sortKey.startsWith("-")) {
      sortOrder = "desc";
      sortKey = sortKey.slice(1); // remove the "-" prefix
    } else {
      sortOrder = "asc";
    }

    const prismaSortField = sortFieldMap[sortKey] || "created_at";

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
        [prismaSortField]: sortOrder,
      },
    });

    if (products.length === 0) {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
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
