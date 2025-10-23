import { NextResponse } from "next/server";
import { API_URL } from "@/config/api";

export const runtime = "nodejs"; // اجرای سریع‌تر در Edge
export const revalidate = 3600; // کش ۱ ساعته

export async function GET() {
  const endpoint = `${API_URL}/productcatapi.php`;

  const start = performance.now();

  try {
    const res = await fetch(endpoint, {
      next: { revalidate },
      cache: "force-cache", // استفاده از کش سمت نکست
    });

    const end = performance.now();
    const fetchTime = (end - start).toFixed(2);

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "خطا در واکشی دسته‌بندی‌ها" },
        { status: res.status }
      );
    }

    const data = await res.json();

    // افزودن متادیتا برای تست
    return NextResponse.json(
      {
        ...data,
        _meta: {
          timing: `${fetchTime} ms (Edge)`,
          endpoint,
          cache: "force-cache",
        },
      },
      {
        status: 200,
        headers: {
          "x-cache-info": "edge-cache",
          "x-response-time": `${fetchTime}ms`,
        },
      }
    );
  } catch (error) {
    console.error("❌ Category API Error:", error);
    return NextResponse.json(
      { success: false, message: "ارتباط با سرور برقرار نشد", endpoint },
      { status: 500 }
    );
  }
}
