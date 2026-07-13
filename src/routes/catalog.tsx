import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useStore, findCoach, coaches } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Search, Clock, Users, TrendingUp, Calendar } from "lucide-react";

export const Route = createFileRoute("/catalog")({
  head: () => ({ meta: [
    { title: "Catalogue des cours — Amrani" },
    { name: "description", content: "Explorez tous les cours de Yoga et Pilates du studio Amrani. Filtrez par discipline, niveau, coach, jour et horaire." },
    { property: "og:title", content: "Catalogue des cours — Amrani" },
    { property: "og:description", content: "Tous les cours de Yoga et Pilates disponibles au studio." },
  ]}),
  component: Catalog,
});

const LEVELS: string[] = ["Débutant", "Intermédiaire", "Avancé", "Tous niveaux"];
const CATEGORIES: string[] = ["Yoga", "Pilates"];
const FORMATS: string[] = ["Collectif", "Individuel"];

function Catalog() {
  const activities = useStore(s => s.activities.filter(a => a.active));
  const schedule = useStore(s => s.schedule.filter(s => s.active));
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [format, setFormat] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [coachId, setCoachId] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [availableOnly, setAvailableOnly] = useState(false);

  const days = useMemo(() => {
    const set = new Map<string, string>();
    schedule.forEach(s => {
      const d = new Date(s.start);
      const key = d.toISOString().slice(0, 10);
      set.set(key, d.toLocaleDateString("fr", { weekday: "long", day: "2-digit", month: "short" }));
    });
    return Array.from(set.entries());
  }, []);

  const items = useMemo(() => {
    return activities.map(a => {
      const slots = schedule
        .filter(s => s.activityId === a.id)
        .filter(s => !coachId || s.coachId === coachId)
        .filter(s => !day || s.start.slice(0, 10) === day)
        .filter(s => !availableOnly || s.booked < s.capacity);
      const next = slots.sort((x, y) => x.start.localeCompare(y.start))[0];
      const remaining = slots.reduce((sum, s) => sum + (s.capacity - s.booked), 0);
      return { a, next, remaining, slotsCount: slots.length };
    })
      .filter(({ a }) => !cat || a.category === cat)
      .filter(({ a }) => !level || a.level === level)
      .filter(({ a }) => {
        if (!format) return true;
        // Reformer & Avancé treated as smaller/individual friendly
        const isIndividual = a.id === "pilates-reformer" || a.id === "pilates-avance";
        return format === "Individuel" ? isIndividual : !isIndividual;
      })
      .filter(({ a }) => !q || a.name.toLowerCase().includes(q.toLowerCase()) || a.description.toLowerCase().includes(q.toLowerCase()))
      .filter(({ slotsCount }) => !(coachId || day || availableOnly) || slotsCount > 0);
  }, [q, cat, format, level, coachId, day, availableOnly]);

  const reset = () => { setQ(""); setCat(null); setFormat(null); setLevel(null); setCoachId(null); setDay(null); setAvailableOnly(false); };

  return (
    <PublicLayout>
      <section className="container-editorial py-16">
        <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--forest)]/70">Catalogue</span>
        <h1 className="font-serif text-5xl md:text-6xl text-[color:var(--forest)] mt-3">Tous nos cours.</h1>
        <p className="mt-4 max-w-xl text-foreground/70">Yoga et Pilates : trouvez le cours qui vous ressemble et réservez en quelques clics.</p>
      </section>

      <section className="container-editorial pb-8">
        <div className="rounded-3xl border border-border bg-card p-6 space-y-5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher un cours…" className="pl-11 h-11 rounded-full" />
          </div>
          <FilterRow label="Discipline" options={CATEGORIES} value={cat} onChange={setCat} />
          <FilterRow label="Format" options={FORMATS} value={format} onChange={setFormat} />
          <FilterRow label="Niveau" options={LEVELS} value={level} onChange={setLevel} />
          <FilterRow label="Coach" options={coaches.map(c => c.name)} value={coachId ? coaches.find(c => c.id === coachId)?.name ?? null : null}
            onChange={(name) => setCoachId(name ? coaches.find(c => c.name === name)?.id ?? null : null)} />
          <FilterRow label="Jour" options={days.map(([, l]) => l)} value={day ? days.find(([k]) => k === day)?.[1] ?? null : null}
            onChange={(l) => setDay(l ? days.find(([, x]) => x === l)?.[0] ?? null : null)} />
          <div className="flex flex-wrap items-center gap-3 justify-between pt-2 border-t border-border">
            <label className="text-sm flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={availableOnly} onChange={e => setAvailableOnly(e.target.checked)} className="accent-[color:var(--forest)]" />
              Uniquement avec places disponibles
            </label>
            <button onClick={reset} className="text-sm text-muted-foreground hover:text-[color:var(--forest)]">Réinitialiser les filtres</button>
          </div>
        </div>
      </section>

      <section className="container-editorial pb-24">
        <div className="mt-6 text-sm text-muted-foreground">{items.length} cours trouvés</div>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ a, next, remaining }) => {
            const coach = next ? findCoach(next.coachId) : null;
            const nextDate = next ? new Date(next.start) : null;
            const full = next ? next.booked >= next.capacity : true;
            return (
              <div key={a.id} className="group rounded-3xl overflow-hidden border border-border bg-card flex flex-col">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={a.image} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 flex flex-col grow">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{a.category} · {a.level}</div>
                  <h3 className="font-serif text-2xl text-[color:var(--forest)] mt-1">{a.name}</h3>
                  <p className="mt-2 text-sm text-foreground/70 line-clamp-2">{a.description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-foreground/80">
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{a.duration} min</span>
                    <span className="inline-flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" />{a.level}</span>
                    {coach && <span className="inline-flex items-center gap-1.5 col-span-2 truncate">👤 {coach.name}</span>}
                    {nextDate && (
                      <span className="inline-flex items-center gap-1.5 col-span-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {nextDate.toLocaleDateString("fr", { weekday: "short", day: "2-digit", month: "short" })} · {nextDate.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                    {next && (
                      <span className="inline-flex items-center gap-1.5 col-span-2">
                        <Users className="h-3.5 w-3.5" />{full ? "Complet" : `${next.capacity - next.booked} place(s) restantes`}
                      </span>
                    )}
                  </div>
                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="text-[color:var(--forest)] font-medium">150 MAD / séance</span>
                    <span className="text-xs text-muted-foreground">packs acceptés</span>
                  </div>
                  <div className="mt-5 flex gap-2 pt-4 border-t border-border">
                    <Link to="/catalog/$id" params={{ id: a.id }} className="flex-1">
                      <Button variant="outline" className="w-full rounded-full">Voir les détails</Button>
                    </Link>
                    <Link to="/booking" search={{ course: a.id, slot: next?.id ?? "" }} className="flex-1">
                      <Button className="w-full rounded-full" disabled={!next}>Réserver</Button>
                    </Link>
                  </div>
                  <div className="mt-3 text-[11px] text-muted-foreground text-center">Réservation : connexion requise</div>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted-foreground">Aucun cours ne correspond à votre recherche.</div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

function FilterRow({ label, options, value, onChange }: { label: string; options: string[]; value: string | null; onChange: (v: string | null) => void }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs uppercase tracking-widest text-muted-foreground w-20 shrink-0">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o} onClick={() => onChange(value === o ? null : o)}
            className={`text-xs px-3 py-1.5 rounded-full border transition ${value === o ? "bg-[color:var(--forest)] text-[color:var(--cream)] border-[color:var(--forest)]" : "border-border hover:border-[color:var(--forest)]"}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
