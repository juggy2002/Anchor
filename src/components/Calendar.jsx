import { useState, useEffect } from "react"
import ReactCalendar from "react-calendar"
import { supabase } from "../supabase"

const moodEmojis = ["😔", "😕", "😐", "🙂", "😊"]
const moodColours = [
  "bg-red-100",
  "bg-orange-100",
  "bg-yellow-100",
  "bg-emerald-100",
  "bg-emerald-200",
]

const milestoneMap = {
  1: "🌱", 7: "🌿", 30: "🌳", 60: "🌲", 90: "🌴", 365: "⭐"
}

const toMidnight = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const daysBetween = (a, b) =>
  Math.round((toMidnight(b) - toMidnight(a)) / (1000 * 60 * 60 * 24))

const dateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

export default function Calendar({ session }) {
  const [moods, setMoods] = useState({})
  const [sobrietyStart, setSobrietyStart] = useState(null)
  const [selected, setSelected] = useState(null)
  const [activeStartDate, setActiveStartDate] = useState(new Date())

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("sobriety_start")
      .eq("id", session.user.id)
      .single()
    if (profile?.sobriety_start) {
      const [year, month, day] = profile.sobriety_start.split("-")
      setSobrietyStart(new Date(year, month - 1, day))
    }

    const { data: moodData } = await supabase
      .from("mood_logs")
      .select("date, mood")
      .eq("user_id", session.user.id)
    if (moodData) {
      const map = {}
      moodData.forEach(m => { map[m.date] = m.mood })
      setMoods(map)
    }
  }

  const getMilestoneForDate = (date) => {
    if (!sobrietyStart) return null
    const today = toMidnight(new Date())
    const target = toMidnight(date)
    if (target > today) return null
    const diff = daysBetween(sobrietyStart, target)
    return milestoneMap[diff] || null
  }

  const logMood = async (index) => {
    if (!selected) return
    const today = toMidnight(new Date())
    const target = toMidnight(selected)
    if (target > today) return
    const key = dateKey(selected)
    await supabase
      .from("mood_logs")
      .upsert({ user_id: session.user.id, date: key, mood: index }, { onConflict: "user_id,date" })
    setMoods(prev => ({ ...prev, [key]: index }))
  }

  const getTileContent = ({ date, view }) => {
    if (view !== "month") return null
    const key = dateKey(date)
    const mood = moods[key]
    const milestone = getMilestoneForDate(date)
    return (
      <div className="flex flex-col items-center mt-0.5">
        {mood !== undefined && <span style={{ fontSize: "10px" }}>{moodEmojis[mood]}</span>}
        {milestone && <span style={{ fontSize: "10px" }}>{milestone}</span>}
      </div>
    )
  }

  const getTileClassName = ({ date, view }) => {
    if (view !== "month") return ""
    const key = dateKey(date)
    const mood = moods[key]
    if (mood !== undefined) return `rounded-xl ${moodColours[mood]}`
    return "rounded-xl"
  }

  const selectedKey = selected ? dateKey(selected) : null
  const selectedMood = selected !== null && selectedKey !== null ? moods[selectedKey] : undefined
  const selectedMilestone = selected ? getMilestoneForDate(selected) : null
  const selectedDayNumber = selected && sobrietyStart
    ? daysBetween(sobrietyStart, selected)
    : null

  return (
    <div className="p-5">
      <h1 className="font-serif text-3xl text-emerald-700 mt-3">Calendar</h1>
      <p className="text-stone-400 text-sm mb-5">Your mood and milestone history</p>

      <style>{`
        .react-calendar { width: 100%; border: none; background: transparent; font-family: inherit; }
        .react-calendar__tile { padding: 6px 2px; font-size: 12px; border-radius: 10px; }
        .react-calendar__tile--now { background: #ecfdf5 !important; color: #047857; font-weight: 600; }
        .react-calendar__tile--active { background: #047857 !important; color: white !important; border-radius: 10px; }
        .react-calendar__navigation button { font-size: 14px; font-weight: 500; color: #374151; background: none; border: none; padding: 8px; }
        .react-calendar__month-view__weekdays { font-size: 11px; color: #9ca3af; text-transform: uppercase; font-weight: 500; }
        .react-calendar__month-view__weekdays abbr { text-decoration: none; }
      `}</style>

      <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-5">
        <ReactCalendar
          tileContent={getTileContent}
          tileClassName={getTileClassName}
          onClickDay={(date) => setSelected(date)}
          activeStartDate={activeStartDate}
          onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
        />
      </div>

      {selected && (
        <div className="bg-white border border-stone-200 rounded-xl p-4 mb-5">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">
            {selected.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </p>

          {selectedDayNumber !== null && selectedDayNumber >= 0 && (
            <p className="text-sm text-stone-600 mb-3">
              Day <span className="font-medium text-emerald-700">{selectedDayNumber}</span> of your recovery
            </p>
          )}

          {selectedMilestone && (
            <p className="text-sm text-stone-600 mb-3">Milestone: {selectedMilestone}</p>
          )}

          <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">How were you feeling?</p>
          <div className="flex gap-2 justify-between mb-2">
            {moodEmojis.map((e, i) => (
              <button
                key={i}
                onClick={() => logMood(i)}
                className={`flex-1 rounded-xl py-2 text-center border transition-all ${
                  selectedMood === i
                    ? "bg-emerald-50 border-emerald-400"
                    : "bg-white border-stone-200 hover:border-emerald-200"
                }`}
              >
                <span className="text-lg">{e}</span>
              </button>
            ))}
          </div>
          {selectedMood !== undefined && (
            <p className="text-xs text-emerald-600 mt-1">
              ✓ {["Struggling", "Low", "Okay", "Good", "Great"][selectedMood]} logged
            </p>
          )}
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-xl p-4">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">Mood key</p>
        <div className="flex justify-between">
          {moodEmojis.map((e, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-lg">{e}</span>
              <span className="text-xs text-stone-400">{["Bad", "Low", "Okay", "Good", "Great"][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}