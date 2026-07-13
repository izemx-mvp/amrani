import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { useStore, actions, type PaymentStatus } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/payments")({ component: Page });

function Page() {
  const payments = useStore(s => s.payments);
  const clients = useStore(s => s.clients);
  const [add, setAdd] = useState(false);
  const [q, setQ] = useState("");

  const total = payments.filter(p => p.status === "Payé").reduce((s, p) => s + p.amount, 0);
  const pending = payments.filter(p => p.status === "En attente").reduce((s, p) => s + p.amount, 0);
  const filtered = payments.filter(p => !q || p.clientName.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title="Paiements" subtitle={`${payments.length} transactions`} actions={<Button onClick={() => setAdd(true)}>+ Paiement manuel</Button>} />
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
        <Stat label="Encaissé" value={`${total.toLocaleString("fr")} MAD`} />
        <Stat label="En attente" value={`${pending.toLocaleString("fr")} MAD`} />
        <Stat label="Transactions" value={String(payments.length)} />
        <Stat label="Ce mois" value={`${Math.round(total * 0.6).toLocaleString("fr")} MAD`} />
      </div>
      <Input placeholder="Rechercher un client…" value={q} onChange={e => setQ(e.target.value)} className="max-w-sm mb-4" />
      <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--cream)] text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="p-3">Transaction</th><th className="p-3">Client</th><th className="p-3">Montant</th><th className="p-3 hidden md:table-cell">Mode</th><th className="p-3">Date</th><th className="p-3">Statut</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3 font-mono text-xs">{p.id.slice(-8)}</td>
                <td className="p-3 font-medium">{p.clientName}</td>
                <td className="p-3">{p.amount} MAD</td>
                <td className="p-3 hidden md:table-cell">{p.mode}</td>
                <td className="p-3">{new Date(p.date).toLocaleDateString("fr")}</td>
                <td className="p-3">
                  <select value={p.status} onChange={e => { actions.updatePaymentStatus(p.id, e.target.value as PaymentStatus); toast.success("Statut mis à jour"); }} className="text-xs px-2 py-1 rounded-md border border-border bg-background">
                    {(["Payé", "En attente", "Échoué", "Remboursé"] as PaymentStatus[]).map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3 text-right"><Button size="sm" variant="ghost">Détail</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {add && (
        <Dialog open onOpenChange={o => !o && setAdd(false)}>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-serif text-2xl text-[color:var(--forest)]">Nouveau paiement</DialogTitle></DialogHeader>
            <AddPaymentForm clients={clients} onDone={() => setAdd(false)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function AddPaymentForm({ clients, onDone }: { clients: any[]; onDone: () => void }) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [amount, setAmount] = useState(150);
  const [mode, setMode] = useState<any>("Carte bancaire");
  const submit = () => {
    const c = clients.find(x => x.id === clientId); if (!c) return;
    actions.addPayment({ clientId: c.id, clientName: c.name, amount, mode, status: "Payé" });
    toast.success("Paiement enregistré");
    onDone();
  };
  return (
    <div className="space-y-3">
      <div><label className="text-xs uppercase tracking-widest text-muted-foreground">Client</label>
        <select value={clientId} onChange={e => setClientId(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-md border border-border">
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div><label className="text-xs uppercase tracking-widest text-muted-foreground">Montant (MAD)</label>
        <Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
      </div>
      <div><label className="text-xs uppercase tracking-widest text-muted-foreground">Mode</label>
        <select value={mode} onChange={e => setMode(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-md border border-border">
          {["Carte bancaire", "Espèces", "Virement", "En ligne", "Autre"].map(m => <option key={m}>{m}</option>)}
        </select>
      </div>
      <div className="flex justify-end gap-2 pt-2"><Button variant="ghost" onClick={onDone}>Annuler</Button><Button onClick={submit}>Enregistrer</Button></div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="p-5 rounded-2xl bg-card border border-border"><div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div><div className="font-serif text-3xl text-[color:var(--forest)] mt-2">{value}</div></div>;
}
