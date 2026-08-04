import type { ProjectDaTrackingConfig } from '../types'
import type { DaTrackingEra, DaTrackingHistoryFile } from './daTrackingHistory'
import { daTrackingIdentity, parseDaTrackingHistory } from './daTrackingHistory'

/**
 * Pure era-update logic behind 'pnpm da:history'. The CLI resolves
 * boundaries (git + RPC) and does the file IO; everything decision-shaped
 * lives here so it can be unit tested.
 */

export interface EraBoundary {
  /** First block of the new era - at or before the rotation (lower bound) */
  sinceBlock: number
  /** Last block of the old era - at or after the rotation (upper bound).
   * The overlap with sinceBlock is deliberate and safe: the two eras have
   * disjoint identity filters, so nothing is double-counted and nothing is
   * missed even though the exact rotation block is unknown. */
  untilBlock: number
  precision: 'bracketed' | 'exact' | 'manual'
  observedAtTimestamp?: number
}

export type ResolveBoundary = (group: {
  type: DaTrackingEra['type']
  daLayer: string
}) => Promise<EraBoundary>

export interface DaHistoryUpdate {
  /** undefined means: no file should exist (nothing derivable) */
  file: DaTrackingHistoryFile | undefined
  changes: string[]
}

export async function updateDaTrackingHistory(
  projectName: string,
  existing: DaTrackingHistoryFile | undefined,
  derived: ProjectDaTrackingConfig[],
  resolveBoundary: ResolveBoundary,
): Promise<DaHistoryUpdate> {
  const derivedEras = derived.map(configToOpenEra)

  if (!existing) {
    if (derivedEras.length === 0) {
      return { file: undefined, changes: [] }
    }
    const file = validate({ eras: derivedEras }, projectName)
    return {
      file,
      changes: derivedEras.map((e) => `init open era: ${label(e)}`),
    }
  }

  const eras = existing.eras.map((era) => ({ ...era }))
  const changes: string[] = []

  const openEras = () => eras.filter((e) => e.untilBlock === undefined)
  const matchesDerived = (era: DaTrackingEra) =>
    derivedEras.some((d) => daTrackingIdentity(d) === daTrackingIdentity(era))
  const sameGroup = (a: { type: string; daLayer: string }, b: typeof a) =>
    a.type === b.type && a.daLayer === b.daLayer

  for (const derivedEra of derivedEras) {
    const alreadyOpen = openEras().some(
      (e) => daTrackingIdentity(e) === daTrackingIdentity(derivedEra),
    )
    if (alreadyOpen) {
      continue
    }

    // The identity rotated (same layer) or the project switched layers
    const rotatedFrom = openEras().find(
      (e) => sameGroup(e, derivedEra) && !matchesDerived(e),
    )
    let newEra: DaTrackingEra
    if (rotatedFrom) {
      const boundary = await resolveBoundary(derivedEra)
      rotatedFrom.untilBlock = boundary.untilBlock
      rotatedFrom.closed = {
        reason: describeChange(rotatedFrom, derivedEra),
        observedAtTimestamp: boundary.observedAtTimestamp,
        precision: boundary.precision,
      }
      newEra = { ...derivedEra, sinceBlock: boundary.sinceBlock }
      changes.push(
        `closed era ${label(rotatedFrom)} at block ${boundary.untilBlock} (${rotatedFrom.closed.reason})`,
      )
    } else {
      // New (type, daLayer) group - block numbers of other groups live on a
      // different chain, so the template-derived sinceBlock is kept as-is.
      newEra = derivedEra
    }

    const repeats = eras.filter(
      (e) => daTrackingIdentity(e) === daTrackingIdentity(newEra),
    ).length
    if (repeats > 0) {
      // Same identity as an earlier era (a value rotated A -> B -> A). The
      // discriminator keeps the backend configuration ids distinct. If the
      // middle era was a spurious flap, use --drop-last instead.
      newEra.discriminator = String(repeats)
      changes.push(
        `identity repeats an earlier era - added discriminator '${newEra.discriminator}' ` +
          '(if the previous era was a spurious flap, revert with --drop-last instead)',
      )
    }
    eras.push(newEra)
    changes.push(`opened era ${label(newEra)} since block ${newEra.sinceBlock}`)
  }

  // Groups the template no longer derives anything for (e.g. the project
  // switched DA layers) - close their open eras.
  for (const era of openEras()) {
    const groupStillDerived = derivedEras.some((d) => sameGroup(d, era))
    if (matchesDerived(era) || groupStillDerived) {
      continue
    }
    const boundary = await resolveBoundary(era)
    era.untilBlock = boundary.untilBlock
    era.closed = {
      reason: 'no longer derived from discovery',
      observedAtTimestamp: boundary.observedAtTimestamp,
      precision: boundary.precision,
    }
    changes.push(
      `closed era ${label(era)} at block ${boundary.untilBlock} (layer no longer in use)`,
    )
  }

  return { file: validate({ eras }, projectName), changes }
}

