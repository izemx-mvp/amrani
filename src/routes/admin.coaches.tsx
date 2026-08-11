import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { useStore, actions, type Coach } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/coaches")({ component: Page });

function blank(): Coach {
  return {
    id: `coach-${Date.now()}`, name: "", role: "", bio: "",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    email: "", phone: "", active: true,
  };
}

function Page() {
  const coaches = useStore(s => s.coaches);
  const [edit, setEdit] = useState<Coach | null>(null);

  return (
    <div>
      <PageHeader title="Coaches" subtitle={`${coaches.length} membres de l'équipe`} actions={<Button onClick={() => setEdit(blank())}>Ajouter un coach</Button>} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {coaches.map(c => (
          <div key={c.id} className="rounded-2xl overflow-hidden bg-card border border-border">
            <div className="aspect-square relative">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
              {!c.active && <div className="absolute inset-0 bg-black/60 grid place-items-center text-white font-serif text-xl">Inactif</div>}
            </div>
            <div className="p-4">
              <div className="font-serif text-lg text-[color:var(--forest)]">{c.name}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{c.role}</div>
              <p className="text-sm text-foreground/70 mt-2">{c.bio}</p>
              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => setEdit(c)}>Modifier</Button>
                <Switch checked={c.active} onCheckedChange={() => { actions.toggleCoach(c.id); toast.success(c.active ? "Coach désactivé" : "Coach activé"); }} />
                <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Supprimer ${c.name} ?`)) { actions.deleteCoach(c.id); toast.success("Coach supprimé"); } }}>×</Button>
              </div>
            </div>
          </div>
        ))}
        {coaches.length === 0 && <div className="text-muted-foreground text-sm">Aucun coach. Ajoutez le premier membre de l'équipe.</div>}
      </div>
      {edit && <CoachDialog coach={edit} onClose={() => setEdit(null)} />}
    </div>
  );
}

function CoachDialog({ coach, onClose }: { coach: Coach; onClose: () => void }) {
  const [c, setC] = useState(coach);
  const save = () => {
    if (!c.name.trim()) { toast.error("Nom requis"); return; }
    actions.saveCoach(c);
    toast.success("Coach enregistré · visible sur le site");
    onClose();
  };
  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif text-2xl text-[color:var(--forest)]">{coach.name ? "Modifier le coach" : "Nouveau coach"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <F label="Nom"><Input value={c.name} onChange={e => setC({ ...c, name: e.target.value })} /></F>
          <F label="Spécialité / Rôle"><Input value={c.role} onChange={e => setC({ ...c, role: e.target.value })} /></F>
          <F label="Biographie"><textarea value={c.bio} onChange={e => setC({ ...c, bio: e.target.value })} className="w-full p-3 rounded-md border border-border text-sm min-h-[70px]" /></F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Email"><Input value={c.email ?? ""} onChange={e => setC({ ...c, email: e.target.value })} /></F>
            <F label="Téléphone"><Input value={c.phone ?? ""} onChange={e => setC({ ...c, phone: e.target.value })} /></F>
          </div>
          <F label="Photo (URL)"><Input value={c.image} onChange={e => setC({ ...c, image: e.target.value })} /></F>
          <label className="text-sm flex items-center gap-2"><Switch checked={c.active} onCheckedChange={v => setC({ ...c, active: v })} /> Actif</label>
        </div>
        <div className="flex justify-end gap-2 pt-4"><Button variant="ghost" onClick={onClose}>Annuler</Button><Button onClick={save}>Enregistrer</Button></div>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children }: any) { return <div><label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label><div className="mt-1">{children}</div></div>; }
