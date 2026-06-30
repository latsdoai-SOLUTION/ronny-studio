"use client";
import { useState } from "react";

export default function CopyButton({ text, label = "העתק" }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {}
  }
  return (
    <button
      onClick={copy}
      className={
        "rounded-lg px-3 py-1.5 text-[13px] font-semibold border transition " +
        (done
          ? "bg-green text-white border-green"
          : "bg-cardHi text-ink border-line hover:border-accent hover:text-accent")
      }
    >
      {done ? "הועתק ✓" : label}
    </button>
  );
}