"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, LogOut, X, Home, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NavbarLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  // const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("You have been logged out.");
      router.push("/sign-in");
    } catch (error) {
      console.error(error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar for large screens */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r shadow-lg h-screen fixed left-0 top-0">
        <div className="p-6 space-y-4">
          <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link href="/vehicle" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <User className="w-4 h-4" /> Create
          </Link>
          <Link href="/settings" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Settings className="w-4 h-4" /> Settings
          </Link>
          <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
    >
      <LogOut size={18} />
      Logout
    </button>
        </div>
      </aside>

      {/* Mobile Navbar Top */}
      <nav className="md:hidden bg-white border-b shadow-sm w-full fixed top-0 left-0 z-40">
        <div className="flex justify-between h-16 items-center px-4">
          <Link href="/" className="text-xl font-bold text-blue-600">
            MyApp
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 space-y-4">
          <Link href="/" onClick={handleClose} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link href="/vehicle" onClick={handleClose} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <User className="w-4 h-4" /> Profile
          </Link>
          <Link href="/settings" onClick={handleClose} className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Settings className="w-4 h-4" /> Settings
          </Link>

          <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
    >
      <LogOut size={18} />
      Logout
    </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity duration-300"
          onClick={handleClose}
        />
      )}
    </div>
  );
}
