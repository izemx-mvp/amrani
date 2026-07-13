import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { clients, findPack } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

export const Route = createFileRoute("/admin/clients")({ component: Page });

function Page() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = clients.filter(c => c.name.toLowerCase().includes(q.toLowerCase()));
  const active = clients.find(c => c.id === selected);
  return (
    <div>
      <PageHeader title="Clients" subtitle={`${clients.length} clients`} actions={<Button>Ajouter un client</Button>} />
      <Input placeholder="Rechercher…" value={q} onChange={e => setQ(e.target.value)} className="mb-4 max-w-sm" />
      <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--cream)] text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="p-3">Client</th><th className="p-3 hidden md:table-cell">Contact</th><th className="p-3">Pack</th><th className="p-3">Séances</th><th className="p-3 hidden lg:table-cell">Réservations</th><th className="p-3">Statut</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-t border-border hover:bg-[color:var(--cream)]/50">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">{c.email}</td>
                <td className="p-3">{findPack(c.packId)?.name}</td>
                <td className="p-3">{c.remaining}</td>
                <td className="p-3 hidden lg:table-cell">{c.bookings}</td>
                <td className="p-3"><span className="text-xs px-2 py-1 rounded-full bg-secondary">{c.status}</span></td>
                <td className="p-3 text-right"><Button variant="ghost" size="sm" onClick={() => setSelected(c.id)}>Ouvrir</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Sheet open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {active && (
            <>
              <SheetHeader><SheetTitle className="font-serif text-2xl text-[color:var(--forest)]">{active.name}</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <div><span className="text-muted-foreground">Email</span><div>{active.email}</div></div>
                <div><span className="text-muted-foreground">Téléphone</span><div>{active.phone}</div></div>
                <div><span className="text-muted-foreground">Pack actuel</span><div>{findPack(active.packId)?.name}</div></div>
                <div><span className="text-muted-foreground">Séances restantes</span><div>{active.remaining}</div></div>
                <div><span className="text-muted-foreground">Dernière activité</span><div>{active.lastActive}</div></div>
                <div className="pt-4 border-t border-border">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Notes internes</div>
                  <textarea className="w-full p-3 rounded-lg border border-border text-sm min-h-[80px]" placeholder="Ajouter une note…" />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
