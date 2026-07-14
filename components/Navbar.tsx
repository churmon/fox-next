"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ModeToggle } from "./mode-toggle";


export default function Navbar() {
  const router = useRouter();
  async function logout() {
          await authClient.signOut();
          toast.success("Logged out successfully!");
          router.push("/sign-in");
      }
  return (
    <nav className="w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          FoxTransport
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/vehicle" className="hover:text-blue-600">Create</Link>
          <Link href="/sign-in" className="hover:text-blue-600">Sign In</Link>
          <Link href="/sign-up" className="hover:text-blue-600">Register</Link>
          <ModeToggle />
          <Button onClick={logout} className="hover:text-blue-600">
            Log Out
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
            {/* <SheetTrigger asChild> */}
              {/* <Button variant="ghost" size="icon"> */}
                <Menu className="h-6 w-6" />
              {/* </Button> */}
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/vehicle" className="hover:text-blue-600">Create</Link>
          <Link href="/sign-in" className="hover:text-blue-600">Sign In</Link>
          <Link href="/sign-up" className="hover:text-blue-600">Register</Link>
          <ModeToggle />
                <Button onClick={logout} className="hover:text-blue-600">
            Log Out
          </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}




// const [selected, setSelected] = useState(0);

// <Carousel
//   opts={{
//     startIndex: selected,
//   }}
// >
//   <CarouselContent>
//     {post.images.map((url, index) => (
//       <CarouselItem key={url}>
//         <div className="relative aspect-video overflow-hidden rounded-xl">
//           <Image
//             src={url}
//             alt=""
//             fill
//             className="object-cover"
//           />
//         </div>
//       </CarouselItem>
//     ))}
//   </CarouselContent>

//   <CarouselPrevious />
//   <CarouselNext />
// </Carousel>

// <div className="mt-3 flex gap-2 overflow-x-auto">
//   {post.images.map((url, index) => (
//     <button
//       key={url}
//       onClick={() => setSelected(index)}
//       className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
//         selected === index
//           ? "border-primary"
//           : "border-transparent"
//       }`}
//     >
//       <Image
//         src={url}
//         alt=""
//         fill
//         className="object-cover"
//       />
//     </button>
//   ))}
// </div>