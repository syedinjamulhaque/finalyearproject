"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Map as MapIcon,
  Megaphone,
  ListChecks,
  Radar,
  Bot,
  ClipboardList,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Flame,
  Droplets,
  Car,
  Construction,
  ShieldAlert,
  CheckCircle2,
  Clock,
  TrendingUp,
  Send,
  Sparkles,
  MapPin,
  ZoomIn,
  ZoomOut,
  LocateFixed,
  X,
  Filter,
  ChevronRight,
  Activity,
  Users2,
  ArrowUpRight,
  BadgeCheck,
  CircleAlert,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/* ----------------------------------------------------------------------- */
/*  Mock / demonstration data — clearly not live emergency feeds           */
/* ----------------------------------------------------------------------- */

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "map", label: "Live Emergency Map", icon: MapIcon },
  { id: "report", label: "Report an Emergency", icon: Megaphone },
  { id: "incidents", label: "All Incidents", icon: ListChecks },
  { id: "alerts", label: "Nearby Alerts", icon: Radar },
  { id: "assistant", label: "AI Emergency Assistant", icon: Bot },
  { id: "reports", label: "My Reports", icon: ClipboardList },
  { id: "settings", label: "Profile & Settings", icon: Settings },
];

const STATS = [
  {
    id: "active",
    label: "Active Emergencies",
    value: 14,
    trend: "+3 in the last hour",
    trendUp: true,
    icon: ShieldAlert,
    from: "#f43f5e",
    to: "#7f1d3a",
  },
  {
    id: "nearby",
    label: "Nearby Emergencies",
    value: 6,
    trend: "within 5 km of you",
    trendUp: null,
    icon: MapPin,
    from: "#fb923c",
    to: "#7c2d12",
  },
  {
    id: "resolved",
    label: "Resolved Incidents",
    value: 182,
    trend: "+21 this week",
    trendUp: true,
    icon: CheckCircle2,
    from: "#22d3ee",
    to: "#0e4a56",
  },
  {
    id: "community",
    label: "Community Reports",
    value: 947,
    trend: "312 verified contributors",
    trendUp: null,
    icon: Users2,
    from: "#a78bfa",
    to: "#3b2166",
  },
];

const CATEGORY_META = {
  Flood: { icon: Droplets, color: "#38bdf8" },
  Fire: { icon: Flame, color: "#fb923c" },
  Accident: { icon: Car, color: "#f43f5e" },
  Roadblock: { icon: Construction, color: "#facc15" },
};

const SEVERITY_META = {
  Critical: { dot: "#f43f5e", text: "text-rose-400", ring: "ring-rose-500/30", bg: "bg-rose-500/10" },
  High: { dot: "#fb923c", text: "text-orange-400", ring: "ring-orange-500/30", bg: "bg-orange-500/10" },
  Moderate: { dot: "#facc15", text: "text-yellow-300", ring: "ring-yellow-500/30", bg: "bg-yellow-500/10" },
  Resolved: { dot: "#34d399", text: "text-emerald-400", ring: "ring-emerald-500/30", bg: "bg-emerald-500/10" },
};

const STATUS_META = {
  Unverified: { text: "text-slate-400", bg: "bg-slate-500/10", ring: "ring-slate-500/30" },
  "Community Reported": { text: "text-cyan-300", bg: "bg-cyan-500/10", ring: "ring-cyan-500/30" },
  Verified: { text: "text-sky-300", bg: "bg-sky-500/10", ring: "ring-sky-500/30" },
  Resolved: { text: "text-emerald-300", bg: "bg-emerald-500/10", ring: "ring-emerald-500/30" },
};

