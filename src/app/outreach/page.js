import { getOutreach } from "@/lib/store";
import CopyButton from "@/components/CopyButton";

export const dynamic = "force-dynamic";

export default function Outreach() {
  const items = getOutreach();
  return (
    <div>
      <h1 className="fade-up text-[30px] hero-title mb-1">פניות מוכנות</h1>
      <p className="fade-up d1 text-muted mb-6">העתיקי → שלחי. ⚠️ אמתי הנדל לפני שליחה. DM נשלח ידנית (בטוח מחסימה).</p>

      <div className="flex flex-col gap-4">
        {items.map((it, idx) => (
          <div key={it.id} className={`fade-up d${(idx % 4) + 1} card p-5`}>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-bold">{it.brand}</h2>
              {it.hot && <span className="text-[11px] text-accent font-bold">🔥</span>}
            </div>
            {it.why && <p className="text-[13px] text-muted mt-1 mb-3">{it.why}</p>}
            <div className="flex flex-col gap-3">
              {it.blocks.map((b, i) => (
                <div key={i} className="bg-cardHi border border-line rounded-xl p-3 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-bold text-accent">{b.label}</span>
                    <CopyButton text={b.text} />
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed text-ink">{b.text}</pre>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
