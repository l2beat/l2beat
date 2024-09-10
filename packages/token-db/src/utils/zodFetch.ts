import { z } from 'zod'

/**
 * Fetches a URL and parses the response with a Zod schema.
 * @param input The URL to fetch.
 * @param zodSchema The Zod schema to parse the response with.
 * @param init The request init to pass to fetch.
 * @returns The parsed response.
 */
export async function zodFetch<T>(
  input: string | URL | globalThis.Request,
  // biome-ignore lint/suspicious/noExplicitAny: intentional
  zodSchema: z.ZodType<T, any>,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init)
  const data = await response.json()
  return zodSchema.parse(data)
}
