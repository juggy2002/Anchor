import { useState, useEffect } from "react"
import { supabase } from "../supabase"

const prompts = [
  "What is one small thing that went well today, and what made it possible?",
  "What emotion am I carrying right now, and where do I feel it in my body?",
  "What is one thing I am grateful for in my recovery today?",
  "What triggered me today, and how did I respond?",
  "What would I tell a friend who is going through what I am going through?",
  "What does my life look like one year from now if I stay the course?",
  "Who supported me today, even in a small way?",
]

export default function Journal({ session }) {
  const [entry, setEntry] = useState("")
  const [craving, setCraving] = useState(null)
  const [saved, setSaved] = useState(false)
  const [pastEntries, setPastEntries] = useState([])
  const [showPast, setShowPast] = useState(false)
  const [loading, setLoading] = useState(false)

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  })

  const todayKey = new Date().toISOString().split("T")[0]
  const promptIndex = new Date().getDay()
  const prompt = prompts[promptIndex]

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", session.user.id)
      .order("date", { ascending: false })
    if (data) {
      setPastEntries(data)
      const todayEntry = data.find(e => e.date === todayKey)
      if (todayEntry) {
        setEntry(todayEntry.text || "")
        setCraving(todayEntry.craving)
      }
    }
  }

  const saveEntry = async () => {
    setLoading(true)
    await supabase
      .from("journal_entries")
      .upsert({
        user_id: session.user.id,
        date: todayKey,
        text: entry,
        craving,
        prompt,
      }, { onConflict: "user_id,date" })
    await fetchEntries()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    setLoading(false)
  }

  return (
    <div className="p-5">
      <h1 className="font-serif text-3xl text-emerald-700 mt-3">Journal</h1>
      <p className="text-stone-400 text-sm mb-5">{today}</p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
        <p className="text-xs uppercase tracking-widest text-amber-600 mb-2">Today's prompt</p>
        <p className="text-sm text-amber-900 leading-relaxed italic">"{prompt}"</p>
      </div>

      <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Your entry</p>
      <textarea
        value={entry}
        onChange={e => setEntry(e.target.value)}
        placeholder="Write freely — this is just for you..."
        className="w-full bg-white border border-stone-200 rounded-xl p-4 text-sm text-stone-700 leading-relaxed resize-none min-h-[140px] mb-5 focus:outline-none focus:border-emerald-400"
      />

      <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Craving check</p>
      <div className="flex gap-2 mb-5">
        {["None", "Mild", "Strong"].map((level) => (
          <button
            key={level}
            onClick={() => setCraving(level)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
              craving === level
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : "bg-white border-stone-200 text-stone-500"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {craving === "Strong" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-sm text-red-800">
          Strong cravings are hard. Try the breathing exercise in Resources, or call the UKNA helpline on 0300 999 1212. You don't have to do this alone. 💚
        </div>
      )}

      <button
        onClick={saveEntry}
        disabled={loading}
        className="w-full bg-emerald-700 text-white py-3 rounded-xl text-sm font-medium mb-2 hover:bg-emerald-800 transition-colors disabled:opacity-50"
      >
        {saved ? "✓ Saved" : loading ? "Saving..." : "Save entry"}
      </button>

      <button
        onClick={() => setShowPast(!showPast)}
        className="w-full text-stone-400 text-sm py-2"
      >
        {showPast ? "Hide past entries" : "View past entries"}
      </button>

      {showPast && (
        <div className="mt-3 flex flex-col gap-3">
          {pastEntries.length === 0 && (
            <p className="text-stone-400 text-sm text-center py-4">No entries yet</p>
          )}
          {pastEntries.map((e, i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-xl p-4">
              <p className="text-xs text-stone-400 mb-1">{e.date}</p>
              <p className="text-sm text-stone-600 leading-relaxed">{e.text || "No entry written"}</p>
              {e.craving && (
                <span className="mt-2 inline-block text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded-full">
                  Craving: {e.craving}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}