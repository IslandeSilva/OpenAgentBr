import Link from 'next/link'
import { Bot, Zap, Shield, TrendingUp, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">OpenAgentBr</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Começar Grátis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Crie Agentes de IA
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Personalizados
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Plataforma brasileira para criar, gerenciar e conversar com agentes de IA
            usando os melhores modelos do OpenRouter
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/login"
              className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <span>Começar Agora</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 text-lg font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 border border-gray-300"
            >
              Saiba Mais
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Por que usar o OpenAgentBr?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Bot className="h-10 w-10 text-blue-600" />}
            title="Agentes Personalizados"
            description="Crie agentes com personalidades e comportamentos únicos usando system prompts customizáveis"
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-yellow-600" />}
            title="Múltiplos Modelos"
            description="Escolha entre GPT-4, Claude, Gemini, Llama e outros modelos de ponta"
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-green-600" />}
            title="Seguro e Privado"
            description="Autenticação robusta com Supabase e proteção de dados garantida"
          />
          <FeatureCard
            icon={<TrendingUp className="h-10 w-10 text-purple-600" />}
            title="Dashboard de Uso"
            description="Acompanhe métricas, custos e uso de créditos em tempo real"
          />
        </div>
      </section>

      {/* Models Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Modelos Disponíveis
        </h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {models.map((model) => (
            <div
              key={model}
              className="p-4 bg-white rounded-lg border border-gray-200 text-center hover:border-blue-500 transition-colors"
            >
              <p className="font-medium text-gray-900">{model}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Crie sua conta gratuitamente e comece a usar agentes de IA hoje mesmo
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 text-lg font-medium text-blue-600 bg-white rounded-lg hover:bg-gray-100"
          >
            Criar Conta Grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 OpenAgentBr. Feito com ❤️ no Brasil 🇧🇷</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

const models = [
  'GPT-4 Turbo',
  'GPT-3.5 Turbo',
  'Claude 3 Opus',
  'Claude 3 Sonnet',
  'Gemini Pro',
  'Llama 3 70B',
  'Mistral Medium',
]
