import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { useStore, actions, findPack } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/clients")({ component: Page });

const TABS = ["Vue d'ensemble", "Réservations", "Packs", "Paiements", "Historique", "Notes internes"] as const;

function Page() {
  const clients = useStore(s => s.clients);
  const bookings = useStore(s => s.bookings);
  const payments = useStore(s => s.payments);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [add, setAdd] = useState(false);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Vue d'ensemble");
  const [note, setNote] = useState("");

  const filtered = clients.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.email.includes(q));
  const active = clients.find(c => c.id === selected);
  const clientBookings = active ? bookings.filter(b => b.clientId === active.id) : [];
  const clientPayments = active ? payments.filter(p => p.clientId === active.id) : [];
  const totalPaid = clientPayments.filter(p => p.status === "Payé").reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <PageHeader title="Clients" subtitle={`${clients.length} clients`} actions={<Button onClick={() => setAdd(true)}>+ Nouveau client</Button>} />
      <Input placeholder="Rechercher…" value={q} onChange={e => setQ(e.target.value)} className="mb-4 max-w-sm" />
      <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--cream)] text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="p-3">Client</th><th className="p-3 hidden md:table-cell">Contact</th><th className="p-3">Pack</th><th className="p-3">Séances</th><th className="p-3 hidden lg:table-cell">Réservations</th><th className="p-3">Statut</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-t border-border hover:bg-[color:var(--cream)]/50 cursor-pointer" onClick={() => { setSelected(c.id); setTab("Vue d'ensemble"); setNote(c.notes ?? ""); }}>
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">{c.email}</td>
                <td className="p-3">{findPack(c.packId)?.name}</td>
                <td className="p-3">{c.remaining}</td>
                <td className="p-3 hidden lg:table-cell">{c.bookings}</td>
                <td className="p-3"><span className="text-xs px-2 py-1 rounded-full bg-secondary">{c.status}</span></td>
                <td className="p-3 text-right"><Button variant="ghost" size="sm">Ouvrir</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Sheet open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {active && (
            <>
              <SheetHeader><SheetTitle className="font-serif text-2xl text-[color:var(--forest)]">{active.name}</SheetTitle></SheetHeader>
              <div className="flex flex-wrap gap-1 mt-4 p-1 bg-secondary rounded-lg w-fit text-xs">
                {TABS.map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-md ${tab === t ? "bg-white shadow-sm" : "text-muted-foreground"}`}>{t}</button>)}
              </div>

              <div className="mt-6 space-y-3 text-sm">
                {tab === "Vue d'ensemble" && (
                  <>
                    <Row k="Email" v={active.email} />
                    <Row k="Téléphone" v={active.phone} />
                    <Row k="Pack actuel" v={findPack(active.packId)?.name ?? "—"} />
                    <Row k="Séances restantes" v={String(active.remaining)} />
                    <Row k="Réservations totales" v={String(clientBookings.length)} />
                    <Row k="Total payé" v={`${totalPaid} MAD`} />
                    <Row k="Dernière activité" v={active.lastActive} />
                  </>
                )}
                {tab === "Réservations" && (
                  <div className="space-y-2">
                    {clientBookings.map(b => (
                      <div key={b.id} className="p-3 rounded-lg border border-border">
                        <div className="flex justify-between text-sm"><span className="font-medium">{new Date(b.start).toLocaleString("fr")}</span><span className="text-xs px-2 py-0.5 rounded-full bg-secondary">{b.status}</span></div>
                      </div>
                    ))}
                    {clientBookings.length === 0 && <div className="text-muted-foreground text-xs">Aucune réservation.</div>}
                  </div>
                )}
                {tab === "Packs" && (
                  <>
                    <Row k="Pack actuel" v={findPack(active.packId)?.name ?? "—"} />
                    <Row k="Séances utilisées" v={String(Math.max(0, (findPack(active.packId)?.sessions ?? 0) - active.remaining))} />
                    <Row k="Séances restantes" v={String(active.remaining)} />
                    <Row k="Date d'achat" v={new Date(active.createdAt).toLocaleDateString("fr")} />
                  </>
                )}
                {tab === "Paiements" && (
                  <div className="space-y-2">
                    {clientPayments.map(p => (
                      <div key={p.id} className="flex justify-between p-3 rounded-lg border border-border">
                        <div><div className="font-medium">{p.amount} MAD</div><div className="text-xs text-muted-foreground">{p.mode} · {new Date(p.date).toLocaleDateString("fr")}</div></div>
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary self-center">{p.status}</span>
                      </div>
                    ))}
                    {clientPayments.length === 0 && <div className="text-muted-foreground text-xs">Aucun paiement.</div>}
                  </div>
                )}
                {tab === "Historique" && (
                  <ol className="space-y-2 border-l-2 border-[color:var(--sage)]/40 pl-4">
                    <li><div className="font-medium">Inscription</div><div className="text-xs text-muted-foreground">{new Date(active.createdAt).toLocaleString("fr")}</div></li>
                    {clientBookings.slice(0, 5).map(b => (
                      <li key={b.id}><div className="font-medium">Réservation {b.status}</div><div className="text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleString("fr")}</div></li>
                    ))}
                  </ol>
                )}
                {tab === "Notes internes" && (
                  <div>
                    <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full p-3 rounded-lg border border-border text-sm min-h-[120px]" placeholder="Ajouter des notes internes…" />
                    <Button size="sm" className="mt-2" onClick={() => { actions.updateClient(active.id, { notes: note }); toast.success("Notes enregistrées"); }}>Enregistrer</Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {add && <AddClient onClose={() => setAdd(false)} />}
    </div>
  );
}

function AddClient({ onClose }: { onClose: () => void }) {
  const [c, setC] = useState({ name: "", email: "", phone: "" });
  const submit = () => {
    if (!c.name || !c.email) { toast.error("Nom et email requis"); return; }
    actions.addClient({ ...c, packId: "discovery", remaining: 1, bookings: 0, lastActive: "à l'instant", status: "Nouveau" });
    toast.success("Client ajouté");
    onClose();
  };
  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-serif text-2xl text-[color:var(--forest)]">Nouveau client</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Nom complet" value={c.name} onChange={e => setC({ ...c, name: e.target.value })} />
          <Input placeholder="Email" value={c.email} onChange={e => setC({ ...c, email: e.target.value })} />
          <Input placeholder="Téléphone" value={c.phone} onChange={e => setC({ ...c, phone: e.target.value })} />
        </div>
        <div className="flex justify-end gap-2 pt-4"><Button variant="ghost" onClick={onClose}>Annuler</Button><Button onClick={submit}>Créer</Button></div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ k, v }: any) { return <div className="flex justify-between py-2 border-b border-border last:border-0"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>; }
