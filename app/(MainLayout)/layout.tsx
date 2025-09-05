"use client";
import MainLayout from "@/components/main-layout";

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <MainLayout>{children}</MainLayout>
    </div>
  );
}
