import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { activities, findCoach, schedule } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, Sparkles } from "lucide-react";

export const Route = createFileRoute("/activities")({
  head: () => ({ meta: [{ title: "Activités — Amrani" }, { name: "description", content: "Yoga et Pilates : découvrez toutes nos activités et disciplines." }] }),
  component: Activities,
});

function Activities() {
  return (
    <PublicLayout>
      <section className="container-editorial py-16">
        <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--forest)]/70">Activités</span>
        <h1 className="font-serif text-5xl md:text-6xl text-[color:var(--forest)] mt-3">Nos disciplines.</h1>
        <p className="mt-4 max-w-xl text-foreground/70">Yoga et Pilates dans toute leur diversité. Débutant, intermédiaire ou avancé — il y a un cours pour vous.</p>
      </section>

      <section className="container-editorial pb-24 space-y-16">
        {activities.map((a, i) => {
          const slots = schedule.filter(s => s.activityId === a.id).slice(0, 3);
          return (
            <div key={a.id} className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
              <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                <img src={a.image} alt={a.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{a.category}</div>
                <h2 className="font-serif text-4xl text-[color:var(--forest)] mt-2">{a.name}</h2>
                <p className="mt-4 text-foreground/70">{a.description}</p>
                <div className="flex flex-wrap gap-4 mt-6 text-sm text-foreground/80">
                  <span className="inline-flex items-center gap-2"><TrendingUp className="h-4 w-4" />{a.level}</span>
                  <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" />{a.duration} min</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {a.benefits.map(b => (
                    <span key={b} className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-[color:var(--sage)]/20 text-[color:var(--forest)]"><Sparkles className="h-3 w-3" />{b}</span>
                  ))}
                </div>
                {slots.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Prochaines séances</div>
                    {slots.map(s => {
                      const c = findCoach(s.coachId)!;
                      const d = new Date(s.start);
                      return (
                        <div key={s.id} className="flex items-center justify-between text-sm py-2 border-b border-border">
                          <span>{d.toLocaleDateString("fr", { weekday: "short", day: "2-digit", month: "short" })} · {d.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}</span>
                          <span className="text-muted-foreground">{c.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="mt-6 flex gap-3">
                  <Link to="/planning"><Button variant="outline" className="rounded-full">Voir les disponibilités</Button></Link>
                  <Link to="/booking"><Button className="rounded-full">Réserver</Button></Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </PublicLayout>
  );
}
