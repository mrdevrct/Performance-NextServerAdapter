//api/articles
import { NextResponse } from "next/server";
import { API_URL } from "@/config/api";

export const revalidate = 1800; // کش نیم‌ساعته

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const per_page = searchParams.get("per_page") || "10";
  const page = searchParams.get("page") || "1";
  const category = searchParams.get("category") || "";

  const endpoint = `https://omdehforoosh.com/wp-json/custom/v1/posts?per_page=${per_page}&page=${page}${
    category ? `&category=${category}` : ""
  }`;

  try {
    const res = await fetch(endpoint, {
      next: { revalidate },
      cache: "force-cache",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "خطا در واکشی مقالات" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("❌ Article List API Error:", error);
    return NextResponse.json(
      { success: false, message: "ارتباط با سرور برقرار نشد" },
      { status: 500 }
    );
  }
}