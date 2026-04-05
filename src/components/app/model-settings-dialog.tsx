"use client";

import { useEffect, useState } from "react";
import { CircleHelp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ModelSettings = {
  temperature: number[];
  topP: number[];
  topK: number[];
  minP: number[];
  presencePenalty: number[];
  repetitionPenalty: number[];
};

const NON_THINKING_SETTINGS: ModelSettings = {
  temperature: [0.7],
  topP: [0.8],
  topK: [20],
  minP: [0.0],
  presencePenalty: [1.5],
  repetitionPenalty: [1.0],
};

const THINKING_SETTINGS: ModelSettings = {
  temperature: [1.0],
  topP: [0.95],
  topK: [20],
  minP: [0.0],
  presencePenalty: [1.5],
  repetitionPenalty: [1.0],
};

export function useModelSettings(thinking: boolean) {
  const [settings, setSettings] = useState<ModelSettings>({
    ...NON_THINKING_SETTINGS,
  });

  useEffect(() => {
    setSettings({ ...(thinking ? THINKING_SETTINGS : NON_THINKING_SETTINGS) });
  }, [thinking]);

  return { settings, setSettings };
}

type ModelSettingsDialogProps = {
  settings: ModelSettings;
  setSettings: React.Dispatch<React.SetStateAction<ModelSettings>>;
};

export function ModelSettingsDialog({
  settings,
  setSettings,
}: ModelSettingsDialogProps) {
  const updateSetting = (
    key: keyof ModelSettings,
    value: number | readonly number[],
  ) => {
    const normalizedValue = Array.isArray(value) ? [...value] : [value];
    setSettings((prev) => ({ ...prev, [key]: normalizedValue }));
  };

  return (
    <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
      <DialogHeader>
        <DialogTitle>Model Settings</DialogTitle>
        <DialogDescription>
          Configure your model settings here.
        </DialogDescription>
      </DialogHeader>
      <TooltipProvider>
        <div className="py-4">
          <div className="mx-auto grid w-full max-w-xs gap-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="slider-temperature">Temperature</Label>
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    onClick={(e) => e.preventDefault()}
                  >
                    <CircleHelp className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-left text-xs">
                      Controls randomness. Lower values produce more focused,
                      predictable outputs. Higher values create more creative
                      but potentially less coherent results.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm text-muted-foreground">
                {settings.temperature.join(", ")}
              </span>
            </div>
            <Slider
              id="slider-temperature"
              value={settings.temperature}
              onValueChange={(val) => updateSetting("temperature", val)}
              min={0}
              max={1}
              step={0.1}
            />
          </div>
          <div className="mx-auto grid w-full max-w-xs gap-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="slider-top-p">Top-P</Label>
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    onClick={(e) => e.preventDefault()}
                  >
                    <CircleHelp className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-left text-xs">
                      Limits token selection to the smallest set of
                      probabilities that sum up to a chosen percentage. A higher
                      value allows more unpredictable sampling; lower restricts
                      choices for consistency.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm text-muted-foreground">
                {settings.topP.join(", ")}
              </span>
            </div>
            <Slider
              id="slider-top-p"
              value={settings.topP}
              onValueChange={(val) => updateSetting("topP", val)}
              min={0}
              max={1}
              step={0.1}
            />
          </div>
          <div className="mx-auto grid w-full max-w-xs gap-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="slider-top-k">Top-K</Label>
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    onClick={(e) => e.preventDefault()}
                  >
                    <CircleHelp className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-left text-xs">
                      Selects only the k most probable tokens from the
                      vocabulary. Useful when you want to constrain generation
                      to a specific subset of words.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm text-muted-foreground">
                {settings.topK.join(", ")}
              </span>
            </div>
            <Slider
              id="slider-top-k"
              value={settings.topK}
              onValueChange={(val) => updateSetting("topK", val)}
              min={0}
              max={100}
              step={1}
            />
          </div>
          <div className="mx-auto grid w-full max-w-xs gap-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="slider-min-p">Min-P</Label>
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    onClick={(e) => e.preventDefault()}
                  >
                    <CircleHelp className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-left text-xs">
                      Ensures tokens are selected only if they meet or exceed a
                      minimum probability threshold, helping maintain diversity
                      without going too unpredictable.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm text-muted-foreground">
                {settings.minP.join(", ")}
              </span>
            </div>
            <Slider
              id="slider-min-p"
              value={settings.minP}
              onValueChange={(val) => updateSetting("minP", val)}
              min={0}
              max={1}
              step={0.1}
            />
          </div>
          <div className="mx-auto grid w-full max-w-xs gap-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="slider-presence-penalty">
                  Presence Penalty
                </Label>
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    onClick={(e) => e.preventDefault()}
                  >
                    <CircleHelp className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-left text-xs">
                      Rewards introducing new words and discourages repeating
                      the same one. Higher values push the model to try
                      different topics.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm text-muted-foreground">
                {settings.presencePenalty.join(", ")}
              </span>
            </div>
            <Slider
              id="slider-presence-penalty"
              value={settings.presencePenalty}
              onValueChange={(val) => updateSetting("presencePenalty", val)}
              min={0}
              max={2}
              step={0.1}
            />
          </div>
          <div className="mx-auto grid w-full max-w-xs gap-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Label htmlFor="slider-repetition-penalty">
                  Repetition Penalty
                </Label>
                <Tooltip>
                  <TooltipTrigger
                    type="button"
                    onClick={(e) => e.preventDefault()}
                  >
                    <CircleHelp className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-left text-xs">
                      Penalizes generating already-mentioned tokens, reducing
                      repetitive patterns in long conversations or articles.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm text-muted-foreground">
                {settings.repetitionPenalty.join(", ")}
              </span>
            </div>
            <Slider
              id="slider-repetition-penalty"
              value={settings.repetitionPenalty}
              onValueChange={(val) => updateSetting("repetitionPenalty", val)}
              min={0}
              max={2}
              step={0.1}
            />
          </div>
        </div>
      </TooltipProvider>
    </DialogContent>
  );
}
