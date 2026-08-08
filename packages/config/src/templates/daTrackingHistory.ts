import { createDaTrackingId } from '@l2beat/shared'
import { ProjectId } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import type { ProjectDaTrackingConfig } from '../types'

/**
 * Committed, machine-maintained DA tracking era store, one file per
 * discovery project: src/projects/<name>/daTracking.json.
 *
 * The file is written ONLY by 'pnpm da:history' (scripts/daHistory) - never
 * by hand. Templates read it in preference to deriving a single entry from
 * current discovery values, so historical eras survive on-chain rotations
 * of the inbox/sequencers instead of being silently replaced (which would
 * make the backend wipe the data indexed under the old configuration id).
 */

const ClosedMetaSchema = v.object({
  /** What changed, e.g. 'SystemConfig.batcherHash changed' */
  reason: v.string(),
  /** Timestamp of the discovery run that observed the change */
  observedAtTimestamp: v.number().optional(),
  /**
   * bracketed - boundary blocks resolved from discovery-run timestamps; the
   * old and new era deliberately overlap (safe: identities are disjoint
   * filters). exact - boundary is the actual rotation block. manual -
   * boundary supplied via CLI flags.
   */
  precision: v.enum(['bracketed', 'exact', 'manual']),
})

const EthereumEraSchema = v.object({
  type: v.literal('ethereum'),
  daLayer: v.string(),
  inbox: v.string(),
  sequencers: v.array(v.string()).optional(),
  topics: v.array(v.string()).optional(),
  sinceBlock: v.number(),
  untilBlock: v.number().optional(),
  discriminator: v.string().optional(),
  closed: ClosedMetaSchema.optional(),
})

const CelestiaEraSchema = v.object({
  type: v.literal('celestia'),
  daLayer: v.string(),
  namespace: v.string(),
  sinceBlock: v.number(),
  untilBlock: v.number().optional(),
  discriminator: v.string().optional(),
  closed: ClosedMetaSchema.optional(),
})

const AvailEraSchema = v.object({
  type: v.literal('avail'),
  daLayer: v.string(),
  appIds: v.array(v.string()),
  sinceBlock: v.number(),
  untilBlock: v.number().optional(),
  discriminator: v.string().optional(),
  closed: ClosedMetaSchema.optional(),
})

export const DaTrackingHistorySchema = v.object({
  eras: v.array(
    v.union([EthereumEraSchema, CelestiaEraSchema, AvailEraSchema]),
  ),
})

export type DaTrackingEra = v.infer<
  typeof DaTrackingHistorySchema
>['eras'][number]
export type DaTrackingHistoryFile = v.infer<typeof DaTrackingHistorySchema>

/** Backend configuration id of an era/config, discriminator included. */
export function daTrackingId(
  config: DaTrackingEra | ProjectDaTrackingConfig,
): string {
  return createDaTrackingId(config)
}

/**
 * Identity of an era/config IGNORING the discriminator - used to compare a
 * file's open era against the template derivation (which never carries a
 * discriminator).
 */
export function daTrackingIdentity(
  config: DaTrackingEra | ProjectDaTrackingConfig,
): string {
  return createDaTrackingId({ ...config, discriminator: undefined })
}

export function daTrackingHistoryPath(projectName: string): string {
  return join(__dirname, '../../src/projects', projectName, 'daTracking.json')
}

/**
 * Parses and validates the era rules. Throws with an actionable message on
 * any violation - the file is generator-written, so a violation means a
 * hand edit or a generator bug.
 */
export function parseDaTrackingHistory(
  raw: unknown,
  projectName: string,
): DaTrackingHistoryFile {
  const result = DaTrackingHistorySchema.safeParse(raw)
  if (!result.success) {
    throw new Error(
      `Invalid daTracking.json for ${projectName}: ${result.path} : ${result.message}`,
    )
  }
  const file = result.data
  const fail = (message: string) => {
    throw new Error(
      `Invalid daTracking.json for ${projectName}: ${message}` +
        " (this file is written by 'pnpm da:history' - do not edit it by hand)",
    )
  }

  if (file.eras.length === 0) {
    fail('eras must not be empty')
  }

  const seenIds = new Map<string, number>()
  file.eras.forEach((era, i) => {
    if (era.untilBlock === undefined) {
      if (era.closed !== undefined) {
        fail(`eras[${i}] is open (no untilBlock) but has closed metadata`)
      }
    } else {
      if (era.untilBlock < era.sinceBlock) {
        fail(
          `eras[${i}]: untilBlock ${era.untilBlock} < sinceBlock ${era.sinceBlock}`,
        )
      }
      if (era.closed === undefined) {
        fail(`eras[${i}] is closed but has no closed metadata`)
      }
    }
    const id = daTrackingId(era)
    const duplicate = seenIds.get(id)
    if (duplicate !== undefined) {
      fail(
        `eras[${i}] has the same configuration id as eras[${duplicate}] ` +
          '(identical identity fields; the later era needs a discriminator)',
      )
    }
    seenIds.set(id, i)
  })

  // Rules within a (type, daLayer) group
  const groups = new Map<string, { era: DaTrackingEra; index: number }[]>()
  file.eras.forEach((era, index) => {
    const key = `${era.type}:${era.daLayer}`
    groups.set(key, [...(groups.get(key) ?? []), { era, index }])
  })
  for (const [key, group] of groups) {
    for (let i = 1; i < group.length; i++) {
      const prev = group[i - 1]
      const curr = group[i]
      if (curr.era.sinceBlock < prev.era.sinceBlock) {
        fail(`eras[${curr.index}] (${key}): sinceBlock not in ascending order`)
      }
      if (prev.era.untilBlock === undefined) {
        fail(
          `eras[${prev.index}] (${key}): only the last era of a group may be open`,
        )
      }
    }
    // Eras with the same identity (sans discriminator) must not overlap -
    // both would match the same data and double-count the shared range.
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i]
        const b = group[j]
        if (daTrackingIdentity(a.era) !== daTrackingIdentity(b.era)) continue
        if (
          a.era.untilBlock === undefined ||
          a.era.untilBlock >= b.era.sinceBlock
        ) {
          fail(
            `eras[${a.index}] and eras[${b.index}] have the same identity ` +
              'but overlapping ranges - identical identities must be disjoint',
          )
        }
      }
    }
  }

  return file
}

