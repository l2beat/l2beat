import type {
  AskConfig,
  AskEvent,
  AskRequest,
  ContractChoice,
  ExplainRequest,
  ExplainResult,
  ProjectChoice,
  ProjectEvent,
  ProjectInfo,
  ProjectRunResult,
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

/** Reads an NDJSON stream line by line. */
async function readLines(
  res: Response,
  onLine: (line: string) => void,
): Promise<void> {
  const reader = res.body?.getReader()
  if (!reader) throw new Error('no response body')
  const decoder = new TextDecoder()
  let buffer = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let nl = buffer.indexOf('\n')
    while (nl >= 0) {
      const line = buffer.slice(0, nl)
      buffer = buffer.slice(nl + 1)
      if (line.trim() !== '') onLine(line)
      nl = buffer.indexOf('\n')
    }
  }
  if (buffer.trim() !== '') onLine(buffer)
}

export const api = {
  contracts: (): Promise<ContractChoice[]> =>
    fetch('/api/contracts').then((r) => json<ContractChoice[]>(r)),
  projects: (): Promise<ProjectChoice[]> =>
    fetch('/api/projects').then((r) => json<ProjectChoice[]>(r)),
  project: (id: string): Promise<ProjectInfo> =>
    fetch(`/api/project?id=${encodeURIComponent(id)}`).then((r) =>
      json<ProjectInfo>(r),
    ),
  /** Runs a whole project; progress events stream in, the last one carries the result. */
  runProject: async (
    id: string,
    onEvent: (event: ProjectEvent) => void,
    signal?: AbortSignal,
  ): Promise<ProjectRunResult> => {
    const res = await post('/api/project/run', { id })
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    let result: ProjectRunResult | undefined
    let error: string | undefined
    await readLines(res, (line) => {
      if (signal?.aborted) return
      const event = JSON.parse(line) as ProjectEvent
      if (event.type === 'done') result = event.result
      else if (event.type === 'error') error = event.message
      onEvent(event)
    })
    if (error) throw new Error(error)
    if (!result) throw new Error('the project run ended without a result')
    return result
  },
  projectUnit: (runId: string, unit: string): Promise<RunResult> =>
    fetch(
      `/api/project/unit?runId=${encodeURIComponent(runId)}&unit=${encodeURIComponent(unit)}`,
    ).then((r) => json<RunResult>(r)),
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
    await readLines(res, (line) => onEvent(JSON.parse(line) as AskEvent))
  },
}
