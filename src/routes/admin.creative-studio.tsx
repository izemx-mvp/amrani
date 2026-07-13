import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Sparkles, Copy, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/creative-studio")({ component: Page });

const TYPES = ["Publication", "Story", "Reel", "Carrousel", "Vidéo"];
const GOALS = ["Notoriété", "Engagement", "Promotion", "Réservation", "Présentation activité"];
const THEMES = ["Yoga", "Pilates", "Bien-être", "Lifestyle", "Conseils", "Promotion"];

const SAMPLES = [
  "🌿 Retrouvez votre équilibre chez Amrani.\nUn nouveau cours de Yin Yoga vous attend chaque mercredi soir. Postures tenues, esprit apaisé, énergie renouvelée.\n\n#YogaCasablanca #Wellness #Amrani",
  "✨ Ce mois-ci : Pack 10 séances à -20%.\nOffrez-vous le rythme de la régularité — 3 mois pour pratiquer à votre tempo.\nLien en bio pour réserver 🌸",
  "Bouger. Respirer. Recommencer.\nNos cours de Pilates Reformer transforment votre posture en quelques semaines. Petits groupes, précision, chaleur.",
];

function Page() {
  const [type, setType] = useState(TYPES[0]);
  const [goal, setGoal] = useState(GOALS[0]);
  const [theme, setTheme] = useState(THEMES[0]);
  const [prompt, setPrompt] = useState("Nouveau cours Yin Yoga du mercredi soir");
  const [result, setResult] = useState(SAMPLES[0]);
  const generate = () => {
    setResult(SAMPLES[Math.floor(Math.random() * SAMPLES.length)]);
    toast.success("Contenu généré");
  };
  return (
    <div>
      <PageHeader title="Studio Créatif IA" subtitle="Générez vos contenus réseaux sociaux" />
      <div className="grid lg:grid-cols-[300px_1fr_320px] gap-4">
        <div className="rounded-2xl bg-card border border-border p-5 space-y-5">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Type</div>
            <div className="grid gap-1.5">{TYPES.map(t => <button key={t} onClick={() => setType(t)} className={`text-left text-sm px-3 py-2 rounded-lg ${type === t ? "bg-[color:var(--forest)] text-[color:var(--cream)]" : "hover:bg-secondary"}`}>{t}</button>)}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Objectif</div>
            <div className="grid gap-1.5">{GOALS.map(t => <button key={t} onClick={() => setGoal(t)} className={`text-left text-sm px-3 py-2 rounded-lg ${goal === t ? "bg-[color:var(--sage)]/30" : "hover:bg-secondary"}`}>{t}</button>)}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Thème</div>
            <div className="flex flex-wrap gap-1.5">{THEMES.map(t => <button key={t} onClick={() => setTheme(t)} className={`text-xs px-3 py-1 rounded-full border ${theme === t ? "border-[color:var(--forest)] bg-[color:var(--forest)] text-[color:var(--cream)]" : "border-border"}`}>{t}</button>)}</div>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border p-6 flex flex-col">
          <Label>Idée de départ</Label>
          <Textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={2} className="mt-2" />
          <div className="mt-4 flex gap-2">
            <Button onClick={generate}><Sparkles className="h-4 w-4 mr-1" />Générer</Button>
            <Button variant="outline" onClick={generate}><RefreshCcw className="h-4 w-4 mr-1" />Régénérer</Button>
          </div>
          <div className="mt-6 flex-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Résultat</div>
            <Textarea value={result} onChange={e => setResult(e.target.value)} rows={12} className="font-serif text-base leading-relaxed" />
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => { navigator.clipboard.writeText(result); toast.success("Copié"); }}><Copy className="h-4 w-4 mr-1" />Copier</Button>
            <Button variant="ghost" onClick={() => toast.success("Enregistré dans la bibliothèque")}>Enregistrer</Button>
          </div>
        </div>
        <div className="rounded-2xl bg-[color:var(--cream)] border border-border p-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Prévisualisation · {type}</div>
          <div className="aspect-square rounded-2xl bg-[color:var(--forest)] text-[color:var(--cream)] p-6 flex items-end">
            <div className="font-serif text-2xl leading-tight">{result.split("\n")[0]}</div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">Objectif : {goal} · Thème : {theme}</div>
        </div>
      </div>
    </div>
  );
}
