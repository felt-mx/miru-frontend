"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type ManagedSocket = {
  socket: Socket;
  refs: number;
};

const socketPool = new Map<string, ManagedSocket>();

function acquireSocket(url: string): Socket {
  const existing = socketPool.get(url);
  if (existing) {
    existing.refs += 1;
    return existing.socket;
  }

  const socket = io(url, {
    transports: ["websocket"],
  });

  socketPool.set(url, {
    socket,
    refs: 1,
  });

  return socket;
}

function releaseSocket(url: string) {
  const existing = socketPool.get(url);
  if (!existing) return;

  existing.refs -= 1;

  if (existing.refs <= 0) {
    existing.socket.disconnect();
    socketPool.delete(url);
  }
}

export function useSharedSocket(url: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sid, setSid] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!url) return;

    const sharedSocket = acquireSocket(url);
    setSocket(sharedSocket);
    setIsConnected(sharedSocket.connected);
    setSid(sharedSocket.id ?? null);

    const handleConnect = () => {
      setIsConnected(true);
      setSid(sharedSocket.id ?? null);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setSid(null);
    };

    sharedSocket.on("connect", handleConnect);
    sharedSocket.on("disconnect", handleDisconnect);

    return () => {
      sharedSocket.off("connect", handleConnect);
      sharedSocket.off("disconnect", handleDisconnect);
      releaseSocket(url);
    };
  }, [url]);

  return { socket, sid, isConnected };
}
