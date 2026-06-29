import fs from "fs";
import path from "path";

const DATA = path.join(process.cwd(), "data");

function read(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(path.join(DATA, file), "utf8"));
  } catch {
    return fallback;
  }
}
function write(file, data) {
  fs.writeFileSync(path.join(DATA, file), JSON.stringify(data, null, 2), "utf8");
}

export const STATUSES = ["חדש", "מחקר", "טיוטה מוכנה", "אושר", "נשלח", "מעקב"];

export function getLeads() {
  return read("leads.json", []);
}
export function getSettings() {
  return read("settings.json", {});
}
export function getOutreach() {
  return read("outreach.json", []);
}

export function updateLeadStatus(id, status) {
  const leads = getLeads();
  const i = leads.findIndex((l) => l.id === id);
  if (i === -1) return null;
  leads[i].status = status;
  write("leads.json", leads);
  return leads[i];
}

function slug(s) {
  let b = "";
  for (const c of String(s).toLowerCase()) {
    if ((c >= "a" && c <= "z") || (c >= "0" && c <= "9")) b += c;
    else if (b && b[b.length - 1] !== "-") b += "-";
  }
  const rnd = Math.floor(Math.random() * 1000000);
  return (b ? b.slice(0, 30) : "lead") + "-" + rnd;
}

// Append new leads, skipping ones whose brand already exists. Returns the added leads.
export function addLeads(items) {
  const leads = getLeads();
  const existing = new Set(leads.map((l) => l.brand.trim()));
  const added = [];
  for (const it of items) {
    if (!it || !it.brand || existing.has(it.brand.trim())) continue;
    const lead = {
      id: slug(it.brand),
      brand: it.brand,
      niche: it.niche || "—",
      tier: it.tier || "B",
      market: it.market || "ישראלי",
      channel: it.channel || "—",
      handle: it.handle || "",
      source: it.source || "",
      angle: it.angle || "",
      status: "חדש",
      hot: false,
      next: "חדש 🆕",
    };
    leads.push(lead);
    existing.add(lead.brand.trim());
    added.push(lead);
  }
  if (added.length) write("leads.json", leads);
  return added;
}

export function getTodayOpportunities() {
  const leads = getLeads();
  const hot = leads.filter((l) => l.hot);
  return (hot.length ? hot : leads).slice(0, 3);
}

export function getStats() {
  const leads = getLeads();
  const by = {};
  for (const s of STATUSES) by[s] = 0;
  for (const l of leads) by[l.status] = (by[l.status] || 0) + 1;
  return { total: leads.length, by };
}
