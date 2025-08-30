"use client";

// BotChat Pro - Settings Page
// User settings, subscription management, and account preferences

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { 
  User, 
  CreditCard, 
  Shield, 
  Bell, 
  Globe,
  Key,
  Trash2,
  CheckCircle,
  XCircle,
  Crown,
  Zap
} from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  limits: {
    bots: number;
    messages: number;
    contacts: number;
  };
  popular?: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    features: [
      "1 Bot",
      "100 Nachrichten/Monat",
      "50 Kontakte",
      "Basic Support"
    ],
    limits: {
      bots: 1,
      messages: 100,
      contacts: 50,
    },
  },
  {
    id: "starter",
    name: "Starter",
    price: 49,
    interval: "month",
    features: [
      "5 Bots",
      "1.000 Nachrichten/Monat",
      "500 Kontakte",
      "Priority Support",
      "Analytics Dashboard",
      "WhatsApp Templates"
    ],
    limits: {
      bots: 5,
      messages: 1000,
      contacts: 500,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    interval: "month",
    popular: true,
    features: [
      "20 Bots",
      "10.000 Nachrichten/Monat",
      "5.000 Kontakte",
      "Priority Support",
      "Advanced Analytics",
      "Custom Integrations",
      "AI-Enhanced Responses",
      "Multi-Team Access"
    ],
    limits: {
      bots: 20,
      messages: 10000,
      contacts: 5000,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    interval: "month",
    features: [
      "Unlimited Bots",
      "Unlimited Nachrichten",
      "Unlimited Kontakte",
      "24/7 Dedicated Support",
      "Custom Analytics",
      "White-Label Solution",
      "API Access",
      "Custom Integrations",
      "SLA Guarantee"
    ],
    limits: {
      bots: 999999,
      messages: 999999,
      contacts: 999999,
    },
  },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("account");
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    security: true,
    botAlerts: true,
  });

  const currentPlan = subscriptionPlans.find(plan => 
    plan.id === (session?.user?.subscriptionTier || "free")
  ) || subscriptionPlans[0];

  const handleUpgrade = (planId: string) => {
    // In production, integrate with Stripe
    alert(`Upgrade zu ${planId} Plan wird implementiert...`);
  };

  const handleDeleteAccount = () => {
    if (confirm("Sind Sie sicher, dass Sie Ihr Konto löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      // In production, call delete API
      alert("Konto-Löschung wird implementiert...");
    }
  };

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "notifications", label: "Benachrichtigungen", icon: Bell },
    { id: "security", label: "Sicherheit", icon: Shield },
    { id: "api", label: "API Keys", icon: Key },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>
        <p className="text-gray-600">
          Verwalten Sie Ihr Konto, Subscription und Präferenzen
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Account Tab */}
        {activeTab === "account" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={session?.user?.name || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    value={session?.user?.email || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Account Actions</h4>
              <div className="space-y-3">
                <Button variant="outline" onClick={() => signOut()}>
                  Abmelden
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleDeleteAccount}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Konto löschen
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === "subscription" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Aktueller Plan</h3>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 flex items-center">
                      {currentPlan.name}
                      {currentPlan.popular && (
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                          Popular
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600">
                      €{currentPlan.price}/{currentPlan.interval === "month" ? "Monat" : "Jahr"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Nächste Abrechnung</p>
                    <p className="font-medium text-gray-900">
                      {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Verfügbare Pläne</h4>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {subscriptionPlans.map(plan => (
                  <div 
                    key={plan.id} 
                    className={`p-4 border rounded-lg ${
                      plan.popular 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200"
                    }`}
                  >
                    <div className="text-center mb-4">
                      {plan.popular && (
                        <div className="flex items-center justify-center mb-2">
                          <Crown className="h-4 w-4 text-blue-600 mr-1" />
                          <span className="text-xs font-medium text-blue-700">Beliebt</span>
                        </div>
                      )}
                      <h5 className="font-semibold text-gray-900">{plan.name}</h5>
                      <p className="text-2xl font-bold text-gray-900">
                        €{plan.price}
                        <span className="text-sm font-normal text-gray-600">
                          /{plan.interval === "month" ? "Monat" : "Jahr"}
                        </span>
                      </p>
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={currentPlan.id === plan.id}
                      className="w-full"
                      variant={currentPlan.id === plan.id ? "outline" : "default"}
                    >
                      {currentPlan.id === plan.id ? "Aktueller Plan" : "Upgraden"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Benachrichtigungseinstellungen</h3>
              <div className="space-y-4">
                {[
                  {
                    key: "email",
                    title: "E-Mail Benachrichtigungen",
                    description: "Erhalten Sie wichtige Updates per E-Mail"
                  },
                  {
                    key: "marketing",
                    title: "Marketing E-Mails",
                    description: "Produktupdates und Tipps erhalten"
                  },
                  {
                    key: "security",
                    title: "Sicherheitswarnungen",
                    description: "Benachrichtigungen über Sicherheitsereignisse"
                  },
                  {
                    key: "botAlerts",
                    title: "Bot Alerts",
                    description: "Benachrichtigungen über Bot-Status und Fehler"
                  }
                ].map(setting => (
                  <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{setting.title}</h4>
                      <p className="text-sm text-gray-600">{setting.description}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({
                        ...prev,
                        [setting.key]: !prev[setting.key as keyof typeof prev]
                      }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications[setting.key as keyof typeof notifications]
                          ? "bg-blue-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notifications[setting.key as keyof typeof notifications]
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sicherheitseinstellungen</h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Passwort</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Sie sind über Google angemeldet. Passwort-Einstellungen verwalten Sie in Ihrem Google-Konto.
                  </p>
                  <Button variant="outline" size="sm">
                    Google-Konto verwalten
                  </Button>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Zwei-Faktor-Authentifizierung</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Zusätzliche Sicherheit für Ihr Konto aktivieren.
                  </p>
                  <Button variant="outline" size="sm">
                    2FA aktivieren
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Tab */}
        {activeTab === "api" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">API Keys</h3>
              <p className="text-sm text-gray-600 mb-4">
                Erstellen und verwalten Sie API Keys für externe Integrationen.
              </p>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Noch keine API Keys</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Erstellen Sie Ihren ersten API Key, um BotChat Pro in andere Anwendungen zu integrieren.
                </p>
                <Button variant="outline" size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  Ersten API Key erstellen
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
