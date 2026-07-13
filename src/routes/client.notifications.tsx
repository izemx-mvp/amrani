import { createFileRoute } from "@tanstack/react-router";
import { notifications } from "@/lib/mock-data";

export const Route = createFileRoute("/client/notifications")({ component: Page });

function Page() {
  return (
    <div>
      <h1 className="font-serif text-4xl text-[color:var(--forest)]">Notifications</h1>
      <div className="mt-6 space-y-2">
        {notifications.map(n => (
          <div key={n.id} className={`p-4 rounded-xl border ${n.read ? "bg-card border-border" : "bg-[color:var(--sage)]/10 border-[color:var(--sage)]/40"}`}>
            <div className="flex justify-between text-xs text-muted-foreground"><span className="font-medium text-foreground">{n.title}</span><span>{n.date}</span></div>
            <div className="mt-1 text-sm">{n.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
