import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useStore, actions, findActivity, findCoach, ensureClientByEmail } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Check, ChevronRight, Lock, CreditCard, Ticket } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

const searchSchema = z.object({
  course: fallback(z.string(), "").default(""),
  slot: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/booking")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [
    { title: "Réservation — Amrani" },
    { name: "description", content: "Réservez votre séance de Yoga ou de Pilates au studio Amrani en quelques étapes." },
  ]}),
  component: Booking,
});

const STEPS = ["Cours", "Date & horaire", "Mode", "Récapitulatif", "Confirmation"];

function Booking() {
  const { user, isAuthenticated, hydrated } = useAuth();
  const { course, slot } = Route.useSearch();
  const nav = useNavigate();

  const activities = useStore(s => s.activities.filter(a => a.active));
  const schedule = useStore(s => s.schedule.filter(s => s.active));
  const packs = useStore(s => s.packs.filter(p => p.active));

  const [step, setStep] = useState(0);
  const [activityId, setActivityId] = useState<string | undefined>(course || undefined);
  const [scheduleId, setScheduleId] = useState<string | undefined>(slot || undefined);
  const [mode, setMode] = useState<"pack" | "session" | undefined>();
  const [packId, setPackId] = useState<string | undefined>();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      const params = new URLSearchParams();
      params.set("redirect", `/booking${course ? `?course=${course}${slot ? `&slot=${slot}` : ""}` : ""}`);
      nav({ to: "/auth", search: { redirect: params.get("redirect") || "/booking", mode: "login" } });
    }
  }, [hydrated, isAuthenticated, nav, course, slot]);

  useEffect(() => {
    if (activityId && step === 0) setStep(1);
    if (scheduleId && activityId && step <= 1) setStep(2);
  }, [activityId, scheduleId, step]);

  if (!hydrated) return <PublicLayout><div className="container-editorial py-24" /></PublicLayout>;
  if (!isAuthenticated) return (
    <PublicLayout>
      <section className="container-editorial py-24 max-w-md text-center">
        <Lock className="h-10 w-10 mx-auto text-[color:var(--forest)]" />
        <h1 className="font-serif text-3xl text-[color:var(--forest)] mt-4">Connexion requise</h1>
        <p className="text-sm text-muted-foreground mt-3">Connectez-vous ou créez votre compte pour réserver votre séance.</p>
        <Link to="/auth" search={{ redirect: "/booking", mode: "login" }} className="mt-6 inline-block"><Button className="rounded-full">Se connecter</Button></Link>
      </section>
    </PublicLayout>
  );

  const activity = activityId ? findActivity(activityId) : undefined;
  const currentSlot = scheduleId ? schedule.find(s => s.id === scheduleId) : undefined;
  const coach = currentSlot ? findCoach(currentSlot.coachId) : undefined;
  const pack = packId ? packs.find(p => p.id === packId) : undefined;

  const confirm = () => {
    if (!activity || !currentSlot || !user) return;
    const client = ensureClientByEmail(user.email, user.firstName, user.lastName, user.phone);
    actions.addBooking({
      clientId: client.id, clientName: client.name, clientEmail: client.email,
      scheduleId: currentSlot.id, activityId: activity.id, coachId: currentSlot.coachId, start: currentSlot.start,
      packId: mode === "pack" ? (packId ?? null) : null,
      status: "En attente", source: "Site web",
      paymentStatus: mode === "pack" ? "Payé" : "En attente",
      paymentMode: mode === "pack" ? "Pack" : "En ligne",
      amount: activity.price ?? 150,
    });
    setDone(true);
    setStep(4);
    toast.success("Réservation envoyée · en attente de validation");
  };

  return (
    <PublicLayout>
      <section className="container-editorial py-12 max-w-4xl">
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
              <h2 className="font-serif text-2xl text-[color:var(--forest)]">Choisissez le cours</h2>
              <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {activities.map(a => (
                  <button key={a.id} onClick={() => { setActivityId(a.id); setScheduleId(undefined); setStep(1); }}
                    className={`text-left p-4 rounded-xl border transition ${activityId === a.id ? "border-[color:var(--forest)] bg-[color:var(--sage)]/10" : "border-border hover:border-[color:var(--forest)]"}`}>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{a.category} · {a.level}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && activity && (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-[color:var(--forest)]">Date & horaire</h2>
                <button onClick={() => setStep(0)} className="text-xs text-muted-foreground hover:text-[color:var(--forest)]">Changer de cours</button>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">Cours sélectionné : <span className="text-foreground font-medium">{activity.name}</span></div>
              <div className="mt-6 grid gap-2">
                {schedule.filter(s => s.activityId === activityId).map(s => {
                  const c = findCoach(s.coachId)!;
                  const d = new Date(s.start);
                  const full = s.booked >= s.capacity;
                  return (
                    <button key={s.id} disabled={full} onClick={() => { setScheduleId(s.id); setStep(2); }}
                      className={`text-left p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${scheduleId === s.id ? "border-[color:var(--forest)] bg-[color:var(--sage)]/10" : "border-border hover:border-[color:var(--forest)]"}`}>
                      <div>
                        <div className="font-medium capitalize">{d.toLocaleDateString("fr", { weekday: "long", day: "2-digit", month: "long" })} · {d.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })}</div>
                        <div className="text-xs text-muted-foreground">avec {c.name} · {activity.duration} min · {activity.level}</div>
                      </div>
                      <span className={`text-xs ${full ? "text-destructive" : "text-[color:var(--forest)]"}`}>{full ? "Complet" : `${s.capacity - s.booked} places`}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && activity && currentSlot && (
            <div>
              <h2 className="font-serif text-2xl text-[color:var(--forest)]">Mode de réservation</h2>
              <p className="mt-2 text-sm text-muted-foreground">Utilisez un pack existant ou payez à la séance.</p>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <button onClick={() => setMode("pack")}
                  className={`text-left p-5 rounded-xl border ${mode === "pack" ? "border-[color:var(--forest)] bg-[color:var(--sage)]/10" : "border-border hover:border-[color:var(--forest)]"}`}>
                  <Ticket className="h-5 w-5 text-[color:var(--forest)]" />
                  <div className="mt-2 font-medium">Utiliser un pack</div>
                  <div className="text-xs text-muted-foreground mt-1">Sélectionnez l'un de vos packs actifs.</div>
                </button>
                <button onClick={() => setMode("session")}
                  className={`text-left p-5 rounded-xl border ${mode === "session" ? "border-[color:var(--forest)] bg-[color:var(--sage)]/10" : "border-border hover:border-[color:var(--forest)]"}`}>
                  <CreditCard className="h-5 w-5 text-[color:var(--forest)]" />
                  <div className="mt-2 font-medium">Payer à la séance</div>
                  <div className="text-xs text-muted-foreground mt-1">150 MAD — paiement au studio ou en ligne.</div>
                </button>
              </div>

              {mode === "pack" && (
                <div className="mt-6">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Choisissez le pack</div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {packs.map(p => (
                      <button key={p.id} onClick={() => setPackId(p.id)}
                        className={`text-left p-4 rounded-xl border ${packId === p.id ? "border-[color:var(--forest)] bg-[color:var(--sage)]/10" : "border-border hover:border-[color:var(--forest)]"}`}>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.sessions} séances · {p.price} MAD</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <Button variant="outline" className="rounded-full" onClick={() => setStep(1)}>Retour</Button>
                <Button className="rounded-full" disabled={!mode || (mode === "pack" && !packId)} onClick={() => setStep(3)}>Continuer</Button>
              </div>
            </div>
          )}

          {step === 3 && activity && currentSlot && coach && (
            <div>
              <h2 className="font-serif text-2xl text-[color:var(--forest)]">Récapitulatif</h2>
              <dl className="mt-6 divide-y divide-border">
                <Row k="Cours" v={activity.name} />
                <Row k="Coach" v={coach.name} />
                <Row k="Date" v={new Date(currentSlot.start).toLocaleDateString("fr", { weekday: "long", day: "2-digit", month: "long" })} />
                <Row k="Heure" v={new Date(currentSlot.start).toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })} />
                <Row k="Durée" v={`${activity.duration} min`} />
                <Row k="Niveau" v={activity.level} />
                <Row k="Places restantes" v={String(currentSlot.capacity - currentSlot.booked)} />
                <Row k="Mode" v={mode === "pack" ? `Pack : ${pack?.name ?? "-"}` : "Paiement à la séance · 150 MAD"} />
              </dl>
              <div className="mt-8 flex gap-3">
                <Button variant="outline" className="rounded-full" onClick={() => setStep(2)}>Modifier</Button>
                <Button className="rounded-full" onClick={confirm}>Confirmer la demande</Button>
              </div>
            </div>
          )}

          {done && step === 4 && (
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
        </div>
      </section>
    </PublicLayout>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between py-3"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium text-right">{v}</dd></div>;
}
