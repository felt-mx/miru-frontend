"use client";

import { useEffect, useRef, useState } from "react";
import { useSharedSocket } from "@/hooks/use-shared-socket";
import { SessionLogEntry } from "@/lib/log-types";

type Options = {
  url: string;
  setLogs: React.Dispatch<React.SetStateAction<SessionLogEntry[]>>;
};

export function useSessionLogs({ url, setLogs }: Options) {
  const { socket } = useSharedSocket(url);
  const socketRef = useRef<typeof socket>(null);

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const onSessionLog = (data: SessionLogEntry) => {
      setLogs((prev) => [
        ...prev,
        {
          id: data.id,
          type: data.type,
          description: data.description,
          timestamp: data.timestamp,
        },
      ]);
    };

    socket.on("session_log", onSessionLog);

    return () => {
      socket.off("session_log", onSessionLog);
    };
  }, [socket]);
}