/**
 * Reverts the most recently appended era - for rotations that turned out to
 * be spurious (discovery flap/revert). Reopens the previous era of the same
 * group when it was closed by that rotation.
 */
export function dropLastEra(file: DaTrackingHistoryFile): DaHistoryUpdate {
  const eras = file.eras.map((era) => ({ ...era }))
  const last = eras.pop()
  if (!last) {
    return { file: undefined, changes: [] }
  }
  const changes = [`dropped era ${label(last)}`]
  const previous = [...eras]
    .reverse()
    .find((e) => e.type === last.type && e.daLayer === last.daLayer)
  if (previous && previous.untilBlock !== undefined) {
    previous.untilBlock = undefined
    previous.closed = undefined
    changes.push(`reopened era ${label(previous)}`)
  }
  if (eras.length === 0) {
    return { file: undefined, changes }
  }
  return { file: validate({ eras }, 'drop-last result'), changes }
}

function validate(
  file: DaTrackingHistoryFile,
  projectName: string,
): DaTrackingHistoryFile {
  // Round-trip through JSON so the result is exactly what the parser will
  // see on the next read - catches generator bugs at generation time.
  return parseDaTrackingHistory(JSON.parse(JSON.stringify(file)), projectName)
}

function configToOpenEra(config: ProjectDaTrackingConfig): DaTrackingEra {
  if (config.type === 'eigen-da') {
    throw new Error(
      'eigen-da tracking is timestamp-based and never template-derived - it cannot live in daTracking.json',
    )
  }
  const { daLayer, untilBlock: _untilBlock, ...rest } = config
  return { ...rest, daLayer: daLayer.toString() }
}

function describeChange(oldEra: DaTrackingEra, newEra: DaTrackingEra): string {
  if (oldEra.type === 'ethereum' && newEra.type === 'ethereum') {
    const changed: string[] = []
    if (oldEra.inbox !== newEra.inbox) {
      changed.push(`inbox ${oldEra.inbox} -> ${newEra.inbox}`)
    }
    if (!sameSet(oldEra.sequencers, newEra.sequencers)) {
      changed.push('sequencers changed')
    }
    if (!sameSet(oldEra.topics, newEra.topics)) {
      changed.push('topics changed')
    }
    return changed.join(', ') || 'identity changed'
  }
  if (oldEra.type === 'celestia' && newEra.type === 'celestia') {
    return `namespace ${oldEra.namespace} -> ${newEra.namespace}`
  }
  if (oldEra.type === 'avail' && newEra.type === 'avail') {
    return 'appIds changed'
  }
  return 'identity changed'
}

function sameSet(a: string[] | undefined, b: string[] | undefined): boolean {
  const as = [...(a ?? [])].sort()
  const bs = [...(b ?? [])].sort()
  return as.length === bs.length && as.every((v, i) => v === bs[i])
}

function label(era: DaTrackingEra): string {
  switch (era.type) {
    case 'ethereum': {
      const sequencers = era.sequencers
        ? ` sequencers[${era.sequencers.length}]`
        : ''
      return `ethereum inbox ${era.inbox}${sequencers}`
    }
    case 'celestia':
      return `celestia namespace ${era.namespace}`
    case 'avail':
      return `avail appIds [${era.appIds.join(', ')}]`
  }
}