const INCIDENTS = [
  {
    id: "INC-1042",
    title: "Flash flooding on Nabin Nagar Road",
    category: "Flood",
    location: "Nabin Nagar, Zone 4",
    severity: "Critical",
    time: "6 min ago",
    status: "Verified",
    x: 62,
    y: 28,
  },
  {
    id: "INC-1041",
    title: "Kitchen fire spreading to adjacent shop",
    category: "Fire",
    location: "Fancy Bazaar Market",
    severity: "Critical",
    time: "18 min ago",
    status: "Community Reported",
    x: 34,
    y: 46,
  },
  {
    id: "INC-1039",
    title: "Multi-vehicle collision, lane blocked",
    category: "Accident",
    location: "GS Road Flyover",
    severity: "High",
    time: "41 min ago",
    status: "Verified",
    x: 75,
    y: 63,
  },
  {
    id: "INC-1036",
    title: "Fallen tree blocking two lanes",
    category: "Roadblock",
    location: "Zoo Road Junction",
    severity: "Moderate",
    time: "1 hr ago",
    status: "Community Reported",
    x: 48,
    y: 72,
  },
  {
    id: "INC-1031",
    title: "Waterlogging cleared after drainage fix",
    category: "Flood",
    location: "Ganeshguri Circle",
    severity: "Resolved",
    time: "3 hr ago",
    status: "Resolved",
    x: 55,
    y: 40,
  },
  {
    id: "INC-1028",
    title: "Minor scooter accident, no injuries reported",
    category: "Accident",
    location: "Beltola Chariali",
    severity: "Resolved",
    time: "5 hr ago",
    status: "Resolved",
    x: 40,
    y: 58,
  },
];

const ALERTS = [
  {
    id: "A-1",
    type: "Flood",
    distance: "0.8 km",
    location: "Nabin Nagar Road",
    severity: "Critical",
    time: "6 min ago",
    description: "Water level rising fast near the culvert — avoid the underpass.",
  },
  {
    id: "A-2",
    type: "Fire",
    distance: "2.1 km",
    location: "Fancy Bazaar Market",
    severity: "Critical",
    time: "18 min ago",
    description: "Fire crews on site; nearby shops advised to evacuate as a precaution.",
  },
  {
    id: "A-3",
    type: "Roadblock",
    distance: "3.4 km",
    location: "Zoo Road Junction",
    severity: "Moderate",
    time: "1 hr ago",
    description: "Fallen tree across two lanes; traffic diverted via service road.",
  },
];

const CATEGORY_BREAKDOWN = [
  { name: "Flood", value: 5, color: "#38bdf8" },
  { name: "Fire", value: 3, color: "#fb923c" },
  { name: "Accident", value: 4, color: "#f43f5e" },
  { name: "Roadblock", value: 2, color: "#facc15" },
];

const ACTIVITY_TREND = [
  { hour: "6a", reports: 2 },
  { hour: "8a", reports: 5 },
  { hour: "10a", reports: 4 },
  { hour: "12p", reports: 7 },
  { hour: "2p", reports: 6 },
  { hour: "4p", reports: 9 },
  { hour: "6p", reports: 12 },
  { hour: "8p", reports: 8 },
];

const TIMELINE = [
  { id: 1, text: "Report verified: Flash flooding on Nabin Nagar Road", time: "6 min ago", tone: "critical" },
  { id: 2, text: "Fire department dispatched to Fancy Bazaar Market", time: "16 min ago", tone: "critical" },
  { id: 3, text: "Incident resolved: Waterlogging at Ganeshguri Circle", time: "3 hr ago", tone: "resolved" },
  { id: 4, text: "New community report submitted near Zoo Road", time: "1 hr ago", tone: "default" },
  { id: 5, text: "Incident resolved: Scooter accident at Beltola", time: "5 hr ago", tone: "resolved" },
];

const COMMUNITY_ACTIVITY = [
  { id: 1, user: "Rupam D.", action: "verified a report", target: "Flash flooding, Nabin Nagar", time: "4 min ago" },
  { id: 2, user: "Priyanka S.", action: "submitted a new report", target: "Kitchen fire, Fancy Bazaar", time: "18 min ago" },
  { id: 3, user: "Anurag B.", action: "added photos to", target: "Multi-vehicle collision, GS Road", time: "35 min ago" },
  { id: 4, user: "Mousumi K.", action: "marked resolved", target: "Waterlogging, Ganeshguri", time: "3 hr ago" },
];

const SUGGESTED_PROMPTS = [
  "What should I do during a flood?",
  "Find nearby reported emergencies.",
  "How do I report a road accident?",
  "What safety precautions should I take?",
];

const AI_CANNED_REPLY =
  "This assistant is a UI demonstration only — responses shown here are illustrative, not verified official emergency guidance. In the full build, this panel will connect to a real AI backend for live, cited safety guidance.";

