import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabase"
import Logo from "./Logo"

export default function Onboarding({ session }) {
  const [name, setName] = useState("")
  const [sobrietyDate, setSobrietyDate] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    if (!session) navigate("/app")
  }, [session])

  const handleSubmit = async () => {
    if (!name.trim() || !sobrietyDate || !password) {
      setError("Please fill in all fields")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)

    const { error: passwordError } = await supabase.auth.updateUser({ password })
    if (passwordError) {
      setError(passwordError.message)
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: session.user.id,
        name,
        sobriety_start: sobrietyDate,
      }, { onConflict: "id" })

    if (profileError) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
      return
    }

    navigate("/app")
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-2">
          <Logo className="h-14" />
        </div>
        <p className="text-stone-400 text-sm text-center mb-8">Let's get you set up</p>

        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <h2 className="text-lg font-medium text-stone-700 mb-2 text-center">Welcome to Anchor</h2>
          <p className="text-sm text-stone-400 text-center mb-6">Just a couple of things to get started</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="text-xs uppercase tracking-widest text-stone-400 mb-1 block">Your first name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="First name"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="mb-4">
            <label className="text-xs uppercase tracking-widest text-stone-400 mb-1 block">Your sobriety start date</label>
            <input
              type="date"
              value={sobrietyDate}
              onChange={e => setSobrietyDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
            />
            <p className="text-xs text-stone-400 mt-1">The date you started your recovery journey</p>
          </div>

          <div className="mb-4">
            <label className="text-xs uppercase tracking-widest text-stone-400 mb-1 block">Create a password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="mb-6">
            <label className="text-xs uppercase tracking-widest text-stone-400 mb-1 block">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-emerald-700 text-white py-3 rounded-xl text-sm font-medium hover:bg-emerald-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Setting up..." : "Get started"}
          </button>
        </div>

        <p className="text-xs text-stone-300 text-center mt-6 leading-relaxed">
          Anchor is a support companion, not a medical service. If you are in crisis please call 999 or the UKNA helpline on 0300 999 1212.
        </p>
      </div>
    </div>
  )
}