import React from "react";

export default function Header() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
            F
          </div>
          <h1 className="text-foreground text-2xl font-bold">
            FISQ 저작정보 관리 시스템
          </h1>
        </div>
      </div>
    </header>
  );
}
