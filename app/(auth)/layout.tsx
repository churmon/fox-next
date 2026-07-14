import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Fox-Transport",
  description: "Cape Town Leader",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
    </div>
  );
}
