import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ProjectEntry } from './entries'
import { controlPaths, indexPermissionPaths } from './permissionPaths'
import { AgentRefError, resolveRef } from './resolveRef'

export const SELECTOR_HELP = [
  'Bridge, arb1:L2Timelock, eth:0x… (one contract)',
  'all',
  'name:*Escrow* (names, * matches anything, any case)',
  'template:orbitstack/* (template ids)',
  'category:*Bridges (L2BEAT categories, find lists them)',
  'type:eoa | type:multisig | type:contract',
  'chain:eth',
  'controlledBy:<contract> (everything it can act on: directly, through other contracts, or as a signer of a multisig that can)',
  'upgradeableBy:<contract> (everything it can upgrade, the same way)',
]

const TYPES = ['eoa', 'multisig', 'contract']
const KNOWN_VALUES_MAX = 20

// Selectors let a view say what it means, "every escrow", instead of a list
// of addresses that goes stale with the next discovery.
export class SelectorResolver {
  private control: ControlIndex | undefined

  constructor(private readonly entries: readonly ProjectEntry[]) {}

  resolve(selector: string): ChainSpecificAddress[] {
    const trimmed = selector.trim()
    if (trimmed === 'all') {
      return this.entries.map((e) => e.address)
    }
    const separator = trimmed.indexOf(':')
    const prefix = trimmed.slice(0, separator).toLowerCase()
    const kind = SELECTOR_KINDS.find((k) => k.toLowerCase() === prefix)
    if (separator === -1 || kind === undefined) {
      return [resolveRef(this.entries, trimmed)]
    }
    return this.resolveKind(selector, kind, trimmed.slice(separator + 1))
  }

  private resolveKind(
    selector: string,
    kind: string,
    value: string,
  ): ChainSpecificAddress[] {
    const matching = (pick: (e: ProjectEntry) => boolean) =>
      this.entries.filter(pick).map((e) => e.address)
    switch (kind) {
      case 'name':
        return matching((e) => matchesGlob(e.name ?? '', value))
      case 'template':
        return matching((e) => matchesGlob(e.template ?? '', value))
      case 'category':
        return matching((e) => matchesGlob(e.category ?? '', value))
      case 'chain':
        return matching((e) => ChainSpecificAddress.chain(e.address) === value)
      case 'type':
        return matching((e) => typeOf(e) === typeName(selector, value))
      case 'controlledBy':
        return [...this.controlIndex().controlled(this.ref(value))]
      default:
        return [...this.controlIndex().upgradeable(this.ref(value))]
    }
  }

  // The values a kind of selector can match here, to suggest when one
  // matches nothing.
  knownValues(selector: string): string[] {
    const kind = selector.slice(0, selector.indexOf(':')).toLowerCase()
    const distinct = (pick: (e: ProjectEntry) => string | undefined) =>
      [...new Set(this.entries.flatMap((e) => pick(e) ?? []))].sort()
    switch (kind) {
      case 'category':
        return distinct((e) => e.category)
      case 'template':
        return distinct((e) => e.template).slice(0, KNOWN_VALUES_MAX)
      case 'chain':
        return distinct((e) => ChainSpecificAddress.chain(e.address))
      case 'type':
        return TYPES
      default:
        return []
    }
  }

  private ref(value: string) {
    return resolveRef(this.entries, value)
  }

  private controlIndex(): ControlIndex {
    this.control ??= new ControlIndex(this.entries)
    return this.control
  }
}

const SELECTOR_KINDS = [
  'name',
  'template',
  'category',
  'chain',
  'type',
  'controlledBy',
  'upgradeableBy',
]

function typeName(selector: string, value: string): string {
  const lower = value.toLowerCase()
  if (!TYPES.includes(lower)) {
    throw new AgentRefError('Unknown type', selector, TYPES)
  }
  return lower
}

export function typeOf(entry: ProjectEntry): string {
  if (entry.isEOA) return 'eoa'
  return entry.signers === undefined ? 'contract' : 'multisig'
}

// Who reaches what: every contract on a control path is credited with the
// path's target, so a timelock in the middle controls what it relays to.
class ControlIndex {
  private readonly controls = new Map<
    ChainSpecificAddress,
    Set<ChainSpecificAddress>
  >()
  private readonly upgrades = new Map<
    ChainSpecificAddress,
    Set<ChainSpecificAddress>
  >()

  constructor(entries: readonly ProjectEntry[]) {
    const index = indexPermissionPaths(entries)
    const byAddress = new Map(entries.map((e) => [e.address, e]))
    for (const entry of entries) {
      for (const p of controlPaths(entry.address, byAddress, index).paths) {
        const holder = p.path[0] as ChainSpecificAddress
        const actors = [...p.path.slice(0, -1), ...signersOf(holder, byAddress)]
        for (const actor of actors) {
          add(this.controls, actor, entry.address)
          if (p.permission === 'upgrade')
            add(this.upgrades, actor, entry.address)
        }
      }
    }
  }

  controlled(actor: ChainSpecificAddress) {
    return this.controls.get(actor) ?? new Set()
  }

  upgradeable(actor: ChainSpecificAddress) {
    return this.upgrades.get(actor) ?? new Set()
  }
}

// Everyone who signs for a multisig, and for multisigs among them, in turn.
export function signersOf(
  holder: ChainSpecificAddress,
  byAddress: ReadonlyMap<ChainSpecificAddress, ProjectEntry>,
): ChainSpecificAddress[] {
  const signers = new Set<ChainSpecificAddress>()
  const stack = [...(byAddress.get(holder)?.signers?.members ?? [])]
  for (let member = stack.pop(); member !== undefined; member = stack.pop()) {
    if (signers.has(member) || member === holder) continue
    signers.add(member)
    stack.push(...(byAddress.get(member)?.signers?.members ?? []))
  }
  return [...signers]
}

function add<K, V>(map: Map<K, Set<V>>, key: K, value: V) {
  const values = map.get(key) ?? new Set()
  values.add(value)
  map.set(key, values)
}

export function matchesGlob(text: string, pattern: string): boolean {
  const subject = text.toLowerCase()
  const parts = pattern.toLowerCase().split('*')
  if (parts.length === 1) {
    return subject === parts[0]
  }
  const first = parts[0] as string
  const last = parts[parts.length - 1] as string
  if (!subject.startsWith(first) || !subject.endsWith(last)) {
    return false
  }
  let at = first.length
  for (const middle of parts.slice(1, -1)) {
    const found = subject.indexOf(middle, at)
    if (found === -1) {
      return false
    }
    at = found + middle.length
  }
  return at <= subject.length - last.length
}
