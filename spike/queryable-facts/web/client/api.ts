import type {
  ContractChoice,
  ExplainRequest,
  ExplainResult,
  RunResult,
} from '../shared/types'

async function json<T>(res: Response): Promise<T> {
  const body = (await res.json()) as T & { error?: string }
  if (!res.ok || body.error)
    throw new Error(body.error ?? `${res.status} ${res.statusText}`)
  return body
}

const post = (url: string, body: unknown) =>
  fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

export const api = {
  contracts: (): Promise<ContractChoice[]> =>
    fetch('/api/contracts').then((r) => json<ContractChoice[]>(r)),
  contract: (id: string): Promise<{ name: string; source: string }> =>
    fetch(`/api/contract?id=${encodeURIComponent(id)}`).then((r) =>
      json<{ name: string; source: string }>(r),
    ),
  run: (name: string, source: string): Promise<RunResult> =>
    post('/api/run', { name, source }).then((r) => json<RunResult>(r)),
  explain: (req: ExplainRequest): Promise<ExplainResult> =>
    post('/api/explain', req).then((r) => json<ExplainResult>(r)),
}
