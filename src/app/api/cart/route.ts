import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/config/api";

export async function GET() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get(process.env.TOKEN_KEY || "jwt_token")?.value;
  const endpoint = `https://omdehforoosh.com/wp-json/custom/v1/cart`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("❌ Cart Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت سبد خرید" },
      { status: 500 }
    );
  }
}