/* ----------------------------------------------------------------------- */
/*  Small building blocks                                                  */
/* ----------------------------------------------------------------------- */

function GlassCard({ className = "", children, style }) {
  return (
    <div
      className={`rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-black/20 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function SeverityDot({ severity }) {
  const meta = SEVERITY_META[severity] || SEVERITY_META.Moderate;
  return (
    <span
      className="inline-block h-2 w-2 rounded-full"
      style={{ backgroundColor: meta.dot, boxShadow: `0 0 8px ${meta.dot}` }}
    />
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Unverified;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${meta.text} ${meta.bg} ${meta.ring}`}
    >
      {status === "Verified" && <BadgeCheck className="h-3.5 w-3.5" />}
      {status}
    </span>
  );
}

function CategoryIcon({ category, className = "h-4 w-4" }) {
  const meta = CATEGORY_META[category];
  if (!meta) return null;
  const Icon = meta.icon;
  return <Icon className={className} style={{ color: meta.color }} />;
}

/* ----------------------------------------------------------------------- */
/*  Main component                                                         */
/* ----------------------------------------------------------------------- */

export default function SmartCityDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mapFilter, setMapFilter] = useState("All");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState([
    { role: "assistant", text: "Need help? I'm here to assist you." },
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  const filteredIncidents = useMemo(
    () => (mapFilter === "All" ? INCIDENTS : INCIDENTS.filter((i) => i.category === mapFilter)),
    [mapFilter]
  );

  function sendChat(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setChatLog((log) => [
      ...log,
      { role: "user", text: trimmed },
      { role: "assistant", text: AI_CANNED_REPLY },
    ]);
    setChatInput("");
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-200 flex" style={{ fontFamily: "Inter, ui-sans-serif, system-ui" }}>
      {/* ---------------------------------------------------------------- */}
      {/* Sidebar                                                          */}
      {/* ---------------------------------------------------------------- */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-2.5 px-6 py-6">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 shadow-lg shadow-cyan-500/20">
            <Radar className="h-5 w-5 text-slate-950" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">SmartCity</span>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-cyan-500/10 text-cyan-300 ring-1 ring-inset ring-cyan-500/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${active ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                <span className="truncate">{item.label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />}
              </button>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl border border-slate-800/80 bg-slate-900/70 p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-semibold text-slate-950">
              PD
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-200">Priyam Deka</p>
              <p className="truncate text-xs text-slate-500">Verified Citizen</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------------------- */}
      {/* Main column                                                      */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/80 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-white sm:text-2xl">Welcome back, Citizen!</h1>
              <p className="mt-0.5 text-sm text-slate-400">Stay informed. Stay safe. Help your community.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-400 md:flex">
                <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                Guwahati, Assam
              </div>

              <div className="relative">
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative grid h-9 w-9 place-items-center rounded-full border border-slate-800 bg-slate-900/70 text-slate-300 hover:text-white"
                >
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-slate-950" />
                </button>
                {notifOpen && (
                  <div className="absolute right-0 z-30 mt-2 w-72 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl">
                    <p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-slate-500">Notifications</p>
                    {TIMELINE.slice(0, 3).map((t) => (
                      <div key={t.id} className="flex items-start gap-2 rounded-lg px-2 py-2 hover:bg-slate-800/60">
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: t.tone === "critical" ? "#f43f5e" : t.tone === "resolved" ? "#34d399" : "#38bdf8" }}
                        />
                        <div>
                          <p className="text-xs text-slate-300">{t.text}</p>
                          <p className="text-[11px] text-slate-500">{t.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 py-1 pl-1 pr-2.5 text-sm text-slate-300 hover:text-white"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-xs font-semibold text-slate-950">
                    PD
                  </span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 py-1 shadow-2xl">
                    <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800/60">
                      <Settings className="h-4 w-4" /> Profile & Settings
                    </button>
                    <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-300 hover:bg-slate-800/60">
                      <ClipboardList className="h-4 w-4" /> My Reports
                    </button>
                  </div>
                )}
              </div>

              <button className="flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 transition-transform hover:scale-[1.02] hover:bg-rose-400">
                <Megaphone className="h-4 w-4" />
                Report Emergency
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 space-y-6 px-4 py-6 sm:px-6">
          {/* Stat cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <GlassCard key={s.id} className="relative overflow-hidden p-5">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{ background: `radial-gradient(120% 120% at 100% 0%, ${s.from}, transparent 60%)` }}
                  />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{s.label}</p>
                      <p className="mt-2 text-3xl font-semibold text-white">{s.value}</p>
                    </div>
                    <div
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                      style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <p className="relative mt-3 flex items-center gap-1 text-xs text-slate-500">
                    {s.trendUp && <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />}
                    {s.trend}
                  </p>
                </GlassCard>
              );
            })}
          </section>

          {/* Map + AI assistant */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Map */}
            <GlassCard className="xl:col-span-2 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-white">Live Emergency Map</h2>
                  <p className="text-xs text-slate-500">Demonstration markers — not verified live incident data</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {["All", "Flood", "Fire", "Accident", "Roadblock"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setMapFilter(cat)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        mapFilter === cat
                          ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/40"
                          : "bg-slate-800/60 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="relative h-[420px] w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                  backgroundColor: "#060b16",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "radial-gradient(60% 60% at 50% 40%, rgba(34,211,238,0.08), transparent 70%)" }}
                />

                {filteredIncidents.map((inc) => {
                  const meta = SEVERITY_META[inc.severity];
                  return (
                    <button
                      key={inc.id}
                      onClick={() => setSelectedIncident(inc)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125"
                      style={{ left: `${inc.x}%`, top: `${inc.y}%` }}
                      title={inc.title}
                    >
                      <span
                        className="grid h-8 w-8 place-items-center rounded-full ring-2"
                        style={{ backgroundColor: `${meta.dot}26`, borderColor: meta.dot, boxShadow: `0 0 14px ${meta.dot}66` }}
                      >
                        <CategoryIcon category={inc.category} className="h-4 w-4" />
                      </span>
                    </button>
                  );
                })}

                {selectedIncident && (
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 rounded-xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl backdrop-blur">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CategoryIcon category={selectedIncident.category} className="h-4 w-4" />
                        <p className="text-sm font-medium text-white">{selectedIncident.title}</p>
                      </div>
                      <button onClick={() => setSelectedIncident(null)} className="text-slate-500 hover:text-slate-200">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{selectedIncident.location}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <SeverityDot severity={selectedIncident.severity} /> {selectedIncident.severity}
                      </span>
                      <StatusBadge status={selectedIncident.status} />
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3 w-3" /> {selectedIncident.time}
                      </span>
                    </div>
                  </div>
                )}

                <div className="absolute right-4 top-4 flex flex-col gap-1.5">
                  <button className="grid h-8 w-8 place-items-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white">
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button className="grid h-8 w-8 place-items-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white">
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <button className="grid h-8 w-8 place-items-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white">
                    <LocateFixed className="h-4 w-4" />
                  </button>
                </div>

                <div className="absolute left-4 top-4 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-[11px] text-slate-400">
                  {Object.entries(SEVERITY_META).map(([label, meta]) => (
                    <span key={label} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.dot }} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* AI Assistant */}
            <GlassCard className="flex flex-col overflow-hidden">
              <div className="flex items-center gap-2.5 border-b border-slate-800/80 px-5 py-4">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500">
                  <Sparkles className="h-4 w-4 text-slate-950" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">AI Emergency Assistant</h2>
                  <p className="text-xs text-slate-500">Need help? I'm here to assist you.</p>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4" style={{ maxHeight: 260 }}>
                {chatLog.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                        m.role === "user"
                          ? "bg-cyan-500/15 text-cyan-100 ring-1 ring-cyan-500/30"
                          : "bg-slate-800/70 text-slate-300"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="border-t border-slate-800/80 px-4 py-3">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => sendChat(p)}
                      className="rounded-full border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[11px] text-slate-400 hover:border-cyan-500/40 hover:text-cyan-300"
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendChat(chatInput);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Describe your emergency or ask a question..."
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-500/50 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </GlassCard>
          </section>

          {/* Quick actions */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Report an Emergency", icon: Megaphone, color: "#f43f5e" },
              { label: "View Live Map", icon: MapIcon, color: "#22d3ee" },
              { label: "Check Nearby Alerts", icon: Radar, color: "#fb923c" },
              { label: "Ask AI Assistant", icon: Bot, color: "#a78bfa" },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-3.5 text-left transition-colors hover:border-slate-700"
                >
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${a.color}1f`, color: a.color }}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="text-sm text-slate-300 group-hover:text-white">{a.label}</span>
                </button>
              );
            })}
          </section>

          {/* Recent reports + Nearby alerts */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <GlassCard className="xl:col-span-2 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4">
                <h2 className="text-base font-semibold text-white">Recent Emergency Reports</h2>
                <button className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300">
                  View All Incidents <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="divide-y divide-slate-800/70">
                {INCIDENTS.slice(0, 5).map((inc) => (
                  <div key={inc.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 hover:bg-slate-800/30">
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                      style={{ backgroundColor: `${CATEGORY_META[inc.category].color}1f` }}
                    >
                      <CategoryIcon category={inc.category} className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-slate-200">{inc.title}</p>
                      <p className="truncate text-xs text-slate-500">{inc.location}</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <SeverityDot severity={inc.severity} /> {inc.severity}
                    </span>
                    <StatusBadge status={inc.status} />
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" /> {inc.time}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800/80 px-5 py-4">
                <h2 className="text-base font-semibold text-white">Nearby Emergency Alerts</h2>
                <CircleAlert className="h-4 w-4 text-rose-400" />
              </div>
              <div className="space-y-3 px-4 py-4">
                {ALERTS.map((a) => {
                  const meta = SEVERITY_META[a.severity];
                  return (
                    <div key={a.id} className={`rounded-xl border px-3.5 py-3 ${meta.bg} border-slate-800/80`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-200">
                          <CategoryIcon category={a.type} className="h-3.5 w-3.5" /> {a.type}
                        </span>
                        <span className={`text-[11px] font-medium ${meta.text}`}>{a.distance} away</span>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-400">{a.description}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{a.location} · {a.time}</span>
                        <button className="flex items-center gap-1 font-medium text-cyan-400 hover:text-cyan-300">
                          View on Map <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </section>

          {/* Timeline / category breakdown / community activity */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <GlassCard className="p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                <Activity className="h-4 w-4 text-cyan-400" /> Activity Timeline
              </h2>
              <div className="space-y-4">
                {TIMELINE.map((t) => (
                  <div key={t.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            t.tone === "critical" ? "#f43f5e" : t.tone === "resolved" ? "#34d399" : "#38bdf8",
                        }}
                      />
                      <span className="mt-1 w-px flex-1 bg-slate-800" />
                    </div>
                    <div className="pb-1">
                      <p className="text-xs text-slate-300">{t.text}</p>
                      <p className="text-[11px] text-slate-500">{t.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <h2 className="mb-2 text-sm font-semibold text-white">Incident Category Breakdown</h2>
              <p className="mb-3 text-xs text-slate-500">Active incidents, last 24 hours</p>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_BREAKDOWN}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={42}
                      outerRadius={62}
                      paddingAngle={3}
                    >
                      {CATEGORY_BREAKDOWN.map((c) => (
                        <Cell key={c.name} fill={c.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {CATEGORY_BREAKDOWN.map((c) => (
                  <span key={c.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                    {c.name} · {c.value}
                  </span>
                ))}
              </div>
              <div className="mt-4 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ACTIVITY_TREND}>
                    <defs>
                      <linearGradient id="reportsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="reports" stroke="#22d3ee" fill="url(#reportsFill)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-1 text-center text-[11px] text-slate-500">Reports submitted, by hour</p>
            </GlassCard>

            <GlassCard className="p-5">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
                <Users2 className="h-4 w-4 text-cyan-400" /> Community Activity
              </h2>
              <div className="space-y-4">
                {COMMUNITY_ACTIVITY.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-300">
                      {c.user.split(" ")[0][0]}
                      {c.user.split(" ")[1]?.[0]}
                    </span>
                    <p className="text-xs text-slate-400">
                      <span className="font-medium text-slate-200">{c.user}</span> {c.action}{" "}
                      <span className="text-slate-300">{c.target}</span>
                      <span className="block text-[11px] text-slate-600">{c.time}</span>
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>

          <p className="pb-4 text-center text-[11px] text-slate-600">
            Demonstration data shown throughout this dashboard. Not connected to a live emergency feed.
          </p>
        </main>
      </div>
    </div>
  );
}
