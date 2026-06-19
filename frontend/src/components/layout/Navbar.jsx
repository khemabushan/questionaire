import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun, Menu, X, Zap } from 'lucide-react'
import useThemeStore from '../../store/useThemeStore'
import clsx from 'clsx'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/generate', label: 'Generate' },
]

export default function Navbar() {
  const { theme, toggleTheme } = useThemeStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <header className="sticky top-0 z-50 border-b border-surface-200 dark:border-surface-800 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm group-hover:bg-brand-700 transition-colors">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-semibold text-base tracking-tight text-surface-900 dark:text-white">
            Questionaire
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                isActive(to)
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                  : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-800'
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="btn-ghost w-9 h-9 p-0 rounded-lg"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-surface-400" />
            ) : (
              <Moon size={18} className="text-surface-500" />
            )}
          </button>

          {/* CTA */}
          <Link to="/generate" className="hidden sm:flex btn-primary text-xs px-4 py-2">
            Start Generating
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="sm:hidden btn-ghost w-9 h-9 p-0 rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 px-4 py-3 flex flex-col gap-1 animate-fade-in">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                'px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive(to)
                  ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300'
                  : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            to="/generate"
            onClick={() => setMobileOpen(false)}
            className="btn-primary mt-2 text-sm"
          >
            Start Generating
          </Link>
        </div>
      )}
    </header>
  )
}
