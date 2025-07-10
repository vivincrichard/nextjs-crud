import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const searchName = searchParams.get("searchName");
    const searchDescription = searchParams.get("searchDescription");
    const sortParam = searchParams.get("sort") || "createdAt"; // e.g. createdAt, -updatedAt
    const seekParam = searchParams.get("seek");

    // Pagination setup
    const limit = 10;
    const page = parseInt(seekParam || "0", 10); // default seek = 0
    const skip = page * limit;

    // Map sort fields
    const sortFieldMap: Record<string, keyof typeof prisma.product.fields> = {
      createdAt: "created_at",
      updatedAt: "updated_at",
      id: "id",
    };

    // Determine sort order and field
    let sortOrder: "asc" | "desc" = "asc";
    let sortKey = sortParam;

    if (sortKey.startsWith("-")) {
      sortOrder = "desc";
      sortKey = sortKey.slice(1);
    }

    const prismaSortField = sortFieldMap[sortKey] || "created_at";

    const whereClause = {
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
    };

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: {
        [prismaSortField]: sortOrder,
      },
      skip,
      take: limit,
    });

    const totalCount = await prisma.product.count({
      where: whereClause,
    });

    const hasNextPage = skip + limit < totalCount;

    return NextResponse.json({
      list: products,
      page,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage,
      totalCount,
    });
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
