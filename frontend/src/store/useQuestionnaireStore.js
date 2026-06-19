import { create } from 'zustand'

const useQuestionnaireStore = create((set) => ({
  // Form inputs
  jobRole: '',
  experienceLevel: '',
  difficultyLevel: '',

  // Generation state
  isLoading: false,
  error: null,

  // Results
  questionnaire: null,

  // Actions
  setField: (field, value) => set({ [field]: value }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setQuestionnaire: (questionnaire) => set({ questionnaire }),

  reset: () =>
    set({
      jobRole: '',
      experienceLevel: '',
      difficultyLevel: '',
      isLoading: false,
      error: null,
      questionnaire: null,
    }),

  clearResults: () => set({ questionnaire: null, error: null }),
}))

export default useQuestionnaireStore
