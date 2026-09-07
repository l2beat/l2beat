import type {
  AskConfig,
  AskEvent,
  AskRequest,
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
  askConfig: (): Promise<AskConfig> =>
    fetch('/api/ask/config').then((r) => json<AskConfig>(r)),
  /** Streams the agent's progress, one AskEvent per line; resolves when the server ends the stream. */
  ask: async (
    req: AskRequest,
    onEvent: (event: AskEvent) => void,
    signal?: AbortSignal,
  ): Promise<void> => {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req),
      signal,
    })
    if (!res.ok) {
      const text = await res.text()
      let message = text
      try {
        message = (JSON.parse(text) as { error?: string }).error ?? text
      } catch {
        // not JSON: the raw text is the message
      }
      throw new Error(message || `${res.status} ${res.statusText}`)
    }
    const reader = res.body?.getReader()
    if (!reader) throw new Error('no response body')
    const decoder = new TextDecoder()
    let buffer = ''
    const emit = (line: string) => {
      if (line.trim() !== '') onEvent(JSON.parse(line) as AskEvent)
    }
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      let nl = buffer.indexOf('\n')
      while (nl >= 0) {
        emit(buffer.slice(0, nl))
        buffer = buffer.slice(nl + 1)
        nl = buffer.indexOf('\n')
      }
    }
    emit(buffer)
  },
}
