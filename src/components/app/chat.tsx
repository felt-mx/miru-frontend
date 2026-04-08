"use client";

import { useRef, useState } from "react";
import { MessageType } from "@/lib/chat-types";
import { useChat } from "@/hooks/use-chat";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Bot, MessageSquareIcon } from "lucide-react";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Attachment,
  AttachmentHoverCard,
  AttachmentHoverCardContent,
  AttachmentHoverCardTrigger,
  AttachmentPreview,
  Attachments,
} from "@/components/ai-elements/attachments";
import { PromptInputBasic } from "@/components/app/prompt-input-basic";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { StreamType } from "@/lib/stream-types";
import { Stream } from "@/components/app/stream";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

function AIAvatar() {
  return (
    <div className="w-7 h-7 shrink-0 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
      {/* Placeholder */}
      <Bot className="size-4 text-white/80" />
    </div>
  );
}

export function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [streamType, setStreamType] = useState<StreamType>("none");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isLoading,
    sendMessage,
    isThinking,
    setIsThinking,
    isConnected,
    isReasoningStreaming,
  } = useChat({
    url: BACKEND_URL,
    setMessages,
    messagesEndRef,
  });

  const lastUserMessageIndex = messages
    .map((message) => message.role)
    .lastIndexOf("user");
  const hasModelTokenAfterLastUser =
    lastUserMessageIndex !== -1 &&
    messages
      .slice(lastUserMessageIndex + 1)
      .some(
        (message) =>
          message.role === "assistant" &&
          (message.content.trim().length > 0 ||
            (message.reasoning?.trim().length ?? 0) > 0),
      );
  const showFirstTokenShimmer =
    isLoading && lastUserMessageIndex !== -1 && !hasModelTokenAfterLastUser;

  return (
    <div className="relative flex size-full min-h-0 flex-col overflow-hidden rounded-[26px] bg-transparent">
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-transparent px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <Bot className="size-5 text-white/80" />
          </div>
          <div className="flex flex-col items-start leading-tight">
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-white/95">
                Miru
              </span>
              <span
                aria-label={isConnected ? "Online" : "Offline"}
                className="inline-flex items-center"
              >
                <span className="relative flex size-2.5">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full animate-ping [animation-duration:1800ms] ${
                      isConnected ? "bg-emerald-400/45" : "bg-red-400/45"
                    }`}
                  />
                  <span
                    className={`relative inline-flex size-2.5 rounded-full ${
                      isConnected ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />
                </span>
              </span>
            </div>
            <span className="text-[11px] text-white/60">Your AI companion</span>
          </div>
        </div>
      </div>

      {/* ── Stream ── */}
      {streamType !== "none" && (
        <div
          className="pointer-events-none absolute left-0 right-0 top-14 z-20 px-4 pb-2"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
          }}
        >
          <div className="pointer-events-auto">
            <Stream url={BACKEND_URL} streamType={streamType} />
          </div>
        </div>
      )}

      <Conversation className="relative min-h-0 grow">
        <ConversationContent scrollClassName="overflow-y-auto overflow-x-hidden pr-1 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-border hover:scrollbar-thumb-border/80">
          {messages.length === 0 ? (
            /* ── Landing / empty state ── */
            <ConversationEmptyState
              description="Ask me anything — I can see, think, and search."
              icon={<MessageSquareIcon className="size-6" />}
              title="Hi, I'm Miru"
            />
          ) : (
            <>
              {messages.map((message, index) => {
                const isAssistant = message.role === "assistant";
                return (
                  <div
                    key={message.id}
                    className={isAssistant ? "flex items-start gap-3" : ""}
                  >
                    {isAssistant && <AIAvatar />}
                    <div className={isAssistant ? "min-w-0 flex-1" : ""}>
                      {message.reasoning && (
                        <Reasoning
                          className="w-full"
                          isStreaming={
                            isReasoningStreaming &&
                            index === messages.length - 1
                          }
                        >
                          <ReasoningTrigger />
                          <ReasoningContent>
                            {message.reasoning}
                          </ReasoningContent>
                        </Reasoning>
                      )}
                      {message.role === "user" &&
                      message.attachments?.length ? (
                        <Attachments className="mb-2" variant="grid">
                          {message.attachments.map((attachment) => (
                            <AttachmentHoverCard key={attachment.id}>
                              <AttachmentHoverCardTrigger asChild>
                                <div className="inline-block">
                                  <Attachment data={attachment}>
                                    <AttachmentPreview />
                                  </Attachment>
                                </div>
                              </AttachmentHoverCardTrigger>
                              <AttachmentHoverCardContent
                                align="end"
                                collisionPadding={16}
                              >
                                <div className="flex max-h-[70vh] w-[min(90vw,42rem)] items-center justify-center overflow-hidden rounded-lg bg-muted/40 p-1">
                                  {attachment.mediaType.startsWith("image/") ? (
                                    <img
                                      alt={attachment.filename}
                                      className="max-h-[68vh] h-auto w-auto max-w-full object-contain"
                                      src={attachment.url}
                                    />
                                  ) : (
                                    <Attachment
                                      className="size-56 overflow-hidden rounded-lg"
                                      data={attachment}
                                    >
                                      <AttachmentPreview className="size-full" />
                                    </Attachment>
                                  )}
                                </div>
                              </AttachmentHoverCardContent>
                            </AttachmentHoverCard>
                          ))}
                        </Attachments>
                      ) : null}
                      <Message from={message.role}>
                        <MessageContent
                          className={
                            message.role === "user"
                              ? "group-[.is-user]:relative group-[.is-user]:border group-[.is-user]:border-white/18 group-[.is-user]:bg-white/8 group-[.is-user]:text-white group-[.is-user]:shadow-[0_4px_14px_rgba(0,0,0,0.16)] group-[.is-user]:backdrop-blur-[6px] group-[.is-user]:[backdrop-filter:blur(8px)_saturate(120%)_contrast(103%)]"
                              : undefined
                          }
                        >
                          <MessageResponse>{message.content}</MessageResponse>
                        </MessageContent>
                      </Message>
                    </div>
                  </div>
                );
              })}

              {showFirstTokenShimmer && (
                <div className="flex items-start gap-3">
                  <AIAvatar />
                  <div className="min-w-0 flex-1 text-sm">
                    <Shimmer>Working</Shimmer>
                  </div>
                </div>
              )}
            </>
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
          setStreamType={setStreamType}
        />
      </div>
    </div>
  );
}
