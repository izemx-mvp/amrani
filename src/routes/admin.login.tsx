import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lotus } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth";
import { toast } from "sonner";
import { Lock, Mail, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Connexion administrateur — Amrani" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@amrani.ma");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (email.trim().toLowerCase() === "admin@amrani.ma" && password === "admin123") {
      signIn({ firstName: "Sofia", lastName: "Amrani", email: "admin@amrani.ma", role: "admin" });
      toast.success("Bienvenue dans le Back Office");
      nav({ to: "/admin" });
      return;
    }
    setErr("Identifiants invalides. Utilisez le compte de démonstration ci-dessous.");
  };

  return (
    <div className="min-h-screen bg-[color:var(--forest)] text-[color:var(--cream)] grid place-items-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Lotus className="h-12 w-12 mx-auto" color="var(--cream)" />
          <h1 className="font-serif text-4xl mt-4">Amrani · Administration</h1>
          <p className="text-sm text-[color:var(--cream)]/70 mt-2 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Accès réservé à l'équipe interne
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
          <div>
            <Label className="text-xs uppercase tracking-widest text-[color:var(--cream)]/70 flex items-center gap-1.5"><Mail className="h-4 w-4" />Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="mt-1 bg-white/10 border-white/10 text-[color:var(--cream)] placeholder:text-white/40" />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-widest text-[color:var(--cream)]/70 flex items-center gap-1.5"><Lock className="h-4 w-4" />Mot de passe</Label>
            <Input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="mt-1 bg-white/10 border-white/10 text-[color:var(--cream)]" />
          </div>
          {err && <div className="text-xs text-red-300">{err}</div>}
          <Button className="w-full rounded-full bg-[color:var(--cream)] text-[color:var(--forest)] hover:bg-white">Se connecter au Back Office</Button>
        </form>

        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[color:var(--cream)]/80">
          <div className="uppercase tracking-widest text-[10px] text-[color:var(--cream)]/60 mb-2">Compte de démonstration</div>
          <div>Email : <span className="font-mono">admin@amrani.ma</span></div>
          <div>Mot de passe : <span className="font-mono">admin123</span></div>
        </div>

        <div className="mt-6 text-center text-xs">
          <Link to="/" className="text-[color:var(--cream)]/60 hover:text-[color:var(--cream)]">← Retour au site</Link>
          <span className="mx-2 text-[color:var(--cream)]/30">·</span>
          <Link to="/auth" search={{ redirect: "/client", mode: "login" }} className="text-[color:var(--cream)]/60 hover:text-[color:var(--cream)]">Connexion client</Link>
        </div>
      </div>
    </div>
  );
}
