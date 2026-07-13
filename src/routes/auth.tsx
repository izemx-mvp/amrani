import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lotus } from "@/components/brand/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Connexion — Amrani" }] }),
  component: Auth,
});

function Auth() {
  const nav = useNavigate();
  const go = (e: React.FormEvent) => { e.preventDefault(); nav({ to: "/client" }); };
  return (
    <PublicLayout>
      <section className="container-editorial py-16 max-w-md">
        <div className="text-center">
          <Lotus className="h-10 w-10 mx-auto" color="var(--forest)" />
          <h1 className="font-serif text-4xl text-[color:var(--forest)] mt-4">Bienvenue chez Amrani</h1>
          <p className="text-sm text-muted-foreground mt-2">Accédez à votre espace client.</p>
        </div>
        <Tabs defaultValue="login" className="mt-10">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-6">
            <form onSubmit={go} className="space-y-4 p-6 rounded-2xl bg-card border border-border">
              <div><Label>Email</Label><Input required type="email" defaultValue="nour@amrani.com" className="mt-1" /></div>
              <div><Label>Mot de passe</Label><Input required type="password" defaultValue="••••••••" className="mt-1" /></div>
              <div className="text-right text-xs"><Link to="/auth" className="text-muted-foreground hover:text-[color:var(--forest)]">Mot de passe oublié ?</Link></div>
              <Button className="w-full rounded-full">Se connecter</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup" className="mt-6">
            <form onSubmit={go} className="space-y-4 p-6 rounded-2xl bg-card border border-border">
              <div><Label>Prénom & Nom</Label><Input required className="mt-1" /></div>
              <div><Label>Email</Label><Input required type="email" className="mt-1" /></div>
              <div><Label>Téléphone</Label><Input className="mt-1" /></div>
              <div><Label>Mot de passe</Label><Input required type="password" className="mt-1" /></div>
              <Button className="w-full rounded-full">Créer mon compte</Button>
            </form>
          </TabsContent>
        </Tabs>
      </section>
    </PublicLayout>
  );
}
