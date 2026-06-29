import { NextResponse } from "next/server";
import { discoverLeads, MissingKeyError } from "@/lib/discover";
import { addLeads } from "@/lib/store";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  try {
    const found = await discoverLeads({
      niche: body.niche,
      region: body.region || "ישראל",
      count: body.count || 5,
    });
    const added = addLeads(found);
    return NextResponse.json({ ok: true, found: found.length, added: added.length, items: added });
  } catch (e) {
    if (e instanceof MissingKeyError) {
      return NextResponse.json({ ok: false, needsKey: true, error: e.message }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: String(e.message || e) }, { status: 500 });
  }
}
