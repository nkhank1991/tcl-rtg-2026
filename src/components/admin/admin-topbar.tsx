"use client";

import { useAuth } from "@/providers/auth-provider";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminTopbar({ title }: { title?: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/10 bg-[#0a0a0a] px-6">
      <h1 className="text-lg font-semibold text-white">
        {title || "Admin Portal"}
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-white/60">
          {user?.name || user?.phone || "Admin"}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
