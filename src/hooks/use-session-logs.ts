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

// export type SessionLogEntry = {
//   id: string;
//   message: string;
//   timestamp: number;
// };

// type Options = {
//   url: string;
//   eventName?: string;
// };

// function toSessionLogEntry(payload: unknown): SessionLogEntry {
//   const timestamp = Date.now();

//   if (typeof payload === "string") {
//     return {
//       id: `${timestamp}-${Math.random()}`,
//       message: payload,
//       timestamp,
//     };
//   }

//   if (payload && typeof payload === "object") {
//     const maybePayload = payload as {
//       id?: string;
//       message?: string;
//       log?: string;
//       text?: string;
//       timestamp?: number;
//       created_at?: number;
//     };

//     return {
//       id: maybePayload.id ?? `${timestamp}-${Math.random()}`,
//       message:
//         maybePayload.message ??
//         maybePayload.log ??
//         maybePayload.text ??
//         JSON.stringify(payload),
//       timestamp: maybePayload.timestamp ?? maybePayload.created_at ?? timestamp,
//     };
//   }

//   return {
//     id: `${timestamp}-${Math.random()}`,
//     message: String(payload),
//     timestamp,
//   };
// }

// export function useSessionLogs({ url, eventName = "session_log" }: Options) {
//   const { socket, sid, isConnected } = useSharedSocket(url);
//   const [logs, setLogs] = useState<SessionLogEntry[]>([]);

//   useEffect(() => {
//     if (!socket) return;

//     const onSessionLog = (payload: unknown) => {
//       setLogs((prev) => [...prev, toSessionLogEntry(payload)]);
//     };

//     socket.on(eventName, onSessionLog);

//     return () => {
//       socket.off(eventName, onSessionLog);
//     };
//   }, [socket, eventName]);

//   return { logs, sid, isConnected };
// }
