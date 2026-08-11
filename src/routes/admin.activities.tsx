import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { useStore, actions, type Activity } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/activities")({ component: Page });

function Page() {
  const activities = useStore(s => s.activities);
  const [edit, setEdit] = useState<Activity | null>(null);
  return (
    <div>
      <PageHeader title="Catalogue & Activités" subtitle="Un cours activé est visible sur le site et réservable" actions={<Button onClick={() => setEdit(blank())}>+ Ajouter</Button>} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activities.map(a => (
          <div key={a.id} className="rounded-2xl overflow-hidden bg-card border border-border">
            <div className="aspect-[16/10] relative">
              <img src={a.image} alt={a.name} className="w-full h-full object-cover" />
              {!a.active && <div className="absolute inset-0 bg-black/60 grid place-items-center text-white font-serif text-xl">Désactivé</div>}
            </div>
            <div className="p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{a.category} · {a.level} · {a.duration}min</div>
              <div className="font-serif text-xl text-[color:var(--forest)] mt-1">{a.name}</div>
              <div className="text-sm text-muted-foreground mt-1">{a.price} MAD / séance</div>
              <div className="flex gap-2 mt-3 items-center">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setEdit(a)}>Modifier</Button>
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (confirm(`Supprimer ${a.name} ?`)) { actions.deleteActivity(a.id); toast.success("Activité supprimée"); } }}>Supprimer</Button>
                <Switch checked={a.active} onCheckedChange={() => { actions.toggleActivity(a.id); toast.success(a.active ? "Désactivé" : "Activé"); }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {edit && <ActDialog a={edit} onClose={() => setEdit(null)} />}
    </div>
  );
}

function blank(): Activity {
  return {
    id: `act-${Date.now()}`, name: "", category: "Yoga", level: "Tous niveaux", duration: 60,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    description: "", benefits: [], price: 150, active: true,
  };
}

function ActDialog({ a, onClose }: { a: Activity; onClose: () => void }) {
  const [x, setX] = useState(a);
  const save = () => { if (!x.name.trim()) { toast.error("Nom requis"); return; } actions.saveActivity(x); toast.success("Enregistré"); onClose(); };
  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif text-2xl text-[color:var(--forest)]">{a.name ? "Modifier" : "Nouveau cours"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <F label="Nom"><Input value={x.name} onChange={e => setX({ ...x, name: e.target.value })} /></F>
          <F label="Description"><textarea value={x.description} onChange={e => setX({ ...x, description: e.target.value })} className="w-full p-3 rounded-md border border-border text-sm min-h-[60px]" /></F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Catégorie">
              <select value={x.category} onChange={e => setX({ ...x, category: e.target.value })} className="w-full h-10 px-3 rounded-md border border-border">
                {["Yoga", "Pilates", "Méditation", "Bien-être"].map(c => <option key={c}>{c}</option>)}
              </select>
            </F>
            <F label="Niveau">
              <select value={x.level} onChange={e => setX({ ...x, level: e.target.value })} className="w-full h-10 px-3 rounded-md border border-border">
                {["Débutant", "Intermédiaire", "Avancé", "Tous niveaux"].map(l => <option key={l}>{l}</option>)}
              </select>
            </F>
            <F label="Durée (min)"><Input type="number" value={x.duration} onChange={e => setX({ ...x, duration: Number(e.target.value) })} /></F>
            <F label="Prix (MAD)"><Input type="number" value={x.price} onChange={e => setX({ ...x, price: Number(e.target.value) })} /></F>
          </div>
          <F label="Image (URL)"><Input value={x.image} onChange={e => setX({ ...x, image: e.target.value })} /></F>
          <label className="text-sm flex items-center gap-2"><Switch checked={x.active} onCheckedChange={v => setX({ ...x, active: v })} /> Actif</label>
        </div>
        <div className="flex justify-end gap-2 pt-4"><Button variant="ghost" onClick={onClose}>Annuler</Button><Button onClick={save}>Enregistrer</Button></div>
      </DialogContent>
    </Dialog>
  );
}
function F({ label, children }: any) { return <div><label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label><div className="mt-1">{children}</div></div>; }
