import { Link } from 'react-router-dom'
import { Zap, Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-semibold text-sm text-surface-900 dark:text-white">
              Questionaire
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-surface-500 dark:text-surface-400">
            <Link to="/" className="hover:text-surface-900 dark:hover:text-surface-100 transition-colors">
              Home
            </Link>
            <Link to="/generate" className="hover:text-surface-900 dark:hover:text-surface-100 transition-colors">
              Generate
            </Link>
            <a href="#" className="hover:text-surface-900 dark:hover:text-surface-100 transition-colors">
              Privacy
            </a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="GitHub"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
            >
              <Github size={16} />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-surface-400 dark:text-surface-600 mt-8">
          © {new Date().getFullYear()} Questionaire. AI-powered interview preparation.
        </p>
      </div>
    </footer>
  )
}
