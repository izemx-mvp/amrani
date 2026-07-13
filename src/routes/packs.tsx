import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

export const Route = createFileRoute("/packs")({
  head: () => ({ meta: [{ title: "Packs & Abonnements — Amrani" }] }),
  component: Packs,
});

function Packs() {
  const packs = useStore(s => s.packs.filter(p => p.active));
  return (
    <PublicLayout>
      <section className="container-editorial py-16">
        <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--forest)]/70">Packs</span>
        <h1 className="font-serif text-5xl md:text-6xl text-[color:var(--forest)] mt-3">Investissez dans votre pratique.</h1>
        <p className="mt-4 max-w-xl text-foreground/70">Des formules pensées pour toutes les envies et tous les rythmes.</p>
      </section>

      <section className="container-editorial pb-24">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* First: featured hero pack */}
          <div className="lg:col-span-2 lg:row-span-2 relative rounded-3xl overflow-hidden bg-[color:var(--forest)] text-[color:var(--cream)] p-10 md:p-14">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest bg-[color:var(--sage)]/20 px-3 py-1 rounded-full">
              <Star className="h-3 w-3" /> Pack recommandé
            </div>
            <h2 className="font-serif text-5xl mt-6">Pack 10 séances</h2>
            <div className="mt-4 font-serif text-6xl">1 300 <span className="text-lg opacity-70">MAD</span></div>
            <p className="mt-4 opacity-80 max-w-md">Le juste équilibre entre engagement et souplesse. Économisez 13% et emmenez un invité en cadeau.</p>
            <ul className="mt-8 space-y-3 max-w-md">
              {["10 séances sur 3 mois", "Toutes activités incluses", "1 invité offert", "Reports possibles", "Priorité de réservation"].map(x => (
                <li key={x} className="flex items-center gap-3"><Check className="h-4 w-4 text-[color:var(--sage)]" />{x}</li>
              ))}
            </ul>
            <Link to="/booking" className="inline-block mt-10">
              <Button size="lg" className="rounded-full bg-[color:var(--cream)] text-[color:var(--forest)] hover:bg-[color:var(--cream)]/90 px-8">Choisir ce pack</Button>
            </Link>
          </div>
          {packs.filter(p => p.id !== "pack10").map(p => (
            <div key={p.id} className="rounded-3xl border border-border bg-card p-8 flex flex-col">
              <h3 className="font-serif text-2xl text-[color:var(--forest)]">{p.name}</h3>
              <div className="font-serif text-3xl text-[color:var(--forest)] mt-3">{p.price} <span className="text-sm text-muted-foreground">MAD</span></div>
              <div className="text-xs text-muted-foreground mt-1">{p.sessions} séance{p.sessions > 1 ? "s" : ""} · {p.validity}</div>
              <ul className="mt-5 space-y-1.5 text-sm text-foreground/80 flex-1">
                {p.perks.map(x => <li key={x} className="flex gap-2"><Check className="h-4 w-4 text-[color:var(--forest)] mt-0.5" />{x}</li>)}
              </ul>
              <Link to="/booking" className="mt-6"><Button variant="outline" className="w-full rounded-full">Choisir</Button></Link>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
