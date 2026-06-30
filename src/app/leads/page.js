import { getLeads, STATUSES } from "@/lib/store";
import StatusSelect from "@/components/StatusSelect";
import DiscoverButton from "@/components/DiscoverButton";

export const dynamic = "force-dynamic";

const tierColor = {
  A: "bg-accentSoft text-accent border border-accent/30",
  B: "bg-goldSoft text-gold border border-gold/30",
  C: "bg-cardHi text-muted border border-line",
};

export default function Leads() {
  const leads = getLeads();
  return (
    <div>
      <div className="fade-up flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-[30px] hero-title mb-1">לידים</h1>
          <p className="text-muted text-[14px]">לוח הזדמנויות. שני סטטוס בכל כרטיס. 🔥 = ליד חם.</p>
        </div>
        <DiscoverButton />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((col, ci) => {
          const items = leads.filter((l) => l.status === col);
          return (
            <div key={col} className={`fade-up d${(ci % 5) + 1} w-[270px] shrink-0`}>
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="font-bold text-[14px]">{col}</span>
                <span className="text-[12px] text-muted bg-cardHi border border-line rounded-full px-2">{items.length}</span>
              </div>
              <div className="flex flex-col gap-2.5 min-h-[60px]">
                {items.map((l) => (
                  <div key={l.id} className="card lift p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-[14.5px] leading-tight">
                        {l.brand} {l.hot && <span className="text-[11px]">🔥</span>}
                      </div>
                      <span className={"text-[10px] font-bold px-2 py-0.5 rounded-full " + (tierColor[l.tier] || "")}>{l.tier}</span>
                    </div>
                    <div className="text-[11px] text-muted mt-0.5">{l.niche} · {l.market}</div>
                    <div className="text-[12px] text-ink/80 mt-1.5 leading-snug">{l.angle}</div>
                    <div className="text-[11px] text-ink/60 mt-1.5">📨 {l.channel}</div>
                    {l.source ? (
                      <a href={l.source} target="_blank" rel="noreferrer" className="text-[11px] text-accent mt-0.5 inline-block hover:underline">🔗 מקור</a>
                    ) : l.handle ? (
                      <div 