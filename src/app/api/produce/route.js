import { NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 300;
const DATA = path.join(process.cwd(), "data");

function ffprobeDur(file) {
  return new Promise((res) => {
    const p = spawn("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]);
    let o = "";
    p.stdout.on("data", (d) => (o += d));
    p.on("close", () => res(parseFloat(o) || 6));
    p.on("error", () => res(6));
  });
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const name = (form.get("name") || "post-" + Date.now()).toString().replace(/[^\w֐-׿-]+/g, "-").slice(0, 40);
    const heb = (form.get("heb") || "").toString();
    const title = (form.get("title") || "UGC").toString();
    const sub = (form.get("sub") || "UGC").toString();
    let caps = [];
    try { caps = JSON.parse(form.get("captions") || "[]"); } catch {}
    const files = form.getAll("clips").filter((f) => typeof f === "object" && f.arrayBuffer);
    if (!files.length) return NextResponse.json({ error: "לא הועלו קליפים" }, { status: 400 });

    const ts = Date.now();
    const inDir = path.join(DATA, "uploads", String(ts));
    fs.mkdirSync(inDir, { recursive: true });
    const clipPaths = [];
    for (let i = 0; i < files.length; i++) {
      const buf = Buffer.from(await files[i].arrayBuffer());
      const fp = path.join(inDir, `clip${i}.mp4`);
      fs.writeFileSync(fp, buf);
      clipPaths.push(fp);
    }

    let total = 0;
    for (const c of clipPaths) total += await ffprobeDur(c);
    const captions = [];
    const n = Math.min(caps.filter(Boolean).length, 4);
    for (let i = 0; i < n; i++) {
      const t0 = (total / n) * i + 0.3;
      const t1 = (total / n) * (i + 1) - 0.3;
      captions.push({ text: caps[i], t0: +t0.toFixed(1), t1: +t1.toFixed(1) });
    }

    const outRel = `posts/${ts}-${name}`;
    const outDir = path.join(DATA, outRel);
    fs.mkdirSync(outDir, { recursive: true });
    const brief = {
      name,
      clips: clipPaths.map((c) => ({ file: c })),
      captions,
      cover: { frame: clipPaths[0], frame_time: 1, heb, title, sub },
      endcard: { headline: "רוצים תוכן כזה למותג שלכם?" },
    };
    const briefPath = path.join(inDir, "brief.json");
    fs.writeFileSync(briefPath, JSON.stringify(brief));

    await new Promise((res, rej) => {
      const p = spawn("python3", [path.join(process.cwd(), "engine", "produce_reel.py"), briefPath, outDir]);
      let err = "";
      p.stderr.on("data", (d) => (err += d));
      p.on("close", (code) => (code === 0 ? res() : rej(new Error(err || "exit " + code))));
      p.on("error", (e) => rej(e));
    });

    return NextResponse.json({
      ok: true,
      reel: `/api/file?p=${encodeURIComponent(outRel + "/reel.mp4")}`,
      cover: `/api/file?p=${encodeURIComponent(outRel + "/cover.png")}`,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e.message || e) }, { status: 500 });
  }
}
