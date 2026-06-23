import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ flightId: string }> }
) {
  const { flightId } = await params;
  const body = await req.json();
  const {
    airline,
    flightNumber,
    departureAirport,
    arrivalAirport,
    departureTime,
    arrivalTime,
    confirmationCode,
    seat,
    notes,
  } = body;

  const flight = await prisma.flight.update({
    where: { id: flightId },
    data: {
      ...(airline !== undefined && { airline }),
      ...(flightNumber !== undefined && { flightNumber }),
      ...(departureAirport !== undefined && { departureAirport }),
      ...(arrivalAirport !== undefined && { arrivalAirport }),
      ...(departureTime !== undefined && {
        departureTime: new Date(departureTime),
      }),
      ...(arrivalTime !== undefined && {
        arrivalTime: arrivalTime ? new Date(arrivalTime) : null,
      }),
      ...(confirmationCode !== undefined && { confirmationCode }),
      ...(seat !== undefined && { seat }),
      ...(notes !== undefined && { notes }),
    },
  });

  return NextResponse.json(flight);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ flightId: string }> }
) {
  const { flightId } = await params;
  await prisma.flight.delete({ where: { id: flightId } });
  return NextResponse.json({ success: true });
}
