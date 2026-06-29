import Link from "next/link";
import { getTodayOpportunities, getStats, getSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

const ACTIONS = [
  { href: "/studio", ic: "ic-reel", icon: "🎬", title: "בנה ריל", sub: "קליפים גולמיים → ריל מוכן" },
  { href: "/outreach", ic: "ic-proposal", icon: "📨", title: "הכן פנייה", sub: "מייל + DM מוכנים להעתקה" },
  { href: "/leads", ic: "ic-leads", icon: "🎯", title: "מצא לידים", sub: "מותגים מדורגים + ערוץ פנייה" },
];

const LOGO = {
  dipy: { t: "D", c: "#46CFC0" }, humanz: { t: "H", c: "#8B7CF0" },
  "ugc-israel": { t: "UGC", c: "#E879A6" }, lavido: { t: "L", c: "#7FD18C" },
  shilav: { t: "ש", c: "#E0B85F" }, lineor: { t: "לי", c: "#E08C5C" },
};
const stat = ["#7FD18C", "#8B7CF0", "#46CFC0", "#E0B85F"];

export default function Today() {
  const opps = getTodayOpportunities();
  const s = getStats();
  const set = getSettings();
  const today = new Date().toLocaleDateString("he-IL", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="py-2">
      <div className="fade-up mb-1.5 text-[13px] text-muted">{today}</div>
      <h1 className="fade-up text-[36px] sm:text-[44px] font-black tracking-tight mb-2 leading-none">
        בוקר טוב, <span className="grad-name">רוני</span> <span className="align-middle">👑</span>
      </h1>
      <p className="fade-up d1 text-muted text-[15px] mb-9">הנה מה שמחכה לך היום. בחרי, אשרי — השאר עליי.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {ACTIONS.map((a, i) => (
          <Link key={a.href} href={a.href} className={`fade-up card lift d${i + 1} p-6 group block`}>
            <div className={`ic ${a.ic} mb-4 transition group-hover:scale-105`}>{a.icon}</div>
            <div className="text-[18px] font-bold flex items-center gap-1.5">
              {a.title}
              <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition text-accent">←</span>
            </div>
            <div className="text-[13px] text-muted mt-1.5">{a.sub}</div>
          </Link>
        ))}
      </div>

      <div className="flex items-baseline justify-between mb-4">
        <h2 className="fade-up d2 text-[20px] font-bold">3 הזדמנויות להיום ✨</h2>
        <Link href="/outreach" className="fade-up d2 text-[13px] text-accent2 font-semibold hover:underline">לכל הפניות ←</Link>
      </div>
      <div className="flex flex-col gap-3 mb-10">
        {opps.map((o, i) => {
          const lg = LOGO[o.id] || { t: o.brand.slice(0, 1), c: "#E08C5C" };
          return (
            <div key={o.id} className={`fade-up card lift d${i + 2} p-4 flex items-center gap-4`}>
              <div className="logo-c w-12 h-12 shrink-0 text-[13px]" style={{ background: lg.c + "22", color: lg.c, borderColor: lg.c + "55" }}>{lg.t}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[15.5px] flex items-center gap-2">
                  {o.brand}{o.hot && <span className="text-[11px] text-accent font-bold">🔥</span>}
                </div>
                <div className="text-[12.5px] text-muted leading-snug mt-0.5 line-clamp-2">{o.angle}</div>
                <div className="text-[11.5px] text-ink/55 mt-1">📨 {o.channel}</div>
              </div>
              <div className="glow-num w-8 h-8 shrink-0 rounded-full text-[#1A140F] text-[14px] font-black flex items-center justify-center">{i + 1}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
        {[
          ["סה״כ לידים", s.total],
          ["טיוטה מוכנה", s.by["טיוטה מוכנה"] || 0],
          ["נשלח", s.by["נשלח"] || 0],
          ["במעקב", s.by["מעקב"] || 0],
        ].map(([label, value], i) => (
          <div key={label} className={`fade-up card lift d${i + 1} p-4`}>
            <div className="flex items-center justify-between">
              <div className="text-[28px] font-black hero-title leading-none">{value}</div>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: stat[i], boxShadow: `0 0 10px ${stat[i]}` }} />
            </div>
            <div className="text-[12px] text-muted mt-2">{label}</div>
          </div>
        ))}
      </div>

      <div className="fade-up d4 alert-pos rounded-2xl p-4 text-[13.5px] text-green leading-relaxed">
        💡 כלל המנוע: {set.rules ? set.rules[1] : "טוב מספיק שמתפרסם מנצח מושלם בטיוטות."}
      </div>
    </div>
  );
}
