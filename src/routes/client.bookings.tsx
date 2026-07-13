import { createFileRoute } from "@tanstack/react-router";
import { bookings, findActivity, findCoach } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/client/bookings")({ component: Page });

const TABS = ["À venir", "Passées", "Annulées"] as const;

function Page() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("À venir");
  const filtered = bookings.filter(b => {
    if (tab === "À venir") return ["En attente", "Confirmée"].includes(b.status);
    if (tab === "Passées") return ["Terminée", "Absente"].includes(b.status);
    return ["Annulée", "Refusée"].includes(b.status);
  });
  return (
    <div>
      <h1 className="font-serif text-4xl text-[color:var(--forest)]">Mes réservations</h1>
      <div className="mt-6 flex gap-1 p-1 bg-secondary rounded-full w-fit">
        {TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-full text-sm ${tab === t ? "bg-white shadow-sm" : "text-muted-foreground"}`}>{t}</button>)}
      </div>
      <div className="mt-6 space-y-2">
        {filtered.map(b => {
          const a = findActivity(b.activityId)!;
          const c = findCoach(b.coachId)!;
          const d = new Date(b.start);
          return (
            <div key={b.id} className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-card border border-border">
              <div className="min-w-[64px]">
                <div className="font-serif text-xl text-[color:var(--forest)]">{d.toLocaleDateString("fr", { day: "2-digit" })}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{d.toLocaleDateString("fr", { month: "short" })}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-muted-foreground">avec {c.name} · {d.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}</div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-secondary">{b.status}</span>
              {tab === "À venir" && <Button size="sm" variant="outline" className="rounded-full">Annuler</Button>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
