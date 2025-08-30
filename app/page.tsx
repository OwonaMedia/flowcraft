"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Wrench, Zap, Shield, BarChart3, MessageSquare, Users } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();

  // Redirect authenticated users to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FlowCraft</span>
            </div>
            <Button variant="outline">
              Anmelden
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Das {" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Handwerk der Automatisierung
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Erschaffen Sie intelligente Workflows für WhatsApp, Email und mehr - 100% DSGVO-konform, 
              ohne Programmierkenntnisse und mit der Präzision deutscher Handwerkskunst.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                <Wrench className="mr-2 h-5 w-5" />
                Workflow starten
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/demo">Demo testen</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Meisterhafte Automation
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Die perfekte Balance zwischen deutscher Handwerkskunst und modernster Technologie
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Wrench,
                title: "Visual Flow Builder",
                description: "Erschaffen Sie Workflows visuell - mit der Präzision eines Meisters."
              },
              {
                icon: Shield,
                title: "100% DSGVO-konform",
                description: "EU-Server, lokale AI, automatische PII-Filterung."
              },
              {
                icon: Zap,
                title: "Deutsche AI-Power",
                description: "Lokale KI-Verarbeitung - Ihre Daten bleiben in Deutschland."
              },
              {
                icon: MessageSquare,
                title: "Multi-Channel Automation",
                description: "WhatsApp, Email, SMS - alle Kanäle in einer Plattform."
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description: "Bot Performance und Customer Insights in Echtzeit."
              },
              {
                icon: Users,
                title: "Handwerk-Templates",
                description: "Branchenspezifische Vorlagen - von Meistern für Meister."
              }
            ].map((feature) => (
              <div key={feature.title} className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                  <feature.icon className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-600 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Bereit für Ihren ersten Workflow?
            </h2>
            <p className="mt-4 text-lg text-amber-100">
              Starten Sie heute kostenlos - keine Kreditkarte erforderlich.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary">
                FlowCraft starten
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FlowCraft</span>
            </div>
            <p className="mt-4 text-gray-400">
              Made with ❤️ und Cursor AI für den DACH-Markt
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}