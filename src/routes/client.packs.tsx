import { createFileRoute, Link } from "@tanstack/react-router";
import { packs } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/client/packs")({ component: Page });

function Page() {
  const active = packs[2];
  return (
    <div>
      <h1 className="font-serif text-4xl text-[color:var(--forest)]">Mes packs</h1>
      <div className="mt-6 p-8 rounded-3xl bg-[color:var(--forest)] text-[color:var(--cream)]">
        <div className="text-xs uppercase tracking-widest opacity-70">Actif</div>
        <div className="font-serif text-3xl mt-2">{active.name}</div>
        <div className="mt-6 flex items-end gap-1">
          <div className="text-6xl font-serif">7</div>
          <div className="opacity-80 pb-2">/ {active.sessions} séances</div>
        </div>
        <div className="h-2 bg-white/15 rounded-full mt-4 overflow-hidden"><div className="h-full bg-[color:var(--sage)]" style={{ width: "70%" }} /></div>
        <div className="mt-4 text-sm opacity-80">Valide jusqu'au 30 septembre 2026</div>
      </div>
      <h2 className="font-serif text-2xl text-[color:var(--forest)] mt-10 mb-4">Renouveler ou changer de pack</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {packs.map(p => (
          <div key={p.id} className="p-6 rounded-2xl bg-card border border-border">
            <div className="font-medium">{p.name}</div>
            <div className="text-xs text-muted-foreground">{p.sessions} séances · {p.price} MAD</div>
            <Link to="/packs" className="block mt-4"><Button variant="outline" className="rounded-full w-full">Détails</Button></Link>
          </div>
        ))}
      </div>
    </div>
  );
}
