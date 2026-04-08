import { useState, useRef, useEffect } from "react"

const SYSTEM_PROMPT = `You are Anchor, a warm and compassionate recovery companion built into an app for people recovering from addiction. You are not a therapist or medical professional, but you are a caring, non-judgmental presence.

Your role is to:
- Listen with empathy and without judgment
- Offer emotional support and encouragement
- Suggest healthy coping strategies when appropriate
- Remind users of their strength and progress
- Gently direct users to professional help or the UKNA helpline (0300 999 1212) if they seem in crisis

Keep responses concise, warm, and human. Never lecture. Never be preachy. Talk like a caring friend who understands recovery. If someone is in immediate danger, always recommend calling 999 or the UKNA helpline.`

export default function Companion() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm Anchor. I'm here whenever you need someone to talk to — no judgment, just support. How are you doing today?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const suggestions = [
    "I'm having a craving",
    "I need a coping strategy",
    "I'm feeling proud of myself",
    "I'm struggling today",
  ]

  const sendMessage = async (text) => {
    const userMessage = { role: "user", content: text }
    const updated = [...messages, userMessage]
    setMessages(updated)
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: updated,
        }),
      })

      const data = await response.json()
      const reply = data.content?.[0]?.text || "I'm here. Can you tell me more?"
      setMessages([...updated, { role: "assistant", content: reply }])
    } catch (err) {
      setMessages([...updated, {
        role: "assistant",
        content: "I'm having trouble connecting right now. If you need urgent support, please call the UKNA helpline on 0300 999 1212.",
      }])
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <div className="p-5 pb-2">
        <h1 className="font-serif text-3xl text-emerald-700 mt-3">Companion</h1>
        <p className="text-stone-400 text-sm">Here whenever you need support</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-3 pb-48">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-emerald-700 text-white rounded-br-sm"
                  : "bg-white border border-stone-200 text-stone-700 rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-sm bg-stone-50 px-5 pt-3 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="flex-shrink-0 text-xs bg-white border border-stone-200 text-stone-500 px-3 py-1.5 rounded-full whitespace-nowrap hover:border-emerald-300 hover:text-emerald-700 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && input.trim() && sendMessage(input.trim())}
            placeholder="Say anything..."
            className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400"
          />
          <button
            onClick={() => input.trim() && sendMessage(input.trim())}
            className="bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-800 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}