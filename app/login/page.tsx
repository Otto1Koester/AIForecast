import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/LoginForm";
import { getCurrentUser } from "@/lib/auth/current-user";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Вход в AIForecast
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Войдите под demo-пользователем, чтобы открыть защищённые разделы.
        </p>
      </header>

      <LoginForm />
      </section>
    </main>
  );
}
