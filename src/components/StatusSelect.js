"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["חדש", "מחקר", "טיוטה מוכנה", "אושר", "נשלח", "מעקב"];

export default function StatusSelect({ id, status }) {
  const [val, setVal] = useState(status);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function change(e) {
    const next = e.target.value;
    setVal(next);
    setSaving(true);
    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={val}
      onChange={change}
      disabled={saving}
      className="text-[12px] border border-line rounded-md px-2 py-1 bg-cardHi text-ink focus:outline-none focus:border-accent"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
