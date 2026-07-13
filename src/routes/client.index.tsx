import { createFileRoute, Link } from "@tanstack/react-router";
import { bookings, packs, promotions, notifications, findActivity, findCoach, findPack } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, Package, Sparkles } from "lucide-react";

export const Route = createFileRoute("/client/")({
  component: Dashboard,
});

function Dashboard() {
  const next = bookings.filter(b => b.status === "Confirmée" || b.status === "En attente")[0];
  const pack = findPack(next?.packId || "pack10")!;
  const activity = findActivity(next?.activityId || "yoga-vinyasa")!;
  const coach = findCoach(next?.coachId || "sofia")!;
  const nextDate = new Date(next?.start || Date.now());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl text-[color:var(--forest)]">Bonjour Nour ✨</h1>
        <p className="text-muted-foreground mt-1">Ravis de vous retrouver.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-[color:var(--forest)] text-[color:var(--cream)] p-6 md:col-span-2">
          <div className="text-xs uppercase tracking-widest opacity-70">Prochaine séance</div>
          <div className="mt-3 font-serif text-3xl">{activity.name}</div>
          <div className="mt-1 text-sm opacity-80">avec {coach.name}</div>
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <div><div className="opacity-60 text-xs uppercase tracking-widest">Date</div><div>{nextDate.toLocaleDateString("fr", { weekday: "long", day: "2-digit", month: "long" })}</div></div>
            <div><div className="opacity-60 text-xs uppercase tracking-widest">Heure</div><div>{nextDate.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}</div></div>
            <div><div className="opacity-60 text-xs uppercase tracking-widest">Statut</div><div>{next?.status}</div></div>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Pack actuel</div>
          <div className="mt-2 font-serif text-2xl text-[color:var(--forest)]">{pack.name}</div>
          <div className="mt-4 flex items-end gap-1">
            <div className="text-4xl font-serif text-[color:var(--forest)]">7</div>
            <div className="text-sm text-muted-foreground pb-1.5">/ {pack.sessions} séances</div>
          </div>
          <div className="h-2 bg-secondary rounded-full mt-4 overflow-hidden">
            <div className="h-full bg-[color:var(--sage)]" style={{ width: `${(7 / pack.sessions) * 100}%` }} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-2xl text-[color:var(--forest)] mb-4">Actions rapides</h2>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
          <Quick to="/booking" icon={Calendar} label="Réserver" />
          <Quick to="/planning" icon={Calendar} label="Planning" />
          <Quick to="/client/packs" icon={Package} label="Mon pack" />
          <Quick to="/contact" icon={MessageCircle} label="Contact" />
          <Quick to="/client" icon={Sparkles} label="Agent IA" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl text-[color:var(--forest)] mb-4">Réservations à venir</h2>
          <div className="space-y-2">
            {bookings.slice(0, 4).map(b => {
              const a = findActivity(b.activityId)!;
              const d = new Date(b.start);
              return (
                <div key={b.id} className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                  <div className="min-w-[64px]">
                    <div className="font-serif text-xl text-[color:var(--forest)]">{d.toLocaleDateString("fr", { day: "2-digit" })}</div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{d.toLocaleDateString("fr", { month: "short" })}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{d.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary">{b.status}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-[color:var(--forest)] mb-4">Notifications</h2>
          <div className="space-y-2">
            {notifications.map(n => (
              <div key={n.id} className="p-4 rounded-xl bg-card border border-border">
                <div className="flex justify-between text-xs text-muted-foreground"><span>{n.title}</span><span>{n.date}</span></div>
                <div className="mt-1 text-sm">{n.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-2xl text-[color:var(--forest)] mb-4">Offres disponibles</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {promotions.slice(0, 3).map(p => (
            <Link key={p.id} to="/promotions" className="rounded-2xl overflow-hidden bg-card border border-border group">
              <div className="aspect-[16/10]"><img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" /></div>
              <div className="p-4">
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{p.offer}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Quick({ to, icon: Icon, label }: { to: any; icon: any; label: string }) {
  return (
    <Link to={to} className="p-4 rounded-2xl bg-card border border-border hover:border-[color:var(--forest)] transition flex flex-col items-center text-center gap-2">
      <Icon className="h-5 w-5 text-[color:var(--forest)]" />
      <span className="text-sm">{label}</span>
    </Link>
  );
}
