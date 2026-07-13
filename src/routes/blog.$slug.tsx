import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { articles } from "@/lib/mock-data";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const a = articles.find(x => x.slug === params?.slug);
    return { meta: [{ title: a ? `${a.title} — Amrani` : "Article — Amrani" }] };
  },
  loader: ({ params }) => {
    const a = articles.find(x => x.slug === params.slug);
    if (!a) throw notFound();
    return a;
  },
  component: Article,
  notFoundComponent: () => <PublicLayout><div className="container-editorial py-24 text-center"><h1 className="font-serif text-4xl text-[color:var(--forest)]">Article introuvable</h1><Link to="/blog" className="mt-4 inline-block text-[color:var(--forest)] underline">Retour au journal</Link></div></PublicLayout>,
});

function Article() {
  const a = Route.useLoaderData();
  const related = articles.filter(x => x.slug !== a.slug && x.category === a.category).slice(0, 3);
  return (
    <PublicLayout>
      <article className="container-editorial max-w-3xl py-16">
        <Link to="/blog" className="text-xs uppercase tracking-widest text-[color:var(--forest)]/70">← Journal</Link>
        <div className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">{a.category} · {a.readMin} min · {a.author}</div>
        <h1 className="font-serif text-4xl md:text-5xl text-[color:var(--forest)] mt-4">{a.title}</h1>
        <div className="mt-8 aspect-[16/9] rounded-3xl overflow-hidden">
          <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
        </div>
        <div className="prose prose-lg mt-10 text-foreground/80 leading-relaxed space-y-6">
          <p className="text-xl">{a.excerpt}</p>
          <p>{a.content}</p>
          <p>La régularité prime sur l'intensité. Un peu chaque jour, avec bienveillance, dessine une transformation durable. Notre équipe est là pour vous accompagner à votre rythme.</p>
        </div>
      </article>
      {related.length > 0 && (
        <section className="bg-[color:var(--sand)]/40 py-16 mt-16">
          <div className="container-editorial">
            <h2 className="font-serif text-3xl text-[color:var(--forest)] mb-8">À lire aussi</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map(r => (
                <Link key={r.slug} to="/blog/$slug" params={{ slug: r.slug }} className="group">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                    <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  </div>
                  <h3 className="font-serif text-xl text-[color:var(--forest)] mt-3 group-hover:underline">{r.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  );
}
