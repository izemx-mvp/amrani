import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { LayoutDashboard, Calendar, Package, Bell, User, LogOut, Menu, X } from "lucide-react";

const NAV: { to: any; label: string; icon: any; exact?: boolean }[] = [
  { to: "/client", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/client/bookings", label: "Mes réservations", icon: Calendar },
  { to: "/client/packs", label: "Mes packs", icon: Package },
  { to: "/client/notifications", label: "Notifications", icon: Bell },
  { to: "/client/profile", label: "Mon profil", icon: User },
];

export function ClientLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: s => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-30">
        <div className="container-editorial flex items-center justify-between py-3">
          <Logo />
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-muted-foreground">Bonjour, Nour</span>
            <Link to="/" className="text-sm text-muted-foreground hover:text-[color:var(--forest)]">Site public</Link>
            <button onClick={() => setOpen(v => !v)} className="lg:hidden p-2">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>
      <div className="container-editorial py-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className={`${open ? "block" : "hidden"} lg:block`}>
          <nav className="space-y-1">
            {NAV.map(n => {
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              const Icon = n.icon;
              return (
                <Link key={n.to} to={n.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-[color:var(--forest)] text-[color:var(--cream)]" : "hover:bg-secondary text-foreground/80"}`}>
                  <Icon className="h-4 w-4" />{n.label}
                </Link>
              );
            })}
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary mt-6">
              <LogOut className="h-4 w-4" />Se déconnecter
            </Link>
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
