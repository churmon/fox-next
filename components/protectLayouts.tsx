// app/dashboard/layout.tsx

"use client";

import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export default function ProtectLayout({ children }: Props) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in");
    }
  }, [session, isPending, router]);

   if (isPending) return <div className="flex items-center justify-center"> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> </div>;

  if (!session) {
    return null;
  }

  return <>{children}</>;
}