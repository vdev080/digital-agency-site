"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { homepageFallback, type Homepage } from "@/lib/homepage";
import { apiUrl } from "@/lib/api";
const cloneFallback = () => JSON.parse(JSON.stringify(homepageFallback)) as Homepage;
const move = <T,>(items: T[], index: number, direction: -1 | 1) => {
  const next = [...items]; const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]]; return next;
};

function Reorder({ index, total, onMove }: { index: number; total: number; onMove: (direction: -1 | 1) => void }) {
  return <span className="flex gap-1"><button type="button" disabled={!index} onClick={() => onMove(-1)} className="rounded border px-2 disabled:opacity-30">↑</button><button type="button" disabled={index === total - 1} onClick={() => onMove(1)} className="rounded border px-2 disabled:opacity-30">↓</button></span>;
}

export default function AdminEditor({ initialHomepage }: { initialHomepage: Homepage }) {
  const router = useRouter();
  const [data, setData] = useState<Homepage>(initialHomepage);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const update = (updater: (previous: Homepage) => Homepage) => { setData(updater); setDirty(true); };

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    setSaving(true); setMessage("");
    try {
      const response = await fetch(`${apiUrl}/api/admin/homepage`, { method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message ?? "Unable to save changes.");
      setData(payload.data.homepage); setDirty(false); setMessage("Homepage content saved.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save changes."); }
    finally { setSaving(false); }
  }

  async function logout() {
    await fetch(`${apiUrl}/api/auth/logout`, { method: "POST", credentials: "include" });
    router.replace("/admin/login");
  }

  const card = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm";
  const input = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm";
  const row = "grid gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-[1fr_1fr_auto_auto]";
  return <main className="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8"><div className="mx-auto max-w-5xl space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-semibold">Homepage editor</h1><p className="text-sm text-slate-600">Edit content only; the public design stays unchanged.</p></div><div className="flex gap-2"><button onClick={logout} className="rounded-md border border-slate-300 px-4 py-2.5 text-sm">Sign out</button><button onClick={save} disabled={saving} className="rounded-md bg-indigo-700 px-5 py-2.5 font-medium text-white disabled:opacity-60">{saving ? "Saving…" : "Save Changes"}</button></div></div>
    {message && <p role="status" className="rounded-md bg-slate-900 px-4 py-3 text-sm text-white">{message}</p>}

    <section className={card}><h2 className="text-xl font-semibold">Banner section</h2><label className="mt-4 block text-sm font-medium">Heading<textarea className={input} rows={3} value={data.banner.heading} onChange={(event) => update((value) => ({ ...value, banner: { ...value.banner, heading: event.target.value } }))} /></label><label className="mt-4 block text-sm font-medium">Description<textarea className={input} rows={4} value={data.banner.description} onChange={(event) => update((value) => ({ ...value, banner: { ...value.banner, description: event.target.value } }))} /></label><h3 className="mt-5 font-medium">Statistics</h3><div className="mt-2 space-y-2">{data.banner.statistics.map((item, index) => <div className={row} key={index}><input className={input} aria-label="Statistic value" placeholder="Value" value={item.value} onChange={(event) => update((value) => { const statistics = [...value.banner.statistics]; statistics[index] = { ...item, value: event.target.value }; return { ...value, banner: { ...value.banner, statistics } }; })} /><input className={input} aria-label="Statistic label" placeholder="Label" value={item.label} onChange={(event) => update((value) => { const statistics = [...value.banner.statistics]; statistics[index] = { ...item, label: event.target.value }; return { ...value, banner: { ...value.banner, statistics } }; })} /><Reorder index={index} total={data.banner.statistics.length} onMove={(direction) => update((value) => ({ ...value, banner: { ...value.banner, statistics: move(value.banner.statistics, index, direction) } }))} /><button type="button" onClick={() => update((value) => ({ ...value, banner: { ...value.banner, statistics: value.banner.statistics.filter((_, current) => current !== index) } }))} className="rounded border border-red-300 px-3 text-red-700">Remove</button></div>)}</div><button type="button" onClick={() => update((value) => ({ ...value, banner: { ...value.banner, statistics: [...value.banner.statistics, { value: "", label: "", sortOrder: value.banner.statistics.length }] } }))} className="mt-3 rounded border px-3 py-2 text-sm">Add statistic</button></section>

    <section className={card}><h2 className="text-xl font-semibold">Banner info section</h2><h3 className="mt-4 font-medium">Top list</h3><div className="mt-2 space-y-2">{data.bannerInfo.topList.map((item, index) => <div className="flex gap-2" key={index}><input className={input} aria-label="Top list text" value={item.text} onChange={(event) => update((value) => { const topList = [...value.bannerInfo.topList]; topList[index] = { ...item, text: event.target.value }; return { ...value, bannerInfo: { ...value.bannerInfo, topList } }; })} /><Reorder index={index} total={data.bannerInfo.topList.length} onMove={(direction) => update((value) => ({ ...value, bannerInfo: { ...value.bannerInfo, topList: move(value.bannerInfo.topList, index, direction) } }))} /><button type="button" onClick={() => update((value) => ({ ...value, bannerInfo: { ...value.bannerInfo, topList: value.bannerInfo.topList.filter((_, current) => current !== index) } }))} className="rounded border border-red-300 px-3 text-red-700">Remove</button></div>)}</div><button type="button" onClick={() => update((value) => ({ ...value, bannerInfo: { ...value.bannerInfo, topList: [...value.bannerInfo.topList, { text: "", sortOrder: value.bannerInfo.topList.length }] } }))} className="mt-3 rounded border px-3 py-2 text-sm">Add item</button><div className="mt-6 grid gap-4 md:grid-cols-3"><label className="text-sm font-medium">Founder name<input className={input} value={data.bannerInfo.founder.name} onChange={(event) => update((value) => ({ ...value, bannerInfo: { ...value.bannerInfo, founder: { ...value.bannerInfo.founder, name: event.target.value } } }))} /></label><label className="text-sm font-medium">Founder title<input className={input} value={data.bannerInfo.founder.title} onChange={(event) => update((value) => ({ ...value, bannerInfo: { ...value.bannerInfo, founder: { ...value.bannerInfo.founder, title: event.target.value } } }))} /></label><label className="text-sm font-medium">Founder image URL<input className={input} value={data.bannerInfo.founder.imageUrl} onChange={(event) => update((value) => ({ ...value, bannerInfo: { ...value.bannerInfo, founder: { ...value.bannerInfo.founder, imageUrl: event.target.value } } }))} /></label></div><label className="mt-5 block text-sm font-medium">Heading<textarea className={input} rows={4} value={data.bannerInfo.heading} onChange={(event) => update((value) => ({ ...value, bannerInfo: { ...value.bannerInfo, heading: event.target.value } }))} /></label><h3 className="mt-5 font-medium">Services</h3><div className="mt-2 space-y-2">{data.bannerInfo.services.map((item, index) => <div className={row} key={index}><input className={input} aria-label="Service title" placeholder="Title" value={item.title} onChange={(event) => update((value) => { const services = [...value.bannerInfo.services]; services[index] = { ...item, title: event.target.value }; return { ...value, bannerInfo: { ...value.bannerInfo, services } }; })} /><input className={input} aria-label="Service image URL" placeholder="Icon/image URL" value={item.iconUrl} onChange={(event) => update((value) => { const services = [...value.bannerInfo.services]; services[index] = { ...item, iconUrl: event.target.value }; return { ...value, bannerInfo: { ...value.bannerInfo, services } }; })} /><Reorder index={index} total={data.bannerInfo.services.length} onMove={(direction) => update((value) => ({ ...value, bannerInfo: { ...value.bannerInfo, services: move(value.bannerInfo.services, index, direction) } }))} /><button type="button" onClick={() => update((value) => ({ ...value, bannerInfo: { ...value.bannerInfo, services: value.bannerInfo.services.filter((_, current) => current !== index) } }))} className="rounded border border-red-300 px-3 text-red-700">Remove</button></div>)}</div><button type="button" onClick={() => update((value) => ({ ...value, bannerInfo: { ...value.bannerInfo, services: [...value.bannerInfo.services, { title: "", iconUrl: "", sortOrder: value.bannerInfo.services.length }] } }))} className="mt-3 rounded border px-3 py-2 text-sm">Add service</button></section>

    <section className={card}><h2 className="text-xl font-semibold">Work section</h2><div className="mt-3 space-y-2">{data.work.map((item, index) => <div className="grid gap-3 rounded-lg border border-slate-200 p-3 md:grid-cols-[1fr_1fr_1fr_auto_auto]" key={index}><input className={input} aria-label="Work image URL" placeholder="Image URL" value={item.imageUrl} onChange={(event) => update((value) => { const work = [...value.work]; work[index] = { ...item, imageUrl: event.target.value }; return { ...value, work }; })} /><input className={input} aria-label="Work title" placeholder="Title" value={item.title} onChange={(event) => update((value) => { const work = [...value.work]; work[index] = { ...item, title: event.target.value }; return { ...value, work }; })} /><input className={input} aria-label="Work URL" placeholder="URL" value={item.url} onChange={(event) => update((value) => { const work = [...value.work]; work[index] = { ...item, url: event.target.value }; return { ...value, work }; })} /><Reorder index={index} total={data.work.length} onMove={(direction) => update((value) => ({ ...value, work: move(value.work, index, direction) }))} /><button type="button" onClick={() => update((value) => ({ ...value, work: value.work.filter((_, current) => current !== index) }))} className="rounded border border-red-300 px-3 text-red-700">Remove</button></div>)}</div><button type="button" onClick={() => update((value) => ({ ...value, work: [...value.work, { imageUrl: "", title: "", url: "", sortOrder: value.work.length }] }))} className="mt-3 rounded border px-3 py-2 text-sm">Add work item</button></section>
  </div></main>;
}
