import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useStore, actions } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({ component: Page });

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function Page() {
  const settings = useStore(s => s.settings);
  const [s, setS] = useState(settings);
  const set = (patch: Partial<typeof s>) => setS(prev => ({ ...prev, ...patch }));
  const save = () => { actions.saveSettings(s); toast.success("Configuration enregistrée"); };
  const dirty = JSON.stringify(s) !== JSON.stringify(settings);

  return (
    <div>
      <PageHeader
        title="Configuration"
        subtitle="Paramètres du studio"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" disabled={!dirty} onClick={() => { setS(settings); toast.success("Modifications annulées"); }}>Annuler</Button>
            <Button disabled={!dirty} onClick={save}>Enregistrer</Button>
          </div>
        }
      />
      <Tabs defaultValue="studio">
        <TabsList className="flex flex-wrap h-auto gap-1">
          {[["studio", "Studio"], ["coords", "Coordonnées"], ["horaires", "Horaires"], ["reseaux", "Réseaux"], ["identite", "Identité"], ["reservations", "Réservations"], ["notif", "Notifications"]].map(([v, l]) => (
            <TabsTrigger key={v} value={v}>{l}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="studio" className="mt-6">
          <Card>
            <div><Label>Nom du studio</Label><Input value={s.studioName} onChange={e => set({ studioName: e.target.value })} className="mt-1" /></div>
            <div><Label>Description</Label><Textarea value={s.description} onChange={e => set({ description: e.target.value })} className="mt-1" /></div>
            <SaveBar dirty={dirty} onSave={save} />
          </Card>
        </TabsContent>

        <TabsContent value="coords" className="mt-6">
          <Card>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>Email</Label><Input value={s.email} onChange={e => set({ email: e.target.value })} className="mt-1" /></div>
              <div><Label>Téléphone</Label><Input value={s.phone} onChange={e => set({ phone: e.target.value })} className="mt-1" /></div>
            </div>
            <div><Label>Adresse</Label><Input value={s.address} onChange={e => set({ address: e.target.value })} className="mt-1" /></div>
            <SaveBar dirty={dirty} onSave={save} />
          </Card>
        </TabsContent>

        <TabsContent value="horaires" className="mt-6">
          <Card>
            {DAYS.map(d => (
              <div key={d} className="flex items-center justify-between gap-4">
                <span className="text-sm">{d}</span>
                <Input value={s.hours[d] ?? ""} onChange={e => set({ hours: { ...s.hours, [d]: e.target.value } })} className="max-w-xs" />
              </div>
            ))}
            <SaveBar dirty={dirty} onSave={save} />
          </Card>
        </TabsContent>

        <TabsContent value="reseaux" className="mt-6">
          <Card>
            <div><Label>Instagram</Label><Input value={s.instagram} onChange={e => set({ instagram: e.target.value })} className="mt-1" /></div>
            <div><Label>Facebook</Label><Input value={s.facebook} onChange={e => set({ facebook: e.target.value })} className="mt-1" /></div>
            <div><Label>TikTok</Label><Input value={s.tiktok} onChange={e => set({ tiktok: e.target.value })} className="mt-1" /></div>
            <SaveBar dirty={dirty} onSave={save} />
          </Card>
        </TabsContent>

        <TabsContent value="identite" className="mt-6">
          <Card>
            <div><Label>Logo (URL)</Label><Input value={s.logoUrl} onChange={e => set({ logoUrl: e.target.value })} className="mt-1" placeholder="https://…" /></div>
            <div><Label>Couleur principale</Label><Input value={s.primaryColor} onChange={e => set({ primaryColor: e.target.value })} className="mt-1" /></div>
            <SaveBar dirty={dirty} onSave={save} />
          </Card>
        </TabsContent>

        <TabsContent value="reservations" className="mt-6">
          <Card>
            <Row label="Validation manuelle" description="L'équipe confirme chaque réservation" checked={s.manualValidation} onChange={v => set({ manualValidation: v })} />
            <Row label="Liste d'attente" description="Autoriser les réservations sur cours complets" checked={s.waitlist} onChange={v => set({ waitlist: v })} />
            <Row label="Rappels automatiques" description="Notification 24h avant la séance" checked={s.reminders} onChange={v => set({ reminders: v })} />
            <div className="grid sm:grid-cols-2 gap-3 pt-3">
              <div><Label>Délai min. avant séance</Label><Input value={s.minDelay} onChange={e => set({ minDelay: e.target.value })} className="mt-1" /></div>
              <div><Label>Délai max. de réservation</Label><Input value={s.maxDelay} onChange={e => set({ maxDelay: e.target.value })} className="mt-1" /></div>
              <div><Label>Politique d'annulation</Label><Input value={s.cancelPolicy} onChange={e => set({ cancelPolicy: e.target.value })} className="mt-1" /></div>
              <div><Label>Capacité max. par cours</Label><Input type="number" value={s.maxCapacity} onChange={e => set({ maxCapacity: Number(e.target.value) })} className="mt-1" /></div>
            </div>
            <SaveBar dirty={dirty} onSave={save} />
          </Card>
        </TabsContent>

        <TabsContent value="notif" className="mt-6">
          <Card>
            <Row label="Notifications email" description="Confirmations et rappels par email" checked={s.emailNotifications} onChange={v => set({ emailNotifications: v })} />
            <Row label="Notifications push" description="Alertes dans l'espace client" checked={s.pushNotifications} onChange={v => set({ pushNotifications: v })} />
            <SaveBar dirty={dirty} onSave={save} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="max-w-2xl space-y-4 p-6 rounded-2xl bg-card border border-border">{children}</div>;
}

function SaveBar({ dirty, onSave }: { dirty: boolean; onSave: () => void }) {
  return <div className="pt-2"><Button disabled={!dirty} onClick={onSave}>Enregistrer</Button></div>;
}

function Row({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div><div className="text-sm font-medium">{label}</div><div className="text-xs text-muted-foreground">{description}</div></div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
