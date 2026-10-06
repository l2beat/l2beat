import { assert } from '@l2beat/shared-pure'
import { readFileSync } from 'fs'

export interface AuditDatasetFiles {
  index: string
  objects: Buffer
  commit: string
}

const INDEX_FILE = 'audit-index.json'
const OBJECTS_FILE = 'audit-objects.json.zst'
const BRANCH = 'main'
const REQUEST_TIMEOUT_MS = 60_000

export function readAuditDataset(
  indexPath: string,
  objectsPath: string,
  commit: string,
): AuditDatasetFiles {
  return {
    index: readFileSync(indexPath, 'utf8'),
    objects: readFileSync(objectsPath),
    commit,
  }
}

export async function fetchAuditDataset(
  repositoryUrl: string,
): Promise<AuditDatasetFiles> {
  const repository = githubRepository(repositoryUrl)
  const head = await fetchOk(
    `https://api.github.com/repos/${repository}/commits/${BRANCH}`,
    { Accept: 'application/vnd.github.sha' },
  )
  const commit = await head.text()
  assert(commit.length === 40, `Unexpected commit of ${repository}: ${commit}`)
  const rawUrl = (file: string) =>
    `https://raw.githubusercontent.com/${repository}/${commit}/${file}`
  const [index, objects] = await Promise.all([
    fetchOk(rawUrl(INDEX_FILE), {}).then((response) => response.text()),
    fetchOk(rawUrl(OBJECTS_FILE), {}).then((response) =>
      response.arrayBuffer(),
    ),
  ])
  return { index, objects: Buffer.from(objects), commit }
}

function githubRepository(url: string): string {
  const parsed = new URL(url)
  assert(parsed.hostname === 'github.com', `Not a GitHub repository: ${url}`)
  const segments = parsed.pathname.split('/').filter((s) => s.length > 0)
  assert(segments.length === 2, `Not a GitHub repository: ${url}`)
  return segments.join('/')
}

async function fetchOk(
  url: string,
  headers: Record<string, string>,
): Promise<Response> {
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  if (!response.ok) {
    throw new Error(`GET ${url} failed: HTTP ${response.status}`)
  }
  return response
}
