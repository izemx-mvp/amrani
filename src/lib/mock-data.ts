// Mock data for the Amrani MVP. All fictional.
export const IMG = {
  hero: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1800&q=80",
  studio1: "https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=1400&q=80",
  studio2: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1400&q=80",
  yoga1: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
  yoga2: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=1200&q=80",
  yoga3: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
  pilates1: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=80",
  pilates2: "https://images.unsplash.com/photo-1591343395082-e120087004b4?auto=format&fit=crop&w=1200&q=80",
  pilates3: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?auto=format&fit=crop&w=1200&q=80",
  meditation: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=1200&q=80",
  wellness: "https://images.unsplash.com/photo-1591343395082-e120087004b4?auto=format&fit=crop&w=1200&q=80",
  nutrition: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
  lifestyle: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1200&q=80",
  coach1: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
  coach2: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
  coach3: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=80",
  coach4: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
};

export const activities = [
  { id: "yoga-vinyasa", name: "Yoga Vinyasa", category: "Yoga", level: "Intermédiaire", duration: 60, image: IMG.yoga1, description: "Un flow dynamique qui synchronise mouvement et respiration.", benefits: ["Souplesse", "Force", "Sérénité"] },
  { id: "yoga-hatha", name: "Yoga Hatha", category: "Yoga", level: "Débutant", duration: 75, image: IMG.yoga2, description: "Pratique douce, alignement et respiration consciente.", benefits: ["Alignement", "Respiration", "Calme"] },
  { id: "yin-yoga", name: "Yin Yoga", category: "Yoga", level: "Tous niveaux", duration: 60, image: IMG.yoga3, description: "Postures tenues longuement pour un relâchement profond.", benefits: ["Détente", "Fascias", "Méditation"] },
  { id: "pilates-mat", name: "Pilates Mat", category: "Pilates", level: "Débutant", duration: 55, image: IMG.pilates1, description: "Renforcement du centre au sol, précision du geste.", benefits: ["Gainage", "Posture", "Tonus"] },
  { id: "pilates-reformer", name: "Pilates Reformer", category: "Pilates", level: "Intermédiaire", duration: 55, image: IMG.pilates2, description: "Sur machine, un travail complet et sculptant.", benefits: ["Sculpture", "Contrôle", "Fluidité"] },
  { id: "pilates-avance", name: "Pilates Avancé", category: "Pilates", level: "Avancé", duration: 60, image: IMG.pilates3, description: "Séquences exigeantes pour pratiquant·e·s confirmé·e·s.", benefits: ["Puissance", "Endurance", "Maîtrise"] },
];

export const coaches = [
  { id: "sofia", name: "Sofia Amrani", role: "Fondatrice · Yoga", bio: "15 ans de pratique, formée à Rishikesh.", image: IMG.coach2 },
  { id: "leila", name: "Leila Bennani", role: "Pilates Reformer", bio: "Physio-Pilates certifiée BASI.", image: IMG.coach4 },
  { id: "yasmine", name: "Yasmine Kadri", role: "Yin & Méditation", bio: "Approche somatique et respiration.", image: IMG.coach1 },
  { id: "karim", name: "Karim Nouri", role: "Pilates Mat", bio: "Ancien danseur, spécialiste posture.", image: IMG.coach3 },
];

const today = new Date();
const d = (offset: number, h: number, m = 0) => {
  const x = new Date(today);
  x.setDate(x.getDate() + offset);
  x.setHours(h, m, 0, 0);
  return x.toISOString();
};

export const schedule = [
  { id: "s1", activityId: "yoga-vinyasa", coachId: "sofia", start: d(0, 8), capacity: 12, booked: 8 },
  { id: "s2", activityId: "pilates-reformer", coachId: "leila", start: d(0, 10), capacity: 6, booked: 5 },
  { id: "s3", activityId: "yin-yoga", coachId: "yasmine", start: d(0, 18), capacity: 14, booked: 6 },
  { id: "s4", activityId: "pilates-mat", coachId: "karim", start: d(1, 9), capacity: 12, booked: 4 },
  { id: "s5", activityId: "yoga-hatha", coachId: "sofia", start: d(1, 17, 30), capacity: 14, booked: 10 },
  { id: "s6", activityId: "pilates-avance", coachId: "leila", start: d(2, 8), capacity: 6, booked: 6 },
  { id: "s7", activityId: "yoga-vinyasa", coachId: "sofia", start: d(2, 19), capacity: 12, booked: 3 },
  { id: "s8", activityId: "yin-yoga", coachId: "yasmine", start: d(3, 20), capacity: 14, booked: 9 },
  { id: "s9", activityId: "pilates-reformer", coachId: "leila", start: d(4, 9), capacity: 6, booked: 4 },
  { id: "s10", activityId: "yoga-hatha", coachId: "sofia", start: d(4, 18), capacity: 14, booked: 7 },
  { id: "s11", activityId: "pilates-mat", coachId: "karim", start: d(5, 10), capacity: 12, booked: 5 },
  { id: "s12", activityId: "yoga-vinyasa", coachId: "sofia", start: d(6, 9), capacity: 12, booked: 8 },
];

