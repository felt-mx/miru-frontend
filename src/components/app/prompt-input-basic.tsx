"use client";

import { memo, useCallback, useState } from "react";
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
  ) => void | Promise<void>;
  isLoading: boolean;
  thinking: boolean;
  setThinking: (thinking: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const { settings, setSettings } = useModelSettings(thinking);

  const onSubmit = ({ text }: PromptInputMessage) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    return handleSubmit(trimmed, settings);
  };

  return (
    <>
      <PromptInputProvider>
        <PromptInput onSubmit={onSubmit}>
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
                  <DropdownMenuItem
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    <Wrench className="mr-2 size-4" /> Model Setting
                  </DropdownMenuItem>
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

      <ModelSettingsDialog
        open={open}
        onOpenChange={setOpen}
        settings={settings}
        setSettings={setSettings}
      />
    </>
  );
}
