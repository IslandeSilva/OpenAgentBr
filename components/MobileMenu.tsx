'use client'

import { useState } from 'react'
import { Menu, X, Home, Bot, Settings, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/agents', label: 'Agentes', icon: Bot },
    { href: '/stats', label: 'Estatísticas', icon: BarChart3 },
    { href: '/settings', label: 'Configurações', icon: Settings },
  ]

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out lg:hidden">
            <div className="p-4">
              {/* Close Button */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  OpenAgentBr
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              
              {/* Theme Toggle */}
              <div className="mb-6">
                <ThemeToggle />
              </div>
              
              {/* Navigation */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  )
}
