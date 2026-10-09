"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminEditor from "@/components/admin/AdminEditor";
import { homepageFallback, type Homepage } from "@/lib/homepage";
import { apiUrl } from "@/lib/api";
export default function AdminPage() { const router = useRouter(); const [homepage, setHomepage] = useState<Homepage | null>(null); const [error, setError] = useState(""); useEffect(() => { (async () => { try { const me = await fetch(`${apiUrl}/api/auth/me`, { credentials: "include" }); if (!me.ok) return router.replace("/admin/login"); const response = await fetch(`${apiUrl}/api/admin/homepage`, { credentials: "include" }); const payload = await response.json(); if (!response.ok) throw new Error(payload.message ?? "Unable to load homepage content."); setHomepage(payload.data.homepage ?? homepageFallback); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to load the admin dashboard."); } })(); }, [router]); if (error) return <main className="grid min-h-screen place-items-center p-6"><p role="alert">{error}</p></main>; if (!homepage) return <main className="grid min-h-screen place-items-center">Loading admin dashboard…</main>; return <AdminEditor initialHomepage={homepage} />; }
