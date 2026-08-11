import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { useStore, actions, findActivity, findCoach, findPack, getCoaches, type BookingStatus, type BookingSource, type PaymentMode } from "@/lib/store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Search, Plus, Check, X, Clock, CheckCircle2, XCircle, MailIcon, AlertTriangle, Sparkles } from "lucide-react";

import { toast } from "sonner";

export const Route = createFileRoute("/admin/bookings")({ component: Page });

const STATUSES: (BookingStatus | "Tous")[] = ["Tous", "En attente", "Confirmée", "Refusée", "Annulée", "Terminée", "Absente"];

function Page() {
  const bookings = useStore(s => s.bookings);
  const activitiesList = useStore(s => s.activities);
  const [status, setStatus] = useState<string>("Tous");
  const [activityFilter, setActivityFilter] = useState("");
  const [coachFilter, setCoachFilter] = useState("");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [wizard, setWizard] = useState(false);

  const filtered = useMemo(() => bookings.filter(b =>
    (status === "Tous" || b.status === status)
    && (!activityFilter || b.activityId === activityFilter)
    && (!coachFilter || b.coachId === coachFilter)
    && (!q || b.clientName.toLowerCase().includes(q.toLowerCase()) || b.id.includes(q))
  ), [bookings, status, activityFilter, coachFilter, q]);

  const active = bookings.find(b => b.id === selected) ?? null;

  return (
    <div>
      <PageHeader title="Réservations" subtitle={`${filtered.length} résultat(s) sur ${bookings.length}`} actions={
        <Button onClick={() => setWizard(true)}><Plus className="h-4 w-4 mr-1" />Nouvelle réservation</Button>
      } />

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher un client ou # réservation…" className="pl-9" />
        </div>
        <select value={activityFilter} onChange={e => setActivityFilter(e.target.value)} className="h-10 px-3 rounded-md border border-border bg-background text-sm">
          <option value="">Toutes activités</option>
          {activitiesList.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select value={coachFilter} onChange={e => setCoachFilter(e.target.value)} className="h-10 px-3 rounded-md border border-border bg-background text-sm">
          <option value="">Tous coachs</option>
          {getCoaches().map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="flex flex-wrap gap-1 p-1 bg-secondary rounded-lg mb-4 w-fit">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setStatus(s)} className={`text-xs px-3 py-1.5 rounded-md ${status === s ? "bg-white shadow-sm" : "text-muted-foreground"}`}>{s}</button>
        ))}
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--cream)] text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3">#</th><th className="p-3">Client</th><th className="p-3">Activité</th>
              <th className="p-3 hidden md:table-cell">Coach</th><th className="p-3">Date</th>
              <th className="p-3 hidden xl:table-cell">Pack</th>
              <th className="p-3">Statut</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => {
              const a = findActivity(b.activityId);
              const c = findCoach(b.coachId);
              const d = new Date(b.start);
              return (
                <tr key={b.id} className={`border-t border-border hover:bg-[color:var(--cream)]/50 cursor-pointer ${b.status === "En attente" ? "bg-amber-50/40" : ""}`} onClick={() => setSelected(b.id)}>
                  <td className="p-3 text-xs text-muted-foreground font-mono">{b.id.slice(-6)}</td>
                  <td className="p-3 font-medium">
                    {b.clientName}
                    {b.status === "En attente" && <span className="ml-2 inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800"><AlertTriangle className="h-2.5 w-2.5" />À valider</span>}
                  </td>
                  <td className="p-3">{a?.name}</td>
                  <td className="p-3 hidden md:table-cell">{c?.name}</td>
                  <td className="p-3">{d.toLocaleDateString("fr", { day: "2-digit", month: "short" })} · {d.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="p-3 hidden xl:table-cell">{b.packId ? findPack(b.packId)?.name : "—"}</td>
                  <td className="p-3"><StatusBadge s={b.status} /></td>
                  <td className="p-3 text-right"><Button size="sm" variant="ghost">Ouvrir</Button></td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={10} className="p-12 text-center text-muted-foreground">Aucune réservation.</td></tr>}
          </tbody>
        </table>
      </div>

      <BookingSheet id={selected} onClose={() => setSelected(null)} />
      {wizard && <NewBookingWizard onClose={() => setWizard(false)} />}
    </div>
  );
}

function BookingSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const b = useStore(s => s.bookings.find(x => x.id === id));
  const [note, setNote] = useState("");
  if (!b) return <Sheet open={false} onOpenChange={onClose}><SheetContent /></Sheet>;
  const activity = findActivity(b.activityId);
  const coach = findCoach(b.coachId);
  const pack = b.packId ? findPack(b.packId) : null;

  const setStatus = (s: BookingStatus) => { actions.updateBookingStatus(b.id, s); toast.success(`Statut : ${s}`); };
  const saveNote = () => { if (note.trim()) { actions.addNote(b.id, note); toast.success("Note enregistrée"); setNote(""); } };

  return (
    <Sheet open={!!id} onOpenChange={o => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <SheetTitle className="font-serif text-2xl text-[color:var(--forest)]">Réservation {b.id.slice(-6).toUpperCase()}</SheetTitle>
              <div className="mt-2 flex items-center gap-2"><StatusBadge s={b.status} /><span className="text-xs text-muted-foreground">créée le {new Date(b.createdAt).toLocaleString("fr")}</span></div>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <Section title="Client">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-11 w-11 rounded-full bg-[color:var(--sage)] text-[color:var(--forest)] grid place-items-center font-semibold">{b.clientName.split(" ").map(x => x[0]).slice(0, 2).join("")}</div>
              <div>
                <div className="font-medium">{b.clientName}</div>
                <div className="text-xs text-muted-foreground">{b.clientEmail ?? "—"}</div>
              </div>
            </div>
            <Row k="Source" v={b.source} />
            <Row k="Pack utilisé" v={pack?.name ?? "Séance unitaire"} />
          </Section>

          <Section title="Séance">
            <Row k="Activité" v={activity?.name ?? "—"} />
            <Row k="Coach" v={coach?.name ?? "—"} />
            <Row k="Date" v={new Date(b.start).toLocaleString("fr")} />
            <Row k="Durée" v={`${activity?.duration ?? 60} min`} />
            <Row k="Niveau" v={activity?.level ?? "—"} />
          </Section>

          <Section title="Paiement">
            <Row k="Montant" v={`${b.amount} MAD`} />
            <Row k="Mode" v={b.paymentMode} />
            <Row k="Statut" v={b.paymentStatus} />
            {b.paymentStatus !== "Payé" && (
              <Button size="sm" variant="outline" className="mt-3" onClick={() => { actions.markBookingPaid(b.id); toast.success("Paiement enregistré"); }}>Marquer comme payé</Button>
            )}
          </Section>



          <Section title="Suivi">
            <ol className="mt-2 space-y-2 border-l-2 border-[color:var(--sage)]/40 pl-4">
              {b.history.map((h, i) => (
                <li key={i} className="text-sm">
                  <div className="font-medium">{h.label}</div>
                  <div className="text-xs text-muted-foreground">{new Date(h.ts).toLocaleString("fr")}</div>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Note interne">
            {b.note && <p className="text-sm bg-[color:var(--cream)] p-3 rounded-lg mb-2">{b.note}</p>}
            <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full p-3 rounded-lg border border-border bg-background text-sm min-h-[80px]" placeholder="Ajouter une note…" />
            <Button size="sm" variant="outline" className="mt-2" onClick={saveNote}>Enregistrer</Button>
          </Section>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-border sticky bottom-0 bg-background pb-2">
            {b.status === "En attente" && (
              <>
                <Button onClick={() => setStatus("Confirmée")}><CheckCircle2 className="h-4 w-4 mr-1" />Valider</Button>
                <Button variant="outline" onClick={() => setStatus("Refusée")}><XCircle className="h-4 w-4 mr-1" />Refuser</Button>
              </>
            )}
            {b.status === "Confirmée" && (
              <>
                <Button onClick={() => setStatus("Terminée")}><Check className="h-4 w-4 mr-1" />Terminée</Button>
                <Button variant="outline" onClick={() => setStatus("Absente")}>Absente</Button>
              </>
            )}
            {!["Annulée", "Refusée", "Terminée"].includes(b.status) && (
              <Button variant="outline" onClick={() => setStatus("Annulée")}><X className="h-4 w-4 mr-1" />Annuler</Button>
            )}
            <Button variant="ghost" onClick={() => { window.location.href = `mailto:${b.clientEmail ?? ""}?subject=${encodeURIComponent("Votre réservation Amrani")}`; }}><MailIcon className="h-4 w-4 mr-1" />Contacter</Button>
            <Button variant="ghost" className="text-destructive" onClick={() => { if (confirm("Supprimer définitivement cette réservation ?")) { actions.deleteBooking(b.id); toast.success("Réservation supprimée"); onClose(); } }}>Supprimer</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NewBookingWizard({ onClose }: { onClose: () => void }) {
  const clients = useStore(s => s.clients);
  const activitiesList = useStore(s => s.activities.filter(a => a.active));
  const schedule = useStore(s => s.schedule.filter(s => s.active));
  const packs = useStore(s => s.packs.filter(p => p.active));

  const [step, setStep] = useState(0);
  const [clientId, setClientId] = useState<string | null>(null);
  const [newClient, setNewClient] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [clientQ, setClientQ] = useState("");
  const [activityId, setActivityId] = useState<string | null>(null);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [packId, setPackId] = useState<string | null>(null);
  const [payMode, setPayMode] = useState<PaymentMode>("Pack");
  const [payStatus, setPayStatus] = useState<"Payé" | "En attente">("Payé");
  const [source, setSource] = useState<BookingSource>("Back Office");
  const [note, setNote] = useState("");

  const filteredClients = clients.filter(c => !clientQ || c.name.toLowerCase().includes(clientQ.toLowerCase()) || c.email.includes(clientQ)).slice(0, 8);
  const activity = activityId ? activitiesList.find(a => a.id === activityId) : null;
  const slot = slotId ? schedule.find(s => s.id === slotId) : null;
  const slotsForActivity = activityId ? schedule.filter(s => s.activityId === activityId) : [];

  const create = () => {
    if (!slot || !activity) return;
    let clientObj = clients.find(c => c.id === clientId);
    if (!clientObj && newClient.email) {
      clientObj = actions.addClient({
        name: `${newClient.firstName} ${newClient.lastName}`.trim(),
        email: newClient.email, phone: newClient.phone,
        packId: "discovery", remaining: 1, bookings: 0,
        lastActive: "à l'instant", status: "Nouveau",
      });
    }
    if (!clientObj) { toast.error("Sélectionnez ou créez un client"); return; }

    actions.addBooking({
      clientId: clientObj.id, clientName: clientObj.name, clientEmail: clientObj.email,
      scheduleId: slot.id, activityId: activity.id, coachId: slot.coachId, start: slot.start,
      packId, status: "Confirmée",
      source, note, paymentStatus: payStatus === "Payé" ? "Payé" : "En attente",
      paymentMode: payMode, amount: activity.price ?? 150,
    });
    toast.success("Réservation créée · le client sera notifié");
    onClose();
  };

  const canNext = [
    () => !!clientId || !!newClient.email,
    () => !!activityId,
    () => !!slotId,
    () => payMode !== "Pack" || !!packId,
    () => true,
  ][step]();

  const STEPS = ["Client", "Cours", "Date & heure", "Pack & Paiement", "Validation"];

  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif text-2xl text-[color:var(--forest)]">Nouvelle réservation</DialogTitle></DialogHeader>

        <div className="flex gap-2 text-xs mb-6 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s} className={`px-3 py-1.5 rounded-full shrink-0 ${i === step ? "bg-[color:var(--forest)] text-[color:var(--cream)]" : i < step ? "bg-[color:var(--sage)]/30 text-[color:var(--forest)]" : "bg-secondary text-muted-foreground"}`}>{i + 1}. {s}</div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Rechercher un client existant</label>
              <Input value={clientQ} onChange={e => setClientQ(e.target.value)} placeholder="Nom ou email…" className="mt-1" />
              <div className="mt-2 max-h-52 overflow-y-auto border border-border rounded-lg divide-y divide-border">
                {filteredClients.map(c => (
                  <button key={c.id} onClick={() => { setClientId(c.id); setNewClient({ firstName: "", lastName: "", email: "", phone: "" }); }}
                    className={`w-full text-left p-2 text-sm hover:bg-[color:var(--cream)] ${clientId === c.id ? "bg-[color:var(--sage)]/20" : ""}`}>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.email}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center text-xs uppercase tracking-widest text-muted-foreground">— ou créer un nouveau client —</div>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Prénom" value={newClient.firstName} onChange={e => { setClientId(null); setNewClient({ ...newClient, firstName: e.target.value }); }} />
              <Input placeholder="Nom" value={newClient.lastName} onChange={e => { setClientId(null); setNewClient({ ...newClient, lastName: e.target.value }); }} />
              <Input placeholder="Email" value={newClient.email} onChange={e => { setClientId(null); setNewClient({ ...newClient, email: e.target.value }); }} />
              <Input placeholder="Téléphone" value={newClient.phone} onChange={e => { setClientId(null); setNewClient({ ...newClient, phone: e.target.value }); }} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {activitiesList.map(a => (
              <button key={a.id} onClick={() => setActivityId(a.id)} className={`p-3 rounded-xl border text-left text-sm ${activityId === a.id ? "border-[color:var(--forest)] bg-[color:var(--sage)]/10" : "border-border"}`}>
                <div className="font-medium">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.category} · {a.level}</div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {slotsForActivity.map(s => {
              const c = findCoach(s.coachId);
              const d = new Date(s.start);
              const full = s.booked >= s.capacity;
              return (
                <button key={s.id} disabled={full} onClick={() => setSlotId(s.id)}
                  className={`w-full text-left p-3 rounded-xl border flex items-center justify-between disabled:opacity-40 ${slotId === s.id ? "border-[color:var(--forest)] bg-[color:var(--sage)]/10" : "border-border"}`}>
                  <div>
                    <div className="font-medium text-sm capitalize">{d.toLocaleDateString("fr", { weekday: "long", day: "2-digit", month: "long" })} · {d.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}</div>
                    <div className="text-xs text-muted-foreground">{c?.name} · capacité {s.capacity}</div>
                  </div>
                  <span className={`text-xs ${full ? "text-destructive" : "text-[color:var(--forest)]"}`}>{full ? "Complet" : `${s.capacity - s.booked} place(s)`}</span>
                </button>
              );
            })}
            {slotsForActivity.length === 0 && <div className="text-sm text-muted-foreground p-4">Aucun créneau. Créez-en un dans le planning.</div>}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Mode</label>
              <select value={payMode} onChange={e => setPayMode(e.target.value as PaymentMode)} className="mt-1 w-full h-10 px-3 rounded-md border border-border">
                <option value="Pack">Utiliser un pack</option>
                <option value="Carte bancaire">Carte bancaire</option>
                <option value="Espèces">Espèces</option>
                <option value="Virement">Virement</option>
                <option value="En ligne">Paiement en ligne</option>
              </select>
            </div>
            {payMode === "Pack" && (
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Pack</label>
                <div className="mt-1 grid gap-2">
                  {packs.map(p => (
                    <button key={p.id} onClick={() => setPackId(p.id)} className={`text-left p-3 rounded-xl border text-sm ${packId === p.id ? "border-[color:var(--forest)] bg-[color:var(--sage)]/10" : "border-border"}`}>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.sessions} séances · {p.price} MAD</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Statut de paiement</label>
              <div className="flex gap-2 mt-1">
                <button onClick={() => setPayStatus("Payé")} className={`px-3 py-1.5 rounded-full text-sm border ${payStatus === "Payé" ? "bg-[color:var(--forest)] text-[color:var(--cream)] border-[color:var(--forest)]" : "border-border"}`}>Payé</button>
                <button onClick={() => setPayStatus("En attente")} className={`px-3 py-1.5 rounded-full text-sm border ${payStatus === "En attente" ? "bg-[color:var(--forest)] text-[color:var(--cream)] border-[color:var(--forest)]" : "border-border"}`}>En attente</button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3 text-sm">
            <Row k="Client" v={clients.find(c => c.id === clientId)?.name ?? `${newClient.firstName} ${newClient.lastName}`} />
            <Row k="Cours" v={activity?.name ?? "—"} />
            <Row k="Date" v={slot ? new Date(slot.start).toLocaleString("fr") : "—"} />
            <Row k="Mode" v={payMode + (packId ? ` · ${findPack(packId)?.name}` : "")} />
            <Row k="Paiement" v={payStatus} />
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Source</label>
              <select value={source} onChange={e => setSource(e.target.value as BookingSource)} className="mt-1 w-full h-10 px-3 rounded-md border border-border">
                {(["Site web", "Application", "Téléphone", "WhatsApp", "Sur place", "Back Office", "Autre"] as BookingSource[]).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Note interne</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} className="mt-1 w-full p-3 rounded-lg border border-border text-sm min-h-[60px]" />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <div className="flex gap-2">
            {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)}>Retour</Button>}
            {step < 4 ? (
              <Button disabled={!canNext} onClick={() => setStep(step + 1)}>Suivant</Button>
            ) : (
              <Button onClick={create}>Créer la réservation</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    "En attente": "bg-amber-100 text-amber-800",
    "Confirmée": "bg-emerald-100 text-emerald-800",
    "Refusée": "bg-red-100 text-red-800",
    "Annulée": "bg-gray-200 text-gray-700",
    "Terminée": "bg-[color:var(--sage)]/40 text-[color:var(--forest)]",
    "Absente": "bg-orange-100 text-orange-800",
  };
  return <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${map[s] || "bg-secondary"}`}><Clock className="h-3 w-3" />{s}</span>;
}
function Row({ k, v }: { k: string; v: string }) { return <div className="flex justify-between py-2 text-sm border-b border-border last:border-0"><span className="text-muted-foreground">{k}</span><span className="font-medium text-right">{v}</span></div>; }
function Section({ title, children }: any) { return <div><h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{title}</h4>{children}</div>; }
