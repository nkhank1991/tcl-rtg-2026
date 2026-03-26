import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";

export const metadata: Metadata = {
  title: {
    default: "Admin | TCL × Arsenal",
    template: "%s | Admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="flex h-dvh overflow-hidden bg-[#111]">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminTopbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
