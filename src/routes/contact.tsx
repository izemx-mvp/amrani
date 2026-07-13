import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapPin, Phone, Mail, MessageCircle, Instagram, Facebook, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Amrani" }] }),
  component: Contact,
});

function Contact() {
  return (
    <PublicLayout>
      <section className="container-editorial py-16 grid md:grid-cols-2 gap-16">
        <div>
          <span className="text-xs tracking-[0.3em] uppercase text-[color:var(--forest)]/70">Contact</span>
          <h1 className="font-serif text-5xl md:text-6xl text-[color:var(--forest)] mt-3">Écrivez-nous.</h1>
          <p className="mt-4 text-foreground/70">Une question, un projet, une envie ? Notre équipe vous répond avec plaisir.</p>
          <div className="mt-10 space-y-5">
            <Info icon={MapPin} label="Adresse" value="12 rue des Oliviers, Casablanca" />
            <Info icon={Phone} label="Téléphone" value="+212 5 22 00 00 00" />
            <Info icon={MessageCircle} label="WhatsApp" value="+212 6 61 00 00 00" />
            <Info icon={Mail} label="Email" value="hello@amrani-studio.com" />
            <Info icon={Clock} label="Horaires" value="Lun–ven 7h–21h · Sam 8h–19h · Dim 9h–14h" />
          </div>
          <div className="mt-8 flex gap-3">
            <a href="#" className="p-3 rounded-full border border-border hover:border-[color:var(--forest)]"><Instagram className="h-4 w-4" /></a>
            <a href="#" className="p-3 rounded-full border border-border hover:border-[color:var(--forest)]"><Facebook className="h-4 w-4" /></a>
          </div>
        </div>
        <form className="space-y-4 p-8 rounded-3xl bg-card border border-border" onSubmit={e => { e.preventDefault(); toast.success("Message envoyé, à très vite !"); (e.target as HTMLFormElement).reset(); }}>
          <div><Label>Nom</Label><Input required className="mt-1" placeholder="Votre nom" /></div>
          <div><Label>Email</Label><Input required type="email" className="mt-1" placeholder="vous@email.com" /></div>
          <div><Label>Téléphone</Label><Input className="mt-1" placeholder="+212 ..." /></div>
          <div><Label>Sujet</Label><Input className="mt-1" placeholder="Sujet du message" /></div>
          <div><Label>Message</Label><Textarea required rows={5} className="mt-1" placeholder="Votre message" /></div>
          <Button className="rounded-full w-full">Envoyer</Button>
        </form>
      </section>
      <section className="container-editorial pb-24">
        <div className="aspect-[16/6] rounded-3xl overflow-hidden bg-[color:var(--sage)]/20 grid place-items-center text-[color:var(--forest)]/60">
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto" />
            <div className="mt-2 text-sm">Carte interactive · 12 rue des Oliviers, Casablanca</div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 shrink-0 rounded-full bg-[color:var(--sage)]/20 grid place-items-center text-[color:var(--forest)]"><Icon className="h-4 w-4" /></div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="text-foreground mt-0.5">{value}</div>
      </div>
    </div>
  );
}
