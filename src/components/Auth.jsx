import { useState } from "react"
import { supabase } from "../supabase"
import Logo from "./Logo"

export default function Auth() {
  const [mode, setMode] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleSignup = async () => {
    setLoading(true)
    setError("")
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        name,
        sobriety_start: new Date().toISOString().split("T")[0],
      })
      setMessage("Account created! Please check your email to confirm your account, then log in.")
      setMode("login")
    }
    setLoading(false)
  }

  const handleReset = async () => {
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) setError(error.message)
    else setMessage("Password reset email sent!")
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-2">
  <Logo className="h-14" />
</div>
        <p className="text-stone-400 text-sm text-center mb-8">Your recovery companion</p>

        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <h2 className="text-lg font-medium text-stone-700 mb-5 text-center">
            {mode === "login" && "Welcome back"}
            {mode === "signup" && "Create your account"}
            {mode === "reset" && "Reset your password"}
          </h2>

          {message && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {mode === "signup" && (
            <div className="mb-3">
              <label className="text-xs uppercase tracking-widest text-stone-400 mb-1 block">Your name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="First name"
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="text-xs uppercase tracking-widest text-stone-400 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          {mode !== "reset" && (
            <div className="mb-5">
              <label className="text-xs uppercase tracking-widest text-stone-400 mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
              />
            </div>
          )}

          <button
            onClick={mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleReset}
            disabled={loading}
            className="w-full bg-emerald-700 text-white py-3 rounded-xl text-sm font-medium hover:bg-emerald-800 transition-colors disabled:opacity-50 mb-4"
          >
            {loading ? "Please wait..." : mode === "login" ? "Log in" : mode === "signup" ? "Create account" : "Send reset email"}
          </button>

          <div className="flex flex-col gap-2 text-center">
            {mode === "login" && (
              <>
                <button onClick={() => { setMode("signup"); setError(""); setMessage("") }} className="text-xs text-stone-400 hover:text-emerald-600">
                  Don't have an account? Sign up
                </button>
                <button onClick={() => { setMode("reset"); setError(""); setMessage("") }} className="text-xs text-stone-400 hover:text-emerald-600">
                  Forgot password?
                </button>
              </>
            )}
            {mode !== "login" && (
              <button onClick={() => { setMode("login"); setError(""); setMessage("") }} className="text-xs text-stone-400 hover:text-emerald-600">
                Back to login
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-stone-300 text-center mt-6 leading-relaxed">
          Anchor is a support companion, not a medical service. If you are in crisis please call 999 or the UKNA helpline on 0300 999 1212.
        </p>
      </div>
    </div>
  )
}