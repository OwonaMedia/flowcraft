"use client";

// BotChat Pro - Sign Up Page
// New user registration with GDPR consent

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (!consentGiven) {
      setError("Bitte stimmen Sie der Datenschutzerklärung zu.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      // Store consent preferences in localStorage for the auth callback
      localStorage.setItem("botchat_consent", JSON.stringify({
        privacy: consentGiven,
        marketing: marketingConsent,
      }));

      await signIn("google", {
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      setError("Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
      console.error("Sign up error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      {/* Logo & Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Kostenloses Konto erstellen
        </h1>
        <p className="text-gray-600">
          Starten Sie in 2 Minuten mit Ihrem ersten WhatsApp Bot
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Features */}
      <div className="mb-6 space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          100% DSGVO-konform - Daten bleiben in der EU
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Keine Kreditkarte erforderlich
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Sofortiger Zugang zu allen Features
        </div>
      </div>

      {/* Consent Checkboxes */}
      <div className="space-y-4 mb-6">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            required
          />
          <span className="text-sm text-gray-700">
            Ich stimme der{" "}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
              Datenschutzerklärung
            </Link>{" "}
            und den{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline">
              Nutzungsbedingungen
            </Link>{" "}
            zu. <span className="text-red-500">*</span>
          </span>
        </label>

        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">
            Ich möchte Updates über neue Features und Tipps erhalten (optional)
          </span>
        </label>
      </div>

      {/* Sign Up Button */}
      <Button
        onClick={handleSignUp}
        disabled={isLoading || !consentGiven}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Konto wird erstellt...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Kostenloses Konto erstellen
          </div>
        )}
      </Button>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          Bereits ein Konto?{" "}
          <Link href="/signin" className="text-blue-600 hover:text-blue-700 underline">
            Hier anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}
