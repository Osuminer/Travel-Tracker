import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  const { placeId } = await params;
  const body = await req.json();
  const { name, category, lat, lng, address, rating, comment, visitDate } =
    body;

  const place = await prisma.place.update({
    where: { id: placeId },
    data: {
      ...(name !== undefined && { name }),
      ...(category !== undefined && { category }),
      ...(lat !== undefined && { lat }),
      ...(lng !== undefined && { lng }),
      ...(address !== undefined && { address }),
      ...(rating !== undefined && { rating }),
      ...(comment !== undefined && { comment }),
      ...(visitDate !== undefined && {
        visitDate: visitDate ? new Date(visitDate) : null,
      }),
    },
    include: { photos: true },
  });

  return NextResponse.json(place);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  const { placeId } = await params;
  await prisma.place.delete({ where: { id: placeId } });
  return NextResponse.json({ success: true });
}
