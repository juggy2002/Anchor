import { useState, useEffect } from "react"

export default function Profile() {
  const [days, setDays] = useState(0)
  const [journalCount, setJournalCount] = useState(0)
  const [name, setName] = useState("")
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [editingDate, setEditingDate] = useState(false)
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("sobrietyStart")
    if (stored) {
      const diff = Math.floor((Date.now() - new Date(stored)) / (1000 * 60 * 60 * 24))
      setDays(diff)
      setStartDate(new Date(stored).toISOString().split("T")[0])
    }
    const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]")
    setJournalCount(entries.length)
    const storedName = localStorage.getItem("userName") || ""
    setName(storedName)
    setTempName(storedName)
  }, [])

  const milestones = [1, 7, 30, 60, 90, 365]
  const milestonesUnlocked = milestones.filter(m => days >= m).length

  const saveName = () => {
    localStorage.setItem("userName", tempName)
    setName(tempName)
    setEditingName(false)
  }

  const saveDate = (val) => {
    const newDate = new Date(val).toISOString()
    localStorage.setItem("sobrietyStart", newDate)
    const diff = Math.floor((Date.now() - new Date(newDate)) / (1000 * 60 * 60 * 24))
    setDays(diff)
    setStartDate(val)
    setEditingDate(false)
  }

  const resetData = () => {
    if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const initials = name
    ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  return (
    <div className="p-5">
      <h1 className="font-serif text-3xl text-emerald-700 mt-3">Profile</h1>
      <p className="text-stone-400 text-sm mb-5">Your recovery journey</p>

      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xl font-bold mb-3">
          {initials}
        </div>
        {editingName ? (
          <div className="flex gap-2 items-center">
            <input
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              className="border border-stone-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:border-emerald-400"
              placeholder="Your name"
              autoFocus
            />
            <button onClick={saveName} className="text-emerald-700 text-sm font-medium">Save</button>
          </div>
        ) : (
          <button onClick={() => setEditingName(true)} className="text-stone-600 font-medium text-base">
            {name || "Add your name"} ✏️
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-emerald-700">{days}</p>
          <p className="text-xs text-stone-400 mt-1">Days sober</p>
        </div>
        <div className="bg-stone-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-stone-600">{journalCount}</p>
          <p className="text-xs text-stone-400 mt-1">Journal entries</p>
        </div>
        <div className="bg-stone-100 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-stone-600">{milestonesUnlocked}</p>
          <p className="text-xs text-stone-400 mt-1">Milestones</p>
        </div>
      </div>

      <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">Sobriety start date</p>
      <div className="bg-white border border-stone-200 rounded-xl p-4 mb-5">
        {editingDate ? (
          <input
            type="date"
            value={startDate}
            onChange={e => saveDate(e.target.value)}
            className="text-sm text-stone-700 focus:outline-none"
          />
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-sm text-stone-700">
              {startDate ? new Date(startDate).toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric"
              }) : "Not set"}
            </p>
            <button onClick={() => setEditingDate(true)} className="text-xs text-emerald-600">Edit</button>
          </div>
        )}
      </div>

      <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">Settings</p>
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex justify-between items-center bg-white border border-stone-200 rounded-xl px-4 py-3">
          <p className="text-sm text-stone-700">Daily check-in reminder</p>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-10 h-6 rounded-full transition-colors ${notifications ? "bg-emerald-600" : "bg-stone-200"}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${notifications ? "translate-x-4" : ""}`} />
          </button>
        </div>
      </div>

      <button
        onClick={resetData}
        className="w-full text-red-400 text-sm py-3 border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
      >
        Reset all data
      </button>
    </div>
  )
}