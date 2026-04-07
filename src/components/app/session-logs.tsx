"use client";

import { useSessionLogs } from "@/hooks/use-session-logs";
import { SessionLogEntry } from "@/lib/log-types";
import { useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export function SessionLogs() {
  const [logs, setLogs] = useState<SessionLogEntry[]>([]);

  useSessionLogs({
    url: BACKEND_URL,
    setLogs,
  });

  return (
    <div className="relative flex size-full min-h-0 flex-col overflow-hidden rounded-[26px] bg-transparent text-white">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-transparent px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-tight text-white/95">
              Session Log
            </span>
            <span className="text-xs text-white/60">Live session</span>
          </div>
        </div>
        <span className="px-2.5 py-1 text-xs text-white/70">
          {logs.length} {logs.length !== 1 ? "entries" : "entry"}
        </span>
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto p-4 text-sm scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-border/80">
        {logs.length === 0 ? (
          <div className="mt-3">
            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[linear-gradient(180deg,hsl(264_72%_20%/.55)_0%,hsl(230_38%_8%/.95)_38%,hsl(230_35%_7%/.98)_100%)] p-5 shadow-[0_18px_45px_hsl(266_80%_10%/.55)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[radial-gradient(80%_100%_at_50%_0%,hsl(277_90%_70%/.35),transparent_70%)]" />

              <div className="relative flex items-center justify-between text-white/80">
                <span className="text-sm font-medium tracking-tight">
                  Listening
                </span>
                <span className="rounded-full border border-white/25 bg-white/5 px-3 py-1 text-xs">
                  Standby
                </span>
              </div>

              <div className="relative flex min-h-[160px] flex-col items-center justify-center text-center">
                <p className="text-sm font-medium text-white/90">
                  No session events yet
                </p>
                <p className="mx-auto mt-1 max-w-[30ch] text-xs leading-relaxed text-white/60">
                  New events will be updated automatically.
                </p>
                <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-[linear-gradient(90deg,hsl(277_89%_71%/.15),hsl(277_89%_71%/.92),hsl(277_89%_71%/.15))]" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-white/15 bg-[linear-gradient(180deg,hsl(228_40%_12%/.72),hsl(228_30%_10%/.82))] p-4 shadow-[0_8px_28px_hsl(235_50%_6%/.45)]"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h1 className="text-sm font-semibold uppercase tracking-wide text-white/70">
                    {log.type}
                  </h1>
                  <span className="text-xs text-white/45">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="whitespace-pre-wrap break-words text-white/85">
                  {log.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
