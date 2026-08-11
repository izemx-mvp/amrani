import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/AdminLayout";
import { useStore, actions, type Article } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/articles")({ component: Page });

const CATS = ["Yoga", "Pilates", "Bien-être", "Nutrition", "Lifestyle", "Conseils"];

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function blank(): Article {
  return {
    slug: "", title: "", category: "Yoga", author: "Sofia Amrani",
    date: new Date().toISOString().slice(0, 10), readMin: 5,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80",
    excerpt: "", content: "", published: false,
  };
}

function Page() {
  const articles = useStore(s => s.articles);
  const [edit, setEdit] = useState<{ a: Article; original?: string } | null>(null);
  const [q, setQ] = useState("");
  const filtered = articles.filter(a => a.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title="Articles" subtitle={`${articles.length} articles · ${articles.filter(a => a.published).length} publiés`} actions={<Button onClick={() => setEdit({ a: blank() })}>Nouvel article</Button>} />
      <Input placeholder="Rechercher un article…" value={q} onChange={e => setQ(e.target.value)} className="mb-4 max-w-sm" />
      <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--cream)] text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="p-3">Titre</th><th className="p-3">Catégorie</th><th className="p-3 hidden md:table-cell">Auteur</th><th className="p-3">Date</th><th className="p-3">Publié</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.slug} className="border-t border-border">
                <td className="p-3 font-medium">{a.title}</td>
                <td className="p-3">{a.category}</td>
                <td className="p-3 hidden md:table-cell text-muted-foreground">{a.author}</td>
                <td className="p-3">{a.date}</td>
                <td className="p-3"><Switch checked={a.published} onCheckedChange={() => { actions.toggleArticle(a.slug); toast.success(a.published ? "Article dépublié" : "Article publié"); }} /></td>
                <td className="p-3 text-right space-x-1 whitespace-nowrap">
                  <Button variant="ghost" size="sm" onClick={() => setEdit({ a, original: a.slug })}>Éditer</Button>
                  <Button variant="ghost" size="sm" onClick={() => setEdit({ a: { ...a, slug: `${a.slug}-copie`, title: `${a.title} (copie)`, published: false } })}>Dupliquer</Button>
                  <Button variant="ghost" size="sm" onClick={() => { if (confirm("Supprimer cet article ?")) { actions.deleteArticle(a.slug); toast.success("Article supprimé"); } }}>×</Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Aucun article.</td></tr>}
          </tbody>
        </table>
      </div>
      {edit && <ArticleDialog article={edit.a} original={edit.original} onClose={() => setEdit(null)} />}
    </div>
  );
}

function ArticleDialog({ article, original, onClose }: { article: Article; original?: string; onClose: () => void }) {
  const [a, setA] = useState(article);
  const save = () => {
    if (!a.title.trim()) { toast.error("Titre requis"); return; }
    const slug = a.slug.trim() || slugify(a.title);
    actions.saveArticle({ ...a, slug }, original);
    toast.success(a.published ? "Article enregistré · visible sur le blog" : "Brouillon enregistré");
    onClose();
  };
  return (
    <Dialog open onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif text-2xl text-[color:var(--forest)]">{original ? "Modifier l'article" : "Nouvel article"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <F label="Titre"><Input value={a.title} onChange={e => setA({ ...a, title: e.target.value, slug: original ? a.slug : slugify(e.target.value) })} /></F>
          <F label="Slug (URL)"><Input value={a.slug} onChange={e => setA({ ...a, slug: slugify(e.target.value) })} /></F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Catégorie">
              <select value={a.category} onChange={e => setA({ ...a, category: e.target.value })} className="w-full h-10 px-3 rounded-md border border-border">
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </F>
            <F label="Auteur"><Input value={a.author} onChange={e => setA({ ...a, author: e.target.value })} /></F>
            <F label="Date"><Input type="date" value={a.date} onChange={e => setA({ ...a, date: e.target.value })} /></F>
            <F label="Temps de lecture (min)"><Input type="number" value={a.readMin} onChange={e => setA({ ...a, readMin: Number(e.target.value) })} /></F>
          </div>
          <F label="Image (URL)"><Input value={a.image} onChange={e => setA({ ...a, image: e.target.value })} /></F>
          <F label="Extrait"><textarea value={a.excerpt} onChange={e => setA({ ...a, excerpt: e.target.value })} className="w-full p-3 rounded-md border border-border text-sm min-h-[60px]" /></F>
          <F label="Contenu"><textarea value={a.content} onChange={e => setA({ ...a, content: e.target.value })} className="w-full p-3 rounded-md border border-border text-sm min-h-[160px]" /></F>
          <label className="text-sm flex items-center gap-2"><Switch checked={a.published} onCheckedChange={v => setA({ ...a, published: v })} /> Publié sur le site</label>
        </div>
        <div className="flex justify-end gap-2 pt-4"><Button variant="ghost" onClick={onClose}>Annuler</Button><Button onClick={save}>Enregistrer</Button></div>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children }: any) { return <div><label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label><div className="mt-1">{children}</div></div>; }
