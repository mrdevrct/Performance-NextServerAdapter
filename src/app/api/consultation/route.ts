import { NextResponse } from "next/server";
import { API_URL } from "@/config/api";

export async function POST(req: Request) {
  const body = await req.json();
  const endpoint = `${API_URL}/wp-json/custom/v1/consultation/request`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("❌ Consultation API Error:", error);
    return NextResponse.json(
      { success: false, message: "ارسال درخواست با خطا مواجه شد." },
      { status: 500 }
    );
  }
}