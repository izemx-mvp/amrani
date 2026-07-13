import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { activities, schedule, packs, findActivity, findCoach } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/booking")({
  head: () => ({ meta: [{ title: "Réservation — Amrani" }] }),
  component: Booking,
});

const STEPS = ["Activité", "Cours", "Date", "Horaire", "Pack", "Vérification", "Confirmation"];

function Booking() {
  const [step, setStep] = useState(0);
  const [activityId, setActivityId] = useState<string>();
  const [scheduleId, setScheduleId] = useState<string>();
  const [packId, setPackId] = useState<string>();
  const [done, setDone] = useState(false);

  const activity = activityId ? findActivity(activityId) : undefined;
  const slot = scheduleId ? schedule.find(s => s.id === scheduleId) : undefined;
  const coach = slot ? findCoach(slot.coachId) : undefined;
  const pack = packId ? packs.find(p => p.id === packId) : undefined;

  const confirm = () => {
    setDone(true);
    setStep(6);
    toast.success("Réservation envoyée · en attente de validation");
  };

  return (
    <PublicLayout>
      <section className="container-editorial py-16 max-w-4xl">
        <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--forest)]/70">Réservation</span>
        <h1 className="font-serif text-4xl md:text-5xl text-[color:var(--forest)] mt-3">Une nouvelle séance ?</h1>

        <div className="mt-10 flex items-center gap-2 text-xs overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <span className={`h-6 w-6 rounded-full grid place-items-center ${i <= step ? "bg-[color:var(--forest)] text-[color:var(--cream)]" : "bg-secondary text-muted-foreground"}`}>{i + 1}</span>
              <span className={i === step ? "font-medium text-[color:var(--forest)]" : "text-muted-foreground"}>{s}</span>
              {i < STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <div className="mt-10 bg-card border border-border rounded-3xl p-8">
          {step === 0 && (
            <div>
              <h2 className="font-serif text-2xl text-[color:var(--forest)]">Choisissez l'activité</h2>
              <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {activities.map(a => (
                  <button key={a.id} onClick={() => { setActivityId(a.id); setStep(1); }} className={`text-left p-4 rounded-xl border transition ${activityId === a.id ? "border-[color:var(--forest)] bg-[color:var(--sage)]/10" : "border-border hover:border-[color:var(--forest)]"}`}>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{a.category} · {a.level}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 1 && (
            <div>
              <h2 className="font-serif text-2xl text-[color:var(--forest)]">Choisissez le cours</h2>
              <div className="mt-6 grid gap-2">
                {schedule.filter(s => s.activityId === activityId).map(s => {
                  const c = findCoach(s.coachId)!;
                  const d = new Date(s.start);
                  return (
                    <button key={s.id} onClick={() => { setScheduleId(s.id); setStep(3); }} className={`text-left p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 ${scheduleId === s.id ? "border-[color:var(--forest)] bg-[color:var(--sage)]/10" : "border-border hover:border-[color:var(--forest)]"}`}>
                      <div>
                        <div className="font-medium">{d.toLocaleDateString("fr", { weekday: "long", day: "2-digit", month: "long" })} · {d.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}</div>
                        <div className="text-xs text-muted-foreground">avec {c.name}</div>
                      </div>
                      <span className="text-xs text-[color:var(--forest)]">{s.capacity - s.booked} places</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {step === 3 && slot && (
            <div>
              <h2 className="font-serif text-2xl text-[color:var(--forest)]">Utilisez un pack</h2>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {packs.map(p => (
                  <button key={p.id} onClick={() => { setPackId(p.id); setStep(5); }} className={`text-left p-4 rounded-xl border ${packId === p.id ? "border-[color:var(--forest)] bg-[color:var(--sage)]/10" : "border-border hover:border-[color:var(--forest)]"}`}>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.sessions} séances · {p.price} MAD</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 5 && activity && slot && coach && pack && (
            <div>
              <h2 className="font-serif text-2xl text-[color:var(--forest)]">Vérifiez votre réservation</h2>
              <dl className="mt-6 divide-y divide-border">
                <Row k="Activité" v={activity.name} />
                <Row k="Coach" v={coach.name} />
                <Row k="Date" v={new Date(slot.start).toLocaleDateString("fr", { weekday: "long", day: "2-digit", month: "long" })} />
                <Row k="Heure" v={new Date(slot.start).toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })} />
                <Row k="Durée" v={`${activity.duration} min`} />
                <Row k="Niveau" v={activity.level} />
                <Row k="Places restantes" v={String(slot.capacity - slot.booked)} />
                <Row k="Pack utilisé" v={pack.name} />
              </dl>
              <div className="mt-8 flex gap-3">
                <Button variant="outline" className="rounded-full" onClick={() => setStep(3)}>Modifier</Button>
                <Button className="rounded-full" onClick={confirm}>Confirmer la demande</Button>
              </div>
            </div>
          )}
          {done && step === 6 && (
            <div className="text-center py-8">
              <div className="mx-auto h-14 w-14 rounded-full bg-[color:var(--sage)]/30 text-[color:var(--forest)] grid place-items-center"><Check className="h-6 w-6" /></div>
              <h2 className="font-serif text-3xl text-[color:var(--forest)] mt-6">Merci !</h2>
              <p className="mt-3 text-foreground/70 max-w-md mx-auto">Votre demande de réservation a bien été envoyée. Statut : <span className="font-medium text-[color:var(--forest)]">En attente de validation</span>. Vous recevrez une notification dès confirmation.</p>
              <div className="mt-8 flex justify-center gap-3">
                <Link to="/client/bookings"><Button className="rounded-full">Voir mes réservations</Button></Link>
                <Link to="/"><Button variant="outline" className="rounded-full">Retour à l'accueil</Button></Link>
              </div>
            </div>
          )}
          {[2, 4].includes(step) && (
            <div className="text-center text-muted-foreground py-6">Étape sautée dans cette démo, retour à la précédente.
              <div className="mt-4"><Button variant="outline" onClick={() => setStep(step - 1)}>Retour</Button></div>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between py-3"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>;
}
