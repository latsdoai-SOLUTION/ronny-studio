import fs from "fs";
import path from "path";

export const runtime = "nodejs";
const DATA = path.join(process.cwd(), "data");

// מגיש קבצים מתיקיית הנתונים (וידאו/תמונות שהמנוע יצר), בבטחה.
export async function GET(req) {
  const p = new URL(req.url).searchParams.get("p") || "";
  const full = path.normalize(path.join(DATA, p));
  if (!full.startsWith(DATA) || !fs.existsSync(full)) {
    return new Response("not found", { status: 404 });
  }
  const ext = path.extname(full).toLowerCase();
  const ct = ext === ".mp4" ? "video/mp4" : ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "application/octet-stream";
  const data = fs.readFileSync(full);
  return new Response(data, { headers: { "Content-Type": ct, "Cache-Control": "no-store" } });
}
