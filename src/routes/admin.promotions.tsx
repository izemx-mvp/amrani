import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { useStore, actions, type Promotion } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/promotions")({ component: Page });

function Page() {
  const promotions = useStore(s => s.promotions);
  const [edit, setEdit] = useState<Promotion | null>(null);
  return (
    <div>
      <PageHeader title="Promotions" actions={<Button onClick={() => setEdit(blank())}>+ Nouvelle promotion</Button>} />
      <div className="grid gap-4 md:grid-cols-2">
        {promotions.map(p => (
          <div key={p.id} className="rounded-2xl overflow-hidden bg-card border border-border">
            <div className="aspect-[16/8] relative">
              <img src={p.image} alt="" className="w-full h-full object-cover" />
              {!p.active && <div className="absolute inset-0 bg-black/60 grid place-items-center text-white font-serif text-xl">Inactive</div>}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="font-serif text-xl text-[color:var(--forest)]">{p.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{p.offer} · code <span className="font-mono">{p.code}</span></div>
                  <div className="text-xs text-muted-foreground mt-1">{p.uses} utilisations · {p.type}</div>
                </div>
                <Switch checked={p.active} onCheckedChange={() => { actions.togglePromotion(p.id); toast.success(p.active ? "Promotion désactivée" : "Promotion activée · visible côté site"); }} />
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setEdit(p)}>Modifier</Button>
                <Button size="sm" variant="ghost" onClick={() => setEdit({ ...p, id: `promo-${Date.now()}`, title: p.title + " (copie)" })}>Dupliquer</Button>
                <Button size="sm" variant="ghost" onClick={() => { if (confirm("Supprimer ?")) { actions.deletePromotion(p.id); toast.success("Supprimée"); } }}>×</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {edit && <PromoDialog promo={edit} onClose={() => setEdit(null)} />}
    </div>
  );
}

function blank(): Promotion {
  return {
    id: `promo-${Date.now()}`, title: "", description: "", offer: "", code: "",
    type: "Pourcentage", value: 10, validity: "en continu",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1200&q=80",
    active: true, uses: 0,
  };
}

function PromoDialog({ promo, onClose }: { promo: Promotion; onClose: () => void }) {
  const [p, setP] = useState(promo);
  const save = () => { if (!p.title.trim() || !p.code.trim()) { toast.error("Titre & code requis"); return; } actions.savePromotion(p); toast.success("Promotion enregistrée"); onClose(); };
  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif text-2xl text-[color:var(--forest)]">{promo.title ? "Modifier" : "Nouvelle promotion"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Field label="Titre public"><Input value={p.title} onChange={e => setP({ ...p, title: e.target.value })} /></Field>
          <Field label="Offre affichée"><Input value={p.offer} onChange={e => setP({ ...p, offer: e.target.value })} placeholder="-20% sur le Pack 10" /></Field>
          <Field label="Description"><textarea value={p.description} onChange={e => setP({ ...p, description: e.target.value })} className="w-full p-3 rounded-md border border-border text-sm min-h-[60px]" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Code promo"><Input value={p.code} onChange={e => setP({ ...p, code: e.target.value.toUpperCase() })} /></Field>
            <Field label="Type">
              <select value={p.type} onChange={e => setP({ ...p, type: e.target.value as any })} className="w-full h-10 px-3 rounded-md border border-border">
                {["Pourcentage", "Montant fixe", "Séance offerte", "Pack spécial", "Première séance"].map(x => <option key={x}>{x}</option>)}
              </select>
            </Field>
            <Field label="Valeur"><Input type="number" value={p.value} onChange={e => setP({ ...p, value: Number(e.target.value) })} /></Field>
            <Field label="Validité"><Input value={p.validity} onChange={e => setP({ ...p, validity: e.target.value })} /></Field>
          </div>
          <Field label="Image (URL)"><Input value={p.image} onChange={e => setP({ ...p, image: e.target.value })} /></Field>
          <label className="text-sm flex items-center gap-2"><Switch checked={p.active} onCheckedChange={v => setP({ ...p, active: v })} /> Active</label>
        </div>
        <div className="flex justify-end gap-2 pt-4"><Button variant="ghost" onClick={onClose}>Annuler</Button><Button onClick={save}>Enregistrer</Button></div>
      </DialogContent>
    </Dialog>
  );
}
function Field({ label, children }: any) { return <div><label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label><div className="mt-1">{children}</div></div>; }
