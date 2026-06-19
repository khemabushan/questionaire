import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, AlertCircle } from 'lucide-react'
import RoleInputForm from '../components/questionnaire/RoleInputForm'
import LoadingAnimation from '../components/ui/LoadingAnimation'
import useQuestionnaireStore from '../store/useQuestionnaireStore'

export default function GeneratePage() {
  const navigate = useNavigate()
  const { isLoading, error, questionnaire, jobRole, experienceLevel, difficultyLevel, setError } =
    useQuestionnaireStore()

  // If results already exist, go straight to results
  useEffect(() => {
    if (questionnaire) {
      navigate('/results', { replace: true })
    }
  }, [questionnaire, navigate])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-50 dark:bg-surface-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {isLoading ? (
          <LoadingAnimation
            jobRole={jobRole}
            experienceLevel={experienceLevel}
            difficultyLevel={difficultyLevel}
          />
        ) : (
          <>
            {/* Page header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 mb-4 shadow-sm">
                <Sparkles size={22} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
                Generate Interview Questions
              </h1>
              <p className="text-surface-500 dark:text-surface-400 text-sm">
                Fill in the details below. GPT-4 handles the rest.
              </p>
            </div>

            {/* Error alert */}
            {error && (
              <div className="flex items-start gap-3 p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 animate-fade-in">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Generation failed</p>
                  <p className="text-xs mt-0.5 opacity-80">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-400 hover:text-red-600 transition-colors text-xs"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Form card */}
            <div className="card p-6 sm:p-8">
              <RoleInputForm />
            </div>

            {/* Fine print */}
            <p className="text-center text-xs text-surface-400 dark:text-surface-600 mt-6">
              Questions are generated fresh each time. No two kits are identical.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
