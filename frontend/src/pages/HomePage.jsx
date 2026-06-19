import { Link } from 'react-router-dom'
import { Sparkles, Code2, Users, Building2, ChevronRight, Zap, Shield, Clock } from 'lucide-react'

const FEATURES = [
  {
    icon: Code2,
    title: '10 Technical Questions',
    description: 'Role-specific questions that probe real engineering depth, with follow-up probes built in.',
    color: 'text-blue-500 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
  },
  {
    icon: Users,
    title: '5 Behavioral Questions',
    description: 'STAR-method prompts that reveal how candidates think, collaborate, and handle adversity.',
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400',
  },
  {
    icon: Building2,
    title: '5 HR Questions',
    description: 'Culture fit and career trajectory questions aligned to seniority and company stage.',
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950 dark:text-amber-400',
  },
  {
    icon: Zap,
    title: 'Follow-up Probes',
    description: 'Every technical question ships with 3 deeper follow-ups to separate good from great.',
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-950 dark:text-purple-400',
  },
  {
    icon: Shield,
    title: 'Expected Answers',
    description: 'Calibrated model answers for every question — know exactly what good looks like.',
    color: 'text-rose-500 bg-rose-50 dark:bg-rose-950 dark:text-rose-400',
  },
  {
    icon: Clock,
    title: 'Ready in Seconds',
    description: 'GPT-4 generates a complete, structured interview kit in under 20 seconds.',
    color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950 dark:text-cyan-400',
  },
]

const ROLES = [
  'Frontend Developer', 'Backend Engineer', 'DevOps Engineer',
  'Data Scientist', 'Product Manager', 'ML Engineer', 'QA Engineer', 'UX Designer',
]

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white dark:bg-surface-900">
        {/* Grid texture */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 dark:opacity-20 pointer-events-none" />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-400 opacity-5 dark:opacity-10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-8">
            <Sparkles size={12} />
            Powered by GPT-4
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-surface-900 dark:text-white leading-tight text-balance mb-6">
            Interview questions
            <br />
            <span className="text-brand-600 dark:text-brand-400">tailored to the role</span>
          </h1>

          <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Enter a job role, experience level, and difficulty. Get a complete interview kit —
            20 questions across technical, behavioral, and HR categories, with follow-ups and expected answers.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/generate" className="btn-primary text-base px-7 py-3.5 shadow-sm shadow-brand-200 dark:shadow-brand-900">
              <Sparkles size={18} />
              Generate questions
              <ChevronRight size={16} />
            </Link>
            <a href="#features" className="btn-secondary text-base px-6 py-3.5">
              See what you get
            </a>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 mt-14 pt-10 border-t border-surface-100 dark:border-surface-800">
            {[
              { value: '20', label: 'Questions per kit' },
              { value: '3', label: 'Follow-ups per technical Q' },
              { value: '<20s', label: 'Generation time' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-surface-900 dark:text-white">{value}</div>
                <div className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role chips ─────────────────────────────────────────────── */}
      <section className="py-8 bg-surface-50 dark:bg-surface-850 border-y border-surface-200 dark:border-surface-800 overflow-hidden">
        <div className="flex gap-2 animate-none">
          <div className="flex gap-2 flex-wrap justify-center max-w-6xl mx-auto px-4">
            {ROLES.map((role) => (
              <Link
                key={role}
                to={`/generate`}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all shadow-sm"
              >
                {role}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section id="features" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="section-label mb-3">What you get</p>
          <h2 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">
            A complete interview kit, not just a list
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mt-3 max-w-xl mx-auto">
            Every generated kit is structured, calibrated to seniority, and ready to use in a live interview.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="card p-5 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-2">{title}</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────── */}
      <section className="py-16 bg-brand-600 dark:bg-brand-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to run better interviews?
          </h2>
          <p className="text-brand-200 mb-8 text-lg">
            Generate a tailored kit for any role in seconds.
          </p>
          <Link to="/generate" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-brand-700 font-semibold text-base hover:bg-brand-50 transition-colors shadow-sm">
            <Sparkles size={18} />
            Start generating
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
