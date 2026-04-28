export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Вход в AIForecast
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Демонстрационная авторизация. Реализация — на следующем этапе.
        </p>
      </header>

      <form className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="space-y-1.5">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Имя пользователя
          </label>
          <input
            id="username"
            name="username"
            type="text"
            disabled
            placeholder="demo"
            className="w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Пароль
          </label>
          <input
            id="password"
            name="password"
            type="password"
            disabled
            placeholder="••••••••"
            className="w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>
        <button
          type="button"
          disabled
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Войти
        </button>
      </form>
    </section>
  );
}
