"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const NICHES = ["הורות/תינוקות", "בית", "תזונה/אוכל", "טיפוח/ביוטי", "וולנס/ספורט", "טיול/לייפסטייל"];

export default function DiscoverButton() {
  const [niche, setNiche] = useState(NICHES[0]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const router = useRouter();

  async function run() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, count: 5 }),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg({ type: "ok", text: `נמצאו ${data.found}, נוספו ${data.added} לידים חדשים 🎯` });
        router.refresh();
      } else if (data.needsKey) {
        setMsg({ type: "warn", text: "כדי לשאוב מהרשת צריך מפתח Perplexity — ראה SETUP-KEYS.md" });
      } else {
        setMsg({ type: "warn", text: data.error || "שגיאה" });
      }
    } catch (e) {
      setMsg({ type: "warn", text: "שגיאת רשת" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
        className="text-[13px] border border-line rounded-lg px-3 py-2 bg-cardHi focus:outline-none focus:border-accent"
      >
        {NICHES.map((n) => <option key={n}>{n}</option>)}
      </select>
      <button
        onClick={run}
        disabled={loading}
        className="dotgrad text-white text-[14px] font-semibold rounded-lg px-4 py-2 shadow-sm hover:opacity-95 disabled:opacity-60 transition"
      >
        {loading ? "מחפש…" : "מצא לידים חדשים ✨"}
      </button>
      {msg && (
        <span className={"text-[12.5px] font-medium " + (msg.type === "ok" ? "text-green" : "text-accent")}>
          {msg.text}
        </span>
      )}
    </div>
  );
}