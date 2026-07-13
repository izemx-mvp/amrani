import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { coaches, IMG } from "@/lib/mock-data";
import { Lotus } from "@/components/brand/Logo";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "À propos — Amrani Studio" }, { name: "description", content: "L'histoire, la philosophie et l'équipe du studio Amrani." }] }),
  component: About,
});

const TIMELINE = [
  { year: "2019", title: "Une intuition", text: "Sofia rentre d'un séjour en Inde avec une conviction : offrir à Casablanca un espace où le mouvement rime avec présence." },
  { year: "2021", title: "Naissance du studio", text: "Amrani ouvre ses portes rue des Oliviers. 60 m² de bois clair, 12 tapis, une communauté qui se forme." },
  { year: "2023", title: "Extension Pilates", text: "Arrivée du Reformer et de Leila. Le studio double son offre." },
  { year: "2026", title: "Une plateforme", text: "Amrani lance son espace numérique pour rapprocher la pratique du quotidien." },
];

function About() {
  return (
    <PublicLayout>
      <section className="container-editorial py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <Lotus className="h-10 w-10 animate-lotus" color="var(--forest)" />
          <span className="mt-6 block text-xs tracking-[0.3em] uppercase text-[color:var(--forest)]/70">Notre histoire</span>
          <h1 className="font-serif text-5xl md:text-6xl text-[color:var(--forest)] mt-4">Un studio né d'une pratique quotidienne.</h1>
          <p className="mt-6 text-foreground/70 leading-relaxed">Amrani signifie « celui qui aspire à l'élévation » en tamazight. Notre studio est né d'un désir simple : offrir un lieu où l'on prend soin de soi comme on prend soin d'un jardin — avec patience, régularité et joie.</p>
        </div>
        <div className="aspect-[4/5] rounded-3xl overflow-hidden">
          <img src={IMG.studio1} alt="Studio" className="w-full h-full object-cover" />
        </div>
      </section>

      <section className="bg-[color:var(--sand)]/40 py-24">
        <div className="container-editorial">
          <h2 className="font-serif text-4xl text-[color:var(--forest)] mb-12">Notre chemin.</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {TIMELINE.map(t => (
              <div key={t.year} className="relative">
                <div className="font-serif text-4xl text-[color:var(--forest)]">{t.year}</div>
                <div className="mt-2 font-medium text-foreground">{t.title}</div>
                <p className="text-sm text-foreground/70 mt-2">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-editorial py-24 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-serif text-4xl text-[color:var(--forest)]">Notre philosophie.</h2>
          <p className="mt-4 text-foreground/70 leading-relaxed">Trois principes guident notre enseignement : la présence, la précision, la persévérance. Nous croyons qu'une pratique juste, même courte, transforme profondément.</p>
          <ul className="mt-6 space-y-3 text-foreground/80">
            <li>· Petits groupes, suivi personnalisé</li>
            <li>· Progression douce et respectueuse du corps</li>
            <li>· Un lieu inclusif, sans compétition</li>
          </ul>
        </div>
        <div className="aspect-[4/3] rounded-3xl overflow-hidden">
          <img src={IMG.yoga2} alt="Pratique" className="w-full h-full object-cover" />
        </div>
      </section>

      <section className="bg-[color:var(--cream)] py-24">
        <div className="container-editorial">
          <h2 className="font-serif text-4xl text-[color:var(--forest)] mb-12">L'équipe.</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {coaches.map(c => (
              <div key={c.id}>
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <div className="mt-4 font-serif text-xl text-[color:var(--forest)]">{c.name}</div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{c.role}</div>
                <p className="text-sm text-foreground/70 mt-2">{c.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
