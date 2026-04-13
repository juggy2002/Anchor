import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import Logo from "./Logo"

export default function AdminDashboard({ session, orgId }) {
  const [org, setOrg] = useState(null)
  const [adminProfile, setAdminProfile] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviting, setInviting] = useState(false)
  const [inviteMessage, setInviteMessage] = useState("")
  const [selectedMember, setSelectedMember] = useState(null)
  const [memberMoods, setMemberMoods] = useState([])

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    const { data: orgData } = await supabase
      .from("organisations")
      .select("*")
      .eq("id", orgId)
      .single()
    setOrg(orgData)

    const { data: profileData } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", session.user.id)
      .single()
    setAdminProfile(profileData)

    const { data: memberData } = await supabase
      .from("organisation_members")
      .select("user_id, role, created_at")
      .eq("organisation_id", orgId)
      .eq("role", "member")

    if (memberData) {
      const enriched = await Promise.all(
        memberData.map(async (m) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name, sobriety_start")
            .eq("id", m.user_id)
            .single()

          const { data: moods } = await supabase
            .from("mood_logs")
            .select("date, mood")
            .eq("user_id", m.user_id)
            .order("date", { ascending: false })
            .limit(7)

          const { count: journalCount } = await supabase
            .from("journal_entries")
            .select("*", { count: "exact", head: true })
            .eq("user_id", m.user_id)

          const lastCheckIn = moods?.[0]?.date || null
          const today = new Date()
          const lastCheckInDate = lastCheckIn ? new Date(lastCheckIn) : null
          const daysSinceCheckIn = lastCheckInDate
            ? Math.floor((today - lastCheckInDate) / (1000 * 60 * 60 * 24))
            : null

          const sobrietyDays = profile?.sobriety_start
            ? Math.floor((today - new Date(profile.sobriety_start)) / (1000 * 60 * 60 * 24))
            : null

          const avgMood = moods?.length
            ? Math.round(moods.reduce((sum, m) => sum + m.mood, 0) / moods.length)
            : null

          return {
            user_id: m.user_id,
            name: profile?.name || "Unknown",
            sobriety_start: profile?.sobriety_start,
            sobrietyDays,
            lastCheckIn,
            daysSinceCheckIn,
            journalCount: journalCount || 0,
            avgMood,
            moods: moods || [],
            atRisk: daysSinceCheckIn === null || daysSinceCheckIn >= 3,
          }
        })
      )
      setMembers(enriched)
    }
    setLoading(false)
  }

  const fetchMemberMoods = async (userId) => {
    const { data } = await supabase
      .from("mood_logs")
      .select("date, mood")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(30)
    setMemberMoods(data || [])
  }

  const inviteClient = async () => {
  if (!inviteEmail.trim()) return
  setInviting(true)
  setInviteMessage("")
  try {
    const { data: { session } } = await supabase.auth.refreshSession()
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-client`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
          "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({
          email: inviteEmail,
          organisation_id: orgId,
        }),
      }
    )
    const result = await response.json()
    if (result.error) {
      setInviteMessage(`Error: ${result.error}`)
    } else {
      setInviteMessage(`Invite sent to ${inviteEmail}`)
      setInviteEmail("")
      await fetchDashboard()
    }
  } catch (err) {
    setInviteMessage("Could not send invite. Please try again.")
  }
  setInviting(false)
}
      const result = await response.json()
      if (result.error) {
        setInviteMessage(`Error: ${result.error}`)
      } else {
        setInviteMessage(`Invite sent to ${inviteEmail}`)
        setInviteEmail("")
        await fetchDashboard()
      }
    } catch (err) {
      setInviteMessage("Could not send invite. Please try again.")
    }
    setInviting(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const moodEmojis = ["😔", "😕", "😐", "🙂", "😊"]
  const moodLabels = ["Struggling", "Low", "Okay", "Good", "Great"]
  const moodColours = [
    "bg-red-100 text-red-600",
    "bg-orange-100 text-orange-600",
    "bg-yellow-100 text-yellow-600",
    "bg-emerald-100 text-emerald-600",
    "bg-emerald-200 text-emerald-700",
  ]

  const atRiskCount = members.filter(m => m.atRisk).length
  const avgSobrietyDays = members.length
    ? Math.round(members.filter(m => m.sobrietyDays !== null).reduce((sum, m) => sum + m.sobrietyDays, 0) / members.length)
    : 0

  const adminName = adminProfile?.name || session.user.email

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-emerald-700 text-sm">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Logo className="h-7" />
          <span className="text-stone-300">|</span>
          <span className="text-sm font-medium text-stone-600">{org?.name}</span>
          <span className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-xs font-medium text-stone-600">{adminName}</p>
          <button
            onClick={handleSignOut}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-stone-800 mb-1">Dashboard</h1>
          <p className="text-stone-400 text-sm">Overview of your clients' recovery progress</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-2xl font-medium text-emerald-700">{members.length}</p>
            <p className="text-xs text-stone-400 mt-1">Total clients</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-2xl font-medium text-emerald-700">{members.length - atRiskCount}</p>
            <p className="text-xs text-stone-400 mt-1">Active this week</p>
          </div>
          <div className={`border rounded-xl p-4 ${atRiskCount > 0 ? "bg-red-50 border-red-200" : "bg-white border-stone-200"}`}>
            <p className={`text-2xl font-medium ${atRiskCount > 0 ? "text-red-600" : "text-emerald-700"}`}>{atRiskCount}</p>
            <p className="text-xs text-stone-400 mt-1">Need check-in</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-2xl font-medium text-emerald-700">{avgSobrietyDays}</p>
            <p className="text-xs text-stone-400 mt-1">Avg days sober</p>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 mb-8">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">Invite a client</p>
          <div className="flex gap-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="client@email.com"
              className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
            />
            <button
              onClick={inviteClient}
              disabled={inviting}
              className="bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-800 transition-colors disabled:opacity-50"
            >
              {inviting ? "Sending..." : "Send invite"}
            </button>
          </div>
          {inviteMessage && (
            <p className="text-sm text-emerald-600 mt-2">{inviteMessage}</p>
          )}
        </div>

        <div className="mb-4 flex justify-between items-center">
          <p className="text-xs uppercase tracking-widest text-stone-400">Clients</p>
          {selectedMember && (
            <button
              onClick={() => { setSelectedMember(null); setMemberMoods([]) }}
              className="text-xs text-stone-400 hover:text-stone-600"
            >
              Back to all clients
            </button>
          )}
        </div>

        {!selectedMember ? (
          <div className="flex flex-col gap-3">
            {members.length === 0 && (
              <div className="bg-white border border-stone-200 rounded-xl p-8 text-center">
                <p className="text-stone-400 text-sm">No clients yet. Invite your first client above.</p>
              </div>
            )}
            {members.map((m, i) => (
              <div
                key={i}
                onClick={() => { setSelectedMember(m); fetchMemberMoods(m.user_id) }}
                className={`bg-white border rounded-xl p-4 cursor-pointer hover:border-emerald-200 transition-all ${m.atRisk ? "border-red-200 bg-red-50/30" : "border-stone-200"}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      {m.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-700">{m.name}</p>
                      <p className="text-xs text-stone-400">
                        {m.sobrietyDays !== null ? `${m.sobrietyDays} days sober` : "No start date set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {m.avgMood !== null && (
                      <span className={`text-xs px-2 py-1 rounded-full ${moodColours[m.avgMood]}`}>
                        {moodEmojis[m.avgMood]} {moodLabels[m.avgMood]}
                      </span>
                    )}
                    {m.atRisk && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        No check-in
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-6 mt-3 pt-3 border-t border-stone-100">
                  <div>
                    <p className="text-xs text-stone-400">Last check-in</p>
                    <p className="text-xs font-medium text-stone-600">
                      {m.lastCheckIn
                        ? m.daysSinceCheckIn === 0 ? "Today"
                        : m.daysSinceCheckIn === 1 ? "Yesterday"
                        : `${m.daysSinceCheckIn} days ago`
                        : "Never"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">Journal entries</p>
                    <p className="text-xs font-medium text-stone-600">{m.journalCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400">7-day mood</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {m.moods.slice(0, 7).reverse().map((mood, j) => (
                        <div
                          key={j}
                          className={`w-3 h-3 rounded-sm ${
                            mood.mood <= 1 ? "bg-red-300" :
                            mood.mood === 2 ? "bg-yellow-300" :
                            "bg-emerald-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xl font-medium">
                {selectedMember.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <h2 className="text-lg font-medium text-stone-700">{selectedMember.name}</h2>
                <p className="text-sm text-stone-400">
                  {selectedMember.sobrietyDays !== null ? `${selectedMember.sobrietyDays} days sober` : "No start date set"}
                  {selectedMember.sobriety_start && ` · Started ${new Date(selectedMember.sobriety_start).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-stone-50 rounded-xl p-3 text-center">
                <p className="text-xl font-medium text-emerald-700">{selectedMember.sobrietyDays ?? "—"}</p>
                <p className="text-xs text-stone-400 mt-1">Days sober</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-3 text-center">
                <p className="text-xl font-medium text-stone-600">{selectedMember.journalCount}</p>
                <p className="text-xs text-stone-400 mt-1">Journal entries</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-3 text-center">
                <p className="text-xl font-medium text-stone-600">
                  {selectedMember.avgMood !== null ? moodEmojis[selectedMember.avgMood] : "—"}
                </p>
                <p className="text-xs text-stone-400 mt-1">Avg mood</p>
              </div>
            </div>

            <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">30-day mood history</p>
            <div className="flex flex-wrap gap-1.5">
              {memberMoods.length === 0 && (
                <p className="text-sm text-stone-400">No mood data yet</p>
              )}
              {memberMoods.map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span className="text-sm">{moodEmojis[m.mood]}</span>
                  <span className="text-xs text-stone-300">{new Date(m.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}