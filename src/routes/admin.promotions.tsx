import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { promotions } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/promotions")({ component: Page });

function Page() {
  return (
    <div>
      <PageHeader title="Promotions" actions={<Button>Créer une promotion</Button>} />
      <div className="grid gap-4 md:grid-cols-2">
        {promotions.map(p => (
          <div key={p.id} className="rounded-2xl overflow-hidden bg-card border border-border">
            <div className="aspect-[16/8]"><img src={p.image} alt="" className="w-full h-full object-cover" /></div>
            <div className="p-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="font-serif text-xl text-[color:var(--forest)]">{p.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{p.offer} · code {p.code}</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">Modifier</Button>
                <Button size="sm" variant="ghost">Supprimer</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
