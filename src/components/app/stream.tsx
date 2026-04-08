"use client";

import { useStream } from "@/hooks/use-stream";
import { StreamType } from "@/lib/stream-types";
import { useRef, useState } from "react";

interface StreamProps {
  url: string;
  streamType: StreamType;
}

export function Stream({ url, streamType }: StreamProps) {
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useStream({ url, streamType, previewRef });

  return (
    <div className="space-y-2">
      <div>
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="relative isolate w-full overflow-hidden rounded-xl border border-white/25 bg-white/12 px-4 py-2 text-center text-xs font-semibold tracking-[0.2em] text-white/95 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition hover:bg-white/15"
          style={{
            WebkitBackdropFilter: "blur(18px) saturate(170%) contrast(115%)",
            backdropFilter: "blur(18px) saturate(170%) contrast(115%)",
          }}
        >
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/24 via-white/8 to-white/2" />
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/60" />
          <span className="absolute left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-red-500 animate-pulse" />
          <span className="relative">LIVE</span>
        </button>
      </div>

      <div
        className={`overflow-hidden rounded-xl border border-white/20 bg-black/50 transition-all duration-300 ${
          isCollapsed
            ? "max-h-0 border-transparent opacity-0"
            : "max-h-[320px] opacity-100"
        }`}
      >
        <video
          ref={previewRef}
          autoPlay
          playsInline
          muted
          className="h-full max-h-[320px] w-full object-cover"
        />
      </div>
    </div>
  );
}
