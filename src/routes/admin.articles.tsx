import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { articles } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/articles")({ component: Page });

function Page() {
  return (
    <div>
      <PageHeader title="Articles" actions={<Button>Nouvel article</Button>} />
      <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--cream)] text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="p-3">Titre</th><th className="p-3">Catégorie</th><th className="p-3 hidden md:table-cell">Auteur</th><th className="p-3">Date</th><th className="p-3">Statut</th><th></th></tr>
          </thead>
          <tbody>
            {articles.map((a, i) => (
              <tr key={a.slug} className="border-t border-border">
                <td className="p-3 font-medium">{a.title}</td>
                <td className="p-3">{a.category}</td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">{a.author}</td>
                <td className="p-3">{a.date}</td>
                <td className="p-3"><span className={`text-xs px-2 py-1 rounded-full ${i % 4 === 3 ? "bg-secondary" : "bg-emerald-100 text-emerald-800"}`}>{i % 4 === 3 ? "Brouillon" : "Publié"}</span></td>
                <td className="p-3 text-right"><Button variant="ghost" size="sm">Éditer</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
