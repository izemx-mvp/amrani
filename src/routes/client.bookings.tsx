import { createFileRoute } from "@tanstack/react-router";
import { useStore, actions, findActivity, findCoach } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/client/bookings")({ component: Page });

const TABS = ["À venir", "Passées", "Annulées"] as const;

function Page() {
  const { user } = useAuth();
  const bookings = useStore(s => s.bookings);
  const [tab, setTab] = useState<(typeof TABS)[number]>("À venir");

  // Show only current user's bookings (matched by email) if present, else all — demo fallback
  const mine = user?.email ? bookings.filter(b => b.clientEmail?.toLowerCase() === user.email.toLowerCase()) : bookings;
  const filtered = mine.filter(b => {
    if (tab === "À venir") return ["En attente", "Confirmée"].includes(b.status);
    if (tab === "Passées") return ["Terminée", "Absente"].includes(b.status);
    return ["Annulée", "Refusée"].includes(b.status);
  });

  return (
    <div>
      <h1 className="font-serif text-4xl text-[color:var(--forest)]">Mes réservations</h1>
      <p className="text-sm text-muted-foreground mt-1">Statuts mis à jour en direct par notre équipe</p>
      <div className="mt-6 flex gap-1 p-1 bg-secondary rounded-full w-fit">
        {TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-full text-sm ${tab === t ? "bg-white shadow-sm" : "text-muted-foreground"}`}>{t}</button>)}
      </div>
      <div className="mt-6 space-y-2">
        {filtered.length === 0 && <div className="text-sm text-muted-foreground p-8 text-center border border-dashed rounded-xl">Aucune réservation dans cette catégorie.</div>}
        {filtered.map(b => {
          const a = findActivity(b.activityId);
          const c = findCoach(b.coachId);
          const d = new Date(b.start);
          return (
            <div key={b.id} className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="min-w-[64px]">
                <div className="font-serif text-xl text-[color:var(--forest)]">{d.toLocaleDateString("fr", { day: "2-digit" })}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{d.toLocaleDateString("fr", { month: "short" })}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{a?.name ?? "—"}</div>
                <div className="text-xs text-muted-foreground">avec {c?.name} · {d.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}</div>
                <div className="text-[11px] text-muted-foreground mt-1">Paiement : {b.paymentStatus}</div>
              </div>
              <StatusBadge s={b.status} />
              {tab === "À venir" && (
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => { actions.updateBookingStatus(b.id, "Annulée", "Annulée par le client"); toast.success("Réservation annulée"); }}>Annuler</Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    "En attente": "bg-amber-100 text-amber-800",
    "Confirmée": "bg-emerald-100 text-emerald-800",
    "Refusée": "bg-red-100 text-red-800",
    "Annulée": "bg-gray-200 text-gray-700",
    "Terminée": "bg-[color:var(--sage)]/40 text-[color:var(--forest)]",
    "Absente": "bg-orange-100 text-orange-800",
  };
  return <span className={`text-xs px-3 py-1 rounded-full ${map[s] || "bg-secondary"}`}>{s}</span>;
}
