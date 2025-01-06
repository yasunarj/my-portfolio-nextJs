import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import prisma from "@/lib/prisma";

if (
  !process.env.SUPABASE_SERVICE_ROLE_KEY ||
  !process.env.NEXT_PUBLIC_SUPABASE_URL
) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URLまたはSUPABASE_SERVICE_ROLE_KEYがありません"
  );
}
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const GET = async (request: Request) => {
  const authHeader = request.headers.get("Authorization") || "";

  if (!authHeader.startsWith("Bearer ")) {
    console.error("Authorizationヘッダーがありません");
    return NextResponse.json(
      { message: "認証トークンがありません" },
      { status: 401 }
    );
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: user, error } = await supabaseAdmin.auth.getUser(token);

  if (error) {
    console.error("Supabaseエラー:", error.message);
    return NextResponse.json(
      { message: "認証エラーが発生しました", error: error.message },
      { status: 401 }
    );
  }

  if (!user) {
    console.error("ユーザーが見つかりません");
    return NextResponse.json(
      { message: "ユーザー情報が見つかりません" },
      { status: 401 }
    );
  }

  const userData = await prisma.user.findFirst({
    where: {
      email: user.user.email,
    },
  });

  if (!userData) {
    return NextResponse.json(
      { success: false, message: "ユーザーが見つかりません" },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "認証成功", user: userData.username });
};

export { GET };
