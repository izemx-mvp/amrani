import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import { Lotus } from "@/components/brand/Logo";
import {
  LayoutGrid, CalendarCheck, CalendarDays, Users, Activity as ActivityIcon, UserCog,
  Package, Sparkles, FileText, Bot, BookOpen, Wand2, Shield, Settings, Menu, X,
  CreditCard, Search, Bell, ChevronDown, ChevronRight, LogOut, ExternalLink, UserCircle,
} from "lucide-react";
import { signOut, useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";

type Item = { to: any; label: string; icon: any; exact?: boolean };
type Group = { id: string; label: string; icon: any; items: Item[]; defaultOpen?: boolean };

const GROUPS: Group[] = [
  {
    id: "pilotage",
    label: "Pilotage",
    icon: LayoutGrid,
    defaultOpen: true,
    items: [{ to: "/admin", label: "Vue d'ensemble", icon: LayoutGrid, exact: true }],
  },
  {
    id: "studio",
    label: "Gestion du studio",
    icon: CalendarCheck,
    defaultOpen: true,
    items: [
      { to: "/admin/bookings", label: "Réservations", icon: CalendarCheck },
      { to: "/admin/planning", label: "Planning", icon: CalendarDays },
      { to: "/admin/clients", label: "Clients", icon: Users },
      { to: "/admin/coaches", label: "Coaches", icon: UserCog },
      { to: "/admin/payments", label: "Paiements", icon: CreditCard },
    ],
  },
  {
    id: "offres",
    label: "Offres & Catalogue",
    icon: Package,
    items: [
      { to: "/admin/activities", label: "Catalogue & Activités", icon: ActivityIcon },
      { to: "/admin/packs", label: "Packs", icon: Package },
      { to: "/admin/promotions", label: "Promotions", icon: Sparkles },
    ],
  },
  {
    id: "contenu",
    label: "Contenu & Communication",
    icon: FileText,
    items: [
      { to: "/admin/articles", label: "Articles", icon: FileText },
    ],
  },
  {
    id: "admin",
    label: "Administration",
    icon: Shield,
    items: [
      { to: "/admin/users", label: "Utilisateurs & Rôles", icon: Shield },
      { to: "/admin/settings", label: "Configuration", icon: Settings },
    ],
  },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: s => s.location.pathname });
  const { user } = useAuth();
  const pending = useStore(s => s.bookings.filter(b => b.status === "En attente").length);

  const activeGroup = useMemo(
    () => GROUPS.find(g => g.items.some(i => (i.exact ? pathname === i.to : pathname.startsWith(i.to))))?.id,
    [pathname]
  );

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const g of GROUPS) initial[g.id] = !!g.defaultOpen;
    return initial;
  });
  const groupsWithActive = { ...openGroups, ...(activeGroup ? { [activeGroup]: true } : {}) };
  const toggle = (id: string) => setOpenGroups(o => ({ ...o, [id]: !groupsWithActive[id] }));

  return (
    <div className="min-h-screen bg-[color:var(--cream)]">
      <div className="flex">
        <aside className={`${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:sticky top-0 z-40 h-screen w-64 shrink-0 bg-[color:var(--forest)] text-[color:var(--cream)] transition-transform flex flex-col`}>
          <div className="p-5 border-b border-white/10 flex items-center gap-2 shrink-0">
            <Lotus className="h-7 w-7" color="var(--cream)" />
            <div>
              <div className="font-serif text-lg">Amrani</div>
              <div className="text-[10px] uppercase tracking-widest opacity-60">Administration</div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {GROUPS.map(g => {
              const isOpen = groupsWithActive[g.id];
              const GIcon = g.icon;
              return (
                <div key={g.id}>
                  <button
                    onClick={() => toggle(g.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[11px] uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5"
                  >
                    <GIcon className="h-3.5 w-3.5" />
                    <span className="flex-1 text-left">{g.label}</span>
                    {g.id === "studio" && pending > 0 && (
                      <span className="text-[10px] bg-amber-400 text-[color:var(--forest)] rounded-full px-1.5 py-0.5 font-semibold">{pending}</span>
                    )}
                    {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </button>
                  {isOpen && (
                    <div className="mt-0.5 ml-2 pl-2 border-l border-white/10 space-y-0.5">
                      {g.items.map(n => {
                        const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
                        const Icon = n.icon;
                        return (
                          <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-colors ${active ? "bg-[color:var(--sage)] text-[color:var(--forest)] font-medium" : "text-white/75 hover:bg-white/10 hover:text-white"}`}>
                            <Icon className="h-3.5 w-3.5" />
                            <span className="flex-1 truncate">{n.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="shrink-0 p-3 border-t border-white/10 space-y-1">
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="h-8 w-8 rounded-full bg-[color:var(--sage)] text-[color:var(--forest)] grid place-items-center text-xs font-semibold">
                {(user?.firstName?.[0] ?? "A") + (user?.lastName?.[0] ?? "")}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium truncate">{user ? `${user.firstName} ${user.lastName}` : "Admin"}</div>
                <div className="text-[10px] text-white/50 truncate">{user?.email ?? "admin@amrani.ma"}</div>
              </div>
            </div>
            <Link to="/" className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-white/75 hover:bg-white/10 hover:text-white">
              <ExternalLink className="h-3.5 w-3.5" />Voir le site public
            </Link>
            <Link to="/admin/settings" className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-white/75 hover:bg-white/10 hover:text-white">
              <UserCircle className="h-3.5 w-3.5" />Profil administrateur
            </Link>
            <button
              onClick={() => { signOut(); window.location.href = "/admin/login"; }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-white/75 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />Se déconnecter
            </button>
          </div>
        </aside>

        {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/40 z-30 lg:hidden" />}

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
                <div className="relative p-2 rounded-full hover:bg-secondary" aria-label="Notifications">
                  <Bell className="h-4 w-4 text-[color:var(--forest)]" />
                  {pending > 0 && <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-amber-400 text-[9px] font-bold text-[color:var(--forest)] grid place-items-center">{pending}</span>}
                </div>
                <div className="h-8 w-8 rounded-full bg-[color:var(--sage)] text-[color:var(--forest)] grid place-items-center text-xs font-semibold">
                  {(user?.firstName?.[0] ?? "A") + (user?.lastName?.[0] ?? "")}
                </div>
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
