import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { SanityLive } from "@/sanity/lib/live";
import { Header } from "@/components/app/Header";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
        {/* <Header /> */}
        <main className="flex-1">{children}</main>
      </div>
      <SanityLive />
    </ClerkProvider>
  );
}
