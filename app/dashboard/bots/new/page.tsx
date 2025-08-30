"use client";

// BotChat Pro - Create New Bot Page
// Template selection and bot creation wizard

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  ArrowLeft, 
  ArrowRight,
  Zap,
  MessageSquare,
  ShoppingCart,
  Calendar,
  Users,
  HeadphonesIcon,
  Sparkles
} from "lucide-react";

const botTemplates = [
  {
    id: "blank",
    name: "Leerer Bot",
    description: "Starten Sie von Grund auf und erstellen Sie Ihren eigenen Flow",
    category: "custom",
    icon: Bot,
    difficulty: "Fortgeschritten",
    estimatedTime: "30+ Min",
    features: ["Vollständige Kontrolle", "Keine Vorgaben", "Maximale Flexibilität"],
    preview: "/templates/blank-preview.png",
  },
  {
    id: "customer-support",
    name: "Kundenservice Bot",
    description: "Automatische Beantwortung häufiger Kundenfragen und Support-Tickets",
    category: "support",
    icon: HeadphonesIcon,
    difficulty: "Einfach",
    estimatedTime: "10 Min",
    features: ["FAQ Automation", "Ticket Routing", "Eskalation an Mensch"],
    preview: "/templates/support-preview.png",
  },
  {
    id: "lead-generation",
    name: "Lead Generation",
    description: "Qualifiziert Leads und sammelt Kontaktdaten automatisch",
    category: "lead-gen", 
    icon: Users,
    difficulty: "Mittel",
    estimatedTime: "15 Min",
    features: ["Lead Scoring", "Kontaktdaten sammeln", "CRM Integration"],
    preview: "/templates/lead-gen-preview.png",
  },
  {
    id: "ecommerce",
    name: "E-Commerce Assistant",
    description: "Bestellstatus, Produktempfehlungen und Kaufberatung",
    category: "e-commerce",
    icon: ShoppingCart,
    difficulty: "Mittel", 
    estimatedTime: "20 Min",
    features: ["Bestellverfolgung", "Produktkatalog", "Warenkorb Abandonment"],
    preview: "/templates/ecommerce-preview.png",
  },
  {
    id: "appointment",
    name: "Termin Buchung",
    description: "Automatische Terminvereinbarung und Kalender-Management",
    category: "appointment",
    icon: Calendar,
    difficulty: "Mittel",
    estimatedTime: "15 Min", 
    features: ["Kalendersync", "Terminbestätigung", "Erinnerungen"],
    preview: "/templates/appointment-preview.png",
  },
  {
    id: "restaurant",
    name: "Restaurant Bot",
    description: "Reservierungen, Speisekarte und Bestellungen über WhatsApp",
    category: "restaurant",
    icon: MessageSquare,
    difficulty: "Einfach",
    estimatedTime: "12 Min",
    features: ["Tischreservierung", "Menü anzeigen", "Online Bestellung"],
    preview: "/templates/restaurant-preview.png",
  },
];

export default function NewBotPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [botName, setBotName] = useState("");
  const [botDescription, setBotDescription] = useState("");

  const selectedTemplateData = botTemplates.find(t => t.id === selectedTemplate);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId !== "blank") {
      const template = botTemplates.find(t => t.id === templateId);
      if (template) {
        setBotName(template.name);
        setBotDescription(template.description);
      }
    }
  };

  const handleNext = () => {
    if (step === 1 && selectedTemplate) {
      setStep(2);
    } else if (step === 2 && botName.trim()) {
      // Create bot and redirect to editor
      const botId = `bot_${Date.now()}`;
      router.push(`/dashboard/bots/${botId}/edit?template=${selectedTemplate}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Einfach":
        return "bg-green-50 text-green-700 border-green-200";
      case "Mittel":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Fortgeschritten":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => step === 1 ? router.back() : setStep(1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Neuen Bot erstellen
          </h1>
          <p className="text-gray-600">
            Schritt {step} von 2: {step === 1 ? "Template auswählen" : "Bot konfigurieren"}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / 2) * 100}%` }}
        />
      </div>

      {/* Step 1: Template Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Wählen Sie eine Vorlage
            </h2>
            <p className="text-gray-600">
              Starten Sie mit bewährten Bot-Vorlagen oder erstellen Sie von Grund auf neu
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {botTemplates.map((template) => {
              const Icon = template.icon;
              const isSelected = selectedTemplate === template.id;
              
              return (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                      <Sparkles className="h-4 w-4" />
                    </div>
                  )}

                  {/* Template Icon */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      template.id === 'blank' ? 'bg-gray-100' : 'bg-blue-50'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        template.id === 'blank' ? 'text-gray-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(template.difficulty)}`}>
                          {template.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">{template.estimatedTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Template Description */}
                  <p className="text-sm text-gray-600 mb-4">
                    {template.description}
                  </p>

                  {/* Template Features */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Features:</p>
                    <ul className="space-y-1">
                      {template.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-xs text-gray-600">
                          <div className="w-1 h-1 bg-blue-400 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 2: Bot Configuration */}
      {step === 2 && selectedTemplateData && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Bot konfigurieren
            </h2>
            <p className="text-gray-600">
              Geben Sie Ihrem Bot einen Namen und beschreiben Sie seinen Zweck
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
            {/* Selected Template Preview */}
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <selectedTemplateData.icon className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{selectedTemplateData.name}</h3>
                <p className="text-sm text-gray-600">{selectedTemplateData.description}</p>
              </div>
            </div>

            {/* Bot Name */}
            <div>
              <label htmlFor="botName" className="block text-sm font-medium text-gray-700 mb-2">
                Bot Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="botName"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="z.B. Mein Kundenservice Bot"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            {/* Bot Description */}
            <div>
              <label htmlFor="botDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung (optional)
              </label>
              <textarea
                id="botDescription"
                value={botDescription}
                onChange={(e) => setBotDescription(e.target.value)}
                placeholder="Beschreiben Sie, wofür dieser Bot verwendet wird..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Template Features Preview */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Dieser Bot wird folgende Features enthalten:
              </h4>
              <div className="grid gap-2">
                {selectedTemplateData.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <Zap className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div>
          {step === 2 && (
            <Button 
              variant="outline"
              onClick={() => setStep(1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Template ändern
            </Button>
          )}
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            onClick={() => router.back()}
          >
            Abbrechen
          </Button>
          <Button 
            onClick={handleNext}
            disabled={step === 1 ? !selectedTemplate : !botName.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {step === 1 ? "Weiter" : "Bot erstellen"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
