import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { gunzipSync } from 'zlib'
import type { WatchContext } from '../WatchTemplate'
import { readTar } from './readTar'

const DATASET_TIMEOUT_MS = 60_000
const DEFI_HACK_LABS_BLOB = 'https://github.com/SunWeb3Sec/DeFiHackLabs/blob/'
const QUEUE_FILE = 'research/queue.json'
const EXCLUDED_FILE = 'research/excluded.json'
const INCIDENTS_DIRECTORY = 'incidents/'

// What the dataset has recorded: its incidents, and every key and ref that
// makes a lead handled. `hash` and `generatedAt` of known.json are ignored.
export const Known = v.object({
  incidents: v.record(v.string(), v.string()),
  recorded: v.array(v.string()),
})
export type Known = v.infer<typeof Known>

const IncidentFile = v.object({
  name: v.string(),
  refs: v.array(v.string()).optional(),
})
const ResearchFile = v.record(
  v.string(),
  v.object({ refs: v.array(v.string()).optional() }),
)

export async function loadKnownJson(
  context: WatchContext,
  url: string,
): Promise<Known> {
  return Known.validate(
    await context.http.fetch(url, { timeout: DATASET_TIMEOUT_MS }),
  )
}

// Fallback until the dataset publishes known.json: codeload has no API rate
// limit, and the archive builds the same Known through buildKnown.
export async function loadKnownTarball(
  context: WatchContext,
  url: string,
): Promise<Known> {
  const response = await context.http.fetchRaw(url, {
    timeout: DATASET_TIMEOUT_MS,
  })
  if (!response.ok) {
    await response.body?.cancel()
    throw new Error('Dataset download failed', {
      cause: { url, status: response.status },
    })
  }
  const archive = gunzipSync(new Uint8Array(await response.arrayBuffer()))
  const files = new Map<string, string>()
  const decoder = new TextDecoder('utf-8', { fatal: true })
  for (const file of readTar(archive)) {
    // codeload puts everything under one `<repository>-<branch>/` directory.
    const path = file.path.slice(file.path.indexOf('/') + 1)
    if (path.endsWith('.json')) {
      files.set(path, decoder.decode(file.content))
    }
  }
  return buildKnown(files)
}

// `files` maps a path in the dataset repository to its text.
export function buildKnown(files: ReadonlyMap<string, string>): Known {
  const incidents: Record<string, string> = {}
  const recorded = new Set<string>()
  for (const [path, text] of files) {
    if (!path.startsWith(INCIDENTS_DIRECTORY)) {
      continue
    }
    const id = toIncidentId(path)
    const incident = IncidentFile.validate(JSON.parse(text))
    incidents[id] = incident.name
    recorded.add(id)
    addRefs(recorded, incident.refs)
  }
  for (const path of [QUEUE_FILE, EXCLUDED_FILE]) {
    const text = files.get(path)
    if (text === undefined) {
      throw new Error('Dataset file missing', { cause: { path } })
    }
    for (const [key, entry] of Object.entries(
      ResearchFile.validate(JSON.parse(text)),
    )) {
      recorded.add(key)
      addRefs(recorded, entry.refs)
    }
  }
  return { incidents, recorded: [...recorded].sort() }
}

export function normalizeRef(ref: string): string {
  if (!ref.startsWith(DEFI_HACK_LABS_BLOB)) {
    return ref
  }
  const rest = ref.slice(DEFI_HACK_LABS_BLOB.length)
  const commitEnd = rest.indexOf('/')
  if (commitEnd < 0) {
    return ref
  }
  return `dfhl:${rest.slice(commitEnd + 1)}`
}

function addRefs(recorded: Set<string>, refs: string[] | undefined): void {
  for (const ref of refs ?? []) {
    recorded.add(normalizeRef(ref))
  }
}

// incidents/<chainId>/<tx>.json is the incident eip155:<chainId>:<tx>.
function toIncidentId(path: string): string {
  const [chainId, file, ...rest] = path
    .slice(INCIDENTS_DIRECTORY.length)
    .split('/')
  if (file === undefined || rest.length > 0) {
    throw new Error('Unexpected incident file', { cause: { path } })
  }
  assert(chainId !== undefined && file.endsWith('.json'))
  return `eip155:${chainId}:${file.slice(0, -'.json'.length)}`
}
