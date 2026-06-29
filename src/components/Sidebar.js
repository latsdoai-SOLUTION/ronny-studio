"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "היום שלי", icon: "☀️" },
  { href: "/leads", label: "לידים", icon: "🎯" },
  { href: "/outreach", label: "פניות מוכנות", icon: "📨" },
  { href: "/studio", label: "אולפן הפקה", icon: "🎬" },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-[244px] shrink-0 border-l border-line/70 bg-white/[0.02] backdrop-blur-xl min-h-screen p-5 sticky top-0 self-start flex flex-col">
      <div className="flex items-center gap-3 px-1 pt-1 pb-6">
        <div className="dotgrad w-10 h-10 rounded-2xl flex items-center justify-center text-[#1A140F] font-black text-[18px] shadow-lg">ר</div>
        <div>
          <div className="text-[18px] font-black tracking-tight leading-none">רוני סטודיו</div>
          <div className="text-accent2 text-[12px] font-medium mt-1">@ronnys_creative</div>
        </div>
      </div>

      <Link href="/leads"
        className="quick flex items-center justify-center gap-2 text-white font-bold text-[15px] rounded-2xl py-3 mb-7 hover:brightness-110 transition">
        <span className="text-[17px]">✨</span> יצירה מהירה
      </Link>

      <div className="text-[11px] text-muted/70 font-semibold px-2 mb-2 tracking-wide">ניווט</div>
      <nav className="flex flex-col gap-1.5">
        {NAV.map((n) => {
          const on = n.href === "/" ? path === "/" : path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={
                "relative flex items-center gap-3 px-3.5 py-3 rounded-2xl text-[15px] transition-all duration-150 " +
                (on
                  ? "bg-white/[0.07] text-ink font-bold border border-white/10"
                  : "text-muted hover:text-ink hover:bg-white/[0.04]")
              }
            >
              {on && <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full dotgrad" />}
              <span className="text-[18px]">{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3.5 text-[11.5px] text-muted leading-relaxed">
        ⚡ זורקת מינימום → מקבלת תוצר מוכן.
      </div>
    </aside>
  );
}
