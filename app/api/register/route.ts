import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  authId: string;
}

const POST = async (request: Request) => {
  const { username, email, password, authId }: RegisterRequest =
    await request.json();

  if (!username || !email || !password || !authId) {
    return NextResponse.json({
      success: false,
      message: "Username,email, and password are require",
      status: 400,
    });
  }

  if (password.length < 8) {
    return NextResponse.json({
      success: false,
      message: "Password must be at least 8 characters long",
      status: "400",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  
  try {
    const newUser = await prisma.user.create({
      data: {
        authId,
        username,
        email,
        password: hashPassword,
        scores: {
          create: {
            value: 0,
          },
        },
      },
    });
    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json({
        success: false,
        message: "Username or email already exists",
        status: 400,
      });
    }
    console.error(e);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
      status: "500",
    });
  }
};

export { POST };
