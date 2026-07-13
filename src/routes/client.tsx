import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ClientLayout } from "@/components/layout/ClientLayout";

export const Route = createFileRoute("/client")({
  component: () => <ClientLayout><Outlet /></ClientLayout>,
});
