import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Lotus } from "@/components/brand/Logo";
import {
  LayoutGrid, CalendarCheck, CalendarDays, Users, Activity, UserCog,
  Package, Sparkles, FileText, MessageSquare, Bot, BookOpen, Wand2, Shield, Settings, Menu, X, CreditCard, Search, Bell
} from "lucide-react";

const NAV: { to: any; label: string; icon: any; exact?: boolean }[] = [
  { to: "/admin", label: "Vue d'ensemble", icon: LayoutGrid, exact: true },
  { to: "/admin/bookings", label: "Réservations", icon: CalendarCheck },
  { to: "/admin/planning", label: "Planning", icon: CalendarDays },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/activities", label: "Catalogue & Activités", icon: Activity },
  { to: "/admin/coaches", label: "Coaches", icon: UserCog },
  { to: "/admin/packs", label: "Packs", icon: Package },
  { to: "/admin/promotions", label: "Promotions", icon: Sparkles },
  { to: "/admin/articles", label: "Articles", icon: FileText },
  { to: "/admin/payments", label: "Paiements", icon: CreditCard },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/ai-agent", label: "Agent IA", icon: Bot },
  { to: "/admin/knowledge", label: "Base de connaissances", icon: BookOpen },
  { to: "/admin/creative-studio", label: "Studio Créatif IA", icon: Wand2 },
  { to: "/admin/users", label: "Utilisateurs & Rôles", icon: Shield },
  { to: "/admin/settings", label: "Configuration", icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: s => s.location.pathname });

  return (
    <div className="min-h-screen bg-[color:var(--cream)]">
      <div className="flex">
        <aside className={`${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:sticky top-0 z-40 h-screen w-64 shrink-0 bg-[color:var(--forest)] text-[color:var(--cream)] transition-transform overflow-y-auto`}>
          <div className="p-5 border-b border-white/10 flex items-center gap-2">
            <Lotus className="h-7 w-7" color="var(--cream)" />
            <div>
              <div className="font-serif text-lg">Amrani</div>
              <div className="text-[10px] uppercase tracking-widest opacity-60">Administration</div>
            </div>
          </div>
          <nav className="p-3 space-y-0.5">
            {NAV.map(n => {
              const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
              const Icon = n.icon;
              return (
                <Link key={n.to} to={n.to} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${active ? "bg-[color:var(--sage)] text-[color:var(--forest)] font-medium" : "text-white/75 hover:bg-white/10 hover:text-white"}`}>
                  <Icon className="h-4 w-4" />{n.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 mt-4 text-[10px] text-white/40">Amrani Admin v1 · Démo</div>
        </aside>
        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-border">
            <div className="flex items-center gap-3 px-4 lg:px-6 py-3">
              <button className="lg:hidden p-2" onClick={() => setOpen(v => !v)}>
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input placeholder="Recherche globale…" className="w-full h-9 pl-9 pr-3 text-sm rounded-full bg-secondary/60 border border-transparent focus:bg-white focus:border-border focus:outline-none" />
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Link to="/admin/bookings" className="hidden md:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-[color:var(--forest)] text-[color:var(--cream)] hover:opacity-90">+ Réservation</Link>
                <button className="relative p-2 rounded-full hover:bg-secondary" aria-label="Notifications">
                  <Bell className="h-4 w-4 text-[color:var(--forest)]" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[color:var(--forest)]" />
                </button>
                <Link to="/" className="hidden sm:inline text-muted-foreground hover:text-[color:var(--forest)]">Voir le site</Link>
                <div className="h-8 w-8 rounded-full bg-[color:var(--sage)] text-[color:var(--forest)] grid place-items-center text-xs font-semibold">SA</div>
              </div>
            </div>
          </header>
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="font-serif text-3xl text-[color:var(--forest)]">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
