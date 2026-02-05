import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/lib/contexts/ThemeContext'

export const metadata: Metadata = {
  title: 'OpenAgentBr - Plataforma de Agentes de IA',
  description: 'Crie e gerencie agentes de IA usando OpenRouter com autenticação Supabase',
  keywords: 'IA, Agentes, OpenRouter, Supabase, Next.js, Brasil',
  authors: [{ name: 'OpenAgentBr' }],
  openGraph: {
    title: 'OpenAgentBr - Plataforma de Agentes de IA',
    description: 'Crie e gerencie agentes de IA usando OpenRouter',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
