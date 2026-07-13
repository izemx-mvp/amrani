import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { knowledgeBase } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/knowledge")({ component: Page });

function Page() {
  const [q, setQ] = useState("");
  const items = knowledgeBase.filter(k => (k.q + k.a).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHeader title="Base de connaissances" subtitle="Nourrissez l'Agent IA" actions={<><Button variant="outline"><Upload className="h-4 w-4 mr-1" />Importer</Button><Button><Plus className="h-4 w-4 mr-1" />Ajouter</Button></>} />
      <Input placeholder="Rechercher…" value={q} onChange={e => setQ(e.target.value)} className="mb-4 max-w-md" />
      <div className="space-y-3">
        {items.map(k => (
          <div key={k.id} className="p-5 rounded-2xl bg-card border border-border">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{k.category}</div>
            <div className="font-medium mt-1">{k.q}</div>
            <p className="text-sm text-foreground/70 mt-2">{k.a}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline">Modifier</Button>
              <Button size="sm" variant="ghost">Supprimer</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
