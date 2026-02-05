'use client'

import { useTheme } from '@/lib/contexts/ThemeContext'
import { Sun, Moon, Monitor, LucideIcon } from 'lucide-react'

type Theme = 'light' | 'dark' | 'system'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const themes: Array<{ value: Theme; icon: LucideIcon; label: string }> = [
    { value: 'light', icon: Sun, label: 'Claro' },
    { value: 'dark', icon: Moon, label: 'Escuro' },
    { value: 'system', icon: Monitor, label: 'Sistema' },
  ]

  return (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-2 rounded-md transition-colors ${
            theme === value
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          title={label}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}
