import { NextResponse } from "next/server";
import { API_URL } from "@/config/api";

export async function POST(req: Request) {
  const body = await req.json();
  const endpoint = `https://omdehforoosh.com/wp-json/custom/v1/otp/request`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Send OTP Adapter Error:", error);
    return NextResponse.json(
      { success: false, message: "ارتباط با سرور برقرار نشد" },
      { status: 500 }
    );
  }
}