"use client";

import { memo, useCallback } from "react";
import {
  PromptInputActionMenuContent,
  PromptInputTextarea,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputTools,
  PromptInputProvider,
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputActionAddAttachments,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Brain, GlobeIcon, Wrench } from "lucide-react";
import {
  ModelSettingsDialog,
  ModelSettings,
  useModelSettings,
} from "@/components/app/model-settings-dialog";
import {
  Attachment,
  AttachmentData,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "../ai-elements/attachments";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { MessageAttachment } from "@/lib/chat-types";

interface AttachmentItemProps {
  attachment: AttachmentData;
  onRemove: (id: string) => void;
}

const AttachmentItem = memo(({ attachment, onRemove }: AttachmentItemProps) => {
  const handleRemove = useCallback(
    () => onRemove(attachment.id),
    [onRemove, attachment.id],
  );
  return (
    <Attachment data={attachment} key={attachment.id} onRemove={handleRemove}>
      <AttachmentPreview />
      <AttachmentRemove />
    </Attachment>
  );
});

AttachmentItem.displayName = "AttachmentItem";

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();

  const handleRemove = useCallback(
    (id: string) => attachments.remove(id),
    [attachments],
  );

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <AttachmentItem
          attachment={attachment}
          key={attachment.id}
          onRemove={handleRemove}
        />
      ))}
    </Attachments>
  );
};

export function PromptInputBasic({
  handleSubmit,
  isLoading,
  thinking,
  setThinking,
}: {
  handleSubmit: (
    value: string,
    settings: ModelSettings,
    files?: File[],
    attachments?: MessageAttachment[],
  ) => void | Promise<void>;
  isLoading: boolean;
  thinking: boolean;
  setThinking: (thinking: boolean) => void;
}) {
  const { settings, setSettings } = useModelSettings(thinking);

  const onSubmit = async ({ text, files }: PromptInputMessage) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const messageAttachments: MessageAttachment[] = files.map(
      (file, index) => ({
        id: `${Date.now()}-${index}`,
        type: "file",
        url: file.url,
        filename: file.filename,
        mediaType: file.mediaType,
      }),
    );

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        try {
          const response = await fetch(file.url);
          const blob = await response.blob();
          return new File([blob], file.filename ?? "upload-image", {
            type: file.mediaType || blob.type,
          });
        } catch {
          return null;
        }
      }),
    );

    return handleSubmit(
      trimmed,
      settings,
      uploadedFiles.filter((file): file is File => file !== null),
      messageAttachments,
    );
  };

  return (
    <>
      <PromptInputProvider>
        <PromptInput accept="image/*" onSubmit={onSubmit}>
          <PromptInputAttachmentsDisplay />
          <PromptInputBody>
            <PromptInputTextarea
              className="p-4"
              disabled={isLoading}
              placeholder="Ask Miru..."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger disabled={isLoading} />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                  <Dialog>
                    <DialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Wrench className="mr-2 size-4" /> Model Setting
                      </DropdownMenuItem>
                    </DialogTrigger>
                    <ModelSettingsDialog
                      settings={settings}
                      setSettings={setSettings}
                    />
                  </Dialog>
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputButton variant="ghost">
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              <PromptInputButton
                aria-pressed={thinking}
                onClick={() => {
                  setThinking(!thinking);
                }}
                variant={thinking ? "default" : "ghost"}
              >
                <Brain size={16} />
                <span>Thinking</span>
              </PromptInputButton>
            </PromptInputTools>
            <PromptInputSubmit disabled={isLoading} />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </>
  );
}
