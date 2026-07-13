import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { useStore, actions, findActivity, findCoach, coaches, type ScheduleSlot } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/planning")({ component: Page });

const VIEWS = ["Jour", "Semaine", "Mois", "Liste"] as const;

function Page() {
  const schedule = useStore(s => s.schedule);
  const activities = useStore(s => s.activities);
  const bookings = useStore(s => s.bookings);
  const [view, setView] = useState<(typeof VIEWS)[number]>("Semaine");
  const [edit, setEdit] = useState<ScheduleSlot | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

  const detailSlot = detail ? schedule.find(s => s.id === detail) : null;

  return (
    <div>
      <PageHeader title="Planning" subtitle="Un cours ajouté ici est immédiatement réservable côté client" actions={
        <Button onClick={() => setEdit(blank(activities[0]?.id ?? "", coaches[0].id))}><Plus className="h-4 w-4 mr-1" />Ajouter un cours</Button>
      } />
      <div className="flex gap-1 p-1 bg-secondary rounded-lg w-fit mb-6">
        {VIEWS.map(v => <button key={v} onClick={() => setView(v)} className={`px-4 py-1.5 rounded-md text-sm ${view === v ? "bg-white shadow-sm" : "text-muted-foreground"}`}>{v}</button>)}
      </div>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-border">
          {Array.from({ length: 7 }).map((_, i) => {
            const day = new Date(); day.setDate(day.getDate() + i);
            const items = schedule.filter(s => new Date(s.start).toDateString() === day.toDateString()).sort((a, b) => a.start.localeCompare(b.start));
            return (
              <div key={i} className="bg-card p-3 min-h-[240px]">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{day.toLocaleDateString("fr", { weekday: "short" })}</div>
                <div className="font-serif text-2xl text-[color:var(--forest)]">{day.getDate()}</div>
                <div className="mt-3 space-y-2">
                  {items.map(s => {
                    const a = findActivity(s.activityId);
                    const c = findCoach(s.coachId);
                    const d = new Date(s.start);
                    return (
                      <button key={s.id} onClick={() => setDetail(s.id)} className={`w-full text-left p-2 rounded-lg text-xs transition ${s.active ? "bg-[color:var(--sage)]/20 hover:bg-[color:var(--sage)]/30" : "bg-secondary opacity-60"}`}>
                        <div className="font-medium text-[color:var(--forest)]">{d.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" })} · {a?.name}</div>
                        <div className="text-muted-foreground">{c?.name} · {s.booked}/{s.capacity}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {edit && <SlotDialog slot={edit} activities={activities} onClose={() => setEdit(null)} />}
      {detailSlot && (
        <Dialog open onOpenChange={o => !o && setDetail(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="font-serif text-2xl text-[color:var(--forest)]">Détail du cours</DialogTitle></DialogHeader>
            <div className="space-y-2 text-sm">
              <Row k="Activité" v={findActivity(detailSlot.activityId)?.name ?? "—"} />
              <Row k="Coach" v={findCoach(detailSlot.coachId)?.name ?? "—"} />
              <Row k="Date" v={new Date(detailSlot.start).toLocaleString("fr")} />
              <Row k="Capacité" v={`${detailSlot.booked}/${detailSlot.capacity}`} />
              <Row k="Salle" v={detailSlot.room ?? "—"} />
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Participants ({bookings.filter(b => b.scheduleId === detailSlot.id).length})</div>
              <ul className="space-y-1 text-sm max-h-40 overflow-y-auto">
                {bookings.filter(b => b.scheduleId === detailSlot.id).map(b => (
                  <li key={b.id} className="flex justify-between p-2 bg-secondary/50 rounded"><span>{b.clientName}</span><span className="text-xs text-muted-foreground">{b.status}</span></li>
                ))}
                {bookings.filter(b => b.scheduleId === detailSlot.id).length === 0 && <li className="text-muted-foreground text-xs">Aucun participant.</li>}
              </ul>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => { if (confirm("Supprimer ce cours ?")) { actions.deleteSlot(detailSlot.id); toast.success("Supprimé"); setDetail(null); } }}><Trash2 className="h-4 w-4 mr-1" />Supprimer</Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setEdit(detailSlot); setDetail(null); }}>Modifier</Button>
                <Button onClick={() => setDetail(null)}>Fermer</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function blank(activityId: string, coachId: string): ScheduleSlot {
  const d = new Date(); d.setHours(9, 0, 0, 0); d.setDate(d.getDate() + 1);
  return { id: `slot-${Date.now()}`, activityId, coachId, start: d.toISOString(), capacity: 12, booked: 0, room: "Salle A", active: true };
}

function SlotDialog({ slot, activities, onClose }: { slot: ScheduleSlot; activities: any[]; onClose: () => void }) {
  const [s, setS] = useState(slot);
  const dt = new Date(s.start);
  const dateStr = dt.toISOString().slice(0, 16);
  const save = () => { actions.saveSlot(s); toast.success("Cours enregistré · disponible côté client"); onClose(); };
  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="font-serif text-2xl text-[color:var(--forest)]">{slot.booked > 0 ? "Modifier le cours" : "Nouveau cours"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <F label="Activité">
            <select value={s.activityId} onChange={e => setS({ ...s, activityId: e.target.value })} className="w-full h-10 px-3 rounded-md border border-border">
              {activities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </F>
          <F label="Coach">
            <select value={s.coachId} onChange={e => setS({ ...s, coachId: e.target.value })} className="w-full h-10 px-3 rounded-md border border-border">
              {coaches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </F>
          <F label="Date & heure"><Input type="datetime-local" value={dateStr} onChange={e => setS({ ...s, start: new Date(e.target.value).toISOString() })} /></F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Capacité"><Input type="number" value={s.capacity} onChange={e => setS({ ...s, capacity: Number(e.target.value) })} /></F>
            <F label="Salle"><Input value={s.room ?? ""} onChange={e => setS({ ...s, room: e.target.value })} /></F>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4"><Button variant="ghost" onClick={onClose}>Annuler</Button><Button onClick={save}>Enregistrer</Button></div>
      </DialogContent>
    </Dialog>
  );
}
function F({ label, children }: any) { return <div><label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label><div className="mt-1">{children}</div></div>; }
function Row({ k, v }: any) { return <div className="flex justify-between py-1"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>; }
