interface TimelinePlace {
  id: string;
  name: string;
  category: string;
  visitDate: string | Date | null;
}

interface TimelineFlight {
  id: string;
  airline: string;
  flightNumber: string | null;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string | Date;
}

interface TimelineEvent {
  id: string;
  time: Date;
  label: string;
  sublabel: string;
  icon: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  LOCATION: "📍",
  RESTAURANT: "🍽️",
  TOUR: "🧭",
  ACTIVITY: "🎟️",
  LODGING: "🛏️",
  OTHER: "•",
};

interface TimelineProps {
  places: TimelinePlace[];
  flights: TimelineFlight[];
}

export default function Timeline({ places, flights }: TimelineProps) {
  const placeEvents: TimelineEvent[] = places
    .filter((p) => p.visitDate)
    .map((p) => ({
      id: `place-${p.id}`,
      time: new Date(p.visitDate as string | Date),
      label: p.name,
      sublabel: p.category,
      icon: CATEGORY_ICONS[p.category] ?? "•",
    }));

  const flightEvents: TimelineEvent[] = flights.map((f) => ({
    id: `flight-${f.id}`,
    time: new Date(f.departureTime),
    label: `${f.airline}${f.flightNumber ? ` ${f.flightNumber}` : ""}`,
    sublabel: `${f.departureAirport} → ${f.arrivalAirport}`,
    icon: "✈️",
  }));

  const allEvents = [...placeEvents, ...flightEvents].sort(
    (a, b) => a.time.getTime() - b.time.getTime()
  );

  if (allEvents.length === 0) {
    return null;
  }

  const dayKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const days = new Map<string, { date: Date; events: TimelineEvent[] }>();
  for (const event of allEvents) {
    const key = dayKey(event.time);
    if (!days.has(key)) {
      days.set(key, { date: event.time, events: [] });
    }
    days.get(key)!.events.push(event);
  }

  const dayGroups = Array.from(days.values());

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-4 min-w-max">
        {dayGroups.map((group, i) => (
          <div key={i} className="flex flex-col gap-2 w-56 shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              <span className="text-sm font-medium text-slate-200">
                {group.date.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="border-l-2 border-slate-700 pl-3 flex flex-col gap-2">
              {group.events.map((event) => (
                <div key={event.id} className="flex flex-col">
                  <span className="text-xs text-slate-500">
                    {event.time.toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-sm text-slate-100">
                    {event.icon} {event.label}
                  </span>
                  <span className="text-xs text-slate-400">
                    {event.sublabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
