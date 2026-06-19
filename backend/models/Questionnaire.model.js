import mongoose from 'mongoose'

const { Schema, model } = mongoose

// ── Follow-up sub-document ───────────────────────────────────────────────
// Stored as a plain string array on technical questions; no dedicated schema needed.

// ── Question sub-document ────────────────────────────────────────────────
const questionSchema = new Schema(
  {
    category: {
      type: String,
      enum: ['technical', 'behavioral', 'hr'],
      required: [true, 'Question category is required'],
    },
    orderIndex: {
      type: Number,
      required: true,
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
      maxlength: [2000, 'Question text cannot exceed 2000 characters'],
    },
    expectedAnswer: {
      type: String,
      required: [true, 'Expected answer is required'],
      trim: true,
      maxlength: [5000, 'Expected answer cannot exceed 5000 characters'],
    },
    // Only populated for technical questions
    followUpQuestions: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: 'A question can have at most 5 follow-ups',
      },
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { _id: true }
)

// ── Questionnaire document ────────────────────────────────────────────────
const questionnaireSchema = new Schema(
  {
    // Auth: owner reference (optional — present once auth is wired up)
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    // Inputs
    jobRole: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
      maxlength: [150, 'Job role cannot exceed 150 characters'],
    },
    experienceLevel: {
      type: String,
      required: [true, 'Experience level is required'],
      enum: {
        values: ['junior', 'mid', 'senior', 'lead'],
        message: 'Experience level must be junior, mid, senior, or lead',
      },
    },
    difficultyLevel: {
      type: String,
      required: [true, 'Difficulty level is required'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty level must be easy, medium, or hard',
      },
    },

    // AI output
    questions: {
      type: [questionSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one question is required',
      },
    },

    // Generation metadata
    modelUsed: {
      type: String,
      default: 'gpt-4o',
    },
    promptTokens: {
      type: Number,
      default: 0,
    },
    completionTokens: {
      type: Number,
      default: 0,
    },
    totalTokens: {
      type: Number,
      default: 0,
    },
    generationMs: {
      type: Number,
      default: 0,
      comment: 'Wall-clock milliseconds the OpenAI call took',
    },

    // User-facing metadata
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    isFavorited: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// ── Indexes ───────────────────────────────────────────────────────────────
questionnaireSchema.index({ createdAt: -1 })
questionnaireSchema.index({ userId: 1, createdAt: -1 })
questionnaireSchema.index({ jobRole: 'text' }) // full-text search on jobRole

// ── Virtuals ──────────────────────────────────────────────────────────────
questionnaireSchema.virtual('questionCount').get(function () {
  return this.questions?.length ?? 0
})

// ── Pre-save hooks ────────────────────────────────────────────────────────
questionnaireSchema.pre('save', function (next) {
  // Auto-generate a title if none provided
  if (!this.title) {
    this.title = `${this.jobRole} — ${capitalize(this.experienceLevel)} (${capitalize(this.difficultyLevel)})`
  }
  next()
})

// ── Static methods ────────────────────────────────────────────────────────
questionnaireSchema.statics.findActive = function (filter = {}) {
  return this.find({ ...filter, deletedAt: null })
}

// ── Instance methods ──────────────────────────────────────────────────────
questionnaireSchema.methods.softDelete = function () {
  this.deletedAt = new Date()
  return this.save()
}

questionnaireSchema.methods.byCategory = function (category) {
  return this.questions.filter((q) => q.category === category)
}

// ── Helpers ───────────────────────────────────────────────────────────────
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

const Questionnaire = model('Questionnaire', questionnaireSchema)
export default Questionnaire
