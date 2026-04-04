"use client";

import { useRef, useState } from "react";
import { MessageType } from "@/lib/chat-types";
import { useChatWebSocket } from "@/hooks/use-chat-websocket";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import { MessageSquareIcon } from "lucide-react";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { PromptInputBasic } from "@/components/app/prompt-input-basic";

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
            messages.map((message) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>{message.content}</MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
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
