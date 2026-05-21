import { LayoutV1 } from './v1'
import { LayoutV2 } from './v2'

export const CURRENT_LAYOUT_VERSION = 2

export type Layout = LayoutV2

export type MigrateFailureReason = 'invalid' | 'unsupported-version' | 'too-new'

export interface MigrateFailure {
  ok: false
  reason: MigrateFailureReason
  message: string
}

export interface MigrateSuccess {
  ok: true
  layout: Layout
  migratedFrom: number
}

export type MigrateResult = MigrateSuccess | MigrateFailure

// Migrates an arbitrary payload (from localStorage, a shared file, or a
// future remote library) to the current layout version. The pipeline is:
//   1. peek at the `version` field; absent ⇒ assume 1
//   2. refuse versions newer than what we know
//   3. parse against that version's schema; refuse on shape errors
//   4. apply chained migrations up to the current version
export function migrateLayout(raw: unknown): MigrateResult {
  const version = peekVersion(raw)
  if (version === undefined) {
    return {
      ok: false,
      reason: 'invalid',
      message: 'File is not a valid layout file.',
    }
  }
  if (version > CURRENT_LAYOUT_VERSION) {
    return {
      ok: false,
      reason: 'too-new',
      message: `Layout was created with a newer version (v${version}) of Protocolbeat than this build supports (v${CURRENT_LAYOUT_VERSION}). Update Protocolbeat to load it.`,
    }
  }

  switch (version) {
    case 1: {
      const parsed = LayoutV1.safeParse(raw)
      if (!parsed.success) {
        return {
          ok: false,
          reason: 'invalid',
          message: 'File is not a valid layout file.',
        }
      }
      return {
        ok: true,
        layout: migrateV1toV2(parsed.data),
        migratedFrom: 1,
      }
    }
    case 2: {
      const parsed = LayoutV2.safeParse(raw)
      if (!parsed.success) {
        return {
          ok: false,
          reason: 'invalid',
          message: 'File is not a valid layout file.',
        }
      }
      return { ok: true, layout: parsed.data, migratedFrom: 2 }
    }
    default:
      return {
        ok: false,
        reason: 'unsupported-version',
        message: `Layout version v${version} is not supported.`,
      }
  }
}

// Reads `version` defensively without trusting the rest of the payload.
// Absent / non-number means we treat it as v1 (legacy untagged shape).
// Returns undefined only when the input is not an object at all, which
// is a hard rejection upstream.
function peekVersion(raw: unknown): number | undefined {
  if (raw === null || typeof raw !== 'object') return undefined
  const candidate = (raw as { version?: unknown }).version
  if (candidate === undefined) return 1
  if (typeof candidate !== 'number' || !Number.isInteger(candidate)) {
    return undefined
  }
  return candidate
}

function migrateV1toV2(input: LayoutV1): LayoutV2 {
  const colors =
    input.colors === undefined ? undefined : normalizeColors(input.colors)
  return {
    version: 2,
    projectId: input.projectId,
    locations: input.locations,
    colors,
    hiddenFields: input.hiddenFields,
    hiddenNodes: input.hiddenNodes,
  }
}

// Legacy oklch color objects collapse to palette index 0. This matches the
// coercion readers already apply for non-numeric color entries, so it's a
// no-op against current runtime behavior; the difference is that the
// on-disk shape is now uniform.
function normalizeColors(
  colors: NonNullable<LayoutV1['colors']>,
): Record<string, number> {
  const result: Record<string, number> = {}
  for (const [id, color] of Object.entries(colors)) {
    result[id] = typeof color === 'number' ? color : 0
  }
  return result
}
