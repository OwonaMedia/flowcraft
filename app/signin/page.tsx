"use client";

// BotChat Pro - Sign In Page
// GDPR-compliant authentication with consent handling

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const result = await signIn("google", {
        redirect: false,
      });

      if (result?.error) {
        setError("Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.");
      } else {
        // Check session and redirect
        const session = await getSession();
        if (session) {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      {/* Logo & Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          FlowCraft
        </h1>
        <p className="text-gray-600">
          Melden Sie sich an, um intelligente WhatsApp-Workflows zu erstellen
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Sign In Form */}
      <div className="space-y-4">
        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          variant="outline"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-2"></div>
              Anmelden...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Mit Google anmelden
            </div>
          )}
        </Button>
      </div>

      {/* GDPR Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Datenschutz:</strong> Durch die Anmeldung stimmen Sie unserer{" "}
          <Link href="/privacy" className="underline hover:text-blue-900">
            Datenschutzerklärung
          </Link>{" "}
          zu. Ihre Daten werden DSGVO-konform verarbeitet und in der EU gehostet.
        </p>
      </div>

      {/* Footer Links */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          Neu hier?{" "}
          <Link href="/signup" className="text-blue-600 hover:text-blue-700 underline">
            Kostenloses Konto erstellen
          </Link>
        </p>
        <div className="mt-2 space-x-4">
          <Link href="/privacy" className="hover:text-gray-800">
            Datenschutz
          </Link>
          <Link href="/terms" className="hover:text-gray-800">
            AGB
          </Link>
          <Link href="/help" className="hover:text-gray-800">
            Hilfe
          </Link>
        </div>
      </div>
    </div>
  );
}
