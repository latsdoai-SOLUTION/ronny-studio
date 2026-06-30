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

// Append new leads, skipping ones whose brand already exists. Returns the 