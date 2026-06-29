"use client";
import { useState } from "react";

export default function StudioUploader() {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [heb, setHeb] = useState("");
  const [sub, setSub] = useState("UGC");
  const [caps, setCaps] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);

  async function submit() {
    if (!files.length) { setErr("בחרי קליפ אחד לפחות"); return; }
    setLoading(true); setErr(null); setResult(null);
    try {
      const fd = new FormData();
      [...files].forEach((f) => fd.append("clips", f));
      fd.append("title", title || "UGC");
      fd.append("heb", heb);
      fd.append("sub", sub || "UGC");
      fd.append("captions", JSON.stringify(caps.filter(Boolean)));
      fd.append("name", title || "ריל");
      const res = await fetch("/api/produce", { method: "POST", body: fd });
      const data = await res.json();
      if (data.ok) setResult(data);
      else setErr(data.error || "שגיאה בהפקה");
    } catch (e) {
      setErr("שגיאת רשת");
    } finally {
      setLoading(false);
    }
  }

  const input = "w-full bg-cardHi border border-line rounded-xl px-3 py-2 text-[14px] focus:outline-none focus:border-accent";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-[13px] text-muted block mb-1.5">קליפים גולמיים (אפשר כמה)</label>
        <input type="file" accept="video/*" multiple onChange={(e) => setFiles(e.target.files)} className={input} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div><label className="text-[13px] text-muted block mb-1.5">כותרת אנגלית (קאבר)</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Spotless" className={input} /></div>
        <div><label className="text-[13px] text-muted block mb-1.5">כיתוב עברי (קאבר)</label><input value={heb} onChange={(e) => setHeb(e.target.value)} placeholder="ניקיון בלי מאמץ" className={input} /></div>
        <div><label className="text-[13px] text-muted block mb-1.5">תת-כותרת</label><input value={sub} onChange={(e) => setSub(e.target.value)} placeholder="Cleaning · UGC" className={input} /></div>
      </div>
      <div>
        <label className="text-[13px] text-muted block mb-1.5">כתוביות (עד 4 — יתפרסו על הסרטון)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {caps.map((c, i) => (
            <input key={i} value={c} onChange={(e) => { const n = [...caps]; n[i] = e.target.value; setCaps(n); }} placeholder={`כתובית ${i + 1}`} className={input} />
          ))}
        </div>
      </div>
      <button onClick={submit} disabled={loading} className="quick text-white font-bold rounded-xl py-3 hover:brightness-110 disabled:opacity-60 transition">
        {loading ? "מפיק… (עד דקה)" : "✨ הפק ריל"}
      </button>
      {err && <div className="text-[13px] text-accent">{err}</div>}
      {result && (
        <div className="card p-4 flex flex-col items-center gap-3">
          <video src={result.reel} controls className="rounded-xl max-h-[60vh]" />
          <div className="flex gap-3">
            <a href={result.reel} download className="text-[13px] text-accent2 font-semibold hover:underline">⬇️ הורדת הריל</a>
            <a href={result.cover} download className="text-[13px] text-accent2 font-semibold hover:underline">⬇️ הורדת קאבר</a>
          </div>
        </div>
      )}
    </div>
  );
}
