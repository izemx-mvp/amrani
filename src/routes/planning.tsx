import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { schedule, findActivity, findCoach } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/planning")({
  head: () => ({ meta: [{ title: "Planning — Amrani" }] }),
  component: Planning,
});

const FILTERS = ["Tous", "Yoga", "Pilates", "Débutant", "Intermédiaire", "Avancé"] as const;
const VIEWS = ["Aujourd'hui", "Semaine", "Liste"] as const;

function Planning() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Tous");
  const [view, setView] = useState<(typeof VIEWS)[number]>("Semaine");

  const items = useMemo(() => {
    return schedule.filter(s => {
      const a = findActivity(s.activityId)!;
      if (filter === "Tous") return true;
      if (["Yoga", "Pilates"].includes(filter)) return a.category === filter;
      return a.level === filter;
    }).filter(s => {
      if (view === "Aujourd'hui") {
        const d = new Date(s.start);
        return d.toDateString() === new Date().toDateString();
      }
      return true;
    });
  }, [filter, view]);

  return (
    <PublicLayout>
      <section className="container-editorial py-16">
        <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--forest)]/70">Planning</span>
        <h1 className="font-serif text-5xl md:text-6xl text-[color:var(--forest)] mt-3">Trouvez votre créneau.</h1>

        <div className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition ${filter === f ? "bg-[color:var(--forest)] text-[color:var(--cream)] border-[color:var(--forest)]" : "border-border hover:border-[color:var(--forest)]"}`}>{f}</button>
          ))}
        </div>
        <div className="mt-4 flex gap-1 p-1 bg-secondary rounded-full w-fit">
          {VIEWS.map(v => (
            <button key={v} onClick={() => setView(v)} className={`text-xs px-4 py-1.5 rounded-full ${view === v ? "bg-white shadow-sm" : "text-muted-foreground"}`}>{v}</button>
          ))}
        </div>

        <div className="mt-8 grid gap-3">
          {items.length === 0 && <div className="text-muted-foreground text-center py-16">Aucun cours ne correspond.</div>}
          {items.map(s => {
            const a = findActivity(s.activityId)!;
            const c = findCoach(s.coachId)!;
            const d = new Date(s.start);
            const remaining = s.capacity - s.booked;
            return (
              <div key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto] sm:flex sm:items-center gap-4 p-4 md:p-5 bg-card rounded-xl border border-border">
                <div className="min-w-[76px] shrink-0">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{d.toLocaleDateString("fr", { weekday: "short" })}</div>
                  <div className="font-serif text-2xl text-[color:var(--forest)]">{d.toLocaleDateString("fr", { day: "2-digit", month: "short" })}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{a.name}</div>
                  <div className="text-sm text-muted-foreground truncate">{c.name} · {a.duration} min · {a.level}</div>
                </div>
                <div className="hidden sm:block text-sm text-muted-foreground">{d.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}</div>
                <div className={`text-xs ${remaining < 3 ? "text-destructive" : "text-[color:var(--forest)]"}`}>{remaining} places</div>
                <Link to="/booking" className="col-span-2 sm:col-span-1"><Button size="sm" variant="outline" className="rounded-full w-full">Réserver</Button></Link>
              </div>
            );
          })}
        </div>
      </section>
    </PublicLayout>
  );
}
