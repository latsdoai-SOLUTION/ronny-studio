import { NextResponse } from "next/server";
import { updateLeadStatus, getLeads } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getLeads());
}

export async function PATCH(req) {
  const body = await req.json().catch(() => null);
  if (!body || !body.id || !body.status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }
  const updated = updateLeadStatus(body.id, body.status);
  if (!updated) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(updated);
}
