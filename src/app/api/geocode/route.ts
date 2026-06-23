import { NextRequest, NextResponse } from "next/server";
import { geocodeSearch } from "@/lib/geocode";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const results = await geocodeSearch(q);
  return NextResponse.json(results);
}
