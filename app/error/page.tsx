"use client";

// FlowCraft - Authentication Error Page
// User-friendly error handling for auth failures

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

const errorMessages = {
  Configuration: "Es ist ein Konfigurationsfehler aufgetreten. Bitte kontaktieren Sie den Support.",
  AccessDenied: "Zugriff verweigert. Sie haben keine Berechtigung für diese Anwendung.",
  Verification: "Der Verifizierungslink ist ungültig oder abgelaufen.",
  OAuthSignin: "Fehler beim Anmelden mit dem OAuth-Anbieter.",
  OAuthCallback: "Fehler beim OAuth-Callback. Bitte versuchen Sie es erneut.",
  OAuthCreateAccount: "Fehler beim Erstellen des OAuth-Kontos.",
  EmailCreateAccount: "Fehler beim Erstellen des E-Mail-Kontos.",
  Callback: "Fehler beim Callback. Bitte versuchen Sie es erneut.",
  OAuthAccountNotLinked: "Dieses Konto ist bereits mit einem anderen Provider verknüpft.",
  EmailSignin: "Fehler beim E-Mail-Versand. Bitte überprüfen Sie Ihre E-Mail-Adresse.",
  CredentialsSignin: "Anmeldedaten ungültig. Bitte überprüfen Sie Ihre Eingaben.",
  SessionRequired: "Sie müssen angemeldet sein, um auf diese Seite zuzugreifen.",
  default: "Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") as keyof typeof errorMessages;
  
  const message = errorMessages[error] || errorMessages.default;
  const isAccessDenied = error === "AccessDenied";
  const isConfigurationError = error === "Configuration";

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      {/* Error Icon */}
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Anmeldung fehlgeschlagen
        </h1>
        <p className="text-gray-600">
          {message}
        </p>
      </div>

      {/* Troubleshooting */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">Lösungsvorschläge:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          {isAccessDenied && (
            <>
              <li>• Stellen Sie sicher, dass Sie ein gültiges Google-Konto verwenden</li>
              <li>• Ihr Konto muss für diese Anwendung berechtigt sein</li>
            </>
          )}
          {isConfigurationError && (
            <>
              <li>• Dies ist ein technisches Problem auf unserer Seite</li>
              <li>• Bitte kontaktieren Sie unseren Support</li>
            </>
          )}
          {!isAccessDenied && !isConfigurationError && (
            <>
              <li>• Versuchen Sie es in wenigen Minuten erneut</li>
              <li>• Löschen Sie Ihren Browser-Cache und Cookies</li>
              <li>• Verwenden Sie einen anderen Browser oder Inkognito-Modus</li>
              <li>• Stellen Sie sicher, dass JavaScript aktiviert ist</li>
            </>
          )}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button asChild className="w-full">
          <Link href="/signin">
            Erneut versuchen
          </Link>
        </Button>
        
        <Button variant="outline" asChild className="w-full">
          <Link href="/">
            Zur Startseite
          </Link>
        </Button>

        {(isConfigurationError || isAccessDenied) && (
          <Button variant="outline" asChild className="w-full">
            <Link href="/contact">
              Support kontaktieren
            </Link>
          </Button>
        )}
      </div>

      {/* Error Details for Development */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Debug Information:</h4>
          <p className="text-sm text-gray-600 font-mono">
            Error: {error || "unknown"}
          </p>
          <p className="text-sm text-gray-600 font-mono">
            URL: {typeof window !== "undefined" ? window.location.href : "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-lg shadow-xl p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Lädt...</p>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
