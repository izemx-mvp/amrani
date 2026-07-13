import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { packs } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export const Route = createFileRoute("/admin/packs")({ component: Page });

function Page() {
  return (
    <div>
      <PageHeader title="Packs" actions={<Button>Créer un pack</Button>} />
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
        {[["Vendus", "184"], ["Actifs", "72"], ["Expirés", "31"], ["Revenu", "128k MAD"]].map(([l, v]) => (
          <div key={l} className="p-5 rounded-2xl bg-card border border-border">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
            <div className="font-serif text-3xl text-[color:var(--forest)] mt-2">{v}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--cream)] text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="p-3">Nom</th><th className="p-3">Prix</th><th className="p-3">Séances</th><th className="p-3">Validité</th><th className="p-3">Recommandé</th><th></th></tr>
          </thead>
          <tbody>
            {packs.map(p => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.price} MAD</td>
                <td className="p-3">{p.sessions}</td>
                <td className="p-3">{p.validity}</td>
                <td className="p-3">{p.recommended && <Star className="h-4 w-4 fill-[color:var(--forest)] text-[color:var(--forest)]" />}</td>
                <td className="p-3 text-right"><Button variant="ghost" size="sm">Modifier</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
