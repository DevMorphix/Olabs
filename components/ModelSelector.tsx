'use client';

import { useEffect, useState } from 'react';
import { Bot, Cpu, CheckCircle2, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ModelAvailability {
  gemini: boolean;
  groq: boolean;
  gpt4: boolean;
}

const MODEL_NAMES = {
  gemini: "Google Gemini",
  groq: "Groq",
  gpt4: "GPT-4"
};

const MODEL_DESCRIPTIONS = {
  gemini: "Fast and cost-effective, good for general summaries",
  groq: "Very fast, good for long videos",
  gpt4: "High-quality summaries, slightly slower"
};

const MODEL_ICONS = {
  gemini: Bot,
  groq: Cpu,
  gpt4: Bot
};

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  theme?: "light" | "dark";
}

export function ModelSelector({ selectedModel, onModelChange, theme = "light" }: ModelSelectorProps) {
  const [modelAvailability, setModelAvailability] = useState<ModelAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLight = theme === "light";
  const textColor = isLight ? "text-white" : "text-black";
  const bgActive = isLight ? "bg-gray-100" : "bg-white/20";
  const bgInactive = isLight ? "bg-transparent" : "bg-transparent";

  useEffect(() => {
    async function fetchModelAvailability() {
      try {
        const response = await fetch('/api/summarize');
        const data = await response.json();
        setModelAvailability(data);
      } catch (error) {
        console.error('Failed to fetch model availability:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchModelAvailability();
  }, []);

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading models..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={selectedModel} onValueChange={onModelChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select AI Model" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(MODEL_NAMES).map(([key, name]) => {
          const isAvailable = modelAvailability?.[key as keyof ModelAvailability];
          const Icon = MODEL_ICONS[key as keyof typeof MODEL_ICONS];

          return (
            <SelectItem
              key={key}
              value={key}
              disabled={!isAvailable}
            >
              <div className={cn(
                "flex items-center space-x-2",
                isLight ? "bg-muted" : "bg-white/10"
              )}>
                <Icon className="h-4 w-4" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={textColor}>{name}</span>
                    {isAvailable ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <p className={`text-xs ${textColor}`}>
                    {MODEL_DESCRIPTIONS[key as keyof typeof MODEL_DESCRIPTIONS]}
                    {!isAvailable && (
                      <span className="text-red-500 block">
                        API key required
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}