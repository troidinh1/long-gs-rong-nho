"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AdminTopbar />

      <div className="flex">
        <AdminSidebar />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1500px] px-4 py-6 md:px-8 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}