import { Code2, Users, Building2 } from 'lucide-react'
import QuestionCard from './QuestionCard'
import clsx from 'clsx'

const CATEGORY_META = {
  technical: {
    icon: Code2,
    label: 'Technical Questions',
    description: 'Role-specific technical depth with follow-up probes',
    accent: 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950',
    iconClass: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900',
    countClass: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900',
  },
  behavioral: {
    icon: Users,
    label: 'Behavioral Questions',
    description: 'STAR-method questions to assess soft skills and experience',
    accent: 'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950',
    iconClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900',
    countClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900',
  },
  hr: {
    icon: Building2,
    label: 'HR Questions',
    description: 'Culture fit, expectations, and career trajectory',
    accent: 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950',
    iconClass: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900',
    countClass: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900',
  },
}

export default function CategorySection({ category, questions }) {
  const meta = CATEGORY_META[category] ?? CATEGORY_META.hr
  const Icon = meta.icon

  let questionNumber = 0

  return (
    <section id={`section-${category}`} className="scroll-mt-24">
      {/* Section header */}
      <div className={clsx('flex items-center gap-4 p-4 rounded-2xl border mb-5', meta.accent)}>
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', meta.iconClass)}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-surface-900 dark:text-surface-100 text-base">
            {meta.label}
          </h2>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
            {meta.description}
          </p>
        </div>
        <span className={clsx('px-3 py-1 rounded-full text-sm font-bold flex-shrink-0', meta.countClass)}>
          {questions.length}
        </span>
      </div>

      {/* Question cards */}
      <div className="space-y-4">
        {questions.map((q) => {
          questionNumber++
          return (
            <QuestionCard
              key={q._id}
              question={q}
              index={questionNumber}
              category={category}
            />
          )
        })}
      </div>
    </section>
  )
}
