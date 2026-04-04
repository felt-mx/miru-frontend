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
import { MessageSquareIcon } from "lucide-react";
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
              <div key={message.id}>
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
      <div className="p-5">
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
