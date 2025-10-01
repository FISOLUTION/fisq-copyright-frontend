import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiKeyUtils } from "@/utils/api-key";
import { aiModeUtils } from "@/utils/ai-mode";
import { AIMode, AIModeValue, DEFAULT_AI_MODE } from "@/types/ai-mode";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [aiMode, setAiMode] = useState<AIModeValue>(DEFAULT_AI_MODE);

  useEffect(() => {
    if (isOpen) {
      const savedApiKey = apiKeyUtils.get();
      setApiKey(savedApiKey || "");
      const savedAiMode = aiModeUtils.get();
      setAiMode(savedAiMode);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey.trim()) {
      apiKeyUtils.set(apiKey.trim());
    }
    aiModeUtils.set(aiMode);
    onClose();
  };

  const handleReset = () => {
    setApiKey("");
    apiKeyUtils.remove();
    setAiMode(DEFAULT_AI_MODE);
    aiModeUtils.remove();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-6">
          <DialogTitle>설정</DialogTitle>
        </DialogHeader>
        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="api-key">API 키</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="API 키를 입력하세요"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-mode">AI 검색 모드</Label>
              <Select
                value={aiMode}
                onValueChange={(value) => setAiMode(value as AIModeValue)}
              >
                <SelectTrigger id="ai-mode">
                  <SelectValue placeholder="AI 모드를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AIMode).map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between gap-2 pt-6">
            <Button type="button" variant="outline" onClick={handleReset}>
              초기화
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                취소
              </Button>
              <Button type="button" onClick={handleSave}>
                저장
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
