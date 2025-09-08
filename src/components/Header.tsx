import React from "react";

export default function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
            F
          </div>
          <h1 className="text-2xl font-bold text-foreground">FISQ 저작정보 관리 시스템</h1>
        </div>
      </div>
    </header>
  );
}