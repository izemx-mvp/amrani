import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { aiConversations, clients } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/messages")({ component: Page });

function Page() {
  return (
    <div>
      <PageHeader title="Messages" subtitle="Conversations clients et Agent IA" />
      <div className="grid lg:grid-cols-[320px_1fr] gap-4 h-[70vh]">
        <div className="rounded-2xl bg-card border border-border overflow-y-auto">
          {[...aiConversations.map(c => ({ id: c.id, name: c.client, last: c.last, when: c.when })), ...clients.slice(0, 6).map(c => ({ id: c.id, name: c.name, last: "Bonjour, une question…", when: "hier" }))].map(m => (
            <button key={m.id} className="w-full text-left p-4 border-b border-border hover:bg-[color:var(--cream)]/60">
              <div className="flex justify-between text-sm"><span className="font-medium">{m.name}</span><span className="text-xs text-muted-foreground">{m.when}</span></div>
              <div className="text-xs text-muted-foreground mt-1 truncate">{m.last}</div>
            </button>
          ))}
        </div>
        <div className="rounded-2xl bg-card border border-border flex flex-col">
          <div className="p-4 border-b border-border font-medium">Rania Z.</div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            <Bubble side="them">Bonjour, à quelle heure est le Reformer demain ?</Bubble>
            <Bubble side="us">Bonjour Rania ! Demain à 10h avec Leila, il reste 1 place.</Bubble>
            <Bubble side="them">Parfait, je réserve.</Bubble>
          </div>
          <div className="p-4 border-t border-border">
            <input placeholder="Écrivez un message…" className="w-full px-4 py-2 rounded-full bg-secondary text-sm outline-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ side, children }: { side: "us" | "them"; children: any }) {
  return <div className={`flex ${side === "us" ? "justify-end" : "justify-start"}`}><div className={`px-3 py-2 rounded-2xl text-sm max-w-[70%] ${side === "us" ? "bg-[color:var(--forest)] text-[color:var(--cream)]" : "bg-secondary"}`}>{children}</div></div>;
}
