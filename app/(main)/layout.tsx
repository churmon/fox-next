import Navbar from "@/components/Navbar";
import ProtectLayout from "@/components/protectLayouts";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Fox-Transport",
  description: "Cape Town Leader",
};

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ProtectLayout>
        {/* flex-1 md:ml-64 mt-16 md:mt-0 p-6 */}
        <main className="flex-1 md:ml-64 mt-16 md:mt-0 p-6 ">
            <Navbar />
            <div>
              {children}
            </div>
            
        </main>
      </ProtectLayout>
  );
}
