import { NextResponse, NextRequest } from "next/server";
import { API_URL } from "@/config/api";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // 👈 params از نوع Promise است
) {
  const { slug } = await params; // 👈 باید await شود

  const endpoint = `${API_URL}/productapi.php?slug=${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(endpoint, {
      next: { revalidate },
      cache: "force-cache",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "محصول یافت نشد" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(
      { success: true, product: data },
      { status: 200, headers: { "x-cache-info": "edge-cache" } }
    );
  } catch (error) {
    console.error("❌ Single Product API Error:", error);
    return NextResponse.json(
      { success: false, message: "ارتباط با سرور برقرار نشد" },
      { status: 500 }
    );
  }
}
