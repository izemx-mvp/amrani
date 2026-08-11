// Central reactive store — bridges Public site, Client space and Back Office.
// Persisted to localStorage. Seeded from mock-data.
import { useSyncExternalStore } from "react";
import {
  activities as seedActivities,
  coaches as seedCoaches,
  schedule as seedSchedule,
  packs as seedPacks,
  promotions as seedPromotions,
  clients as seedClients,
  bookings as seedBookings,
  articles as seedArticles,
} from "./mock-data";


export type BookingStatus =
  | "En attente" | "Confirmée" | "Refusée" | "Annulée" | "Terminée" | "Absente";
export type PaymentStatus = "Payé" | "En attente" | "Échoué" | "Remboursé";
export type PaymentMode = "Carte bancaire" | "Espèces" | "Virement" | "En ligne" | "Pack" | "Autre";
export type BookingSource = "Site web" | "Application" | "Téléphone" | "WhatsApp" | "Sur place" | "Back Office" | "Autre";

export type HistoryEvent = { ts: string; label: string };


export type Booking = {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  scheduleId: string;
  activityId: string;
  coachId: string;
  start: string;
  packId: string | null;
  status: BookingStatus;
  createdAt: string;
  source: BookingSource;
  note?: string;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
  amount: number;
  history: HistoryEvent[];
};


export type Pack = {
  id: string; name: string; description?: string; price: number;
  sessions: number; validity: string; activities: string;
  perks: string[]; recommended: boolean; active: boolean;
  image?: string;
};

export type Promotion = {
  id: string; title: string; description: string; offer: string;
  code: string; type: "Pourcentage" | "Montant fixe" | "Séance offerte" | "Pack spécial" | "Première séance";
  value: number; validity: string; image: string; active: boolean;
  startDate?: string; endDate?: string; maxUses?: number; uses: number;
};

export type Activity = {
  id: string; name: string; category: string; level: string;
  duration: number; image: string; description: string;
  benefits: string[]; price: number; active: boolean;
};

export type ScheduleSlot = {
  id: string; activityId: string; coachId: string; start: string;
  capacity: number; booked: number; room?: string; active: boolean;
};

export type Client = {
  id: string; name: string; email: string; phone: string;
  packId: string; remaining: number; bookings: number;
  lastActive: string; status: string; createdAt: string; notes?: string;
};

export type Payment = {
  id: string; clientId: string; clientName: string;
  bookingId?: string; packId?: string; amount: number;
  mode: PaymentMode; status: PaymentStatus; date: string;
};

export type Coach = {
  id: string; name: string; role: string; bio: string; image: string;
  email?: string; phone?: string; active: boolean;
};

export type Article = {
  slug: string; title: string; category: string; author: string; date: string;
  readMin: number; image: string; excerpt: string; content: string;
  published: boolean;
};

export type StaffUser = {
  id: string; name: string; email: string; role: string; active: boolean;
};

export type Settings = {
  studioName: string; description: string; email: string; phone: string; address: string;
  instagram: string; facebook: string; tiktok: string;
  hours: Record<string, string>;
  manualValidation: boolean; waitlist: boolean; reminders: boolean;
  minDelay: string; maxDelay: string; cancelPolicy: string; maxCapacity: number;
  emailNotifications: boolean; pushNotifications: boolean;
  primaryColor: string; logoUrl: string;
};

type State = {
  activities: Activity[];
  schedule: ScheduleSlot[];
  packs: Pack[];
  promotions: Promotion[];
  clients: Client[];
  bookings: Booking[];
  payments: Payment[];
  coaches: Coach[];
  articles: Article[];
  staff: StaffUser[];
  settings: Settings;
};

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const defaultSettings: Settings = {
  studioName: "Amrani",
  description: "Un espace dédié au mouvement, à l'énergie et à votre bien-être.",
  email: "hello@amrani-studio.com",
  phone: "+212 5 22 00 00 00",
  address: "12 rue des Oliviers, Casablanca",
  instagram: "https://instagram.com/amrani.studio",
  facebook: "https://facebook.com/amrani.studio",
  tiktok: "",
  hours: Object.fromEntries(DAYS.map((d, i) => [d, i < 5 ? "07:00 – 21:00" : i === 5 ? "08:00 – 19:00" : "09:00 – 14:00"])),
  manualValidation: true, waitlist: false, reminders: true,
  minDelay: "2h", maxDelay: "30 j", cancelPolicy: "6h avant · gratuit", maxCapacity: 14,
  emailNotifications: true, pushNotifications: false,
  primaryColor: "#17352C", logoUrl: "",
};

