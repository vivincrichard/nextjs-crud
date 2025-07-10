// app/api/user/route.ts

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

// GET all user - /api/users
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to Fetch User" },
      { status: 500 }
    );
  }
}

// POST User - /api/users

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name) {
      return NextResponse.json({ error: "Name required." }, { status: 400 });
    } else if (!email) {
      return NextResponse.json({ error: "Email required." }, { status: 400 });
    }
    if (!name && !email) {
      return NextResponse.json(
        { error: "Name and Email are required." },
        { status: 400 }
      );
    }

    const addUser = await prisma.user.create({
      data: { name, email },
    });

    return NextResponse.json(addUser, { status: 201 });
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // P2002 = Unique constraint failed (email)
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 409 }
      );
    }

    // Unexpected error
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
