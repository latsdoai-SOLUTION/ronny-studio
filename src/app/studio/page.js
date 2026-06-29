import { getSettings } from "@/lib/store";
import StudioUploader from "@/components/StudioUploader";

export const dynamic = "force-dynamic";

const STEPS = [
  { n: "1", cmd: "python3 כלים/ingest.py", t: "סורק את הקליפים בתיקיית 'תוכן/נכנס' ובונה לוח פריימים" },
  { n: "2", cmd: 'python3 כלים/reel_pipeline.py --clip raw.mp4 --label "טיפוח" --name "שם"', t: "קליפ → תיקיית פוסט + קאבר + כתוביות" },
  { n: "3", cmd: "python3 כלים/assemble.py --edl edl.json", t: "ריבוי קליפים → ריל מורכב מלא" },
];

export default function Studio() {
  const s = getSettings();
  return (
    <div>
      <h1 className="text-[28px] font-black tracking-tight mb-1">אולפן הפקה 🎬</h1>
      <p className="text-muted mb-6">קליפים גולמיים → רילים מוכנים, ישירות מהאפליקציה. (פעיל בשרת/בהרצה מקומית עם python+ffmpeg.)</p>

      <div className="card p-5 mb-5">
        <h2 className="text-[17px] font-bold mb-1">העלאת קליפים → ריל מוכן</h2>
        <p className="text-[13.5px] text-muted mb-4">בחרי קליפים, מלאי כותרת וכתוביות — ולחצי "הפק ריל". מקבלת ריל עם כתוביות, קאבר וכרטיס סיום.</p>
        <StudioUploader />
      </div>

      <div className="bg-card border border-line rounded-2xl p-5 mb-5">
        <h2 className="text-[17px] font-bold mb-3">צינור ההפקה (רץ עכשיו דרך הכלים)</h2>
        <div className="flex flex-col gap-3">
          {STEPS.map((st) => (
            <div key={st.n} className="flex gap-3 items-start">
              <div className="w-6 h-6 shrink-0 rounded-full dotgrad text-[#1A140F] text-[12px] font-bold flex items-center justify-center">{st.n}</div>
              <div>
                <code className="bg-cardHi px-2 py-1 rounded text-[12.5px] block w-fit" dir="ltr">{st.cmd}</code>
                <div className="text-[12.5px] text-muted mt-1">{st.t}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-line rounded-2xl p-5">
        <h2 className="text-[17px] font-bold mb-2">תוויות קאבר</h2>
        <div className="flex flex-wrap gap-2">
          {(s.niches || []).map((n) => (
            <span key={n} className="text-[12px] bg-accentSoft text-[#9A5235] rounded-full px-3 py-1 font-semibold">{n}</span>
          ))}
        </div>
        <p className="text-[12px] text-muted mt-3">מילה אחת בעברית, פונט אחד · אסתטיקה: {s.aesthetic}</p>
      </div>
    </div>
  );
}
