import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { coaches } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/coaches")({ component: Page });

function Page() {
  return (
    <div>
      <PageHeader title="Coaches" actions={<Button>Ajouter un coach</Button>} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {coaches.map(c => (
          <div key={c.id} className="rounded-2xl overflow-hidden bg-card border border-border">
            <div className="aspect-square"><img src={c.image} alt={c.name} className="w-full h-full object-cover" /></div>
            <div className="p-4">
              <div className="font-serif text-lg text-[color:var(--forest)]">{c.name}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{c.role}</div>
              <p className="text-sm text-foreground/70 mt-2">{c.bio}</p>
              <Button size="sm" variant="outline" className="w-full mt-3">Modifier</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
