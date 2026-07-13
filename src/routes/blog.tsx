import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { articles } from "@/lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/blog")({
  head: () => ({ meta: [{ title: "Journal — Amrani" }] }),
  component: Blog,
});

const CATS = ["Tous", "Yoga", "Pilates", "Bien-être", "Nutrition", "Lifestyle", "Conseils"] as const;

function Blog() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("Tous");
  const items = cat === "Tous" ? articles : articles.filter(a => a.category === cat);
  const [featured, ...rest] = items;

  return (
    <PublicLayout>
      <section className="container-editorial py-16">
        <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--forest)]/70">Journal</span>
        <h1 className="font-serif text-5xl md:text-6xl text-[color:var(--forest)] mt-3">Le blog Amrani.</h1>
        <div className="mt-8 flex flex-wrap gap-2">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`text-xs uppercase tracking-widest px-4 py-2 rounded-full border ${cat === c ? "bg-[color:var(--forest)] text-[color:var(--cream)] border-[color:var(--forest)]" : "border-border hover:border-[color:var(--forest)]"}`}>{c}</button>
          ))}
        </div>
      </section>
      <section className="container-editorial pb-24 space-y-16">
        {featured && (
          <Link to="/blog/$slug" params={{ slug: featured.slug }} className="grid md:grid-cols-2 gap-8 group">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden">
              <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{featured.category} · {featured.readMin} min</div>
              <h2 className="font-serif text-4xl md:text-5xl text-[color:var(--forest)] mt-3">{featured.title}</h2>
              <p className="mt-4 text-foreground/70">{featured.excerpt}</p>
              <div className="mt-6 text-sm text-muted-foreground">par {featured.author}</div>
            </div>
          </Link>
        )}
        <div className="grid md:grid-cols-3 gap-10">
          {rest.map(a => (
            <Link key={a.slug} to="/blog/$slug" params={{ slug: a.slug }} className="group">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
              <div className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{a.category} · {a.readMin} min</div>
              <h3 className="font-serif text-2xl text-[color:var(--forest)] mt-2 group-hover:underline">{a.title}</h3>
              <p className="mt-2 text-sm text-foreground/70">{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
