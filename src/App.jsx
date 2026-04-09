import { useState, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { supabase } from "./supabase"
import Auth from "./components/Auth"
import Home from "./components/Home"
import Journal from "./components/Journal"
import Companion from "./components/Companion"
import Resources from "./components/Resources"
import Profile from "./components/Profile"
import Calendar from "./components/Calendar"
import Landing from "./components/Landing"

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("home")

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-emerald-700 font-serif text-2xl">Anchor</p>
      </div>
    )
  }

  const AppShell = () => (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col bg-stone-50 relative">
      {tab !== "calendar" && (
        <button
          onClick={() => setTab("calendar")}
          style={{position: 'fixed', top: '1rem', right: 'calc(50% - 190px)', zIndex: 50}}
          className="bg-white border border-stone-200 rounded-full w-10 h-10 flex items-center justify-center shadow-sm hover:border-emerald-300 transition-colors"
        >
          📅
        </button>
      )}

      {tab === "calendar" && (
        <button
          onClick={() => setTab("home")}
          style={{position: 'fixed', top: '1rem', right: 'calc(50% - 190px)', zIndex: 50}}
          className="bg-white border border-stone-200 rounded-full w-10 h-10 flex items-center justify-center shadow-sm hover:border-emerald-300 transition-colors"
        >
          ✕
        </button>
      )}

      <div className="flex-1 overflow-y-auto pb-20">
        {tab === "home" && <Home session={session} />}
        {tab === "journal" && <Journal session={session} />}
        {tab === "companion" && <Companion session={session} />}
        {tab === "resources" && <Resources />}
        {tab === "calendar" && <Calendar session={session} />}
        {tab === "profile" && <Profile session={session} />}
      </div>

      {tab !== "calendar" && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-stone-50 border-t border-stone-200 flex justify-around items-center py-3 z-50">
          {[
            { id: "home", icon: "🏠", label: "Home" },
            { id: "journal", icon: "📓", label: "Journal" },
            { id: "companion", icon: "💬", label: "Companion" },
            { id: "resources", icon: "🧭", label: "Resources" },
            { id: "profile", icon: "👤", label: "Profile" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex flex-col items-center gap-1 text-xs px-3 ${
                tab === item.id ? "text-emerald-700" : "text-stone-400"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  )

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={session ? <AppShell /> : <Auth />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}