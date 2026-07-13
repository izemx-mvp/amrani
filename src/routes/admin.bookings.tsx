import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { bookings, findActivity, findCoach, findPack } from "@/lib/mock-data";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/bookings")({ component: Page });

const STATUSES = ["Tous", "En attente", "Confirmée", "Refusée", "Annulée", "Terminée", "Absente"];

function Page() {
  const [status, setStatus] = useState("Tous");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = bookings.filter(b => (status === "Tous" || b.status === status) && (q === "" || b.clientName.toLowerCase().includes(q.toLowerCase())));
  const active = bookings.find(b => b.id === selected);
  const activity = active ? findActivity(active.activityId)! : null;
  const coach = active ? findCoach(active.coachId)! : null;
  const pack = active ? findPack(active.packId)! : null;

  return (
    <div>
      <PageHeader title="Réservations" subtitle={`${filtered.length} résultats`} actions={<Button>Nouvelle réservation</Button>} />
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher un client…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1 p-1 bg-secondary rounded-lg">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatus(s)} className={`text-xs px-3 py-1.5 rounded-md ${status === s ? "bg-white shadow-sm" : "text-muted-foreground"}`}>{s}</button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--cream)] text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="p-3">Client</th><th className="p-3">Activité</th><th className="p-3 hidden md:table-cell">Coach</th><th className="p-3">Date</th><th className="p-3 hidden lg:table-cell">Pack</th><th className="p-3">Statut</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(b => {
              const a = findActivity(b.activityId)!;
              const c = findCoach(b.coachId)!;
              const d = new Date(b.start);
              return (
                <tr key={b.id} className="border-t border-border hover:bg-[color:var(--cream)]/50">
                  <td className="p-3 font-medium">{b.clientName}</td>
                  <td className="p-3">{a.name}</td>
                  <td className="p-3 hidden md:table-cell">{c.name}</td>
                  <td className="p-3">{d.toLocaleDateString("fr", { day: "2-digit", month: "short" })} · {d.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="p-3 hidden lg:table-cell">{findPack(b.packId)?.name}</td>
                  <td className="p-3"><StatusBadge s={b.status} /></td>
                  <td className="p-3 text-right"><Button size="sm" variant="ghost" onClick={() => setSelected(b.id)}>Ouvrir</Button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Sheet open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {active && activity && coach && pack && (
            <>
              <SheetHeader><SheetTitle className="font-serif text-2xl text-[color:var(--forest)]">{active.clientName}</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-6">
                <StatusBadge s={active.status} />
                <Section title="Informations client">
                  <Row k="Nom" v={active.clientName} />
                  <Row k="Réservation #" v={active.id} />
                  <Row k="Créée le" v={new Date(active.createdAt).toLocaleString("fr")} />
                </Section>
                <Section title="Séance">
                  <Row k="Activité" v={activity.name} />
                  <Row k="Coach" v={coach.name} />
                  <Row k="Date" v={new Date(active.start).toLocaleString("fr")} />
                  <Row k="Durée" v={`${activity.duration} min`} />
                  <Row k="Niveau" v={activity.level} />
                </Section>
                <Section title="Pack">
                  <Row k="Pack" v={pack.name} />
                  <Row k="Séances restantes" v="7" />
                </Section>
                <Section title="Notes internes">
                  <textarea className="w-full mt-1 p-3 rounded-lg border border-border bg-background text-sm min-h-[80px]" placeholder="Ajouter une note…" />
                </Section>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                  <Button onClick={() => { toast.success("Réservation validée"); setSelected(null); }}>Valider</Button>
                  <Button variant="outline" onClick={() => toast.error("Réservation refusée")}>Refuser</Button>
                  <Button variant="outline">Modifier</Button>
                  <Button variant="outline">Annuler</Button>
                  <Button variant="outline">Terminée</Button>
                  <Button variant="outline">Absente</Button>
                  <Button variant="ghost">Contacter</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    "En attente": "bg-amber-100 text-amber-800",
    "Confirmée": "bg-emerald-100 text-emerald-800",
    "Refusée": "bg-red-100 text-red-800",
    "Annulée": "bg-gray-200 text-gray-700",
    "Terminée": "bg-[color:var(--sage)]/30 text-[color:var(--forest)]",
    "Absente": "bg-orange-100 text-orange-800",
  };
  return <span className={`text-xs px-2 py-1 rounded-full ${map[s] || "bg-secondary"}`}>{s}</span>;
}
function Row({ k, v }: { k: string; v: string }) { return <div className="flex justify-between py-2 text-sm border-b border-border last:border-0"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>; }
function Section({ title, children }: any) { return <div><h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{title}</h4>{children}</div>; }
