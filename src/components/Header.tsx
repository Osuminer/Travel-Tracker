import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-100 font-semibold tracking-tight"
        >
          Travel Tracker
        </Link>
      </div>
    </header>
  );
}
