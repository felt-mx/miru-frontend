"use client";

import { MessageType } from "@/lib/chat-types";
import { compressImage } from "@/lib/image-utils";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ModelSettings } from "@/components/app/model-settings-dialog";
import { useSharedSocket } from "@/hooks/use-shared-socket";

type Options = {
  url: string;
  setMessages: Dispatch<SetStateAction<MessageType[]>>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

export function useChat({ url, setMessages, messagesEndRef }: Options) {
  const { socket, isConnected } = useSharedSocket(url);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const socketRef = useRef<typeof socket>(null);

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      console.log("WebSocket connected");
    };

    const onAssistantToken = (data: string) => {
      const content = data || "";

      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (!lastMessage || lastMessage.role === "user") {
          return [
            ...prev,
            {
              id: Date.now(),
              role: "assistant",
              content,
              mode: "agentic" as const,
            },
          ];
        }
        return prev.map((msg, idx) =>
          idx === prev.length - 1 && msg.role === "assistant"
            ? { ...msg, content: msg.content + content }
            : msg,
        );
      });

      setIsLoading(true);
    };

    const onAssistantThinking = (data: string) => {
      const content = data || "";

      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (!lastMessage || lastMessage.role === "user") {
          return [
            ...prev,
            {
              id: Date.now(),
              role: "assistant",
              content: "",
              reasoning: content,
              mode: "agentic" as const,
            },
          ];
        }
        return prev.map((msg, idx) =>
          idx === prev.length - 1 && msg.role === "assistant"
            ? { ...msg, reasoning: (msg.reasoning || "") + content }
            : msg,
        );
      });

      setIsLoading(true);
    };

    const onAssistantDone = (data: { data?: { all_results?: unknown } }) => {
      setIsLoading(false);

      if (data?.data?.all_results) {
        setMessages((prev) =>
          prev.map((msg, idx) =>
            idx === prev.length - 1 && msg.role === "assistant"
              ? { ...msg, sources: data.data?.all_results }
              : msg,
          ),
        );
      }
    };

    const onConnectError = (error: unknown) => {
      console.error("WebSocket connection error:", error);
      setIsLoading(false);
    };

    const onDisconnect = () => {
      console.log("WebSocket disconnected");
      setIsLoading(false);
    };

    const onError = (error: unknown) => {
      console.error("WebSocket error:", error);
      setIsLoading(false);
    };

    socket.on("connect", onConnect);
    socket.on("assistant_token", onAssistantToken);
    socket.on("assistant_thinking", onAssistantThinking);
    socket.on("assistant_done", onAssistantDone);
    socket.on("connect_error", onConnectError);
    socket.on("disconnect", onDisconnect);
    socket.on("error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("assistant_token", onAssistantToken);
      socket.off("assistant_thinking", onAssistantThinking);
      socket.off("assistant_done", onAssistantDone);
      socket.off("connect_error", onConnectError);
      socket.off("disconnect", onDisconnect);
      socket.off("error", onError);
    };
  }, [socket, setMessages]);

  const sendMessage = async (
    input: string,
    settings?: ModelSettings,
    files?: File[],
    attachments?: MessageType["attachments"],
  ) => {
    if (!input.trim() || !socketRef.current) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: input, attachments },
    ]);
    setIsLoading(true);

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    if (!socketRef.current.connected) {
      console.error("[WebSocket] Socket is not connected");
      setIsLoading(false);
      return;
    }

    try {
      const processedFiles =
        files && files.length > 0
          ? await Promise.all(
              files.map((file) =>
                file.type.startsWith("image/") ? compressImage(file) : file,
              ),
            )
          : [];

      const encodedFiles = await Promise.all(
        processedFiles.map(
          (file) =>
            new Promise<{ name: string; type: string; data: string }>(
              (resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const result = reader.result as string;
                  resolve({
                    name: file.name,
                    type: file.type,
                    data: result.split(",")[1],
                  });
                };
                reader.onerror = () =>
                  reject(new Error(`Failed to read file: ${file.name}`));
                reader.readAsDataURL(file);
              },
            ),
        ),
      );

      socketRef.current.emit("user_message", {
        text: input,
        thinking: isThinking,
        settings: settings,
        files: encodedFiles,
      });
    } catch (error) {
      console.error("[WebSocket] Failed to process files:", error);
      setIsLoading(false);
    }
  };

  return { isLoading, sendMessage, isThinking, setIsThinking, isConnected };
}
