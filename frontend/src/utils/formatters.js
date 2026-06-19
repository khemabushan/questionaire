export function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function truncate(str, n = 80) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '…' : str
}

export const EXPERIENCE_LABELS = {
  junior: 'Junior (0–2 yrs)',
  mid: 'Mid-Level (2–5 yrs)',
  senior: 'Senior (5–8 yrs)',
  lead: 'Lead / Principal (8+ yrs)',
}

export const DIFFICULTY_LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}
