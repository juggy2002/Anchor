import { useNavigate } from "react-router-dom"
import Logo from "./Logo"

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    { icon: "🏠", title: "Sobriety tracker", desc: "Count every day. Celebrate every milestone from your first 24 hours to one full year and beyond." },
    { icon: "📓", title: "Daily journal", desc: "Reflect on your day with guided prompts. Log cravings, wins, and everything in between." },
    { icon: "💬", title: "AI companion", desc: "Talk to Anchor any time of day or night. Warm, non-judgmental support powered by AI." },
    { icon: "📅", title: "Mood calendar", desc: "See your emotional journey mapped out over time. Understand your patterns and progress." },
    { icon: "🧭", title: "UK resources", desc: "Instant access to UKNA helpline, NHS addiction support, meeting finders and coping tools." },
    { icon: "🔒", title: "Private and secure", desc: "Your data is yours. Everything is stored securely and never shared with third parties." },
  ]

  const stats = [
    { number: "Free", label: "Always free for users" },
    { number: "AI", label: "Powered companion" },
    { number: "24/7", label: "Always available" },
  ]

  const testimonials = [
    { quote: "Having something to check in with every day made a real difference in my early recovery.", days: "47 days sober" },
    { quote: "The AI companion does not judge. It just listens. That is exactly what I needed at 3am.", days: "112 days sober" },
    { quote: "Simple, calm, and always there. Anchor feels like it was made for people like me.", days: "8 months sober" },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'DM Serif Display', serif; }
        .fade-in { animation: fadeIn 0.8s ease forwards; }
        .fade-in-2 { animation: fadeIn 0.8s ease 0.2s forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-50/90 backdrop-blur-sm border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Logo className="h-8" />
         <div className="flex items-center gap-3">
  <button
    onClick={() => navigate("/app")}
    className="text-stone-500 text-sm px-4 py-2 rounded-full border border-stone-200 hover:border-emerald-300 transition-colors"
  >
    Log in
  </button>
  <button
    onClick={() => navigate("/app")}
    className="bg-emerald-700 text-white text-sm px-5 py-2 rounded-full hover:bg-emerald-800 transition-colors"
  >
    For providers
  </button>
</div>
        </div>
      </nav>

      <section className="pt-32 pb-24 px-6 max-w-5xl mx-auto fade-in">
        <div className="max-w-2xl">
          <div className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
            Recovery Companion
          </div>
          <h1 className="serif text-5xl text-stone-800 leading-tight mb-6">
            You don't have to do this alone.
          </h1>
          <p className="text-stone-500 text-lg leading-relaxed mb-8 max-w-xl">
            Anchor is a free recovery companion for people overcoming addiction. Track your sobriety, reflect through journaling, and talk to an AI companion that is always there. No judgment, just support.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate("/app")}
              className="bg-emerald-700 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-emerald-800 transition-colors"
            >
              Get started — it's free
            </button>
            <button
              onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })}
              className="text-stone-500 px-8 py-3 rounded-full text-sm border border-stone-200 hover:border-emerald-300 transition-colors"
            >
              Learn more
            </button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 max-w-sm fade-in-2">
          {stats.map((s, i) => (
            <div key={i} className="bg-white border border-stone-100 rounded-2xl p-4 text-center">
              <p className="text-2xl font-medium text-emerald-700 mb-1">{s.number}</p>
              <p className="text-xs text-stone-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-4">Features</p>
          <h2 className="serif text-4xl text-stone-800 mb-12 max-w-lg">Everything you need in one place</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-medium text-stone-700 mb-2">{f.title}</h3>
                <p className="text-sm text-stone-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-6 bg-emerald-700">
        <div className="max-w-5xl mx-auto md:flex gap-16 items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <p className="text-emerald-300 text-xs uppercase tracking-widest mb-4">Our story</p>
            <h2 className="serif text-4xl text-white mb-6 leading-tight">
              Built by someone in recovery, for people in recovery.
            </h2>
            <p className="text-emerald-100 leading-relaxed mb-4">
              Anchor was built by Jugaad Singh, who went through his own recovery journey with One Recovery Bucks in High Wycombe. He knows first-hand what it feels like to need support at 2am when a craving hits and to not know where to turn.
            </p>
            <p className="text-emerald-100 leading-relaxed">
              Anchor is the tool he wished he had. Free for anyone in recovery, always. No subscriptions, no ads, no judgment.
            </p>
          </div>
          <div className="md:w-1/2 bg-emerald-800 rounded-2xl p-8">
            <p className="text-emerald-200 text-sm italic leading-relaxed mb-4">
              Recovery is hard enough without having to navigate it alone. Anchor exists to make sure no one has to.
            </p>
            <p className="text-emerald-300 text-sm font-medium">Jugaad Singh, Founder</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-4">Testimonials</p>
          <h2 className="serif text-4xl text-stone-800 mb-12">What people are saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-stone-50 border border-stone-100 rounded-2xl p-6">
                <p className="text-stone-600 text-sm leading-relaxed italic mb-4">{t.quote}</p>
                <p className="text-stone-400 text-xs">Anonymous · {t.days}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 bg-stone-50">
        <div className="max-w-5xl mx-auto md:flex justify-between items-center">
          <div className="mb-8 md:mb-0">
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-4">Contact</p>
            <h2 className="serif text-4xl text-stone-800 mb-4">Get in touch</h2>
            <p className="text-stone-400 text-sm max-w-md leading-relaxed">
              Are you a healthcare provider, recovery service, or employer interested in trialling Anchor? We would love to hear from you.
            </p>
          </div>
          <a
            href="mailto:info@anchor-recovery.co.uk"
            className="inline-block bg-emerald-700 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-emerald-800 transition-colors"
          >
            info@anchor-recovery.co.uk
          </a>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="md:flex gap-16">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <p className="text-xs uppercase tracking-widest text-stone-400 mb-4">Privacy Policy</p>
              <div className="text-sm text-stone-500 leading-relaxed space-y-3">
                <p>Anchor takes your privacy seriously. All personal data is stored securely using Supabase and is never sold or shared with third parties.</p>
                <p>We collect only the data necessary to provide the service: your email address, sobriety start date, journal entries, and mood logs. This data is associated with your account and is only accessible by you.</p>
                <p>You can delete your account and all associated data at any time by contacting us at hello@anchorrecovery.co.uk.</p>
                <p>Anchor uses the Anthropic Claude API to power the AI companion. Messages sent to the companion are processed by Anthropic in accordance with their privacy policy. We do not store companion conversation history.</p>
                <p>We use no advertising, no tracking pixels, and no third-party analytics.</p>
              </div>
            </div>
            <div className="md:w-1/2">
              <p className="text-xs uppercase tracking-widest text-stone-400 mb-4">Terms and Conditions</p>
              <div className="text-sm text-stone-500 leading-relaxed space-y-3">
                <p>Anchor is a support companion tool and is not a substitute for professional medical or psychiatric care. If you are in crisis, please call 999 or the UKNA helpline on 0300 999 1212.</p>
                <p>By using Anchor you agree to use the app responsibly and in accordance with its intended purpose of supporting recovery.</p>
                <p>Anchor is provided free of charge. We reserve the right to modify or discontinue the service at any time.</p>
                <p>The AI companion is powered by artificial intelligence and may not always provide appropriate responses. Always seek professional help for serious mental health concerns.</p>
                <p>You must be 18 or over to use Anchor.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 bg-stone-50 border-t border-stone-100">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Logo className="h-6" />
          <p className="text-xs text-stone-400">2026 Anchor Recovery. Built with care in the UK.</p>
        </div>
      </footer>
    </div>
  )
}
