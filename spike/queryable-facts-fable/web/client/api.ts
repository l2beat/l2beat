import type { ExplainResult, RowsResult, RunView, State } from '../shared/types'

async function json<T>(res: Response): Promise<T> {
  const text = await res.text()
  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    throw new Error(`${res.status}: ${text.slice(0, 500)}`)
  }
  if (!res.ok) {
    const err = (body as { error?: string }).error
    throw new Error(err ?? `${res.status}`)
  }
  return body as T
}

export const api = {
  state: () => fetch('/api/state').then((r) => json<State>(r)),
  run: (example: string, level: number) =>
    fetch('/api/run', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ example, level }),
    }).then((r) => json<RunView>(r)),
  rows: (example: string, level: number, relation: string) =>
    fetch(
      `/api/rows?example=${encodeURIComponent(example)}&level=${level}&relation=${encodeURIComponent(relation)}`,
    ).then((r) => json<RowsResult>(r)),
  source: async (example: string) => {
    const res = await fetch(
      `/api/source?example=${encodeURIComponent(example)}`,
    )
    if (!res.ok) throw new Error(await res.text())
    return res.text()
  },
  explain: (example: string, level: number, atom: string) =>
    fetch('/api/explain', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ example, level, atom }),
    }).then((r) => json<ExplainResult>(r)),
}
