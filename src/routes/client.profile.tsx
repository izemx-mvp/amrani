import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth, updateUser } from "@/lib/auth";
import { actions, getState } from "@/lib/store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/client/profile")({ component: Page });

const PREFS_KEY = "amrani.profile.extra";

function Page() {
  const { user, hydrated } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", birthday: "", prefs: "" });

  useEffect(() => {
    if (!hydrated) return;
    let extra = { birthday: "", prefs: "" };
    try { extra = { ...extra, ...JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}") }; } catch { /* noop */ }
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      ...extra,
    });
  }, [hydrated, user]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim()) { toast.error("Prénom et email requis"); return; }
    updateUser({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone });
    localStorage.setItem(PREFS_KEY, JSON.stringify({ birthday: form.birthday, prefs: form.prefs }));
    const client = getState().clients.find(c => c.email.toLowerCase() === (user?.email ?? "").toLowerCase());
    if (client) {
      actions.updateClient(client.id, {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
      });
    }
    toast.success("Profil mis à jour");
  };

  return (
    <div>
      <h1 className="font-serif text-4xl text-[color:var(--forest)]">Mon profil</h1>
      <form onSubmit={submit} className="mt-6 max-w-xl space-y-4 p-8 rounded-2xl bg-card border border-border">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Prénom</Label><Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="mt-1" /></div>
          <div><Label>Nom</Label><Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="mt-1" /></div>
        </div>
        <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1" /></div>
        <div><Label>Téléphone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1" /></div>
        <div><Label>Anniversaire</Label><Input type="date" value={form.birthday} onChange={e => setForm({ ...form, birthday: e.target.value })} className="mt-1" /></div>
        <div><Label>Préférences</Label><Input value={form.prefs} onChange={e => setForm({ ...form, prefs: e.target.value })} className="mt-1" placeholder="Yoga Vinyasa, Pilates Reformer" /></div>
        <Button type="submit" className="rounded-full">Enregistrer</Button>
      </form>
    </div>
  );
}