const defaultStaff: StaffUser[] = [
  { id: "u1", name: "Sofia Amrani", role: "Super Administrateur", email: "sofia@amrani.com", active: true },
  { id: "u2", name: "Leila Bennani", role: "Coach", email: "leila@amrani.com", active: true },
  { id: "u3", name: "Karim Nouri", role: "Coach", email: "karim@amrani.com", active: true },
  { id: "u4", name: "Meryem Ouazzani", role: "Réception", email: "meryem@amrani.com", active: true },
  { id: "u5", name: "Ines Chraibi", role: "Gestionnaire de contenu", email: "ines@amrani.com", active: true },
];

const KEY = "amrani.store.manual.v2";


function seed(): State {
  const bookings = seedBookings.map((b, i) => {
    const status = b.status as BookingStatus;
    const isConfirmed = status === "Confirmée" || status === "Terminée";
    const isPending = status === "En attente";
    return {
      ...b,
      clientEmail: seedClients.find(c => c.id === b.clientId)?.email,
      status,
      source: (["Site web", "Application", "WhatsApp", "Téléphone"] as BookingSource[])[i % 4],
      paymentStatus: (isConfirmed ? "Payé" : "En attente") as PaymentStatus,
      paymentMode: "Pack" as PaymentMode,
      amount: 150,
      history: [{ ts: b.createdAt, label: "Réservation créée" }],
    };
  });


  return {
    activities: seedActivities.map(a => ({ ...a, price: 150, active: true })),
    schedule: seedSchedule.map(s => ({ ...s, room: "Salle A", active: true })),
    packs: seedPacks.map(p => ({ ...p, description: p.perks.join(" · "), active: true })),
    promotions: seedPromotions.map(p => ({
      ...p, type: "Pourcentage" as const, value: 20, active: true, uses: Math.floor(Math.random() * 30),
    })),
    clients: seedClients.map(c => ({ ...c, createdAt: new Date(Date.now() - Math.random() * 1e10).toISOString(), notes: "" })),
    bookings,
    payments: seedBookings.slice(0, 12).map((b, i) => ({
      id: `p${i + 1}`, clientId: b.clientId, clientName: b.clientName, bookingId: b.id, amount: 150,
      mode: (["Carte bancaire", "Espèces", "En ligne", "Pack"] as PaymentMode[])[i % 4],
      status: (["Payé", "Payé", "En attente", "Payé"] as PaymentStatus[])[i % 4],
      date: new Date(Date.now() - i * 86400000).toISOString(),
    })),
    coaches: seedCoaches.map(c => ({ ...c, email: `${c.id}@amrani.com`, phone: "+212 6 00 00 00 00", active: true })),
    articles: seedArticles.map((a, i) => ({ ...a, published: i % 4 !== 3 })),
    staff: defaultStaff.map(u => ({ ...u })),
    settings: { ...defaultSettings, hours: { ...defaultSettings.hours } },
  };
}

let state: State = load();

function load(): State {
  const base = seed();
  if (typeof window === "undefined") return base;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Partial<State>;
    return { ...base, ...saved, settings: { ...base.settings, ...(saved.settings ?? {}) } };
  } catch { return base; }
}


function persist() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* noop */ }
}

const listeners = new Set<() => void>();
function notify() { persist(); listeners.forEach(l => l()); }

const subscribe = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); };
const getSnapshot = () => state;
const serverSnapshot = () => state;

export const getCoaches = () => state.coaches;

// Selectors
export function useStore<T>(sel: (s: State) => T): T {
  const snap = useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
  return sel(snap);
}
export function getState() { return state; }

