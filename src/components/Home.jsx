import { useState, useEffect } from "react"

export default function Home() {
  const [days, setDays] = useState(0)
  const [mood, setMood] = useState(null)

  useEffect(() => {
    const start = localStorage.getItem("sobrietyStart")
    if (start) {
      const diff = Math.floor((Date.now() - new Date(start)) / (1000 * 60 * 60 * 24))
      setDays(diff)
    } else {
      const today = new Date().toISOString()
      localStorage.setItem("sobrietyStart", today)
      setDays(0)
    }
  }, [])

  const milestones = [
    { days: 1, icon: "🌱", label: "First Step" },
    { days: 7, icon: "🌿", label: "One Week" },
    { days: 30, icon: "🌳", label: "One Month" },
    { days: 60, icon: "🌲", label: "Two Months" },
    { days: 90, icon: "🌴", label: "Foundation" },
    { days: 365, icon: "⭐", label: "One Year" },
  ]

  const moods = ["😔", "😕", "😐", "🙂", "😊"]
  const moodLabels = ["Struggling", "Low", "Okay", "Good", "Great"]

  return (
    <div className="p-5">
      <h1 className="font-serif text-3xl text-emerald-700 mt-3">Anchor</h1>
      <p className="text-stone-400 text-sm mb-4">Good to see you today</p>

      <div className="bg-emerald-700 rounded-2xl p-6 mb-5 relative overflow-hidden">
        <div className="text-7xl font-bold text-white mb-1">{days}</div>
        <div className="text-emerald-200 text-xs uppercase tracking-widest mb-4">Days sober</div>
        <div className="flex gap-2 flex-wrap">
          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
            Next milestone: {milestones.find(m => m.days > days)?.label || "Legend"}
          </span>
        </div>
      </div>

      <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">Milestones</p>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {milestones.map((m) => (
          <div
            key={m.days}
            className={`min-w-[80px] rounded-xl p-3 text-center flex-shrink-0 border ${
              days >= m.days
                ? "bg-emerald-50 border-emerald-200"
                : "bg-white border-stone-100"
            }`}
          >
            <div className={`text-2xl mb-1 ${days >= m.days ? "" : "opacity-30"}`}>{m.icon}</div>
            <div className="text-xs font-medium text-stone-600">{m.days}d</div>
            <div className="text-xs text-stone-400">{m.label}</div>
          </div>
        ))}
      </div>

      <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">How are you feeling?</p>
      <div className="flex gap-2 justify-between mb-5">
        {moods.map((m, i) => (
          <button
            key={i}
            onClick={() => setMood(i)}
            className={`flex-1 rounded-xl py-3 text-center border transition-all ${
              mood === i
                ? "bg-emerald-50 border-emerald-300"
                : "bg-white border-stone-100"
            }`}
          >
            <div className="text-xl">{m}</div>
            <div className="text-xs text-stone-400 mt-1">{moodLabels[i]}</div>
          </button>
        ))}
      </div>

      {mood !== null && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
          {mood <= 1
            ? "It's okay to have tough days. You're still here and that matters. 💚"
            : mood === 2
            ? "Keep going — one day at a time. You're doing it. 🌿"
            : "That's great to hear. Keep building on this. ⭐"}
        </div>
      )}
    </div>
  )
}