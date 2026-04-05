"use client";

import { useRef, useState } from "react";
import { MessageType } from "@/lib/chat-types";
import { useChatWebSocket } from "@/hooks/use-chat-websocket";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { MessageSquareIcon, Pill } from "lucide-react";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { PromptInputBasic } from "@/components/app/prompt-input-basic";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

function AIAvatar() {
  return (
    <div className="w-7 h-7 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-0.5">
      {/* Placeholder */}
      <Pill className="size-3.5 text-primary" />
    </div>
  );
}

export function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isLoading, sendMessage, isThinking, setIsThinking } =
    useChatWebSocket({
      url: BACKEND_URL,
      setMessages,
      messagesEndRef,
    });

  return (
    <div className="flex size-full min-h-0 flex-col">
      {/* ── Sticky header ── */}
      <div className="px-4 py-3 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between gap-2 sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Pill className="size-4 text-primary" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-base">Miru</span>
          </div>
        </div>
      </div>

      <Conversation className="relative min-h-0 grow">
        <ConversationContent>
          {messages.length === 0 ? (
            /* ── Landing / empty state ── */
            <ConversationEmptyState
              description="Ask me anything — I can see, think, and search."
              icon={<MessageSquareIcon className="size-6" />}
              title="Hi, I'm Miru"
            />
          ) : (
            messages.map((message, index) => (
              <div key={message.id} className="flex items-start gap-5">
                {message.role === "assistant" && <AIAvatar />}
                {message.reasoning && (
                  <Reasoning
                    className="w-full"
                    isStreaming={isLoading && index === messages.length - 1}
                  >
                    <ReasoningTrigger />
                    <ReasoningContent>{message.reasoning}</ReasoningContent>
                  </Reasoning>
                )}
                <Message from={message.role}>
                  <MessageContent>
                    <MessageResponse>{message.content}</MessageResponse>
                  </MessageContent>
                </Message>
              </div>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input */}
      <div className="py-4">
        <PromptInputBasic
          handleSubmit={sendMessage}
          isLoading={isLoading}
          thinking={isThinking}
          setThinking={setIsThinking}
        />
      </div>
    </div>
  );
}
