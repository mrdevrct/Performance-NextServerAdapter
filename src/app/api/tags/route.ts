import { NextResponse } from "next/server";
import { API_URL } from "@/config/api";

export const runtime = "nodejs";        // اجرا روی Edge
export const revalidate = 3600;       // کش یک‌ساعته (ISR برای ۱ ساعت)

export async function GET() {
  const endpoint = `${API_URL}/producttagapi.php`;
  const start = performance.now();

  try {
    const res = await fetch(endpoint, {
      next: { revalidate },
      cache: "force-cache",
    });

    const end = performance.now();
    const fetchTime = (end - start).toFixed(2);

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "خطا در واکشی برچسب‌ها" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(
      { ...data, _timing: `${fetchTime} ms (Edge)` },
      { status: 200, headers: { "x-cache-info": "edge-cache" } }
    );
  } catch (error) {
    console.error("❌ Tag API Error:", error);
    return NextResponse.json(
      { success: false, message: "ارتباط با سرور برقرار نشد" },
      { status: 500 }
    );
  }
}
