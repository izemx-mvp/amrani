import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Lotus } from "@/components/brand/Logo";

type Msg = { role: "user" | "ai"; text: string };

const SUGGESTIONS = [
  "Quels sont vos horaires ?",
  "Comment réserver un cours ?",
  "Quel pack me conseillez-vous ?",
];

const CANNED: Record<string, string> = {
  horaires: "Nous sommes ouverts du lundi au vendredi de 7h à 21h, samedi 8h–19h, dimanche 9h–14h.",
  réserver: "Depuis votre espace client ou la page Réservation, choisissez l'activité, le créneau et validez en 4 clics.",
  pack: "Pour découvrir, essayez la Séance découverte. Pour une pratique régulière, le Pack 10 séances est notre recommandation.",
  adresse: "12 rue des Oliviers, Casablanca. À deux pas du parc Sindibad.",
};

export function AIBubble() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Bonjour ✨ Bienvenue chez Amrani. Comment puis-je vous accompagner ?" },
  ]);
  const [input, setInput] = useState("");

  const send = (t: string) => {
    if (!t.trim()) return;
    const user: Msg = { role: "user", text: t };
    const key = Object.keys(CANNED).find(k => t.toLowerCase().includes(k));
    const ai: Msg = {
      role: "ai",
      text: key ? CANNED[key] : "Avec plaisir, je transmets votre message à l'équipe. Souhaitez-vous que je vous aide à réserver ?",
    };
    setMsgs(m => [...m, user, ai]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[color:var(--forest)] text-[color:var(--cream)] shadow-xl grid place-items-center hover:scale-105 transition"
        aria-label="Ouvrir l'agent IA"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-2rem))] bg-white rounded-2xl shadow-2xl border border-border overflow-hidden animate-fade-up">
          <div className="bg-[color:var(--forest)] text-[color:var(--cream)] px-4 py-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[color:var(--cream)] grid place-items-center">
              <Lotus className="h-5 w-5" color="var(--forest)" />
            </div>
            <div>
              <div className="font-serif text-lg leading-none">Amrani</div>
              <div className="text-[11px] opacity-70">Agent bien-être · en ligne</div>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto p-4 space-y-3 bg-[color:var(--cream)]">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`px-3 py-2 rounded-2xl text-sm max-w-[80%] ${m.role === "user" ? "bg-[color:var(--forest)] text-[color:var(--cream)]" : "bg-white border border-border"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {msgs.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full bg-white border border-border hover:border-[color:var(--forest)]">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={e => { e.preventDefault(); send(input); }} className="p-3 border-t border-border flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Écrivez votre message…" className="flex-1 px-3 py-2 rounded-full bg-secondary text-sm outline-none" />
            <button type="submit" className="h-9 w-9 rounded-full bg-[color:var(--forest)] text-[color:var(--cream)] grid place-items-center">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
