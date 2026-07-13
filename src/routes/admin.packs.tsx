import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { useStore, actions, type Pack } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/packs")({ component: Page });

function Page() {
  const packs = useStore(s => s.packs);
  const [edit, setEdit] = useState<Pack | null>(null);

  return (
    <div>
      <PageHeader title="Packs" actions={<Button onClick={() => setEdit(blank())}>+ Nouveau pack</Button>} />
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
        {[["Total", String(packs.length)], ["Actifs", String(packs.filter(p => p.active).length)], ["Recommandés", String(packs.filter(p => p.recommended).length)], ["Ventes (démo)", "184"]].map(([l, v]) => (
          <div key={l} className="p-5 rounded-2xl bg-card border border-border"><div className="text-xs uppercase tracking-widest text-muted-foreground">{l}</div><div className="font-serif text-3xl text-[color:var(--forest)] mt-2">{v}</div></div>
        ))}
      </div>
      <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--cream)] text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="p-3">Nom</th><th className="p-3">Prix</th><th className="p-3">Séances</th><th className="p-3">Validité</th><th className="p-3">Recommandé</th><th className="p-3">Actif</th><th></th></tr>
          </thead>
          <tbody>
            {packs.map(p => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">{p.price} MAD</td>
                <td className="p-3">{p.sessions}</td>
                <td className="p-3">{p.validity}</td>
                <td className="p-3">{p.recommended && <Star className="h-4 w-4 fill-[color:var(--forest)] text-[color:var(--forest)]" />}</td>
                <td className="p-3"><Switch checked={p.active} onCheckedChange={() => { actions.togglePack(p.id); toast.success(p.active ? "Pack désactivé" : "Pack activé"); }} /></td>
                <td className="p-3 text-right space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => setEdit(p)}>Modifier</Button>
                  <Button variant="ghost" size="sm" onClick={() => setEdit({ ...p, id: `pack-${Date.now()}`, name: p.name + " (copie)" })}>Dupliquer</Button>
                  <Button variant="ghost" size="sm" onClick={() => { if (confirm("Supprimer ?")) { actions.deletePack(p.id); toast.success("Pack supprimé"); } }}>×</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {edit && <PackDialog pack={edit} onClose={() => setEdit(null)} />}
    </div>
  );
}

function blank(): Pack {
  return { id: `pack-${Date.now()}`, name: "", description: "", price: 500, sessions: 5, validity: "2 mois", activities: "Toutes", perks: [], recommended: false, active: true };
}

function PackDialog({ pack, onClose }: { pack: Pack; onClose: () => void }) {
  const [p, setP] = useState(pack);
  const save = () => { if (!p.name.trim()) { toast.error("Nom requis"); return; } actions.savePack(p); toast.success("Pack enregistré · visible côté site"); onClose(); };
  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif text-2xl text-[color:var(--forest)]">{pack.name ? "Modifier le pack" : "Nouveau pack"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Field label="Nom"><Input value={p.name} onChange={e => setP({ ...p, name: e.target.value })} /></Field>
          <Field label="Description"><textarea value={p.description ?? ""} onChange={e => setP({ ...p, description: e.target.value })} className="w-full p-3 rounded-md border border-border text-sm min-h-[60px]" /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Prix"><Input type="number" value={p.price} onChange={e => setP({ ...p, price: Number(e.target.value) })} /></Field>
            <Field label="Séances"><Input type="number" value={p.sessions} onChange={e => setP({ ...p, sessions: Number(e.target.value) })} /></Field>
            <Field label="Validité"><Input value={p.validity} onChange={e => setP({ ...p, validity: e.target.value })} /></Field>
          </div>
          <Field label="Activités compatibles"><Input value={p.activities} onChange={e => setP({ ...p, activities: e.target.value })} /></Field>
          <Field label="Avantages (un par ligne)">
            <textarea value={p.perks.join("\n")} onChange={e => setP({ ...p, perks: e.target.value.split("\n").filter(Boolean) })} className="w-full p-3 rounded-md border border-border text-sm min-h-[80px]" />
          </Field>
          <div className="flex items-center gap-4">
            <label className="text-sm flex items-center gap-2"><Switch checked={p.recommended} onCheckedChange={v => setP({ ...p, recommended: v })} /> Recommandé</label>
            <label className="text-sm flex items-center gap-2"><Switch checked={p.active} onCheckedChange={v => setP({ ...p, active: v })} /> Actif</label>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4"><Button variant="ghost" onClick={onClose}>Annuler</Button><Button onClick={save}>Enregistrer</Button></div>
      </DialogContent>
    </Dialog>
  );
}
function Field({ label, children }: any) { return <div><label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label><div className="mt-1">{children}</div></div>; }
