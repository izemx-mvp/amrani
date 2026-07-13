import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { activities, schedule, findCoach, findActivity, packs } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, Users, Calendar, Sparkles, Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/catalog/$id")({
  loader: ({ params }) => {
    const a = findActivity(params.id);
    if (!a) throw notFound();
    return { activity: a };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Cours introuvable — Amrani" }, { name: "robots", content: "noindex" }] };
    const a = loaderData.activity;
    return { meta: [
      { title: `${a.name} — Amrani` },
      { name: "description", content: a.description },
      { property: "og:title", content: `${a.name} — Amrani` },
      { property: "og:description", content: a.description },
      { property: "og:image", content: a.image },
    ]};
  },
  notFoundComponent: () => (
    <PublicLayout>
      <section className="container-editorial py-24 text-center">
        <h1 className="font-serif text-4xl text-[color:var(--forest)]">Cours introuvable</h1>
        <Link to="/catalog" className="mt-6 inline-block"><Button className="rounded-full">Retour au catalogue</Button></Link>
      </section>
    </PublicLayout>
  ),
  component: Detail,
});

function Detail() {
  const { activity } = Route.useLoaderData();
  const slots = schedule.filter(s => s.activityId === activity.id).sort((a, b) => a.start.localeCompare(b.start));
  const next = slots[0];
  const related = activities.filter(a => a.id !== activity.id && a.category === activity.category).slice(0, 3);

  return (
    <PublicLayout>
      <section className="container-editorial py-10">
        <Link to="/catalog" className="text-sm text-muted-foreground hover:text-[color:var(--forest)]">← Retour au catalogue</Link>
      </section>

      <section className="container-editorial grid lg:grid-cols-[1.3fr_1fr] gap-10 pb-16">
        <div className="aspect-[4/3] rounded-3xl overflow-hidden">
          <img src={activity.image} alt={activity.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--forest)]/70">{activity.category} · {activity.level}</div>
          <h1 className="font-serif text-4xl md:text-5xl text-[color:var(--forest)] mt-3">{activity.name}</h1>
          <p className="mt-4 text-foreground/70">{activity.description}</p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary"><Clock className="h-4 w-4" />{activity.duration} minutes</span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary"><TrendingUp className="h-4 w-4" />{activity.level}</span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary"><Users className="h-4 w-4" />Capacité max : 12</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/booking" search={{ course: activity.id, slot: next?.id ?? "" }}>
              <Button size="lg" className="rounded-full">Réserver ce cours</Button>
            </Link>
            <Link to="/packs">
              <Button size="lg" variant="outline" className="rounded-full">Voir les packs compatibles</Button>
            </Link>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">Connexion requise pour finaliser la réservation.</div>

          <div className="mt-8 p-5 rounded-2xl bg-[color:var(--sage)]/15 border border-[color:var(--sage)]/40">
            <div className="text-xs uppercase tracking-widest text-[color:var(--forest)]/70">Tarification</div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="font-serif text-3xl text-[color:var(--forest)]">150 MAD</span>
              <span className="text-sm text-muted-foreground">à la séance · packs acceptés</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-editorial grid md:grid-cols-2 gap-10 pb-16">
        <Block title="Objectifs & bénéfices">
          <ul className="space-y-2">
            {activity.benefits.map(b => (
              <li key={b} className="flex items-start gap-2 text-sm"><Sparkles className="h-4 w-4 mt-0.5 text-[color:var(--forest)]" />{b}</li>
            ))}
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 mt-0.5 text-[color:var(--forest)]" />Meilleure conscience corporelle</li>
            <li className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 mt-0.5 text-[color:var(--forest)]" />Réduction du stress</li>
          </ul>
        </Block>
        <Block title="Matériel & informations">
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>Tapis fourni · serviette bienvenue</li>
            <li>Tenue souple, pieds nus</li>
            <li>Arriver 10 minutes avant le cours</li>
            <li>Bouteille d'eau recommandée</li>
          </ul>
        </Block>
      </section>

      <section className="container-editorial pb-16">
        <h2 className="font-serif text-3xl text-[color:var(--forest)]">Prochaines dates disponibles</h2>
        <div className="mt-6 grid gap-2">
          {slots.slice(0, 6).map(s => {
            const c = findCoach(s.coachId)!;
            const d = new Date(s.start);
            const full = s.booked >= s.capacity;
            return (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-border bg-card">
                <div>
                  <div className="font-medium capitalize">{d.toLocaleDateString("fr", { weekday: "long", day: "2-digit", month: "long" })} · {d.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}</div>
                  <div className="text-xs text-muted-foreground">avec {c.name} · {full ? "Complet" : `${s.capacity - s.booked} places restantes`}</div>
                </div>
                <Link to="/booking" search={{ course: activity.id, slot: s.id }}>
                  <Button size="sm" className="rounded-full" disabled={full}>{full ? "Complet" : "Réserver"}</Button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-editorial pb-16">
        <Block title="Packs compatibles">
          <div className="grid sm:grid-cols-2 gap-3">
            {packs.slice(0, 4).map(p => (
              <Link key={p.id} to="/packs" className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-[color:var(--forest)] transition">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.sessions} séances · {p.price} MAD</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </Block>
      </section>

      <section className="container-editorial pb-16">
        <Block title="Politique d'annulation">
          <p className="text-sm text-foreground/80">Annulation gratuite jusqu'à 12 heures avant le début du cours. Passé ce délai, la séance est décomptée du pack. En cas d'imprévu, contactez-nous — nous étudions chaque situation.</p>
        </Block>
      </section>

      <section className="container-editorial pb-24">
        <h2 className="font-serif text-3xl text-[color:var(--forest)]">Vous pourriez également aimer</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {related.map(r => (
            <Link key={r.id} to="/catalog/$id" params={{ id: r.id }} className="group rounded-3xl overflow-hidden border border-border bg-card">
              <div className="aspect-[4/3] overflow-hidden"><img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{r.category}</div>
                <div className="font-serif text-xl text-[color:var(--forest)] mt-1">{r.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
