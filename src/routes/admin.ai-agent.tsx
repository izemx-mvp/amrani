import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { useStore, actions, findActivity, findCoach, findSlot, findAlternatives, type AutomationMode } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState, useMemo } from "react";
import {
  Bot, CheckCircle2, AlertTriangle, Activity, MessageSquare, BookOpen,
  Settings2, ListChecks, ScrollText, Zap, Power, Play, Send, Search, XCircle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/ai-agent")({ component: Page });

type TabId = "overview" | "handled" | "queue" | "conversations" | "knowledge" | "rules" | "config" | "journal";
const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: "overview", label: "Vue d'ensemble", icon: Activity },
  { id: "handled", label: "Réservations traitées", icon: CheckCircle2 },
  { id: "queue", label: "À valider par un humain", icon: AlertTriangle },
  { id: "conversations", label: "Conversations", icon: MessageSquare },
  { id: "knowledge", label: "Base de connaissances", icon: BookOpen },
  { id: "rules", label: "Règles d'automatisation", icon: ListChecks },
  { id: "config", label: "Configuration", icon: Settings2 },
  { id: "journal", label: "Journal d'activité", icon: ScrollText },
];

function Page() {
  const [tab, setTab] = useState<TabId>("overview");
  const automation = useStore(s => s.automation);

  return (
    <div>
      <PageHeader
        title="Centre Agent IA"
        subtitle="Agent opérationnel — analyse, propose, confirme sous supervision humaine"
        actions={
          <div className="flex items-center gap-3">
            <div className={`text-xs px-3 py-1.5 rounded-full ${automation.enabled ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
              {automation.enabled ? `Automatisation active · ${labelForMode(automation.mode)}` : "Automatisation désactivée"}
            </div>
            <Button
              variant={automation.enabled ? "outline" : "default"}
              onClick={() => { actions.toggleAutomation(); toast.success(automation.enabled ? "Automatisation IA désactivée" : "Automatisation IA activée"); }}
            >
              <Power className="h-4 w-4 mr-1" />
              {automation.enabled ? "Désactiver l'IA" : "Réactiver l'IA"}
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-1 p-1 bg-secondary rounded-lg mb-6 w-fit">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md ${tab === t.id ? "bg-white shadow-sm text-[color:var(--forest)] font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              <Icon className="h-3.5 w-3.5" />{t.label}
            </button>
          );
        })}
      </div>

      {tab === "overview" && <Overview />}
      {tab === "handled" && <Handled />}
      {tab === "queue" && <Queue />}
      {tab === "conversations" && <Conversations />}
      {tab === "knowledge" && <KnowledgeShortcut />}
      {tab === "rules" && <Rules />}
      {tab === "config" && <Config />}
      {tab === "journal" && <Journal />}
    </div>
  );
}

function labelForMode(m: AutomationMode) {
  return m === "auto" ? "Automatique" : m === "semi" ? "Semi-automatique" : "Manuel";
}

function Overview() {
  const bookings = useStore(s => s.bookings);
  const journal = useStore(s => s.aiJournal);
  const handled = bookings.filter(b => b.treatment === "Confirmée par l'IA");
  const queue = bookings.filter(b => b.needsHumanValidation);
  const rate = bookings.length ? Math.round((handled.length / bookings.length) * 100) : 0;
  const avgConf = handled.length ? Math.round(handled.reduce((a, b) => a + (b.aiConfidence ?? 0), 0) / handled.length) : 0;

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Stat label="Traitées automatiquement" value={String(handled.length)} delta={`${rate}% du total`} />
        <Stat label="En attente humaine" value={String(queue.length)} delta="Action requise" />
        <Stat label="Confiance moyenne" value={`${avgConf}%`} delta="analyses confirmées" />
        <Stat label="Interventions humaines" value={String(journal.filter(j => j.humanValidation).length)} delta="7 derniers jours" />
      </div>
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-serif text-xl text-[color:var(--forest)] mb-4">Activité de l'Agent IA aujourd'hui</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {journal.slice(0, 12).map(j => (
            <div key={j.id} className="flex items-start gap-3 p-3 rounded-lg bg-[color:var(--cream)]/60 text-sm">
              <div className="mt-0.5 h-8 w-8 rounded-full bg-[color:var(--sage)]/40 grid place-items-center shrink-0">
                <Zap className="h-4 w-4 text-[color:var(--forest)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{j.action} <span className="text-muted-foreground font-normal">· {j.clientName ?? "—"}</span></div>
                <div className="text-xs text-muted-foreground">{new Date(j.ts).toLocaleString("fr")} · {j.module} · {j.result}{typeof j.confidence === "number" ? ` · ${j.confidence}% confiance` : ""}</div>
              </div>
            </div>
          ))}
          {journal.length === 0 && <div className="text-sm text-muted-foreground p-3">Aucune action enregistrée.</div>}
        </div>
      </div>
    </div>
  );
}

function Handled() {
  const bookings = useStore(s => s.bookings.filter(b => b.treatment && b.treatment !== "Créée par le client" && b.treatment !== "Créée manuellement"));
  return (
    <div className="rounded-2xl bg-card border border-border overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[color:var(--cream)] text-left text-xs uppercase tracking-widest text-muted-foreground">
          <tr><th className="p-3">Client</th><th className="p-3">Cours</th><th className="p-3">Date</th><th className="p-3">Traitement</th><th className="p-3">Confiance</th><th className="p-3">Statut</th></tr>
        </thead>
        <tbody>
          {bookings.map(b => {
            const a = findActivity(b.activityId);
            return (
              <tr key={b.id} className="border-t border-border">
                <td className="p-3 font-medium">{b.clientName}</td>
                <td className="p-3">{a?.name}</td>
                <td className="p-3">{new Date(b.start).toLocaleString("fr")}</td>
                <td className="p-3"><TreatmentBadge t={b.treatment ?? ""} /></td>
                <td className="p-3">{typeof b.aiConfidence === "number" ? `${b.aiConfidence}%` : "—"}</td>
                <td className="p-3 text-xs">{b.status}</td>
              </tr>
            );
          })}
          {bookings.length === 0 && <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">Aucune réservation traitée par l'IA.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function Queue() {
  const queue = useStore(s => s.bookings.filter(b => b.needsHumanValidation));
  const [selected, setSelected] = useState<string | null>(null);
  const active = queue.find(b => b.id === selected) ?? null;

  return (
    <>
      <div className="space-y-3">
        {queue.map(b => {
          const a = findActivity(b.activityId);
          const c = findCoach(b.coachId);
          return (
            <div key={b.id} className="p-5 rounded-2xl bg-card border border-amber-200 flex flex-wrap items-start gap-4">
              <div className="flex-1 min-w-[220px]">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{b.clientName}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Priorité {b.aiAnalysis?.problem ? "haute" : "moyenne"}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{a?.name} · {c?.name} · {new Date(b.start).toLocaleString("fr")}</div>
                {b.aiAnalysis?.problem && (
                  <div className="mt-2 text-xs px-2 py-1 rounded-md bg-amber-50 text-amber-900 inline-block">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />{b.aiAnalysis.problem}
                  </div>
                )}
                <div className="mt-2 text-xs text-muted-foreground">
                  Confiance IA : <span className="font-medium text-[color:var(--forest)]">{b.aiConfidence ?? "—"}%</span> · Reçu {new Date(b.createdAt).toLocaleDateString("fr")}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <Button size="sm" onClick={() => setSelected(b.id)}>Ouvrir le dossier</Button>
                <Button size="sm" variant="outline" onClick={() => { actions.aiApproveBooking(b.id); toast.success("Proposition IA validée"); }}>
                  <CheckCircle2 className="h-4 w-4 mr-1" />Valider IA
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { actions.aiRejectBooking(b.id); toast.success("Refusée"); }}>
                  <XCircle className="h-4 w-4 mr-1" />Refuser
                </Button>
              </div>
            </div>
          );
        })}
        {queue.length === 0 && <div className="p-12 text-center text-muted-foreground rounded-2xl bg-card border border-border">Aucune décision en attente 🎉</div>}
      </div>

      <QueueSheet id={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function QueueSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const b = useStore(s => s.bookings.find(x => x.id === id));
  if (!b) return <Sheet open={false} onOpenChange={onClose}><SheetContent /></Sheet>;
  const a = findActivity(b.activityId);
  const c = findCoach(b.coachId);
  const slot = findSlot(b.scheduleId);
  const alternatives = findAlternatives(b.activityId, b.scheduleId, 3);

  return (
    <Sheet open={!!id} onOpenChange={o => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl text-[color:var(--forest)]">Dossier IA · {b.clientName}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6 text-sm">
          <div className="p-4 rounded-xl bg-[color:var(--cream)]">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Résumé de la demande</div>
            <p>{b.aiAnalysis?.summary ?? `Réservation ${a?.name} avec ${c?.name} le ${new Date(b.start).toLocaleString("fr")}.`}</p>
            {b.aiAnalysis?.problem && (
              <div className="mt-2 text-xs text-amber-900"><AlertTriangle className="h-3 w-3 inline mr-1" />{b.aiAnalysis.problem}</div>
            )}
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Vérifications effectuées</div>
            <ul className="space-y-1.5">
              {(b.aiAnalysis?.checks ?? [
                { label: "Cours actif", ok: true },
                { label: "Coach disponible", ok: !!c },
                { label: "Places restantes", ok: !!slot && slot.booked < slot.capacity },
              ]).map((k, i) => (
                <li key={i} className="flex items-center gap-2">
                  {k.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                  <span className={k.ok ? "" : "text-red-700"}>{k.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Alternatives détectées (max. 3)</div>
            {alternatives.length ? (
              <div className="space-y-2">
                {alternatives.map(alt => {
                  const co = findCoach(alt.coachId);
                  return (
                    <div key={alt.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <div className="text-sm font-medium">{new Date(alt.start).toLocaleString("fr")}</div>
                        <div className="text-xs text-muted-foreground">{co?.name} · {alt.capacity - alt.booked} place(s)</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => {
                        actions.updateBooking(b.id, { scheduleId: alt.id, coachId: alt.coachId, start: alt.start });
                        actions.aiApproveBooking(b.id);
                        toast.success("Créneau alternatif attribué et validé");
                        onClose();
                      }}>Attribuer</Button>
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-xs text-muted-foreground">Aucune alternative disponible pour ce cours.</p>}
          </div>

          <div className="p-4 rounded-xl bg-[color:var(--sage)]/20">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Recommandation de l'Agent IA</div>
            <p className="text-sm">{b.aiAnalysis?.recommendation ?? "Confirmer manuellement après vérification du paiement."}</p>
            <div className="mt-2 text-xs text-muted-foreground">Niveau de confiance : {b.aiConfidence ?? "—"}%</div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
            <Button onClick={() => { actions.aiApproveBooking(b.id); toast.success("Proposition IA validée"); onClose(); }}>
              <CheckCircle2 className="h-4 w-4 mr-1" />Valider la proposition IA
            </Button>
            <Button variant="outline" onClick={() => { actions.aiRejectBooking(b.id); toast.success("Refusée"); onClose(); }}>Refuser</Button>
            <Link to="/admin/bookings" className="inline-flex items-center text-xs px-3 py-2 rounded-md border border-border hover:bg-secondary">Ouvrir la réservation</Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Conversations() {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <p className="text-sm text-muted-foreground">Les conversations client de l'Agent IA sont regroupées dans le module Messages.</p>
      <Link to="/admin/messages" className="mt-3 inline-flex text-sm underline text-[color:var(--forest)]">Ouvrir Messages →</Link>
    </div>
  );
}

function KnowledgeShortcut() {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <p className="text-sm text-muted-foreground">La base de connaissances alimente l'Agent IA. Les données structurées (planning, packs, promotions) sont lues directement des modules concernés.</p>
      <Link to="/admin/knowledge" className="mt-3 inline-flex text-sm underline text-[color:var(--forest)]">Ouvrir la base de connaissances →</Link>
    </div>
  );
}

function Rules() {
  const automation = useStore(s => s.automation);
  const MODES: { id: AutomationMode; title: string; desc: string; icon: any }[] = [
    { id: "auto", title: "Automatique", desc: "L'IA confirme les réservations standards lorsque toutes les règles sont respectées.", icon: Zap },
    { id: "semi", title: "Semi-automatique", desc: "L'IA prépare la réservation ; un membre de l'équipe clique sur « Valider et envoyer ».", icon: Play },
    { id: "manual", title: "Manuel", desc: "L'IA fournit analyse, disponibilités et suggestions. La décision reste humaine.", icon: Bot },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {MODES.map(m => {
          const Icon = m.icon;
          const active = automation.mode === m.id;
          return (
            <button key={m.id} onClick={() => { actions.setAutomationMode(m.id); toast.success(`Mode ${m.title}`); }}
              className={`p-5 rounded-2xl border text-left transition ${active ? "border-[color:var(--forest)] bg-[color:var(--sage)]/10" : "border-border bg-card hover:border-[color:var(--forest)]/40"}`}>
              <div className="flex items-center gap-2 text-[color:var(--forest)]"><Icon className="h-4 w-4" /><span className="font-serif text-lg">{m.title}</span></div>
              <p className="text-xs text-muted-foreground mt-2">{m.desc}</p>
              {active && <div className="mt-3 text-xs font-medium text-[color:var(--forest)]">Mode actif</div>}
            </button>
          );
        })}
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-serif text-xl text-[color:var(--forest)] mb-4">Règles spécifiques</h3>
        <div className="space-y-2 text-sm">
          {[
            ["Cours collectifs", "Automatique"],
            ["Cours individuels", "Validation humaine"],
            ["Demandes WhatsApp", "Semi-automatique"],
            ["Annulations hors délai", "Manuelle"],
            ["Promotions > 30%", "Validation humaine"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between p-3 rounded-lg bg-[color:var(--cream)]/60">
              <span>{k}</span><span className="text-xs px-2 py-0.5 rounded-full bg-white border border-border">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Config() {
  const [tester, setTester] = useState("");
  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      <form onSubmit={e => { e.preventDefault(); toast.success("Configuration enregistrée"); }} className="space-y-5 p-6 rounded-2xl bg-card border border-border">
        <div><Label>Nom de l'Agent</Label><Input defaultValue="Amrani" className="mt-1" /></div>
        <div><Label>Message d'accueil</Label><Textarea rows={3} defaultValue="Bonjour ✨ Bienvenue chez Amrani. Comment puis-je vous accompagner ?" className="mt-1" /></div>
        <div><Label>Tonalité</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Chaleureuse", "Bienveillante", "Professionnelle", "Élégante", "Dynamique"].map((t, i) => (
              <label key={t} className="text-sm px-3 py-1.5 rounded-full border border-border cursor-pointer has-[:checked]:border-[color:var(--forest)] has-[:checked]:bg-[color:var(--sage)]/20">
                <input type="radio" name="tone" defaultChecked={i === 0} className="hidden" />{t}
              </label>
            ))}
          </div>
        </div>
        <div><Label>Instructions système</Label>
          <Textarea rows={5} defaultValue="Vérifie systématiquement les disponibilités du planning. Ne dépasse jamais la capacité d'un cours. Escalade vers un humain les demandes hors politique." className="mt-1" />
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg border border-border">
          <div><div className="text-sm font-medium">Escalade WhatsApp</div><div className="text-xs text-muted-foreground">Basculer vers un conseiller en cas d'échec</div></div>
          <Switch defaultChecked />
        </div>
        <Button>Enregistrer</Button>
      </form>
      <div className="rounded-2xl bg-[color:var(--forest)] text-[color:var(--cream)] p-6 h-fit">
        <div className="text-xs uppercase tracking-widest opacity-70">Tester mon agent</div>
        <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto">
          <div className="px-3 py-2 rounded-2xl bg-white/10 text-sm">Bonjour ✨ Comment puis-je vous aider ?</div>
          <div className="px-3 py-2 rounded-2xl bg-[color:var(--cream)] text-[color:var(--forest)] text-sm ml-auto w-fit">Je veux réserver un Reformer mardi 18h.</div>
          <div className="px-3 py-2 rounded-2xl bg-white/10 text-sm">Le créneau de mardi 18h est complet. Je vous propose mardi 19h30 avec Sofia, mercredi 17h avec Lina ou jeudi 18h avec Sofia.</div>
        </div>
        <div className="mt-4 flex gap-2">
          <input value={tester} onChange={e => setTester(e.target.value)} placeholder="Test un message…" className="flex-1 px-3 py-2 rounded-full bg-white/10 text-sm outline-none placeholder:text-white/50" />
          <button onClick={() => setTester("")} className="p-2 rounded-full bg-[color:var(--sage)] text-[color:var(--forest)]"><Send className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}

function Journal() {
  const journal = useStore(s => s.aiJournal);
  const [q, setQ] = useState("");
  const filtered = useMemo(() => journal.filter(j => !q || (j.action + (j.clientName ?? "") + j.module).toLowerCase().includes(q.toLowerCase())), [journal, q]);
  return (
    <div>
      <div className="relative max-w-md mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher dans le journal…" className="pl-9" />
      </div>
      <div className="rounded-2xl bg-card border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--cream)] text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3">Date</th><th className="p-3">Action</th><th className="p-3">Client</th>
              <th className="p-3">Module</th><th className="p-3">Décision</th><th className="p-3">Confiance</th>
              <th className="p-3">Validation</th><th className="p-3">Résultat</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(j => (
              <tr key={j.id} className="border-t border-border">
                <td className="p-3 whitespace-nowrap text-xs">{new Date(j.ts).toLocaleString("fr")}</td>
                <td className="p-3">{j.action}</td>
                <td className="p-3">{j.clientName ?? "—"}</td>
                <td className="p-3 text-xs text-muted-foreground">{j.module}</td>
                <td className="p-3 text-xs">{j.decision}</td>
                <td className="p-3 text-xs">{typeof j.confidence === "number" ? `${j.confidence}%` : "—"}</td>
                <td className="p-3 text-xs">{j.humanValidation ? (j.validatedBy ?? "Humain") : "Auto"}</td>
                <td className="p-3 text-xs">{j.result}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={8} className="p-12 text-center text-muted-foreground">Aucune entrée.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="p-5 rounded-2xl bg-card border border-border">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-serif text-3xl text-[color:var(--forest)] mt-2">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{delta}</div>
    </div>
  );
}

export function TreatmentBadge({ t }: { t: string }) {
  const map: Record<string, string> = {
    "Créée par le client": "bg-secondary text-foreground",
    "Créée manuellement": "bg-secondary text-foreground",
    "Analysée par l'IA": "bg-blue-100 text-blue-800",
    "Confirmée par l'IA": "bg-emerald-100 text-emerald-800",
    "En attente de validation humaine": "bg-amber-100 text-amber-800",
    "Validée par un administrateur": "bg-[color:var(--sage)]/40 text-[color:var(--forest)]",
    "Modifiée par l'équipe": "bg-purple-100 text-purple-800",
  };
  const cls = map[t] ?? "bg-secondary";
  const withIcon = t === "En attente de validation humaine";
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full ${cls}`}>
      {withIcon && <AlertTriangle className="h-3 w-3" />}
      {t || "—"}
    </span>
  );
}
