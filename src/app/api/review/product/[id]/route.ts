// api/articles/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/config/api";

export const revalidate = 1800;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 👈 params از نوع Promise است
) {
  const { id } =await params;
  const endpoint = `${API_URL}/wp-json/custom/v1/product/${id}/review`;

  try {
    const res = await fetch(endpoint, {
      next: { revalidate },
      cache: "force-cache",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "مقاله یافت نشد" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("❌ Single Product API Error:", error);
    return NextResponse.json(
      { success: false, message: "ارتباط با سرور برقرار نشد" },
      { status: 500 }
    );
  }
}