import ProtectLayout from "@/components/protectLayouts";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Fox-Transport",
  description: "Cape Town Leader",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ProtectLayout>
      {children}
      </ProtectLayout>

    </div>
  );
}
