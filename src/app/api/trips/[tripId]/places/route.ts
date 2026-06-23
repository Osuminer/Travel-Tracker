import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;
  const places = await prisma.place.findMany({
    where: { tripId },
    include: { photos: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(places);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;
  const body = await req.json();
  const { name, category, lat, lng, address, rating, comment, visitDate } =
    body;

  if (!name || lat === undefined || lng === undefined) {
    return NextResponse.json(
      { error: "name, lat, and lng are required" },
      { status: 400 }
    );
  }

  const place = await prisma.place.create({
    data: {
      tripId,
      name,
      category: category ?? "LOCATION",
      lat,
      lng,
      address: address ?? null,
      rating: rating ?? null,
      comment: comment ?? null,
      visitDate: visitDate ? new Date(visitDate) : null,
    },
    include: { photos: true },
  });

  return NextResponse.json(place, { status: 201 });
}
