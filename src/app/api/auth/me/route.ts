import { NextResponse } from "next/server";
import { API_URL } from "@/config/api";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get(process.env.TOKEN_KEY || "jwt_token")?.value;
  const endpoint = `https://omdehforoosh.com/wp-json/custom/v1/me`;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "توکن یافت نشد", user: null },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Get Current User Adapter Error:", error);
    return NextResponse.json(
      { success: false, message: "ارتباط با سرور برقرار نشد", user: null },
      { status: 500 }
    );
  }
}