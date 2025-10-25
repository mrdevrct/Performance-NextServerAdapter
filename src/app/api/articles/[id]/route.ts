import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/config/api";
import { cookies } from "next/headers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const cookieStore = await cookies();
  const token = cookieStore.get(process.env.TOKEN_KEY || "auth_token")?.value;

  const { id } = await params; // 👈 اینجا await اضافه شد
  const endpoint = `https://omdehforoosh.com/wp-json/custom/v1/articles/${id}`;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "توکن یافت نشد", article: null },
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
    console.log("API Request:", endpoint);

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(`Get Article ${id} Adapter Error:`, error);
    return NextResponse.json(
      { success: false, message: "ارتباط با سرور برقرار نشد", article: null },
      { status: 500 }
    );
  }
}
