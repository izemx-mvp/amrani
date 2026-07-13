import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/promotions")({
  head: () => ({ meta: [{ title: "Promotions — Amrani" }] }),
  component: Promotions,
});

function Promotions() {
  return (
    <PublicLayout>
      <section className="container-editorial py-16">
        <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--forest)]/70">Offres du moment</span>
        <h1 className="font-serif text-5xl md:text-6xl text-[color:var(--forest)] mt-3">Promotions.</h1>
      </section>
      <section className="container-editorial pb-24 grid gap-8 md:grid-cols-2">
        {promotions.map(p => (
          <div key={p.id} className="rounded-3xl overflow-hidden bg-card border border-border">
            <div className="aspect-[16/9] overflow-hidden">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-8">
              <h2 className="font-serif text-3xl text-[color:var(--forest)]">{p.title}</h2>
              <p className="mt-3 text-foreground/70">{p.description}</p>
              <div className="mt-4 font-serif text-2xl text-[color:var(--forest)]">{p.offer}</div>
              <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">Valide jusqu'au {p.validity} · code {p.code}</div>
              <Link to="/booking" className="inline-block mt-6"><Button className="rounded-full">Profiter de l'offre</Button></Link>
            </div>
          </div>
        ))}
      </section>
    </PublicLayout>
  );
}
