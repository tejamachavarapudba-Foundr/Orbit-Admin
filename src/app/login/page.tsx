import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { getSession } from "@/lib/session";

import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session && !session.expired && session.role.toUpperCase() === "ADMIN") {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong w-full max-w-sm rounded-2xl p-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-500 text-on-primary shadow-md shadow-primary/25">
            <ShieldCheck className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="font-display text-lg font-bold text-text">Orbit Admin</span>
        </div>

        <h1 className="mt-7 font-display text-xl font-bold text-text">Sign in</h1>
        <p className="mt-1 text-sm text-muted">Staff access only. Your account needs the admin role.</p>

        <LoginForm />
      </div>
    </main>
  );
}
