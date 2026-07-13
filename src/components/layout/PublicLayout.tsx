import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Menu, X, Instagram, Facebook, User } from "lucide-react";
import { AIBubble } from "@/components/ai/AIBubble";
import { useAuth } from "@/lib/auth";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/about", label: "À propos" },
  { to: "/activities", label: "Activités" },
  { to: "/catalog", label: "Catalogue" },
  { to: "/planning", label: "Planning" },
  { to: "/packs", label: "Packs" },
  { to: "/promotions", label: "Promotions" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function PublicLayout({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: s => s.location.pathname });
  const { user, isAuthenticated } = useAuth();
  const espaceLabel = isAuthenticated && user ? user.firstName : "Mon espace";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md border-b border-border py-2" : "bg-transparent py-4"}`}>
        <div className="container-editorial flex items-center justify-between">
          <Logo />
          <nav className="hidden lg:flex items-center gap-5">
            {NAV.map(n => (
              <Link key={n.to} to={n.to} className="text-sm text-foreground/80 hover:text-[color:var(--forest)] transition-colors [&.active]:text-[color:var(--forest)] [&.active]:font-medium" activeProps={{ className: "active" }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link to={isAuthenticated ? "/client" : "/auth"} className="hidden sm:inline-flex items-center gap-1.5 text-sm text-foreground/80 hover:text-[color:var(--forest)]">
              <User className="h-4 w-4" />{espaceLabel}
            </Link>
            <Link to="/booking">
              <Button size="sm" className="rounded-full px-5 hidden sm:inline-flex">Réserver</Button>
            </Link>
            <button className="lg:hidden p-2" onClick={() => setOpen(v => !v)} aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="container-editorial py-4 flex flex-col gap-3">
              {NAV.map(n => <Link key={n.to} to={n.to} className="py-1 text-foreground/80">{n.label}</Link>)}
              <Link to={isAuthenticated ? "/client" : "/auth"} className="py-1 text-foreground/80">{espaceLabel}</Link>
              <Link to="/booking"><Button className="rounded-full w-full mt-2">Réserver</Button></Link>
            </div>
          </div>
        )}
      </header>

      <main className="pt-20">{children}</main>

      <footer className="mt-24 border-t border-border bg-[color:var(--forest)] text-[color:var(--cream)]">
        <div className="container-editorial py-16 grid gap-10 md:grid-cols-4">
          <div>
            <Logo className="[&_span]:text-[color:var(--cream)] [&_svg]:!text-[color:var(--cream)]" />
            <p className="mt-4 text-sm text-[color:var(--cream)]/70 max-w-xs">Un espace dédié au mouvement, à l'énergie et à votre bien-être.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[color:var(--cream)] mb-3">Studio</h4>
            <ul className="space-y-2 text-sm text-[color:var(--cream)]/70">
              <li><Link to="/about">Notre histoire</Link></li>
              <li><Link to="/activities">Activités</Link></li>
              <li><Link to="/packs">Packs</Link></li>
              <li><Link to="/blog">Journal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[color:var(--cream)] mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-[color:var(--cream)]/70">
              <li>12 rue des Oliviers, Casablanca</li>
              <li>+212 5 22 00 00 00</li>
              <li>hello@amrani-studio.com</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[color:var(--cream)] mb-3">Suivez-nous</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 border border-[color:var(--cream)]/20 rounded-full hover:bg-[color:var(--cream)]/10"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="p-2 border border-[color:var(--cream)]/20 rounded-full hover:bg-[color:var(--cream)]/10"><Facebook className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-[color:var(--cream)]/10 py-5 text-center text-xs text-[color:var(--cream)]/50">© {new Date().getFullYear()} Amrani Studio · Yoga & Pilates</div>
      </footer>

      <AIBubble />
    </div>
  );
}
