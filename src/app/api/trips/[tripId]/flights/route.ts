import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;
  const flights = await prisma.flight.findMany({
    where: { tripId },
    orderBy: { departureTime: "asc" },
  });
  return NextResponse.json(flights);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId } = await params;
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

  if (!airline || !departureAirport || !arrivalAirport || !departureTime) {
    return NextResponse.json(
      {
        error:
          "airline, departureAirport, arrivalAirport, and departureTime are required",
      },
      { status: 400 }
    );
  }

  const flight = await prisma.flight.create({
    data: {
      tripId,
      airline,
      flightNumber: flightNumber ?? null,
      departureAirport,
      arrivalAirport,
      departureTime: new Date(departureTime),
      arrivalTime: arrivalTime ? new Date(arrivalTime) : null,
      confirmationCode: confirmationCode ?? null,
      seat: seat ?? null,
      notes: notes ?? null,
    },
  });

  return NextResponse.json(flight, { status: 201 });
}
