import { useState } from "react"
import Home from "./components/Home"
import Journal from "./components/Journal"
import Companion from "./components/Companion"
import Resources from "./components/Resources"
import Profile from "./components/Profile"
import { Analytics } from "@vercel/analytics/next"

export default function App() {
  const [tab, setTab] = useState("home")

  return (
    <div className="max-w-sm mx-auto min-h-screen flex flex-col bg-stone-50 relative">
      <div className="flex-1 overflow-y-auto pb-20">
        {tab === "home" && <Home />}
        {tab === "journal" && <Journal />}
        {tab === "companion" && <Companion />}
        {tab === "resources" && <Resources />}
        {tab === "profile" && <Profile />}
      </div>

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
    </div>
  )
}