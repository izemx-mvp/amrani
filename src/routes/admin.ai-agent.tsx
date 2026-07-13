import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/ai-agent")({ component: Page });

const TONES = ["Chaleureuse", "Bienveillante", "Professionnelle", "Élégante", "Dynamique", "Concise"];

function Page() {
  return (
    <div>
      <PageHeader title="Agent IA" subtitle="Configurez l'assistant service client" />
      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        <form onSubmit={e => { e.preventDefault(); toast.success("Configuration enregistrée"); }} className="space-y-5 p-6 rounded-2xl bg-card border border-border">
          <div><Label>Nom de l'Agent</Label><Input defaultValue="Amrani" className="mt-1" /></div>
          <div><Label>Message d'accueil</Label><Textarea rows={3} defaultValue="Bonjour ✨ Bienvenue chez Amrani. Comment puis-je vous accompagner ?" className="mt-1" /></div>
          <div>
            <Label>Tonalité</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {TONES.map((t, i) => <label key={t} className="text-sm px-3 py-1.5 rounded-full border border-border cursor-pointer has-[:checked]:border-[color:var(--forest)] has-[:checked]:bg-[color:var(--sage)]/20"><input type="radio" name="tone" defaultChecked={i === 0} className="hidden" />{t}</label>)}
            </div>
          </div>
          <div><Label>Langue</Label><Input defaultValue="Français" className="mt-1" /></div>
          <div><Label>Instructions système</Label><Textarea rows={5} defaultValue="Réponds toujours avec chaleur et concision. Guide vers la réservation quand pertinent. Ne promets jamais ce que le studio ne propose pas." className="mt-1" /></div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div>
              <div className="text-sm font-medium">Transfert WhatsApp</div>
              <div className="text-xs text-muted-foreground">Escalade automatique en cas d'échec</div>
            </div>
            <Switch defaultChecked />
          </div>
          <Button>Enregistrer</Button>
        </form>
        <div className="rounded-2xl bg-[color:var(--forest)] text-[color:var(--cream)] p-6 h-fit">
          <div className="text-xs uppercase tracking-widest opacity-70">Tester mon agent</div>
          <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto">
            <div className="px-3 py-2 rounded-2xl bg-white/10 text-sm">Bonjour ✨ Comment puis-je vous aider ?</div>
            <div className="px-3 py-2 rounded-2xl bg-[color:var(--cream)] text-[color:var(--forest)] text-sm ml-auto w-fit">Quels sont vos horaires ?</div>
            <div className="px-3 py-2 rounded-2xl bg-white/10 text-sm">Lundi–vendredi 7h–21h, samedi 8h–19h, dimanche 9h–14h.</div>
          </div>
          <input placeholder="Test un message…" className="mt-4 w-full px-3 py-2 rounded-full bg-white/10 text-sm outline-none placeholder:text-white/50" />
        </div>
      </div>
    </div>
  );
}
