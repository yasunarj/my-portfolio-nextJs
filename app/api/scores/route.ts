import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const POST = async (req: Request) => {
  const { authId } = await req.json();

  const user = await prisma.user.findUnique({
    where: {
      authId,
    },
  });

  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" });
  }

  const score = await prisma.score.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, score });
};

const PUT = async (req: Request) => {
  const { value, authId } = await req.json();
  const user = await prisma.user.findUnique({
    where: {
      authId,
    },
  });

  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" });
  }

  const score = await  prisma.score.findFirst({
    where: {
      userId: user.id,
    },
  });
  if (!score) {
    return NextResponse.json({ success: false, error: "Score not found" });
  }

  const result = await prisma.score.update({
    where: {
      id: score.id
    },
    data: {
      value,
    },
  });
  return NextResponse.json({ success: true, result });
};

export { POST, PUT };
