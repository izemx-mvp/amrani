import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { activities, packs, schedule, articles, findActivity, findCoach, promotions, IMG } from "@/lib/mock-data";
import { ArrowRight, MapPin, Star, Sparkles, Leaf, Wind } from "lucide-react";
import { Lotus } from "@/components/brand/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amrani — Studio de Yoga & Pilates à Casablanca" },
      { name: "description", content: "Retrouvez votre équilibre au studio Amrani. Cours de Yoga et Pilates, packs et abonnements dans un espace wellness premium." },
      { property: "og:title", content: "Amrani — Studio de Yoga & Pilates" },
      { property: "og:description", content: "Un espace dédié au mouvement, à l'énergie et à votre bien-être." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG.hero} alt="Studio Amrani" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--forest)]/70 via-[color:var(--forest)]/40 to-transparent" />
        </div>
        <div className="relative container-editorial min-h-[80vh] flex items-center py-24">
          <div className="max-w-xl text-[color:var(--cream)] animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <Lotus className="h-8 w-8 animate-lotus" color="var(--cream)" />
              <span className="text-xs tracking-[0.3em] uppercase opacity-80">Yoga · Pilates · Casablanca</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05]">Retrouvez votre équilibre.</h1>
            <p className="mt-6 text-lg opacity-90 max-w-md">Un espace dédié au mouvement, à l'énergie et à votre bien-être.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/booking"><Button size="lg" className="rounded-full bg-[color:var(--cream)] text-[color:var(--forest)] hover:bg-[color:var(--cream)]/90 px-7">Réserver une séance</Button></Link>
              <Link to="/about"><Button size="lg" variant="outline" className="rounded-full border-[color:var(--cream)]/40 bg-transparent text-[color:var(--cream)] hover:bg-[color:var(--cream)]/10 px-7">Découvrir le studio</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="container-editorial py-24 grid gap-12 md:grid-cols-2 items-center">
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
          <img src={IMG.studio1} alt="Intérieur du studio" className="w-full h-full object-cover" />
        </div>
        <div>
          <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--forest)]/70">Le studio</span>
          <h2 className="font-serif text-4xl md:text-5xl text-[color:var(--forest)] mt-3">Un cocon dédié au mouvement conscient.</h2>
          <p className="mt-6 text-foreground/70 leading-relaxed">Bois clair, lumière naturelle, plantes vivantes. Amrani est pensé comme une parenthèse. Nos cours de Yoga et Pilates, en petits comités, sont animés par des enseignants expérimentés qui vous accompagnent avec justesse.</p>
          <div className="mt-8 grid grid-cols-3 gap-6">
            {[["6", "coaches"], ["12", "cours/semaine"], ["500+", "élèves"]].map(([n, l]) => (
              <div key={l}>
                <div className="font-serif text-3xl text-[color:var(--forest)]">{n}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="bg-[color:var(--sand)]/40 py-24">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--forest)]/70">Activités</span>
              <h2 className="font-serif text-4xl md:text-5xl text-[color:var(--forest)] mt-3">Une pratique pour chaque jour.</h2>
            </div>
            <Link to="/activities" className="hidden md:inline-flex items-center gap-2 text-sm text-[color:var(--forest)]">Toutes les activités <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {activities.slice(0, 6).map(a => (
              <Link key={a.id} to="/activities" className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl">
                  <img src={a.image} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="pt-4">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{a.category} · {a.level}</div>
                  <h3 className="font-serif text-2xl text-[color:var(--forest)] mt-1">{a.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PLANNING WEEK */}
      <section className="container-editorial py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--forest)]/70">Cette semaine</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[color:var(--forest)] mt-3">Planning à venir.</h2>
          </div>
          <Link to="/planning" className="hidden md:inline-flex items-center gap-2 text-sm text-[color:var(--forest)]">Voir tout <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-3">
          {schedule.slice(0, 6).map(s => {
            const a = findActivity(s.activityId)!;
            const c = findCoach(s.coachId)!;
            const d = new Date(s.start);
            return (
              <div key={s.id} className="flex flex-wrap items-center gap-4 p-4 md:p-5 bg-card rounded-xl border border-border hover:border-[color:var(--forest)]/30 transition">
                <div className="min-w-[80px]">
                  <div className="font-serif text-2xl text-[color:var(--forest)]">{d.toLocaleDateString("fr", { day: "2-digit" })}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{d.toLocaleDateString("fr", { month: "short" })}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{a.name}</div>
                  <div className="text-sm text-muted-foreground">avec {c.name} · {a.duration} min · {a.level}</div>
                </div>
                <div className="text-sm text-muted-foreground">{d.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}</div>
                <div className="text-xs text-[color:var(--forest)]">{s.capacity - s.booked} places</div>
                <Link to="/booking"><Button size="sm" variant="outline" className="rounded-full">Réserver</Button></Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* PACKS */}
      <section className="bg-[color:var(--forest)] text-[color:var(--cream)] py-24">
        <div className="container-editorial">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs tracking-[0.3em] uppercase opacity-70">Packs populaires</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-3">Choisissez votre rythme.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {packs.slice(1, 4).map(p => (
              <div key={p.id} className={`p-8 rounded-2xl ${p.recommended ? "bg-[color:var(--cream)] text-[color:var(--forest)] md:-translate-y-4 shadow-2xl" : "border border-white/15"}`}>
                {p.recommended && <div className="text-xs uppercase tracking-widest mb-2 text-[color:var(--forest)]/70">Recommandé</div>}
                <h3 className="font-serif text-2xl">{p.name}</h3>
                <div className={`text-4xl font-serif mt-4 ${p.recommended ? "" : "text-[color:var(--cream)]"}`}>{p.price} <span className="text-sm opacity-70">MAD</span></div>
                <div className="text-sm opacity-70 mt-1">{p.sessions} séances · valable {p.validity}</div>
                <ul className="mt-6 space-y-2 text-sm">
                  {p.perks.map(x => <li key={x} className="flex items-center gap-2"><Sparkles className="h-3 w-3 opacity-60" />{x}</li>)}
                </ul>
                <Link to="/packs" className="block mt-6">
                  <Button className={`w-full rounded-full ${p.recommended ? "" : "bg-[color:var(--cream)] text-[color:var(--forest)] hover:bg-[color:var(--cream)]/90"}`}>Choisir</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO */}
      <section className="container-editorial py-24">
        <div className="grid md:grid-cols-2 rounded-3xl overflow-hidden">
          <img src={promotions[0].image} alt="Promotion" className="w-full h-full object-cover aspect-[4/3]" />
          <div className="bg-[color:var(--sand)] p-10 md:p-14 flex flex-col justify-center">
            <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--forest)]/70">Offre du moment</span>
            <h2 className="font-serif text-4xl text-[color:var(--forest)] mt-3">{promotions[0].title}</h2>
            <p className="mt-4 text-foreground/70">{promotions[0].description}</p>
            <div className="mt-2 font-serif text-2xl text-[color:var(--forest)]">{promotions[0].offer}</div>
            <Link to="/promotions" className="mt-6"><Button className="rounded-full self-start">Profiter de l'offre</Button></Link>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="bg-[color:var(--cream)] py-24">
        <div className="container-editorial">
          <h2 className="font-serif text-4xl md:text-5xl text-[color:var(--forest)] text-center max-w-2xl mx-auto">L'expérience Amrani.</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-14">
            {[
              { i: Leaf, t: "Intimité", d: "Petits groupes pour un suivi précis." },
              { i: Wind, t: "Respiration", d: "Chaque cours commence par un ancrage." },
              { i: Sparkles, t: "Excellence", d: "Enseignants formés à l'international." },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-[color:var(--sage)]/30 grid place-items-center text-[color:var(--forest)]"><Icon className="h-6 w-6" /></div>
                <h3 className="font-serif text-2xl text-[color:var(--forest)] mt-4">{t}</h3>
                <p className="text-sm text-foreground/70 mt-2 max-w-xs mx-auto">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-editorial py-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Rania Z.", text: "Un lieu magnifique et une équipe attentive. Chaque séance est une pause précieuse.", },
            { name: "Adam B.", text: "Le Reformer avec Leila a transformé ma posture en quelques semaines.", },
            { name: "Salma I.", text: "L'ambiance, la lumière, la douceur des instructeurs. Amrani est devenu mon rituel.", },
          ].map(t => (
            <div key={t.name} className="p-8 rounded-2xl bg-card border border-border">
              <div className="flex gap-1 text-[color:var(--forest)]">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-foreground/80 leading-relaxed">« {t.text} »</p>
              <div className="mt-6 text-sm font-medium text-[color:var(--forest)]">{t.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ARTICLES */}
      <section className="bg-[color:var(--sand)]/40 py-24">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--forest)]/70">Journal</span>
              <h2 className="font-serif text-4xl md:text-5xl text-[color:var(--forest)] mt-3">Derniers articles.</h2>
            </div>
            <Link to="/blog" className="hidden md:inline-flex items-center gap-2 text-sm text-[color:var(--forest)]">Tout lire <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {articles.slice(0, 3).map(a => (
              <Link key={a.slug} to="/blog/$slug" params={{ slug: a.slug }} className="group">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{a.category} · {a.readMin} min</div>
                <h3 className="font-serif text-2xl text-[color:var(--forest)] mt-2 group-hover:underline">{a.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION + CTA */}
      <section className="container-editorial py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--forest)]/70">Localisation</span>
            <h2 className="font-serif text-4xl text-[color:var(--forest)] mt-3">12 rue des Oliviers, Casablanca.</h2>
            <p className="mt-4 text-foreground/70">Un havre à quelques minutes du parc Sindibad. Parking à proximité, arrêt tramway L1.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 mt-6 text-[color:var(--forest)]"><MapPin className="h-4 w-4" /> Itinéraire</Link>
          </div>
          <div className="aspect-[4/3] rounded-3xl overflow-hidden">
            <img src={IMG.studio2} alt="Extérieur studio" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--forest)] text-[color:var(--cream)] py-24 text-center">
        <div className="container-editorial max-w-2xl">
          <Lotus className="h-10 w-10 mx-auto animate-lotus" color="var(--cream)" />
          <h2 className="font-serif text-4xl md:text-5xl mt-6">Prenez rendez-vous avec vous-même.</h2>
          <Link to="/booking" className="inline-block mt-8">
            <Button size="lg" className="rounded-full bg-[color:var(--cream)] text-[color:var(--forest)] hover:bg-[color:var(--cream)]/90 px-8">Réserver une séance</Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
