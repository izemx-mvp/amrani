import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { useStore, actions, type StaffUser } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({ component: Page });

const ROLES = ["Super Administrateur", "Administrateur", "Réception", "Coach", "Gestionnaire de contenu"];

function blank(): StaffUser {
  return { id: `u${Date.now()}`, name: "", email: "", role: "Réception", active: true };
}

function Page() {
  const staff = useStore(s => s.staff);
  const [edit, setEdit] = useState<StaffUser | null>(null);

  return (
    <div>
      <PageHeader title="Utilisateurs & Rôles" subtitle={`${staff.length} comptes internes`} actions={<Button onClick={() => setEdit(blank())}>Ajouter un utilisateur</Button>} />
      <div className="rounded-2xl bg-card border border-border overflow-hidden mb-8 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--cream)] text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="p-3">Nom</th><th className="p-3">Email</th><th className="p-3">Rôle</th><th className="p-3">Actif</th><th></th></tr>
          </thead>
          <tbody>
            {staff.map(u => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3">
                  <select value={u.role} onChange={e => { actions.saveStaff({ ...u, role: e.target.value }); toast.success("Rôle mis à jour"); }} className="text-xs px-2 py-1 rounded-md border border-border bg-background">
                    {ROLES.map(r => <option key={r}>{r}</option>)}
                  </select>
                </td>
                <td className="p-3"><Switch checked={u.active} onCheckedChange={() => { actions.toggleStaff(u.id); toast.success(u.active ? "Accès suspendu" : "Accès réactivé"); }} /></td>
                <td className="p-3 text-right space-x-1 whitespace-nowrap">
                  <Button size="sm" variant="ghost" onClick={() => setEdit(u)}>Éditer</Button>
                  <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Supprimer ${u.name} ?`)) { actions.deleteStaff(u.id); toast.success("Utilisateur supprimé"); } }}>×</Button>
                </td>
              </tr>
            ))}
            {staff.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Aucun utilisateur.</td></tr>}
          </tbody>
        </table>
      </div>
      <h3 className="font-serif text-2xl text-[color:var(--forest)] mb-4">Permissions par rôle</h3>
      <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--cream)]">
            <tr><th className="p-3 text-left">Permission</th>{ROLES.map(r => <th key={r} className="p-3 text-center text-xs">{r}</th>)}</tr>
          </thead>
          <tbody>
            {["Réservations", "Planning", "Clients", "Packs", "Promotions", "Articles", "Configuration"].map((p, i) => (
              <tr key={p} className="border-t border-border">
                <td className="p-3">{p}</td>
                {ROLES.map((r, j) => <td key={r} className="p-3 text-center">{(j <= (5 - i / 2)) ? "✓" : "—"}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {edit && <UserDialog user={edit} onClose={() => setEdit(null)} />}
    </div>
  );
}

function UserDialog({ user, onClose }: { user: StaffUser; onClose: () => void }) {
  const [u, setU] = useState(user);
  const save = () => {
    if (!u.name.trim() || !u.email.trim()) { toast.error("Nom et email requis"); return; }
    actions.saveStaff(u);
    toast.success("Utilisateur enregistré");
    onClose();
  };
  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-serif text-2xl text-[color:var(--forest)]">{user.name ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Nom complet" value={u.name} onChange={e => setU({ ...u, name: e.target.value })} />
          <Input placeholder="Email" value={u.email} onChange={e => setU({ ...u, email: e.target.value })} />
          <select value={u.role} onChange={e => setU({ ...u, role: e.target.value })} className="w-full h-10 px-3 rounded-md border border-border">
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
          <label className="text-sm flex items-center gap-2"><Switch checked={u.active} onCheckedChange={v => setU({ ...u, active: v })} /> Compte actif</label>
        </div>
        <div className="flex justify-end gap-2 pt-4"><Button variant="ghost" onClick={onClose}>Annuler</Button><Button onClick={save}>Enregistrer</Button></div>
      </DialogContent>
    </Dialog>
  );
}
