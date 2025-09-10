import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex items-center px-6 py-2">
        <Image
          src="/logo.png"
          alt="FISQ Logo"
          width={120}
          height={30}
          className="h-8 w-auto"
          priority
        />
      </div>
    </header>
  );
}
