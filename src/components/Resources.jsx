export default function Resources() {
  return (
    <div className="p-5">
      <h1 className="font-serif text-3xl text-emerald-700 mt-3">Resources</h1>
      <p className="text-stone-400 text-sm mb-5">Support is always available</p>

      <p className="text-xs uppercase tracking-widest text-red-400 mb-3">Crisis support</p>
      <div className="flex flex-col gap-3 mb-5">
        <a href="tel:03009991212" className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-3">
          <span className="text-2xl">📞</span>
          <div>
            <p className="text-sm font-medium text-stone-700">UKNA Helpline</p>
            <p className="text-xs text-stone-400">0300 999 1212 · 10am to midnight daily</p>
          </div>
        </a>
        <a href="tel:111" className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-3">
          <span className="text-2xl">🏥</span>
          <div>
            <p className="text-sm font-medium text-stone-700">NHS 111</p>
            <p className="text-xs text-stone-400">24/7 · For urgent medical help</p>
          </div>
        </a>
        <a href="tel:999" className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-3">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="text-sm font-medium text-stone-700">Emergency Services</p>
            <p className="text-xs text-stone-400">999 · Immediate danger only</p>
          </div>
        </a>
      </div>

      <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">Narcotics Anonymous</p>
      <div className="flex flex-col gap-3 mb-5">
        <a href="https://ukna.org/meetings/search" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl p-3">
          <span className="text-2xl">📍</span>
          <div>
            <p className="text-sm font-medium text-stone-700">Find a meeting near you</p>
            <p className="text-xs text-stone-400">1,600+ meetings across the UK</p>
          </div>
        </a>
        <a href="https://ukna.org/meetings/online" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl p-3">
          <span className="text-2xl">💻</span>
          <div>
            <p className="text-sm font-medium text-stone-700">Online meetings</p>
            <p className="text-xs text-stone-400">Join from anywhere, any time</p>
          </div>
        </a>
        <a href="https://ukna.org" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl p-3">
          <span className="text-2xl">🌿</span>
          <div>
            <p className="text-sm font-medium text-stone-700">UKNA website</p>
            <p className="text-xs text-stone-400">ukna.org</p>
          </div>
        </a>
      </div>

      <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">NHS Support</p>
      <div className="flex flex-col gap-3 mb-5">
        <a href="https://www.nhs.uk/live-well/addiction-support/" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl p-3">
          <span className="text-2xl">💙</span>
          <div>
            <p className="text-sm font-medium text-stone-700">NHS addiction support</p>
            <p className="text-xs text-stone-400">Advice, treatment and local services</p>
          </div>
        </a>
        <a href="https://www.talktofrank.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl p-3">
          <span className="text-2xl">💬</span>
          <div>
            <p className="text-sm font-medium text-stone-700">Talk to Frank</p>
            <p className="text-xs text-stone-400">Free · Confidential · 0300 123 6600</p>
          </div>
        </a>
      </div>

      <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">Coping tools</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <p className="text-sm font-medium text-stone-700 mb-1">🫁 Box breathing</p>
          <p className="text-xs text-stone-400 leading-relaxed">Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4 times. Use when a craving hits.</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <p className="text-sm font-medium text-stone-700 mb-1">🧘 5-4-3-2-1 grounding</p>
          <p className="text-xs text-stone-400 leading-relaxed">Name 5 things you see, 4 you hear, 3 you can touch, 2 you smell, 1 you taste. Brings you back to the present.</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <p className="text-sm font-medium text-stone-700 mb-1">🌊 Urge surfing</p>
          <p className="text-xs text-stone-400 leading-relaxed">Cravings peak and pass like waves. Observe without acting on it. Most cravings pass within 15 to 30 minutes.</p>
        </div>
      </div>
    </div>
  )
}