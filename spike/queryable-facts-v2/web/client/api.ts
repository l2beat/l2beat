import type {
  AskConfig,
  AskDetail,
  AskEvent,
  AskRecord,
  ExplainRequest,
  ExplainResult,
  Inputs,
  PromoteRequest,
  RowsPage,
  RunEvent,
  RunInfo,
  RunListItem,
  RunRequest,
  UnitInfo,
} from '../shared/types'

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  const body = (await res.json()) as T & { error?: string }
  if (!res.ok) throw new Error(body.error ?? `${res.status} ${url}`)
  return body
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = (await res.json()) as T & { error?: string }
  if (!res.ok) throw new Error(data.error ?? `${res.status} ${url}`)
  return data
}

/** Reads an NDJSON response line by line. */
async function readLines<T>(
  res: Response,
  onLine: (value: T) => void,
): Promise<void> {
  if (!res.ok || !res.body) {
    const text = await res.text()
    let message = text
    try {
      message = (JSON.parse(text) as { error?: string }).error ?? text
    } catch {
      // plain text
    }
    throw new Error(message || `${res.status}`)
  }
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let nl = buffer.indexOf('\n')
    while (nl >= 0) {
      const line = buffer.slice(0, nl).trim()
      buffer = buffer.slice(nl + 1)
      if (line) onLine(JSON.parse(line) as T)
      nl = buffer.indexOf('\n')
    }
  }
  if (buffer.trim()) onLine(JSON.parse(buffer) as T)
}

const qs = (params: Record<string, string | number | undefined>) =>
  Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
    )
    .join('&')

export const api = {
  inputs: () => getJson<Inputs>('/api/inputs'),
  runs: () => getJson<RunListItem[]>('/api/runs'),
  run: (id: string) => getJson<RunInfo>(`/api/run?${qs({ id })}`),
  unit: (id: string, unit: string) =>
    getJson<UnitInfo>(`/api/run/unit?${qs({ id, unit })}`),
  solc: async (id: string, unit: string) => {
    const res = await fetch(`/api/run/solc?${qs({ id, unit })}`)
    if (!res.ok) throw new Error(`${res.status}`)
    return res.text()
  },
  discovered: async (id: string) => {
    const res = await fetch(`/api/run/discovered?${qs({ id })}`)
    if (!res.ok) throw new Error(`${res.status}`)
    return res.text()
  },
  source: async (id: string, unit: string) => {
    const res = await fetch(`/api/run/source?${qs({ id, unit })}`)
    if (!res.ok) throw new Error(`${res.status}`)
    return res.text()
  },
  rows: (
    id: string,
    relation: string,
    opts: {
      unit?: string
      offset?: number
      limit?: number
      filter?: string
      ask?: string
      query?: string
    } = {},
  ) => getJson<RowsPage>(`/api/run/rows?${qs({ id, relation, ...opts })}`),
  startRun: async (
    req: RunRequest,
    onEvent: (e: RunEvent) => void,
    signal?: AbortSignal,
  ) => {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req),
      signal,
    })
    await readLines<RunEvent>(res, onEvent)
  },
  explain: (req: ExplainRequest) =>
    postJson<ExplainResult>('/api/explain', req),
  askConfig: () => getJson<AskConfig>('/api/ask/config'),
  asks: (id: string) => getJson<AskRecord[]>(`/api/asks?${qs({ id })}`),
  askDetail: (id: string, ask: string) =>
    getJson<AskDetail>(`/api/ask?${qs({ id, ask })}`),
  ask: async (
    req: {
      id: string
      question: string
      model: string
      effort: string
      threadId?: string
    },
    onEvent: (e: AskEvent) => void,
    signal?: AbortSignal,
  ) => {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req),
      signal,
    })
    await readLines<AskEvent>(res, onEvent)
  },
  promote: (req: PromoteRequest) =>
    postJson<{
      file: string
      relation: string
      expected: string
      rows: number
    }>('/api/promote', req),
}
