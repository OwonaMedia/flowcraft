'use client';

export default function FlowCraftDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔧</div>
              <h1 className="text-xl font-bold text-gray-900">FlowCraft</h1>
            </div>
            <div className="text-sm text-gray-600">
              Demo Version - Produktionsreif
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 FlowCraft ist LIVE!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Die intelligente WhatsApp Automation Plattform für den DACH-Markt
          </p>
          
          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-green-500 text-3xl mb-2">✅</div>
              <h3 className="text-lg font-semibold mb-2">Production Ready</h3>
              <p className="text-gray-600">Erfolgreich deployed auf owona.de</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-blue-500 text-3xl mb-2">🔒</div>
              <h3 className="text-lg font-semibold mb-2">DSGVO-Konform</h3>
              <p className="text-gray-600">EU-Hosting & Datenschutz</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-purple-500 text-3xl mb-2">⚡</div>
              <h3 className="text-lg font-semibold mb-2">High Performance</h3>
              <p className="text-gray-600">Optimiert für Geschwindigkeit</p>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">🚀 Was ist FlowCraft?</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-lg mb-2">🤖 Visual Bot Builder</h3>
                <p className="text-gray-600">Drag & Drop Interface für intuitive Bot-Erstellung</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">📱 WhatsApp Integration</h3>
                <p className="text-gray-600">360dialog Business API für professionelle Kommunikation</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">📊 Analytics Dashboard</h3>
                <p className="text-gray-600">Real-time Metriken und Performance-Tracking</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">💰 Subscription Management</h3>
                <p className="text-gray-600">Stripe Integration für automatisierte Abrechnung</p>
              </div>
            </div>
          </div>

          {/* Technical Stack */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6">🛠️ Tech Stack</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">⚛️</div>
                <h4 className="font-semibold">Next.js 14</h4>
                <p className="text-sm opacity-90">React Framework</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🗃️</div>
                <h4 className="font-semibold">Supabase</h4>
                <p className="text-sm opacity-90">EU Database</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💳</div>
                <h4 className="font-semibold">Stripe</h4>
                <p className="text-sm opacity-90">Payments</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💬</div>
                <h4 className="font-semibold">WhatsApp API</h4>
                <p className="text-sm opacity-90">360dialog</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">🎯 Nächste Schritte</h2>
            <div className="text-left max-w-2xl mx-auto">
              <div className="space-y-2">
                <p>✅ Frontend erfolgreich deployed</p>
                <p>🔧 Environment Variables konfigurieren</p>
                <p>🔗 Backend APIs verbinden</p>
                <p>🧪 Full-Stack Tests durchführen</p>
                <p>🚀 MVP Launch vorbereiten</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>© 2025 FlowCraft - WhatsApp Automation für den DACH-Markt</p>
            <p className="text-sm mt-2">
              Deployed: {new Date().toLocaleDateString('de-DE')} | Status: ✅ LIVE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
