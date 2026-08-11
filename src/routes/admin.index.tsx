import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { useStore, findActivity, findCoach } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { Plus, Calendar, Package, Sparkles, FileText, Wand2 } from "lucide-react";
import { actions } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({ component: Overview });

const trend = Array.from({ length: 12 }).map((_, i) => ({ m: ["Jan","Fev","Mar","Avr","Mai","Jun","Jul","Aou","Sep","Oct","Nov","Déc"][i], v: 40 + Math.round(Math.sin(i) * 15 + i * 2) }));
const COLORS = ["#17352C", "#A8B5A2", "#E9E0D2", "#202420", "#7C9483"];

function Overview() {
  const bookings = useStore(s => s.bookings);
  const clients = useStore(s => s.clients);
  const schedule = useStore(s => s.schedule);
  const packs = useStore(s => s.packs);
  const promotions = useStore(s => s.promotions);
  const activities = useStore(s => s.activities);
  const payments = useStore(s => s.payments);
  const journal = useStore(s => s.aiJournal);

  const today = new Date().toDateString();
  const todayBookings = bookings.filter(b => new Date(b.start).toDateString() === today);
  const todaySlots = schedule.filter(s => new Date(s.start).toDateString() === today);
  const pending = bookings.filter(b => b.status === "En attente");
  const confirmed = bookings.filter(b => b.status === "Confirmée");
  const fill = schedule.slice(0, 8).map(s => ({ n: s.id.slice(-3), pct: Math.round(s.booked / s.capacity * 100) }));
  const packMix = packs.filter(p => p.active).map(p => ({ name: p.name, value: 5 + p.sessions }));

  return (
    <div className="space-y-8">
      <PageHeader title="Vue d'ensemble" subtitle={`Bienvenue Sofia · ${new Date().toLocaleDateString("fr", { weekday: "long", day: "2-digit", month: "long" })}`} />
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Stat label="Réservations aujourd'hui" value={String(todayBookings.length)} delta={`${confirmed.length} confirmées`} />
        <Stat label="Réservations en attente" value={String(pending.length)} delta="Validation manuelle requise" />
        <Stat label="Total réservations" value={String(bookings.length)} delta="Toutes périodes" />
        <Stat label="Séances aujourd'hui" value={String(todaySlots.length)} delta={`${todaySlots.reduce((a, s) => a + s.booked, 0)} places réservées`} />
        <Stat label="Clients" value={String(clients.length)} delta="Total actifs" />
        <Stat label="Taux de remplissage" value={`${Math.round(schedule.reduce((a, s) => a + s.booked / s.capacity, 0) / Math.max(1, schedule.length) * 100)}%`} delta="cette semaine" />
        <Stat label="Packs actifs" value={String(packs.filter(p => p.active).length)} delta={`${packs.length} au total`} />
        <Stat label="Paiements récents" value={String(payments.length)} delta={`${payments.filter(p => p.status === "Payé").reduce((a, p) => a + p.amount, 0).toLocaleString("fr")} MAD`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border">
          <div className="flex justify-between items-baseline"><h3 className="font-serif text-xl text-[color:var(--forest)]">Évolution des réservations</h3><span className="text-xs text-muted-foreground">12 derniers mois</span></div>
          <div className="h-64 mt-4">
            <ResponsiveContainer><LineChart data={trend}><XAxis dataKey="m" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis hide /><Tooltip /><Line type="monotone" dataKey="v" stroke="#17352C" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h3 className="font-serif text-xl text-[color:var(--forest)]">Répartition des packs</h3>
          <div className="h-64 mt-4">
            <ResponsiveContainer><PieChart><Pie data={packMix} dataKey="value" innerRadius={40} outerRadius={80}>{packMix.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border">
          <h3 className="font-serif text-xl text-[color:var(--forest)]">Taux de remplissage par séance</h3>
          <div className="h-56 mt-4">
            <ResponsiveContainer><BarChart data={fill}><XAxis dataKey="n" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis hide /><Tooltip /><Bar dataKey="pct" fill="#A8B5A2" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h3 className="font-serif text-xl text-[color:var(--forest)]">Activités populaires</h3>
          <ul className="mt-4 space-y-3">
            {activities.slice(0, 5).map((a, i) => (
              <li key={a.id} className="flex justify-between text-sm"><span>{a.name}</span><span className="text-muted-foreground">{95 - i * 12}%</span></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-serif text-xl text-[color:var(--forest)] mb-4">Actions rapides</h3>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-6">
          {[
            { to: "/admin/planning", icon: Calendar, label: "Ajouter un cours" },
            { to: "/admin/bookings", icon: Plus, label: "Nouvelle réservation" },
            { to: "/admin/packs", icon: Package, label: "Créer un pack" },
            { to: "/admin/promotions", icon: Sparkles, label: "Créer promotion" },
            { to: "/admin/articles", icon: FileText, label: "Publier article" },
            { to: "/admin/articles", icon: FileText, label: "Publier article" },
          ].map(a => (
            <Link key={a.label} to={a.to as any} className="p-4 rounded-xl border border-border hover:border-[color:var(--forest)] flex flex-col items-center text-center gap-2 text-sm">
              <a.icon className="h-5 w-5 text-[color:var(--forest)]" />{a.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h3 className="font-serif text-xl text-[color:var(--forest)] mb-4">Aujourd'hui · Cours prévus</h3>
          <div className="space-y-2">
            {todaySlots.length === 0 && <div className="text-sm text-muted-foreground">Aucun cours prévu aujourd'hui.</div>}
            {todaySlots.map(s => {
              const a = findActivity(s.activityId); const c = findCoach(s.coachId);
              return (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-[color:var(--cream)]">
                  <div>
                    <div className="font-medium text-sm">{a?.name} · {new Date(s.start).toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}</div>
                    <div className="text-xs text-muted-foreground">{c?.name} · {s.booked}/{s.capacity}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-white">{s.capacity - s.booked} places</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-card border border-border">
          <h3 className="font-serif text-xl text-[color:var(--forest)] mb-4">Réservations à valider ({pending.length})</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {pending.slice(0, 8).map(b => (
              <div key={b.id} className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-[color:var(--cream)]">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{b.clientName}</div>
                  <div className="text-xs text-muted-foreground">{new Date(b.start).toLocaleString("fr")}</div>
                </div>
                <Button size="sm" onClick={() => { actions.updateBookingStatus(b.id, "Confirmée"); toast.success("Réservation validée"); }}>Valider</Button>
                <Button size="sm" variant="outline" onClick={() => { actions.updateBookingStatus(b.id, "Refusée"); toast.success("Refusée"); }}>Refuser</Button>
              </div>
            ))}
            {pending.length === 0 && <div className="text-sm text-muted-foreground">Rien à valider.</div>}
          </div>
        </div>
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
