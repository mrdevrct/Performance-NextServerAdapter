import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/config/api";

export async function POST(req: Request) {
  const cookieStore = await cookies(); 
  const token = cookieStore.get(process.env.TOKEN_KEY || "jwt_token")?.value;
  const body = await req.json();
  const endpoint = `${API_URL}/wp-json/custom/v1/cart/add`;

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
    console.error("❌ Add To Cart Error:", error);
    return NextResponse.json(
      { success: false, message: "افزودن به سبد خرید با خطا مواجه شد" },
      { status: 500 }
    );
  }
}
