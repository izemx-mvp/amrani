import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminGate,
});

function AdminGate() {
  const { isAdmin, hydrated } = useAuth();
  const nav = useNavigate();
  const pathname = useRouterState({ select: s => s.location.pathname });
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (hydrated && !isAdmin && !isLogin) nav({ to: "/admin/login" });
  }, [hydrated, isAdmin, isLogin, nav]);

  if (isLogin) return <Outlet />;
  if (!hydrated || !isAdmin) return null;
  return <AdminLayout><Outlet /></AdminLayout>;
}
