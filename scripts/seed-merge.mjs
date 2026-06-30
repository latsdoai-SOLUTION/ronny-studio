// seed-merge — מיזוג לידים חדשים מה-seed לתוך הדיסק החי, בכל עליית שרת.
// עיקרון: לא נוגעים בלידים קיימים (משמרים סטטוסים שרוני עדכנה),
// רק מוסיפים מותגים חדשים שעוד לא קיימים. כך אפשר לדחוף לידים חדשים
// ב-data/leads.json והם יופיעו בלוח החי אחרי deploy — בלי לאבד שום דבר.
import fs from "fs";
import path from "path";

const DATA = process.env.DATA_DIR || "/app/data";
const SEED = process.env.SEED_DIR || "/app/seed";

function load(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function mergeFile(file) {
  const seed = load(path.join(SEED, file));
  if (!Array.isArray(seed)) return;
  let live = load(path.join(DATA, file));
  if (!Array.isArray(live)) live = [];
  const have = new Set(live.map((x) => (x.brand || "").trim()).filter(Boolean));
  let added = 0;
  for (const item of seed) {
    const brand = (item.brand || "").trim();
    if (!brand || have.has(brand)) continue;
    live.push(item);
    have.add(brand);
    added++;
  }
  if (added) {
    fs.writeFileSync(path.join(DATA, file), JSON.stringify(live, null, 2), "utf8");
    console.log(`seed-merge: ${file} — added ${added} new`);
  } else {
    console.log(`seed-merge: ${file} — no new`);
  }
}

try {
  mergeFile("leads.json");
} catch (e) {
  console.log("seed-merge error:", e.message);
}
