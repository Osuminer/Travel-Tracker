"use client";

import dynamic from "next/dynamic";

export type { MapPlace } from "./MapView";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-400">
      Loading map...
    </div>
  ),
});

export default MapView;
