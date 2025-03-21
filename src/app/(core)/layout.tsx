"use client";

import Providers from "@/components/layouts/providers";
import SetLayout from "@/components/layouts/SetLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <SetLayout>{children}</SetLayout>
    </Providers>
  );
}
