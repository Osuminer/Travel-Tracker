import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const { photoId } = await params;
  const photo = await prisma.photo.findUnique({ where: { id: photoId } });

  if (photo) {
    const filePath = path.join(process.cwd(), "public", photo.filePath);
    await unlink(filePath).catch(() => {});
  }

  await prisma.photo.delete({ where: { id: photoId } });
  return NextResponse.json({ success: true });
}
