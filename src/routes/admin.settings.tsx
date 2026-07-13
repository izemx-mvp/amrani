import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({ component: Page });

function Page() {
  return (
    <div>
      <PageHeader title="Configuration" subtitle="Paramètres du studio" />
      <Tabs defaultValue="studio">
        <TabsList className="flex flex-wrap h-auto gap-1">
          {["studio", "coords", "horaires", "reseaux", "identite", "reservations", "notif"].map(t => <TabsTrigger key={t} value={t}>{t}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="studio" className="mt-6">
          <form onSubmit={e => { e.preventDefault(); toast.success("Enregistré"); }} className="max-w-2xl space-y-4 p-6 rounded-2xl bg-card border border-border">
            <div><Label>Nom du studio</Label><Input defaultValue="Amrani" className="mt-1" /></div>
            <div><Label>Description</Label><Textarea defaultValue="Un espace dédié au mouvement, à l'énergie et à votre bien-être." className="mt-1" /></div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>Email</Label><Input defaultValue="hello@amrani-studio.com" className="mt-1" /></div>
              <div><Label>Téléphone</Label><Input defaultValue="+212 5 22 00 00 00" className="mt-1" /></div>
            </div>
            <div><Label>Adresse</Label><Input defaultValue="12 rue des Oliviers, Casablanca" className="mt-1" /></div>
            <Button>Enregistrer</Button>
          </form>
        </TabsContent>
        <TabsContent value="reservations" className="mt-6">
          <div className="max-w-2xl space-y-3 p-6 rounded-2xl bg-card border border-border">
            <Row label="Validation manuelle" description="L'équipe confirme chaque réservation" />
            <Row label="Liste d'attente" description="Autoriser les réservations sur cours complets" />
            <Row label="Rappels automatiques" description="Notification 24h avant la séance" />
            <div className="grid sm:grid-cols-2 gap-3 pt-3">
              <div><Label>Délai min. avant séance</Label><Input defaultValue="2h" className="mt-1" /></div>
              <div><Label>Délai max. de réservation</Label><Input defaultValue="30 j" className="mt-1" /></div>
              <div><Label>Politique d'annulation</Label><Input defaultValue="6h avant · gratuit" className="mt-1" /></div>
              <div><Label>Capacité max. par cours</Label><Input defaultValue="14" className="mt-1" /></div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="horaires" className="mt-6">
          <div className="max-w-2xl p-6 rounded-2xl bg-card border border-border space-y-2">
            {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"].map((d, i) => (
              <div key={d} className="flex items-center justify-between">
                <span>{d}</span>
                <Input defaultValue={i < 5 ? "07:00 – 21:00" : i === 5 ? "08:00 – 19:00" : "09:00 – 14:00"} className="max-w-xs" />
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="coords" className="mt-6"><Placeholder text="Coordonnées & contact" /></TabsContent>
        <TabsContent value="reseaux" className="mt-6"><Placeholder text="Liens Instagram, Facebook, TikTok…" /></TabsContent>
        <TabsContent value="identite" className="mt-6"><Placeholder text="Logo, couleurs, favicon" /></TabsContent>
        <TabsContent value="notif" className="mt-6"><Placeholder text="Emails et notifications push" /></TabsContent>
      </Tabs>
    </div>
  );
}

function Row({ label, description }: { label: string; description: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <div><div className="text-sm font-medium">{label}</div><div className="text-xs text-muted-foreground">{description}</div></div>
      <Switch defaultChecked />
    </div>
  );
}
function Placeholder({ text }: { text: string }) {
  return <div className="p-6 rounded-2xl bg-card border border-border text-muted-foreground">{text}</div>;
}
