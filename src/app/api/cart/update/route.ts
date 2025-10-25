import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/config/api";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.TOKEN_KEY || "jwt_token")?.value;
  const body = await req.json();
  const endpoint = `https://omdehforoosh.com/wp-json/custom/v1/cart/update`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("❌ Update Cart Error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در بروزرسانی سبد خرید" },
      { status: 500 }
    );
  }
}
