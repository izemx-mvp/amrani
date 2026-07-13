import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/users")({ component: Page });

const USERS = [
  { name: "Sofia Amrani", role: "Super Administrateur", email: "sofia@amrani.com" },
  { name: "Leila Bennani", role: "Coach", email: "leila@amrani.com" },
  { name: "Karim Nouri", role: "Coach", email: "karim@amrani.com" },
  { name: "Meryem Ouazzani", role: "Réception", email: "meryem@amrani.com" },
  { name: "Ines Chraibi", role: "Gestionnaire de contenu", email: "ines@amrani.com" },
];
const ROLES = ["Super Administrateur", "Administrateur", "Réception", "Coach", "Gestionnaire de contenu"];

function Page() {
  return (
    <div>
      <PageHeader title="Utilisateurs & Rôles" actions={<Button>Ajouter un utilisateur</Button>} />
      <div className="rounded-2xl bg-card border border-border overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--cream)] text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="p-3">Nom</th><th className="p-3">Email</th><th className="p-3">Rôle</th><th></th></tr>
          </thead>
          <tbody>
            {USERS.map(u => (
              <tr key={u.email} className="border-t border-border">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3 text-right"><Button size="sm" variant="ghost">Éditer</Button></td>
              </tr>
            ))}
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
    </div>
  );
}
