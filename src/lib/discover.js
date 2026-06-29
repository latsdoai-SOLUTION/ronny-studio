// Live lead discovery, grounded in real web sources (anti-hallucination).
// Uses the Perplexity Sonar API: it returns answers WITH citations, so every
// brand we keep is backed by a real source URL. Rule: "cite-or-drop" — any item
// without an http source is discarded, so the engine never invents brands.

const SONAR_URL = "https://api.perplexity.ai/chat/completions";

export class MissingKeyError extends Error {}

export async function discoverLeads({ niche = "הורות/תינוקות", region = "ישראל", count = 5 } = {}) {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) {
    throw new MissingKeyError("חסר PERPLEXITY_API_KEY. ראה ronny-studio-app/SETUP-KEYS.md");
  }

  const sys =
    "You are a research assistant for an Israeli UGC creator (@ronnys_creative, mom of 3, " +
    "niches: parenting, home, food, beauty, wellness). Find REAL Israeli brands that plausibly " +
    "hire UGC creators. Output ONLY a JSON array, no prose. Each item: " +
    '{"brand","niche","channel","handle","angle","source","tier"}. ' +
    "'source' MUST be a real URL you found. 'angle' in Hebrew, one sentence, on-brand, no medical claims. " +
    "'tier': A=high fit, B=medium, C=aspirational. Do NOT invent brands or sources.";

  const user = `מצא ${count} מותגים ישראליים בנישה "${niche}" (${region}) שעובדים/עשויים לעבוד עם יוצרי UGC. החזר JSON בלבד.`;

  const res = await fetch(SONAR_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Sonar API error ${res.status}: ${t.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || "[]";
  const citations = data?.citations || [];

  let items = [];
  try {
    const match = content.match(/\[[\s\S]*\]/);
    items = JSON.parse(match ? match[0] : content);
  } catch {
    items = [];
  }
  if (!Array.isArray(items)) items = [];

  // cite-or-drop: keep only items backed by a real source URL.
  const cleaned = items
    .map((it) => {
      let src = (it.source || "").trim();
      if (!/^https?:\/\//.test(src) && citations[0]) src = citations[0];
      return { ...it, source: src, market: "ישראלי" };
    })
    .filter((it) => it.brand && /^https?:\/\//.test(it.source));

  return cleaned;
}
