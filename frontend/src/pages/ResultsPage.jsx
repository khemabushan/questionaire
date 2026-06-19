import { useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { RotateCcw, Code2, Users, Building2, Download, Calendar, BarChart2, Target } from 'lucide-react'
import CategorySection from '../components/questionnaire/CategorySection'
import Badge from '../components/ui/Badge'
import useQuestionnaireStore from '../store/useQuestionnaireStore'

const CATEGORY_ORDER = ['technical', 'behavioral', 'hr']

const CATEGORY_NAV = [
  { id: 'technical', label: 'Technical', icon: Code2, color: 'text-blue-500' },
  { id: 'behavioral', label: 'Behavioral', icon: Users, color: 'text-emerald-500' },
  { id: 'hr', label: 'HR', icon: Building2, color: 'text-amber-500' },
]

function scrollToSection(id) {
  const el = document.getElementById(`section-${id}`)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function handlePrint() {
  window.print()
}

export default function ResultsPage() {
  const navigate = useNavigate()
  const { questionnaire, clearResults, jobRole, experienceLevel, difficultyLevel } =
    useQuestionnaireStore()

  useEffect(() => {
    if (!questionnaire) {
      navigate('/generate', { replace: true })
    }
  }, [questionnaire, navigate])

  if (!questionnaire) return null

  const { questions = [] } = questionnaire

  // Group by category
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = questions.filter((q) => q.category === cat)
    return acc
  }, {})

  const handleGenerateNew = () => {
    clearResults()
    navigate('/generate')
  }

  const formatDate = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Results header ── */}
        <div className="card p-6 mb-6 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant={difficultyLevel || 'medium'}>{difficultyLevel || 'medium'}</Badge>
                <Badge variant="default">{experienceLevel || questionnaire.experienceLevel}</Badge>
              </div>
              <h1 className="text-xl font-bold text-surface-900 dark:text-white truncate">
                {jobRole || questionnaire.jobRole} — Interview Kit
              </h1>
              <div className="flex items-center gap-4 mt-1.5 text-xs text-surface-400 dark:text-surface-500">
                {questionnaire.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {formatDate(questionnaire.createdAt)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <BarChart2 size={11} />
                  {questions.length} questions total
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={handlePrint} className="btn-secondary text-xs gap-1.5 py-2 px-3">
                <Download size={14} />
                Export
              </button>
              <button onClick={handleGenerateNew} className="btn-primary text-xs gap-1.5 py-2 px-3">
                <RotateCcw size={14} />
                New Kit
              </button>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-surface-100 dark:border-surface-700">
            {[
              { label: 'Technical', count: grouped.technical.length, icon: Code2, color: 'text-blue-500' },
              { label: 'Behavioral', count: grouped.behavioral.length, icon: Users, color: 'text-emerald-500' },
              { label: 'HR', count: grouped.hr.length, icon: Building2, color: 'text-amber-500' },
            ].map(({ label, count, icon: Icon, color }) => (
              <div key={label} className="text-center">
                <div className={`flex items-center justify-center gap-1 text-sm font-bold ${color}`}>
                  <Icon size={14} />
                  {count}
                </div>
                <div className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-6 items-start">
          {/* ── Sticky sidebar nav ── */}
          <aside className="hidden lg:block w-44 flex-shrink-0 sticky top-24">
            <div className="card p-3 space-y-1">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider px-2 py-1">
                Jump to
              </p>
              {CATEGORY_NAV.map(({ id, label, icon: Icon, color }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 hover:text-surface-900 dark:hover:text-surface-100 transition-all text-left"
                >
                  <Icon size={14} className={color} />
                  {label}
                  <span className="ml-auto text-xs text-surface-400 font-medium">
                    {grouped[id]?.length}
                  </span>
                </button>
              ))}

              <div className="border-t border-surface-200 dark:border-surface-700 pt-2 mt-2">
                <button
                  onClick={handleGenerateNew}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950 transition-all text-left font-medium"
                >
                  <RotateCcw size={14} />
                  New kit
                </button>
              </div>
            </div>
          </aside>

          {/* ── Question sections ── */}
          <div className="flex-1 min-w-0 space-y-10">
            {CATEGORY_ORDER.map((category) =>
              grouped[category]?.length > 0 ? (
                <div key={category} className="animate-slide-up">
                  <CategorySection
                    category={category}
                    questions={grouped[category]}
                  />
                </div>
              ) : null
            )}

            {/* Bottom actions */}
            <div className="card p-6 text-center">
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
                Want a different kit? Generate again with different parameters.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={handleGenerateNew} className="btn-primary gap-2">
                  <RotateCcw size={16} />
                  Generate new kit
                </button>
                <button onClick={handlePrint} className="btn-secondary gap-2">
                  <Download size={16} />
                  Export as PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
