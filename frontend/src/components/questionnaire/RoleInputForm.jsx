import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, ChevronDown, Briefcase, BarChart2, Target } from 'lucide-react'
import useQuestionnaireStore from '../../store/useQuestionnaireStore'
import { generateQuestionnaire } from '../../api/questionnaire.api'
import clsx from 'clsx'

const EXPERIENCE_LEVELS = [
  { value: 'junior', label: 'Junior (0–2 years)' },
  { value: 'mid', label: 'Mid-Level (2–5 years)' },
  { value: 'senior', label: 'Senior (5–8 years)' },
  { value: 'lead', label: 'Lead / Principal (8+ years)' },
]

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy — Core concepts', color: 'text-green-600 dark:text-green-400' },
  { value: 'medium', label: 'Medium — Applied skills', color: 'text-orange-600 dark:text-orange-400' },
  { value: 'hard', label: 'Hard — Expert-level', color: 'text-red-600 dark:text-red-400' },
]

const POPULAR_ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Engineer',
  'DevOps Engineer', 'Data Scientist', 'Product Manager',
  'UX Designer', 'ML Engineer', 'QA Engineer',
]

function SelectField({ label, icon: Icon, value, onChange, options, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-surface-700 dark:text-surface-300">
        <Icon size={14} className="text-brand-500" />
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={clsx(
            'select-field pr-10',
            !value && 'text-surface-400 dark:text-surface-500'
          )}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none" />
      </div>
    </div>
  )
}

export default function RoleInputForm() {
  const navigate = useNavigate()
  const { jobRole, experienceLevel, difficultyLevel, isLoading, setField, setLoading, setError, setQuestionnaire } =
    useQuestionnaireStore()

  const [roleInputFocused, setRoleInputFocused] = useState(false)

  const isValid = jobRole.trim().length > 0 && experienceLevel && difficultyLevel

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid || isLoading) return

    setLoading(true)
    setError(null)

    try {
      const res = await generateQuestionnaire({
        jobRole: jobRole.trim(),
        experienceLevel,
        difficultyLevel,
      })

      const data = res.data?.data ?? res.data
      setQuestionnaire(data)
      navigate('/results')
    } catch (err) {
      setError(err.response?.data?.error ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Job Role Input */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-surface-700 dark:text-surface-300">
          <Briefcase size={14} className="text-brand-500" />
          Job Role
        </label>
        <input
          type="text"
          value={jobRole}
          onChange={(e) => setField('jobRole', e.target.value)}
          onFocus={() => setRoleInputFocused(true)}
          onBlur={() => setTimeout(() => setRoleInputFocused(false), 150)}
          placeholder="e.g. Senior React Developer"
          className="input-field"
          autoComplete="off"
          maxLength={100}
        />

        {/* Quick-pick chips */}
        {roleInputFocused && (
          <div className="flex flex-wrap gap-1.5 pt-1 animate-fade-in">
            {POPULAR_ROLES.filter((r) =>
              !jobRole || r.toLowerCase().includes(jobRole.toLowerCase())
            ).slice(0, 6).map((role) => (
              <button
                key={role}
                type="button"
                onMouseDown={() => setField('jobRole', role)}
                className="px-2.5 py-1 text-xs rounded-lg bg-surface-100 dark:bg-surface-700 
                           text-surface-600 dark:text-surface-300 
                           hover:bg-brand-50 dark:hover:bg-brand-950 hover:text-brand-700 dark:hover:text-brand-300
                           border border-surface-200 dark:border-surface-600 transition-all"
              >
                {role}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Experience Level */}
      <SelectField
        label="Experience Level"
        icon={BarChart2}
        value={experienceLevel}
        onChange={(v) => setField('experienceLevel', v)}
        options={EXPERIENCE_LEVELS}
        placeholder="Select level"
      />

      {/* Difficulty */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-surface-700 dark:text-surface-300">
          <Target size={14} className="text-brand-500" />
          Difficulty Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTY_LEVELS.map(({ value, label, color }) => (
            <button
              key={value}
              type="button"
              onClick={() => setField('difficultyLevel', value)}
              className={clsx(
                'px-3 py-3 rounded-xl text-sm font-medium border transition-all duration-150 text-center',
                difficultyLevel === value
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 shadow-sm'
                  : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:border-surface-300 dark:hover:border-surface-600'
              )}
            >
              <span className={clsx('block text-xs font-semibold capitalize', difficultyLevel === value ? '' : color)}>
                {value}
              </span>
              <span className="block text-xs mt-0.5 opacity-70 hidden sm:block">
                {label.split('—')[1]?.trim()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* What you'll get */}
      <div className="rounded-xl bg-surface-50 dark:bg-surface-850 border border-surface-200 dark:border-surface-700 p-4">
        <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
          You'll receive
        </p>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { count: '10', label: 'Technical Qs' },
            { count: '5', label: 'Behavioral Qs' },
            { count: '5', label: 'HR Questions' },
          ].map(({ count, label }) => (
            <div key={label}>
              <div className="text-xl font-bold text-brand-600 dark:text-brand-400">{count}</div>
              <div className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-surface-400 dark:text-surface-500 text-center mt-3">
          + follow-up questions & expected answers for every question
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="btn-primary w-full py-3 text-sm gap-2"
      >
        <Sparkles size={16} />
        {isLoading ? 'Generating…' : 'Generate Interview Questions'}
      </button>
    </form>
  )
}
