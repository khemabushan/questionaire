import { useState } from 'react'
import { ChevronDown, Lightbulb, MessageSquare, Copy, Check } from 'lucide-react'
import Badge from '../ui/Badge'
import clsx from 'clsx'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-700 transition-all"
      title="Copy question"
    >
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  )
}

function AccordionSection({ icon: Icon, label, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-t border-surface-100 dark:border-surface-700/50">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors"
      >
        <span className="flex items-center gap-2 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
          <Icon size={13} />
          {label}
        </span>
        <ChevronDown
          size={14}
          className={clsx(
            'text-surface-400 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>
      {open && (
        <div className="px-5 pb-4 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  )
}

export default function QuestionCard({ question, index, category }) {
  const { questionText, expectedAnswer, followUpQuestions = [], tags = [] } = question

  return (
    <div className="card group animate-slide-up hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start gap-3">
          {/* Number bubble */}
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-bold mt-0.5">
            {index}
          </div>

          {/* Question text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <Badge variant={category}>{category}</Badge>
              <CopyButton text={questionText} />
            </div>
            <p className="text-sm font-medium text-surface-900 dark:text-surface-100 leading-relaxed">
              {questionText}
            </p>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded-md bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400 font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expected Answer */}
      <AccordionSection icon={Lightbulb} label="Expected Answer">
        <div className="bg-brand-50 dark:bg-brand-950/50 border border-brand-100 dark:border-brand-900 rounded-xl p-4">
          <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
            {expectedAnswer}
          </p>
        </div>
      </AccordionSection>

      {/* Follow-up Questions (only for technical) */}
      {followUpQuestions.length > 0 && (
        <AccordionSection icon={MessageSquare} label={`Follow-ups (${followUpQuestions.length})`}>
          <ol className="space-y-2">
            {followUpQuestions.map((fq, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-surface-200 dark:bg-surface-700 text-surface-500 dark:text-surface-400 flex items-center justify-center text-xs font-semibold mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{fq}</p>
              </li>
            ))}
          </ol>
        </AccordionSection>
      )}
    </div>
  )
}