/** Reads the validated era file, or undefined when the project has none. */
export function readDaTrackingHistoryFile(
  projectName: string,
): DaTrackingHistoryFile | undefined {
  const filePath = daTrackingHistoryPath(projectName)
  if (!existsSync(filePath)) {
    return undefined
  }
  return parseDaTrackingHistory(
    JSON.parse(readFileSync(filePath, 'utf8')),
    projectName,
  )
}

/** Maps an era to the config entry the backend consumes (drops metadata). */
export function eraToConfig(era: DaTrackingEra): ProjectDaTrackingConfig {
  const { closed: _closed, daLayer, ...rest } = era
  return { ...rest, daLayer: ProjectId(daLayer) }
}

export function readDaTrackingHistory(
  projectName: string,
): ProjectDaTrackingConfig[] | undefined {
  return readDaTrackingHistoryFile(projectName)?.eras.map(eraToConfig)
}

/**
 * Stable serializer used by the generator - fixed key order so diffs stay
 * minimal and reviewable.
 */
export function serializeDaTrackingHistory(
  file: DaTrackingHistoryFile,
): string {
  const ERA_KEY_ORDER = [
    'type',
    'daLayer',
    'inbox',
    'sequencers',
    'topics',
    'namespace',
    'appIds',
    'sinceBlock',
    'untilBlock',
    'discriminator',
    'closed',
  ]
  const CLOSED_KEY_ORDER = ['reason', 'observedAtTimestamp', 'precision']
  const orderKeys = (value: Record<string, unknown>, order: string[]) =>
    Object.fromEntries(
      order.filter((k) => value[k] !== undefined).map((k) => [k, value[k]]),
    )
  const eras = file.eras.map((era) => {
    const ordered = orderKeys(era as Record<string, unknown>, ERA_KEY_ORDER)
    if (era.closed) {
      ordered.closed = orderKeys(
        era.closed as unknown as Record<string, unknown>,
        CLOSED_KEY_ORDER,
      )
    }
    return ordered
  })
  return `${JSON.stringify({ eras }, null, 2)}\n`
}

export interface DaTrackingResolution {
  /**
   * nonTemplate - project overrides with nonTemplateDaTracking
   * history - src/projects/<name>/daTracking.json is in effect
   * derived - single era derived from current discovery values (a project
   * without a history file yet)
   */
  source: 'nonTemplate' | 'history' | 'derived'
  /** What the template derives from current discovery state right now */
  derived: ProjectDaTrackingConfig[] | undefined
}

const resolutions = new Map<string, DaTrackingResolution>()

/**
 * Filled as a side effect of evaluating the stack templates (i.e. of
 * importing the project modules / calling getProjects()). The history guard
 * test and 'pnpm da:history' read it to compare the stored open eras against
 * the current template derivation without re-building templateVars.
 */
export function getDaTrackingResolutions(): ReadonlyMap<
  string,
  DaTrackingResolution
> {
  return resolutions
}

/**
 * Single entry point the stack templates use for daTracking. Precedence:
 * nonTemplateDaTracking (full manual override) > committed daTracking.json
 * (machine-maintained history) > single era derived from current discovery.
 */
export function resolveDaTracking(
  projectName: string,
  nonTemplateDaTracking: ProjectDaTrackingConfig[] | undefined,
  derive: () => ProjectDaTrackingConfig[] | undefined,
): ProjectDaTrackingConfig[] | undefined {
  if (nonTemplateDaTracking) {
    resolutions.set(projectName, { source: 'nonTemplate', derived: undefined })
    return nonTemplateDaTracking
  }
  const derived = derive()
  const history = readDaTrackingHistory(projectName)
  resolutions.set(projectName, {
    source: history ? 'history' : 'derived',
    derived,
  })
  return history ?? derived
}
