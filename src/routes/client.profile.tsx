import { createFileRoute } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/client/profile")({ component: Page });

function Page() {
  return (
    <div>
      <h1 className="font-serif text-4xl text-[color:var(--forest)]">Mon profil</h1>
      <form onSubmit={e => { e.preventDefault(); toast.success("Profil mis à jour"); }} className="mt-6 max-w-xl space-y-4 p-8 rounded-2xl bg-card border border-border">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>Prénom</Label><Input defaultValue="Nour" className="mt-1" /></div>
          <div><Label>Nom</Label><Input defaultValue="Alaoui" className="mt-1" /></div>
        </div>
        <div><Label>Email</Label><Input type="email" defaultValue="nour.alaoui@mail.com" className="mt-1" /></div>
        <div><Label>Téléphone</Label><Input defaultValue="+212 6 61 00 00 00" className="mt-1" /></div>
        <div><Label>Anniversaire</Label><Input type="date" defaultValue="1993-05-14" className="mt-1" /></div>
        <div><Label>Préférences</Label><Input defaultValue="Yoga Vinyasa, Pilates Reformer" className="mt-1" /></div>
        <Button className="rounded-full">Enregistrer</Button>
      </form>
    </div>
  );
}
