import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { schedule, findActivity, findCoach } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/planning")({ component: Page });

const VIEWS = ["Jour", "Semaine", "Mois", "Liste"] as const;

function Page() {
  const [view, setView] = useState<(typeof VIEWS)[number]>("Semaine");
  return (
    <div>
      <PageHeader title="Planning" subtitle="Gestion des cours" actions={<Button><Plus className="h-4 w-4 mr-1" />Ajouter un cours</Button>} />
      <div className="flex gap-1 p-1 bg-secondary rounded-lg w-fit mb-6">
        {VIEWS.map(v => <button key={v} onClick={() => setView(v)} className={`px-4 py-1.5 rounded-md text-sm ${view === v ? "bg-white shadow-sm" : "text-muted-foreground"}`}>{v}</button>)}
      </div>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-border">
          {Array.from({ length: 7 }).map((_, i) => {
            const day = new Date(); day.setDate(day.getDate() + i);
            const items = schedule.filter(s => new Date(s.start).toDateString() === day.toDateString());
            return (
              <div key={i} className="bg-card p-3 min-h-[240px]">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{day.toLocaleDateString("fr", { weekday: "short" })}</div>
                <div className="font-serif text-2xl text-[color:var(--forest)]">{day.getDate()}</div>
                <div className="mt-3 space-y-2">
                  {items.map(s => {
                    const a = findActivity(s.activityId)!;
                    const c = findCoach(s.coachId)!;
                    const d = new Date(s.start);
                    return (
                      <div key={s.id} className="p-2 rounded-lg bg-[color:var(--sage)]/20 text-xs">
                        <div className="font-medium text-[color:var(--forest)]">{d.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })} · {a.name}</div>
                        <div className="text-muted-foreground">{c.name} · {s.booked}/{s.capacity}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
