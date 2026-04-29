import OpenAI from "openai";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_OPENROUTER_MODEL = "openai/gpt-4o-mini";

function readOptionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();

  return value ? value : undefined;
}

export function getOpenRouterModel(): string {
  return readOptionalEnv("OPENROUTER_MODEL") ?? DEFAULT_OPENROUTER_MODEL;
}

export function createOpenRouterClient(): OpenAI {
  const apiKey = readOptionalEnv("OPENROUTER_API_KEY");

  if (!apiKey) {
    throw new Error(
      "Missing OPENROUTER_API_KEY environment variable for OpenRouter forecast generation.",
    );
  }

  const defaultHeaders: Record<string, string> = {};
  const siteUrl = readOptionalEnv("OPENROUTER_SITE_URL");
  const appTitle = readOptionalEnv("OPENROUTER_APP_TITLE");

  if (siteUrl) {
    defaultHeaders["HTTP-Referer"] = siteUrl;
  }

  if (appTitle) {
    defaultHeaders["X-Title"] = appTitle;
  }

  return new OpenAI({
    apiKey,
    baseURL: OPENROUTER_BASE_URL,
    defaultHeaders,
  });
}
