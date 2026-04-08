import { useState, useEffect } from "react"
import ReactCalendar from "react-calendar"
import { supabase } from "../supabase"

const moodEmojis = ["😔", "😕", "😐", "🙂", "😊"]
const moodColours = [
  "bg-red-100 text-red-400",
  "bg-orange-100 text-orange-400",
  "bg-yellow-100 text-yellow-500",
  "bg-emerald-100 text-emerald-500",
  "bg-emerald-200 text-emerald-700",
]

const milestoneMap = {
  1: "🌱", 7: "🌿", 30: "🌳", 60: "🌲", 90: "🌴", 365: "⭐"
}

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
    const start = new Date(sobrietyStart)
    start.setHours(0, 0, 0, 0)
    const target = new Date(date)
    target.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (target > today) return null
    const diff = Math.round((target - start) / (1000 * 60 * 60 * 24)) + 1
    return milestoneMap[diff] || null
  }

  const getTileContent = ({ date, view }) => {
    if (view !== "month") return null
    const key = date.toISOString().split("T")[0]
    const mood = moods[key]
    const milestone = getMilestoneForDate(date)

    return (
      <div className="flex flex-col items-center gap-0.5 mt-0.5">
        {mood !== undefined && (
          <span className="text-xs">{moodEmojis[mood]}</span>
        )}
        {milestone && (
          <span className="text-xs">{milestone}</span>
        )}
      </div>
    )
  }

  const getTileClassName = ({ date, view }) => {
    if (view !== "month") return ""
    const key = date.toISOString().split("T")[0]
    const mood = moods[key]
    if (mood !== undefined) return `rounded-xl ${moodColours[mood]}`
    return "rounded-xl"
  }

  const selectedKey = selected ? `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, "0")}-${String(selected.getDate()).padStart(2, "0")}` : null
  const selectedMood = selected ? moods[selectedKey] : null
  const selectedMilestone = selected ? getMilestoneForDate(selected) : null
  const selectedDays = selected && sobrietyStart
    ? (() => {
        const start = new Date(sobrietyStart)
        start.setHours(0, 0, 0, 0)
        const target = new Date(selected)
        target.setHours(0, 0, 0, 0)
        return Math.round((target - start) / (1000 * 60 * 60 * 24)) + 1
      })()
    : null

  return (
    <div className="p-5">
      <h1 className="font-serif text-3xl text-emerald-700 mt-3">Calendar</h1>
      <p className="text-stone-400 text-sm mb-5">Your mood and milestone history</p>

      <style>{`
        .react-calendar {
          width: 100%;
          border: none;
          background: transparent;
          font-family: inherit;
        }
        .react-calendar__tile {
          padding: 6px 2px;
          font-size: 12px;
          border-radius: 10px;
        }
        .react-calendar__tile--now {
          background: #ecfdf5 !important;
          color: #047857;
          font-weight: 600;
        }
        .react-calendar__tile--active {
          background: #047857 !important;
          color: white !important;
          border-radius: 10px;
        }
        .react-calendar__navigation button {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          background: none;
          border: none;
          padding: 8px;
        }
        .react-calendar__month-view__weekdays {
          font-size: 11px;
          color: #9ca3af;
          text-transform: uppercase;
          font-weight: 500;
        }
        .react-calendar__month-view__weekdays abbr {
          text-decoration: none;
        }
      `}</style>

      <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-5">
        <ReactCalendar
          tileContent={getTileContent}
          tileClassName={getTileClassName}
          onClickDay={setSelected}
          activeStartDate={activeStartDate}
          onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
        />
      </div>

      {selected && (
        <div className="bg-white border border-stone-200 rounded-xl p-4 mb-5">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">
            {selected.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          {selectedDays !== null && selectedDays >= 1 && (
            <p className="text-sm text-stone-600 mb-2">Day <span className="font-medium text-emerald-700">{selectedDays}</span> of your recovery</p>
          )}
          {selectedMood !== undefined && selectedMood !== null ? (
            <p className="text-sm text-stone-600">
              Mood: {moodEmojis[selectedMood]} <span className="text-stone-400">{["Struggling", "Low", "Okay", "Good", "Great"][selectedMood]}</span>
            </p>
          ) : (
            <p className="text-sm text-stone-400">No mood logged this day</p>
          )}
          {selectedMilestone && (
            <p className="text-sm text-stone-600 mt-2">Milestone reached: {selectedMilestone}</p>
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