// Actions
export const actions = {
  reset() { state = seed(); notify(); },

  // Bookings
  addBooking(input: Omit<Booking, "id" | "createdAt" | "history"> & { history?: HistoryEvent[] }) {
    const id = `b${Date.now()}`;
    const createdAt = new Date().toISOString();
    const booking: Booking = {
      ...input, id, createdAt,
      history: input.history ?? [{ ts: createdAt, label: "Réservation créée" }],
    };
    state = {
      ...state,
      bookings: [booking, ...state.bookings],
      schedule: state.schedule.map(s => s.id === booking.scheduleId ? { ...s, booked: Math.min(s.capacity, s.booked + 1) } : s),
    };
    notify();
    return booking;
  },
  updateBookingStatus(id: string, status: BookingStatus, label?: string) {
    state = {
      ...state,
      bookings: state.bookings.map(b => b.id === id ? {
        ...b, status,
        history: [...b.history, { ts: new Date().toISOString(), label: label ?? `Statut → ${status}` }],
      } : b),
    };
    notify();
  },
  updateBooking(id: string, patch: Partial<Booking>) {
    state = {
      ...state,
      bookings: state.bookings.map(b => b.id === id ? {
        ...b, ...patch,
        history: [...b.history, { ts: new Date().toISOString(), label: "Réservation modifiée" }],
      } : b),
    };
    notify();
  },
  markBookingPaid(id: string, mode: PaymentMode = "Carte bancaire") {
    const b = state.bookings.find(x => x.id === id);
    if (!b) return;
    state = {
      ...state,
      bookings: state.bookings.map(x => x.id === id ? {
        ...x, paymentStatus: "Payé", paymentMode: mode,
        history: [...x.history, { ts: new Date().toISOString(), label: "Paiement encaissé" }],
      } : x),
      payments: [{
        id: `p${Date.now()}`, clientId: b.clientId, clientName: b.clientName,
        bookingId: b.id, amount: b.amount, mode, status: "Payé", date: new Date().toISOString(),
      }, ...state.payments],
    };
    notify();
  },
  addNote(id: string, note: string) {
    state = { ...state, bookings: state.bookings.map(b => b.id === id ? { ...b, note } : b) };
    notify();
  },

  // Packs
  savePack(pack: Pack) {
    const exists = state.packs.some(p => p.id === pack.id);
    state = { ...state, packs: exists ? state.packs.map(p => p.id === pack.id ? pack : p) : [...state.packs, pack] };
    notify();
  },
  togglePack(id: string) {
    state = { ...state, packs: state.packs.map(p => p.id === id ? { ...p, active: !p.active } : p) };
    notify();
  },
  deletePack(id: string) {
    state = { ...state, packs: state.packs.filter(p => p.id !== id) };
    notify();
  },

  // Promotions
  savePromotion(promo: Promotion) {
    const exists = state.promotions.some(p => p.id === promo.id);
    state = { ...state, promotions: exists ? state.promotions.map(p => p.id === promo.id ? promo : p) : [...state.promotions, promo] };
    notify();
  },
  togglePromotion(id: string) {
    state = { ...state, promotions: state.promotions.map(p => p.id === id ? { ...p, active: !p.active } : p) };
    notify();
  },
  deletePromotion(id: string) {
    state = { ...state, promotions: state.promotions.filter(p => p.id !== id) };
    notify();
  },

  // Activities
  saveActivity(a: Activity) {
    const exists = state.activities.some(x => x.id === a.id);
    state = { ...state, activities: exists ? state.activities.map(x => x.id === a.id ? a : x) : [...state.activities, a] };
    notify();
  },
  toggleActivity(id: string) {
    state = { ...state, activities: state.activities.map(a => a.id === id ? { ...a, active: !a.active } : a) };
    notify();
  },

  // Schedule
  saveSlot(slot: ScheduleSlot) {
    const exists = state.schedule.some(s => s.id === slot.id);
    state = { ...state, schedule: exists ? state.schedule.map(s => s.id === slot.id ? slot : s) : [...state.schedule, slot] };
    notify();
  },
  deleteSlot(id: string) {
    state = { ...state, schedule: state.schedule.filter(s => s.id !== id) };
    notify();
  },

  // Clients
  addClient(c: Omit<Client, "id" | "createdAt">) {
    const id = `c${Date.now()}`;
    const client: Client = { ...c, id, createdAt: new Date().toISOString() };
    state = { ...state, clients: [client, ...state.clients] };
    notify();
    return client;
  },
  updateClient(id: string, patch: Partial<Client>) {
    state = { ...state, clients: state.clients.map(c => c.id === id ? { ...c, ...patch } : c) };
    notify();
  },

  // Payments
  addPayment(p: Omit<Payment, "id" | "date">) {
    const payment: Payment = { ...p, id: `p${Date.now()}`, date: new Date().toISOString() };
    state = { ...state, payments: [payment, ...state.payments] };
    notify();
  },
  updatePaymentStatus(id: string, status: PaymentStatus) {
    state = { ...state, payments: state.payments.map(p => p.id === id ? { ...p, status } : p) };
    notify();
  },
  deletePayment(id: string) {
    state = { ...state, payments: state.payments.filter(p => p.id !== id) };
    notify();
  },

  // Clients / bookings deletion
  deleteClient(id: string) {
    state = { ...state, clients: state.clients.filter(c => c.id !== id) };
    notify();
  },
  deleteBooking(id: string) {
    state = { ...state, bookings: state.bookings.filter(b => b.id !== id) };
    notify();
  },
  deleteActivity(id: string) {
    state = {
      ...state,
      activities: state.activities.filter(a => a.id !== id),
      schedule: state.schedule.filter(s => s.activityId !== id),
    };
    notify();
  },

  // Coaches
  saveCoach(c: Coach) {
    const exists = state.coaches.some(x => x.id === c.id);
    state = { ...state, coaches: exists ? state.coaches.map(x => x.id === c.id ? c : x) : [...state.coaches, c] };
    notify();
  },
  toggleCoach(id: string) {
    state = { ...state, coaches: state.coaches.map(c => c.id === id ? { ...c, active: !c.active } : c) };
    notify();
  },
  deleteCoach(id: string) {
    state = { ...state, coaches: state.coaches.filter(c => c.id !== id) };
    notify();
  },

  // Articles
  saveArticle(a: Article, originalSlug?: string) {
    const key = originalSlug ?? a.slug;
    const exists = state.articles.some(x => x.slug === key);
    state = { ...state, articles: exists ? state.articles.map(x => x.slug === key ? a : x) : [a, ...state.articles] };
    notify();
  },
  toggleArticle(slug: string) {
    state = { ...state, articles: state.articles.map(a => a.slug === slug ? { ...a, published: !a.published } : a) };
    notify();
  },
  deleteArticle(slug: string) {
    state = { ...state, articles: state.articles.filter(a => a.slug !== slug) };
    notify();
  },

  // Staff users
  saveStaff(u: StaffUser) {
    const exists = state.staff.some(x => x.id === u.id);
    state = { ...state, staff: exists ? state.staff.map(x => x.id === u.id ? u : x) : [...state.staff, u] };
    notify();
  },
  toggleStaff(id: string) {
    state = { ...state, staff: state.staff.map(u => u.id === id ? { ...u, active: !u.active } : u) };
    notify();
  },
  deleteStaff(id: string) {
    state = { ...state, staff: state.staff.filter(u => u.id !== id) };
    notify();
  },

  // Settings
  saveSettings(patch: Partial<Settings>) {
    state = { ...state, settings: { ...state.settings, ...patch } };
    notify();
  },

};

export function findAlternatives(activityId: string, excludeSlotId?: string, max = 3) {
  const now = Date.now();
  return state.schedule
    .filter(s => s.active && s.activityId === activityId && s.id !== excludeSlotId && s.booked < s.capacity && new Date(s.start).getTime() > now)
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, max);
}

// Helpers
export const findActivity = (id: string) => state.activities.find(a => a.id === id);
export const findCoach = (id: string) => state.coaches.find(c => c.id === id);

export const findPack = (id: string) => state.packs.find(p => p.id === id);
export const findClient = (id: string) => state.clients.find(c => c.id === id);
export const findSlot = (id: string) => state.schedule.find(s => s.id === id);

export function ensureClientByEmail(email: string, firstName: string, lastName: string, phone = ""): Client {
  const existing = state.clients.find(c => c.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;
  return actions.addClient({
    name: `${firstName} ${lastName}`.trim() || email,
    email, phone, packId: "discovery", remaining: 1, bookings: 0,
    lastActive: "à l'instant", status: "Nouveau", notes: "",
  });
}
