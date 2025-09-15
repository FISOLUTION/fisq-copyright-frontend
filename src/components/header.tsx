import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    <header className="bg-background border-b">
      <div className="container mx-auto flex items-center justify-between px-6 py-2">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/logo.png"
            alt="FISQ Logo"
            width={120}
            height={30}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSettingsOpen(true)}
          className="h-8 w-8"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </header>
  );
}
