"use client";

// FlowCraft - Demo Page
// Vollständige Demo der WhatsApp Bot SaaS-Plattform

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Wrench, 
  MessageSquare, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Clock
} from "lucide-react";

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    // Setze Demo-Modus im localStorage
    localStorage.setItem("demo-mode", "true");
  }, []);

  const handleDemoLogin = () => {
    // Direkter Zugang zum Dashboard im Demo-Modus
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">FlowCraft</h1>
                <p className="text-sm text-gray-500">Demo-Modus</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleDemoLogin}>
                <Play className="h-4 w-4 mr-2" />
                Live Demo starten
              </Button>
              <Link href="/signin">
                <Button>Anmelden</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4 mr-2" />
            Interaktive Demo verfügbar
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Intelligente WhatsApp-Workflows<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              für deutsche Unternehmen
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            FlowCraft ist die führende WhatsApp Bot SaaS-Plattform. 
            Erstellen Sie intelligente Automatisierungen in Minuten - 
            100% DSGVO-konform und EU-gehostet.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" onClick={handleDemoLogin} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Play className="h-5 w-5 mr-2" />
              Kostenlose Demo testen
            </Button>
            <Button variant="outline" size="lg">
              <MessageSquare className="h-5 w-5 mr-2" />
              WhatsApp Integration
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-8 mb-16 text-gray-500">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">DSGVO-konform</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span className="text-sm font-medium">EU-gehostet</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">360dialog Partner</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span className="text-sm font-medium">Enterprise-ready</span>
          </div>
        </div>

        {/* Demo Video/Screenshot Placeholder */}
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <span className="text-white font-medium">FlowCraft Dashboard - Live Demo</span>
              </div>
            </div>
            <div className="p-8 bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Bot Builder */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Visual Bot Builder</h3>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Wrench className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Drag & Drop Interface mit React Flow</p>
                  <div className="space-y-2">
                    <div className="h-2 bg-blue-200 rounded"></div>
                    <div className="h-2 bg-blue-200 rounded w-3/4"></div>
                    <div className="h-2 bg-blue-200 rounded w-1/2"></div>
                  </div>
                </div>

                {/* WhatsApp Integration */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">WhatsApp Business</h3>
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">360dialog EU Business API</p>
                  <div className="space-y-2">
                    <div className="h-2 bg-green-200 rounded"></div>
                    <div className="h-2 bg-green-200 rounded w-4/5"></div>
                    <div className="h-2 bg-green-200 rounded w-2/3"></div>
                  </div>
                </div>

                {/* Analytics */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Real-time Analytics</h3>
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Performance & Engagement Tracking</p>
                  <div className="space-y-2">
                    <div className="h-2 bg-purple-200 rounded"></div>
                    <div className="h-2 bg-purple-200 rounded w-5/6"></div>
                    <div className="h-2 bg-purple-200 rounded w-3/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Alles was Sie für erfolgreiche WhatsApp-Automation brauchen
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              FlowCraft bietet alle Tools für professionelle WhatsApp-Kommunikation - 
              von einfachen Chatbots bis zu komplexen Automation-Workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Wrench,
                title: "Visual Flow Builder",
                description: "Intuitive Drag & Drop Oberfläche für Bot-Erstellung ohne Programmierung"
              },
              {
                icon: MessageSquare,
                title: "WhatsApp Business API",
                description: "Offizielle 360dialog Integration für EU-konforme WhatsApp-Kommunikation"
              },
              {
                icon: Shield,
                title: "DSGVO-konform",
                description: "100% EU-gehostet mit automatischer Datenlöschung und Consent Management"
              },
              {
                icon: Zap,
                title: "KI-Integration",
                description: "Lokale Phi-3-mini AI für intelligente Antworten und OpenAI Fallback"
              },
              {
                icon: Users,
                title: "Multi-Tenant SaaS",
                description: "Skalierbare Architektur für Agenturen und Enterprise-Kunden"
              },
              {
                icon: TrendingUp,
                title: "Analytics Dashboard",
                description: "Detaillierte Einblicke in Performance, Engagement und Conversions"
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Transparente Preise für jeden Bedarf
            </h2>
            <p className="text-gray-600">
              Keine Setup-Gebühren, keine versteckten Kosten - 14 Tage kostenlos testen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "29€",
                period: "/Monat",
                features: ["1.000 Nachrichten", "1 WhatsApp Nummer", "Grundlegende Flows", "E-Mail Support"],
                popular: false
              },
              {
                name: "Professional",
                price: "79€",
                period: "/Monat",
                features: ["10.000 Nachrichten", "3 WhatsApp Nummern", "KI-Integration", "Priority Support"],
                popular: true
              },
              {
                name: "Enterprise",
                price: "299€",
                period: "/Monat",
                features: ["Unbegrenzte Nachrichten", "White-Label", "On-Premise Option", "Dedicated Support"],
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className={`bg-white rounded-lg p-6 ${plan.popular ? 'ring-2 ring-blue-600 shadow-lg' : 'shadow-sm'}`}>
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                    Beliebtester Plan
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={handleDemoLogin}
                >
                  Demo testen
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bereit für intelligente WhatsApp-Automation?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Starten Sie noch heute mit FlowCraft und revolutionieren Sie Ihre Kundenkommunikation
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Button size="lg" variant="secondary" onClick={handleDemoLogin}>
              <Play className="h-5 w-5 mr-2" />
              Kostenlose Demo starten
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              <Clock className="h-5 w-5 mr-2" />
              14 Tage kostenlos testen
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                <Wrench className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">FlowCraft</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>© 2024 FlowCraft. Alle Rechte vorbehalten.</span>
              <Link href="/privacy" className="hover:text-gray-900">Datenschutz</Link>
              <Link href="/terms" className="hover:text-gray-900">AGB</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}