export const packs = [
  { id: "discovery", name: "Séance découverte", price: 150, sessions: 1, validity: "1 mois", activities: "Toutes", perks: ["Bilan personnalisé"], recommended: false },
  { id: "pack5", name: "Pack 5 séances", price: 700, sessions: 5, validity: "2 mois", activities: "Toutes", perks: ["Flexibilité totale", "-7% vs. unitaire"], recommended: false },
  { id: "pack10", name: "Pack 10 séances", price: 1300, sessions: 10, validity: "3 mois", activities: "Toutes", perks: ["Économie 13%", "1 invité offert"], recommended: true },
  { id: "monthly", name: "Abonnement mensuel", price: 1600, sessions: 20, validity: "1 mois", activities: "Toutes", perks: ["Accès illimité mat", "Priorité reservation"], recommended: false },
  { id: "premium", name: "Pack Premium", price: 3800, sessions: 40, validity: "6 mois", activities: "Toutes + Reformer", perks: ["Coach dédié", "2 séances privées", "Retraite offerte"], recommended: false },
];

export const promotions = [
  { id: "new-year", title: "Nouvelle année, nouvel équilibre", offer: "-20% sur le Pack 10", validity: "31 janvier", image: IMG.wellness, description: "Reprenez en douceur avec 20% de remise sur nos packs 10 séances.", code: "AMRANI20" },
  { id: "duo", title: "Duo Bien-Être", offer: "2 séances pour 250 MAD", validity: "en continu", image: IMG.yoga3, description: "Venez à deux, partagez l'expérience.", code: "DUO" },
  { id: "morning", title: "Matinales sereines", offer: "-15% sur les cours 7h-9h", validity: "mars", image: IMG.meditation, description: "Commencez la journée sur le tapis.", code: "MORNING" },
  { id: "first", title: "Première séance offerte", offer: "1 cours découverte gratuit", validity: "toute l'année", image: IMG.studio1, description: "Testez Amrani sans engagement.", code: "WELCOME" },
];

export const articles = [
  { slug: "respiration-consciente", title: "La respiration consciente, socle du Yoga", category: "Yoga", author: "Sofia Amrani", date: "2026-06-10", readMin: 5, image: IMG.yoga1, excerpt: "Le pranayama, plus qu'une technique, une hygiène quotidienne.", content: "Le souffle est notre premier geste et notre dernier. Il rythme la vie et pourtant nous l'oublions..." },
  { slug: "pilates-posture", title: "Pilates : reconstruire la posture", category: "Pilates", author: "Leila Bennani", date: "2026-05-28", readMin: 7, image: IMG.pilates1, excerpt: "Comment 30 minutes par jour transforment votre alignement.", content: "Joseph Pilates disait : « En dix séances vous sentez la différence...»" },
  { slug: "yin-hiver", title: "Yin Yoga : ralentir en hiver", category: "Bien-être", author: "Yasmine Kadri", date: "2026-05-14", readMin: 4, image: IMG.yoga3, excerpt: "Postures tenues, esprit apaisé.", content: "L'hiver nous invite à l'introspection..." },
  { slug: "nutrition-anti-inflammatoire", title: "Assiette anti-inflammatoire", category: "Nutrition", author: "Sofia Amrani", date: "2026-04-30", readMin: 6, image: IMG.nutrition, excerpt: "Les aliments qui apaisent le corps.", content: "L'inflammation chronique est le mal silencieux..." },
  { slug: "routine-matinale", title: "La routine matinale idéale", category: "Lifestyle", author: "Karim Nouri", date: "2026-04-15", readMin: 5, image: IMG.lifestyle, excerpt: "5 rituels pour un réveil aligné.", content: "1. Boire de l'eau tiède citronnée..." },
  { slug: "meditation-debutant", title: "Méditer quand on débute", category: "Conseils", author: "Yasmine Kadri", date: "2026-03-30", readMin: 4, image: IMG.meditation, excerpt: "Trois pas simples pour commencer.", content: "Asseyez-vous. Respirez. Observez..." },
  { slug: "reformer-explique", title: "Le Reformer, expliqué simplement", category: "Pilates", author: "Leila Bennani", date: "2026-03-18", readMin: 6, image: IMG.pilates2, excerpt: "La machine reine du Pilates dévoilée.", content: "Ressorts, chariot, sangles - un instrument de précision..." },
  { slug: "sommeil-yoga", title: "Yoga du soir pour mieux dormir", category: "Yoga", author: "Sofia Amrani", date: "2026-03-01", readMin: 5, image: IMG.yoga2, excerpt: "3 postures pour préparer le repos.", content: "Balasana, Supta Baddha Konasana, Viparita Karani..." },
];

