import { useEffect, useState } from 'react'
import { Brain, Sparkles, FileText, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

const STEPS = [
  { icon: Brain, label: 'Analyzing job role and requirements', duration: 800 },
  { icon: Sparkles, label: 'Generating technical questions', duration: 900 },
  { icon: FileText, label: 'Crafting behavioral & HR questions', duration: 700 },
  { icon: CheckCircle2, label: 'Adding follow-ups and expected answers', duration: 600 },
]

export default function LoadingAnimation({ jobRole, experienceLevel, difficultyLevel }) {
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])

  useEffect(() => {
    let stepIndex = 0
    let elapsed = 0

    const advance = () => {
      if (stepIndex < STEPS.length - 1) {
        elapsed += STEPS[stepIndex].duration
        const currentStep = stepIndex
        setTimeout(() => {
          setCompletedSteps((prev) => [...prev, currentStep])
          stepIndex++
          setActiveStep(stepIndex)
          advance()
        }, elapsed)
      }
    }

    advance()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in">
      {/* Pulsing orb */}
      <div className="relative mb-12">
        <div className="w-24 h-24 rounded-full bg-brand-600 flex items-center justify-center shadow-lg animate-pulse-slow">
          <Brain size={36} className="text-white" />
        </div>
        <div className="absolute inset-0 rounded-full bg-brand-400 opacity-20 scale-125 animate-ping" />
        <div className="absolute inset-0 rounded-full bg-brand-500 opacity-10 scale-150 animate-ping" style={{ animationDelay: '0.3s' }} />
      </div>

      {/* Job context */}
      <h2 className="text-xl font-semibold text-surface-900 dark:text-white text-center mb-1">
        Generating your interview kit
      </h2>
      <p className="text-sm text-surface-500 dark:text-surface-400 text-center mb-10">
        <span className="text-brand-600 dark:text-brand-400 font-medium">{jobRole}</span>
        {' · '}{experienceLevel}
        {' · '}{difficultyLevel}
      </p>

      {/* Steps */}
      <div className="w-full max-w-sm space-y-3">
        {STEPS.map((step, i) => {
          const Icon = step.icon
          const isDone = completedSteps.includes(i)
          const isActive = activeStep === i
          const isPending = !isDone && !isActive

          return (
            <div
              key={i}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500',
                isDone && 'bg-brand-50 dark:bg-brand-950 border-brand-200 dark:border-brand-800',
                isActive && 'bg-white dark:bg-surface-800 border-brand-400 dark:border-brand-600 shadow-sm',
                isPending && 'bg-surface-50 dark:bg-surface-850 border-surface-200 dark:border-surface-700 opacity-40'
              )}
            >
              <div
                className={clsx(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300',
                  isDone && 'bg-brand-600 text-white',
                  isActive && 'bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400',
                  isPending && 'bg-surface-200 dark:bg-surface-700 text-surface-400'
                )}
              >
                {isActive ? (
                  <span className="flex gap-0.5">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="w-1 h-1 rounded-full bg-brand-600 dark:bg-brand-400 animate-bounce-dot"
                        style={{ animationDelay: `${dot * 0.16}s` }}
                      />
                    ))}
                  </span>
                ) : (
                  <Icon size={16} />
                )}
              </div>
              <span
                className={clsx(
                  'text-sm font-medium transition-colors duration-300',
                  isDone && 'text-brand-700 dark:text-brand-300',
                  isActive && 'text-surface-900 dark:text-surface-100',
                  isPending && 'text-surface-400'
                )}
              >
                {step.label}
              </span>
              {isDone && (
                <CheckCircle2 size={14} className="ml-auto text-brand-600 dark:text-brand-400 flex-shrink-0" />
              )}
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm mt-8">
        <div className="h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${((completedSteps.length + (activeStep < STEPS.length ? 0.5 : 0)) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-surface-400 text-center mt-2">
          This usually takes 10–20 seconds
        </p>
      </div>
    </div>
  )
}
