import { ApiError, type Endpoint } from '@/types'

export async function postApi<Input, Output>(
  endpoint: Endpoint<Input, Output>,
  request: Input,
): Promise<Output> {
  const res = await fetch(`/api${endpoint.path}`, {
    method: 'POST',
    // express.json() ignores bodies without this header
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }
  return endpoint.Response.parse(await res.json())
}

// Failures may come from a proxy rather than our API, so the body is not
// guaranteed to be an ApiError or even JSON.
async function readErrorMessage(res: Response): Promise<string> {
  const body: unknown = await res.json().catch(() => undefined)
  const error = ApiError.safeParse(body)
  return error.success
    ? error.data.message
    : `Request failed: ${res.status} ${res.statusText}`
}
