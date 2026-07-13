import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { activities } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/activities")({ component: Page });

function Page() {
  return (
    <div>
      <PageHeader title="Activités" actions={<Button>Ajouter</Button>} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activities.map(a => (
          <div key={a.id} className="rounded-2xl overflow-hidden bg-card border border-border">
            <div className="aspect-[16/10]"><img src={a.image} alt={a.name} className="w-full h-full object-cover" /></div>
            <div className="p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{a.category} · {a.level}</div>
              <div className="font-serif text-xl text-[color:var(--forest)] mt-1">{a.name}</div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1">Modifier</Button>
                <Button size="sm" variant="ghost">Désactiver</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
