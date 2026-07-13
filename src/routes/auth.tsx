import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lotus } from "@/components/brand/Logo";
import { signIn } from "@/lib/auth";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Lock, Mail, ShieldCheck } from "lucide-react";

const searchSchema = z.object({
  redirect: fallback(z.string(), "/client").default("/client"),
  mode: fallback(z.string(), "login").default("login"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({ meta: [
    { title: "Connexion — Amrani" },
    { name: "description", content: "Connectez-vous ou créez votre compte pour réserver vos séances de Yoga et Pilates." },
  ]}),
  component: Auth,
});

function Auth() {
  const { redirect, mode } = Route.useSearch();
  const nav = useNavigate();
  const [view, setView] = useState<"tabs" | "forgot" | "reset" | "verify">("tabs");
  const [email, setEmail] = useState("");

  const finish = (name: string) => {
    signIn({ firstName: name.split(" ")[0] || "Nour", lastName: name.split(" ").slice(1).join(" ") || "A.", email: email || "nour@amrani.com" });
    toast.success(`Bienvenue ${name.split(" ")[0] || "chez Amrani"} ✿`);
    nav({ to: redirect as any });
  };

  return (
    <PublicLayout>
      <section className="container-editorial py-12 max-w-md">
        <div className="text-center">
          <Lotus className="h-10 w-10 mx-auto" color="var(--forest)" />
          <h1 className="font-serif text-4xl text-[color:var(--forest)] mt-4">Bienvenue chez Amrani</h1>
          {redirect !== "/client" ? (
            <p className="text-sm text-foreground/80 mt-3 p-3 rounded-xl bg-[color:var(--sage)]/20 border border-[color:var(--sage)]/40">
              Connectez-vous ou créez votre compte pour réserver votre séance.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-2">Accédez à votre espace client.</p>
          )}
        </div>

        {view === "tabs" && (
          <Tabs defaultValue={mode === "signup" ? "signup" : "login"} className="mt-8">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Créer un compte</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <form onSubmit={(e) => { e.preventDefault(); finish("Nour A."); }} className="space-y-4 p-6 rounded-2xl bg-card border border-border">
                <Field label="Email" icon={<Mail className="h-4 w-4" />}>
                  <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@email.com" />
                </Field>
                <Field label="Mot de passe" icon={<Lock className="h-4 w-4" />}>
                  <Input required type="password" placeholder="••••••••" />
                </Field>
                <div className="text-right text-xs">
                  <button type="button" onClick={() => setView("forgot")} className="text-muted-foreground hover:text-[color:var(--forest)]">Mot de passe oublié ?</button>
                </div>
                <Button className="w-full rounded-full">Se connecter</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <SignupForm onDone={finish} setEmail={setEmail} onVerify={() => setView("verify")} />
            </TabsContent>
          </Tabs>
        )}

        {view === "forgot" && (
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Email de réinitialisation envoyé"); setView("reset"); }} className="mt-8 space-y-4 p-6 rounded-2xl bg-card border border-border">
            <h2 className="font-serif text-2xl text-[color:var(--forest)]">Mot de passe oublié</h2>
            <p className="text-sm text-muted-foreground">Entrez votre email, nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
            <Field label="Email" icon={<Mail className="h-4 w-4" />}><Input required type="email" /></Field>
            <Button className="w-full rounded-full">Envoyer le lien</Button>
            <button type="button" onClick={() => setView("tabs")} className="w-full text-xs text-muted-foreground hover:text-[color:var(--forest)]">← Retour à la connexion</button>
          </form>
        )}

        {view === "reset" && (
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Mot de passe mis à jour"); setView("tabs"); }} className="mt-8 space-y-4 p-6 rounded-2xl bg-card border border-border">
            <h2 className="font-serif text-2xl text-[color:var(--forest)]">Nouveau mot de passe</h2>
            <Field label="Nouveau mot de passe" icon={<Lock className="h-4 w-4" />}><Input required type="password" /></Field>
            <Field label="Confirmez" icon={<Lock className="h-4 w-4" />}><Input required type="password" /></Field>
            <Button className="w-full rounded-full">Mettre à jour</Button>
          </form>
        )}

        {view === "verify" && (
          <div className="mt-8 space-y-4 p-6 rounded-2xl bg-card border border-border text-center">
            <ShieldCheck className="h-10 w-10 mx-auto text-[color:var(--forest)]" />
            <h2 className="font-serif text-2xl text-[color:var(--forest)]">Vérifiez votre email</h2>
            <p className="text-sm text-muted-foreground">Nous vous avons envoyé un lien de vérification. Cliquez dessus pour activer votre compte.</p>
            <Button className="w-full rounded-full" onClick={() => finish("Nouveau membre")}>Continuer</Button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/admin/login" className="inline-flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border border-[color:var(--forest)]/30 text-[color:var(--forest)] hover:bg-[color:var(--forest)] hover:text-[color:var(--cream)] transition-colors">
            <ShieldCheck className="h-3.5 w-3.5" /> Connexion administrateur
          </Link>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          En continuant, vous acceptez nos <Link to="/contact" className="underline">conditions</Link>.
        </p>
      </section>
    </PublicLayout>
  );
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">{icon}{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function SignupForm({ onDone, setEmail, onVerify }: { onDone: (n: string) => void; setEmail: (e: string) => void; onVerify: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [terms, setTerms] = useState(false);
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!terms) { setErr("Vous devez accepter les conditions."); return; }
    if (pwd.length < 6) { setErr("Mot de passe trop court (6 caractères min)."); return; }
    if (pwd !== confirm) { setErr("Les mots de passe ne correspondent pas."); return; }
    onDone(`${firstName} ${lastName}`.trim() || "Nouveau membre");
    void onVerify;
  };

  return (
    <form onSubmit={submit} className="space-y-4 p-6 rounded-2xl bg-card border border-border">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom"><Input required value={firstName} onChange={e => setFirstName(e.target.value)} /></Field>
        <Field label="Nom"><Input required value={lastName} onChange={e => setLastName(e.target.value)} /></Field>
      </div>
      <Field label="Email" icon={<Mail className="h-4 w-4" />}><Input required type="email" onChange={e => setEmail(e.target.value)} /></Field>
      <Field label="Téléphone"><Input type="tel" placeholder="+212 ..." /></Field>
      <Field label="Mot de passe" icon={<Lock className="h-4 w-4" />}><Input required type="password" value={pwd} onChange={e => setPwd(e.target.value)} /></Field>
      <Field label="Confirmer le mot de passe" icon={<Lock className="h-4 w-4" />}><Input required type="password" value={confirm} onChange={e => setConfirm(e.target.value)} /></Field>
      <label className="flex items-start gap-2 text-xs text-foreground/80">
        <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="mt-0.5 accent-[color:var(--forest)]" />
        J'accepte les conditions générales et la politique de confidentialité.
      </label>
      <label className="flex items-start gap-2 text-xs text-foreground/70">
        <input type="checkbox" className="mt-0.5 accent-[color:var(--forest)]" />
        Je souhaite recevoir les offres et actualités du studio (facultatif).
      </label>
      {err && <div className="text-xs text-destructive">{err}</div>}
      <Button className="w-full rounded-full">Créer mon compte</Button>
    </form>
  );
}
