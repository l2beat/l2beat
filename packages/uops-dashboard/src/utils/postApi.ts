import type { ApiError } from '@/types'

export async function postApi<Output>(
  endpoint: 'latest' | 'uops' | 'stats',
  input: unknown,
): Promise<Output> {
  const res = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    // express.json() ignores bodies without this header
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  const body = await res.json()
  if (res.status !== 200) {
    throw new Error((body as ApiError).message)
  }
  return body as Output
}
