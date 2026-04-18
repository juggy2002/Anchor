import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../supabase"
import Logo from "./Logo"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  const handleReset = async () => {
    if (!password || !confirm) { setError("Please fill in both fields"); return }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return }
    if (password !== confirm) { setError("Passwords do not match"); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true)
    setTimeout(() => navigate("/app"), 2000)
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-2">
          <Logo className="h-14" />
        </div>
        <p className="text-stone-400 text-sm text-center mb-8">Set your new password</p>

        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <h2 className="text-lg font-medium text-stone-700 mb-5 text-center">Reset password</h2>

          {done ? (
            <p className="text-emerald-600 text-sm text-center">Password updated! Redirecting...</p>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">{error}</div>
              )}
              <div className="mb-4">
                <label className="text-xs uppercase tracking-widest text-stone-400 mb-1 block">New password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div className="mb-5">
                <label className="text-xs uppercase tracking-widest text-stone-400 mb-1 block">Confirm password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>
              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full bg-emerald-700 text-white py-3 rounded-xl text-sm font-medium hover:bg-emerald-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Updating..." : "Set new password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}