export const clients = Array.from({ length: 20 }).map((_, i) => {
  const names = ["Nour Alaoui", "Rania Ziani", "Salma Idrissi", "Amine Berrada", "Yassir Fassi", "Ines Chraibi", "Kenza Slaoui", "Zineb Alami", "Adam Benjelloun", "Hiba Tazi", "Sara El Amrani", "Malak Chami", "Reda Mansouri", "Lina Kabbaj", "Oussama Rifi", "Meryem Ouazzani", "Youssef Sabri", "Aya Bouzoubaa", "Ismail Cherkaoui", "Nada Lahlou"];
  const name = names[i];
  return {
    id: `c${i + 1}`,
    name,
    email: name.toLowerCase().replace(" ", ".") + "@mail.com",
    phone: `+212 6${String(10000000 + i * 12345).slice(-8)}`,
    packId: ["pack5", "pack10", "monthly", "premium", "discovery"][i % 5],
    remaining: [3, 7, 12, 20, 1][i % 5],
    bookings: 3 + (i % 9),
    lastActive: `il y a ${1 + (i % 20)} j`,
    status: i % 7 === 0 ? "Nouveau" : "Actif",
  };
});

export const bookings = Array.from({ length: 30 }).map((_, i) => {
  const s = schedule[i % schedule.length];
  const c = clients[i % clients.length];
  const statuses = ["En attente", "Confirmée", "Confirmée", "Terminée", "Annulée", "Refusée", "Absente"];
  return {
    id: `b${i + 1}`,
    clientId: c.id,
    clientName: c.name,
    scheduleId: s.id,
    activityId: s.activityId,
    coachId: s.coachId,
    start: s.start,
    packId: c.packId,
    status: statuses[i % statuses.length],
    createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
  };
});

export const notifications = [
  { id: "n1", title: "Réservation confirmée", body: "Yoga Vinyasa – mardi 9h avec Sofia", date: "il y a 2h", read: false },
  { id: "n2", title: "Rappel séance", body: "Demain 18h · Yin Yoga", date: "il y a 5h", read: false },
  { id: "n3", title: "Promotion", body: "-20% Pack 10 jusqu'au 31/01", date: "hier", read: true },
  { id: "n4", title: "Pack expirant", body: "Il vous reste 15 jours", date: "il y a 3 j", read: true },
];

export const knowledgeBase = [
  { id: "k1", category: "Studio", q: "Quels sont les horaires d'ouverture ?", a: "Lundi–vendredi 7h–21h, samedi 8h–19h, dimanche 9h–14h." },
  { id: "k2", category: "Réservations", q: "Comment réserver une séance ?", a: "Depuis l'espace client ou via l'Agent IA, en 4 clics." },
  { id: "k3", category: "Annulations", q: "Quelle est la politique d'annulation ?", a: "Gratuite jusqu'à 6h avant, sinon 1 séance est déduite." },
  { id: "k4", category: "Packs", q: "Puis-je partager mon pack ?", a: "Non, les packs sont nominatifs sauf mention Duo." },
  { id: "k5", category: "Activités", q: "Quelle activité pour débuter ?", a: "Yoga Hatha ou Pilates Mat sont parfaits pour commencer." },
];

export const aiConversations = [
  { id: "ai1", client: "Rania Z.", last: "Merci, à demain !", when: "10:24", messages: 6 },
  { id: "ai2", client: "Adam B.", last: "Je réserve le Reformer", when: "09:41", messages: 12 },
  { id: "ai3", client: "Anonyme", last: "Quels sont vos tarifs ?", when: "hier", messages: 3 },
];

// Helpers
export const findActivity = (id: string) => activities.find(a => a.id === id);
export const findCoach = (id: string) => coaches.find(c => c.id === id);
export const findPack = (id: string) => packs.find(p => p.id === id);
