import type { Parser } from '@l2beat/validate'
import { ApiError } from '@/types'

export async function postApi<Output>(
  endpoint: 'latest' | 'uops' | 'stats',
  input: unknown,
  Output: Parser<Output>,
): Promise<Output> {
  const res = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    // express.json() ignores bodies without this header
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  const body: unknown = await res.json()
  if (res.status !== 200) {
    throw new Error(ApiError.parse(body).message)
  }
  return Output.parse(body)
}
