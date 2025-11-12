import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { SettingsModal } from "@/components/settings-modal";

export default function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  React.useEffect(() => {
    const handleOpenSettings = () => {
      setIsSettingsOpen(true);
    };

    window.addEventListener("openSettings", handleOpenSettings);
    return () => {
      window.removeEventListener("openSettings", handleOpenSettings);
    };
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsSettingsOpen(true)}
        className="h-8 w-8"
      >
        <Settings className="h-4 w-4" />
      </Button>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
