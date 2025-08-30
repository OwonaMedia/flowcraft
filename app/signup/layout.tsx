// BotChat Pro - Auth Layout
// Clean layout for authentication pages

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anmeldung - BotChat Pro",
  description: "Melden Sie sich bei BotChat Pro an oder erstellen Sie ein neues Konto.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
