// app/api/user/route.ts

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

// GET all user - /api/users
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// POST User - /api/users
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    const addUser = await prisma.user.create({
      data: { name, email },
    });

    return NextResponse.json(addUser, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // P2002 = Unique constraint failed
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 409 }
      );
    }

    // Unexpected errors
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
