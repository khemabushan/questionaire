import clsx from 'clsx'

const VARIANTS = {
  technical: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 ring-1 ring-blue-100 dark:ring-blue-900',
  behavioral: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 ring-1 ring-emerald-100 dark:ring-emerald-900',
  hr: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 ring-1 ring-amber-100 dark:ring-amber-900',
  easy: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 ring-1 ring-green-100 dark:ring-green-900',
  medium: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300 ring-1 ring-orange-100 dark:ring-orange-900',
  hard: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 ring-1 ring-red-100 dark:ring-red-900',
  default: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400 ring-1 ring-surface-200 dark:ring-surface-700',
}

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={clsx(
        'badge font-medium capitalize',
        VARIANTS[variant] ?? VARIANTS.default,
        className
      )}
    >
      {children}
    </span>
  )
}
