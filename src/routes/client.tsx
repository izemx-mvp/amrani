import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";

export const Route = createFileRoute("/client")({
  component: ClientGate,
});

function ClientGate() {
  const { isAuthenticated, hydrated } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (hydrated && !isAuthenticated) nav({ to: "/auth", search: { redirect: "/client", mode: "login" } });
  }, [hydrated, isAuthenticated, nav]);
  if (!hydrated || !isAuthenticated) return null;
  return <ClientLayout><Outlet /></ClientLayout>;
}
