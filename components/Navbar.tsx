"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./DarkModeBtn";
import UserCard from "./UserCard";
import { useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return null;
  }

  return (
    <nav className="bg-background border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-primary flex">
            <img src={"./box-drive-logo.png"} className="w-10 h-7" />
            Box Drive
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6 items-center">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Home
            </Link>
            <Link
              href="/starred"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Starred
            </Link>
            <Link
              href="/trash"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Trash
            </Link>
          </div>
          <div className="hidden md:flex">
            <ModeToggle />
            <UserCard
              avatarUrl={user?.imageUrl || ""}
              email={user?.emailAddresses?.[0]?.emailAddress || ""}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <div className="flex">
              <ModeToggle />
              <UserCard
                avatarUrl={user?.imageUrl || ""}
                email={user?.emailAddresses?.[0]?.emailAddress || ""}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link
            href="/"
            className="block text-muted-foreground hover:text-foreground transition"
          >
            Home
          </Link>
          <Link
            href="/starred"
            className="block text-muted-foreground hover:text-foreground transition"
          >
            Starred
          </Link>
          <Link
            href="/trash"
            className="block text-muted-foreground hover:text-foreground transition"
          >
            Trash
          </Link>
        </div>
      )}
    </nav>
  );
}
