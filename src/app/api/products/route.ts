import { NextResponse } from "next/server";
import { API_URL } from "@/config/api";

export const runtime = "nodejs"; // اجرای سریع روی Edge Runtime
export const revalidate = 3600; // کش یک‌ساعته (ISR)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // پارامترها
  const per_page = searchParams.get("per_page") || "10";
  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";
  const tag = searchParams.get("tag") || "";
  const count = searchParams.get("count") || "";
  const search = searchParams.get("search") || "";
  const max_price = searchParams.get("max_price") || "";
  const min_price = searchParams.get("min_price") || "";

  // ساخت endpoint نهایی
  const endpoint = `${API_URL}/productsapi.php?per_page=${per_page}${
    category ? `&category=${category}` : ""
  }${type ? `&type=${type}` : ""}${tag ? `&tag=${tag}` : ""}${
    count ? `&count=${count}` : ""
  }${search ? `&search=${search}` : ""}${
    max_price ? `&max_price=${max_price}` : ""
  }${min_price ? `&min_price=${min_price}` : ""}`;

  const start = performance.now(); // شروع تایم‌گیری

  try {
    const res = await fetch(endpoint, {
      next: { revalidate },
      cache: "force-cache", // کش فعال
    });

    const end = performance.now();
    const fetchTime = (end - start).toFixed(2);

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "❌ خطا در واکشی لیست محصولات" },
        { status: res.status }
      );
    }

    const data = await res.json();

    // افزودن زمان پاسخ برای تست و نمایش در UI
    return NextResponse.json(
      { ...data, _timing: `${fetchTime} ms (Edge)` },
      {
        status: 200,
        headers: {
          "x-cache-info": "edge-cache",
        },
      }
    );
  } catch (error) {
    console.error("❌ Product List API Error:", error);
    return NextResponse.json(
      { success: false, message: "ارتباط با سرور برقرار نشد" },
      { status: 500 }
    );
  }
}
