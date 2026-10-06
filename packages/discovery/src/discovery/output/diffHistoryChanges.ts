import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { getChainShortName } from '../../config/config.discovery'
import type { DiffHistoryEntry } from './DiffHistoryParser'
import type { DiscoveryDiff } from './diffDiscovery'
import {
  type DiffHistoryFieldChange,
  parseDiffHistoryBlocks,
} from './parseDiffHistoryBlocks'
import { parseUpgrade, type Upgrade } from './upgradeHistory'

export type DiffHistoryChangeKind =
  | 'implementation'
  | 'upgradeAppended'
  | 'upgradeRecord'
  | 'value'
  | 'representationOnly'

export interface DiffHistoryChange {
  entryId: string
  timestamp: number
  previous?: number
  address: ChainSpecificAddress
  addressType: DiscoveryDiff['addressType']
  template?: string
  status?: 'created' | 'deleted'
  field?: string
  kind?: DiffHistoryChangeKind
  upgrade?: Upgrade & { transaction: string }
}

const PAST_UPGRADES_ITEM = 'values.$pastUpgrades.'

export function getDiffHistoryChanges(
  entry: DiffHistoryEntry,
): DiffHistoryChange[] {
  assert(entry.timestamp !== null, `undated diffHistory entry ${entry.date}`)
  const base = {
    entryId: entry.id,
    timestamp: entry.timestamp,
    ...(entry.comparing?.at?.kind === 'timestamp'
      ? { previous: entry.comparing.at.value }
      : {}),
  }
  return entry.sections
    .filter((section) => section.kind === 'watched-changes')
    .flatMap((section) => parseDiffHistoryBlocks(section.body))
    .flatMap((block) => {
      const contract = {
        ...base,
        address: resolveAddress(block.address, entry.chain),
        addressType: block.addressType,
        ...(block.template === undefined ? {} : { template: block.template }),
      }
      return [
        ...(block.type === undefined
          ? []
          : [{ ...contract, status: block.type }]),
        ...(block.diff ?? []).map((field) => ({
          ...contract,
          ...classify(field),
        })),
      ]
    })
}

function resolveAddress(raw: string, chain: string | null) {
  if (raw.includes(':')) return ChainSpecificAddress(raw)
  // the two migration-day entries have bare addresses and no chain line
  return ChainSpecificAddress(
    `${getChainShortName(chain ?? 'ethereum')}:${raw}`,
  )
}

function classify(
  field: DiffHistoryFieldChange,
): Pick<DiffHistoryChange, 'field' | 'kind' | 'upgrade'> {
  const name = canonicalField(field.key)
  const named = name === undefined ? {} : { field: name }
  const upgrade = appendedUpgrade(field)
  if (upgrade !== undefined)
    return { ...named, kind: 'upgradeAppended', upgrade }
  if (
    field.before !== undefined &&
    field.after !== undefined &&
    stripChainPrefixes(field.before) === stripChainPrefixes(field.after)
  ) {
    return { ...named, kind: 'representationOnly' }
  }
  if (name === '$implementation') return { ...named, kind: 'implementation' }
  if (name === '$pastUpgrades' || name === '$upgradeCount') {
    return { ...named, kind: 'upgradeRecord' }
  }
  return { ...named, kind: 'value' }
}

function appendedUpgrade(field: DiffHistoryFieldChange) {
  if (!field.key.startsWith(PAST_UPGRADES_ITEM)) return undefined
  const index = field.key.slice(PAST_UPGRADES_ITEM.length)
  if (index === '' || !Number.isInteger(Number(index))) return undefined
  if (field.before !== undefined || field.after === undefined) return undefined
  const upgrade = parseUpgrade(parseJson(field.after))
  if (upgrade?.transaction === undefined) return undefined
  return { timestamp: upgrade.timestamp, transaction: upgrade.transaction }
}

export function canonicalField(key: string): string | undefined {
  const dot = key.indexOf('.')
  if (dot === -1) return undefined
  const prefix = key.slice(0, dot)
  const first = key.slice(dot + 1).split('.')[0] ?? ''
  if (prefix === 'values') return first
  if (prefix === 'upgradeability') return `$${first}`
  return undefined
}

export function stripChainPrefixes(value: string): string {
  let result = ''
  let i = 0
  while (i < value.length) {
    const colon = value.indexOf(':0x', i)
    if (colon === -1) {
      result += value.slice(i)
      break
    }
    let start = colon
    while (start > i && isChainNameCharacter(value.charCodeAt(start - 1))) {
      start--
    }
    result +=
      start === colon ? value.slice(i, colon + 1) : value.slice(i, start)
    i = colon + 1
  }
  return result
}

function isChainNameCharacter(code: number): boolean {
  const isLower = code >= 97 && code <= 122
  const isUpper = code >= 65 && code <= 90
  const isDigit = code >= 48 && code <= 57
  return isLower || isUpper || isDigit || code === 45
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value)
  } catch {
    return undefined
  }
}
