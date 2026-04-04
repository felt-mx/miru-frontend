"use client";

import { useState } from "react";
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
} from "@/components/ai-elements/prompt-input";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Brain, GlobeIcon, Wrench } from "lucide-react";
import {
  ModelSettingsDialog,
  ModelSettings,
  useModelSettings,
} from "@/components/app/model-settings-dialog";

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
