import type { TemplateService } from '@l2beat/discovery'

export type RelativeIgnore =
  | { status: 'leaking' }
  | { status: 'ignored'; source: 'template' | 'override' }

export type RelativeTarget = {
  address: string
  label: string
  template?: string
  inDiscovery: boolean
}

export type OutgoingField = {
  field: string
  ignore: RelativeIgnore
  targets: RelativeTarget[]
}

export type EntryOutgoing = {
  address: string
  name: string
  template?: string
  fields: OutgoingField[]
  leakingTargetCount: number
  ignoredTargetCount: number
}

const ADDRESS_RE = /^[a-z0-9]+:0x[0-9a-fA-F]{40}$/

export function extractAddresses(value: unknown): string[] {
  const out: string[] = []
  walk(value)
  return out
  function walk(v: unknown): void {
    if (v === null || v === undefined) return
    if (typeof v === 'string') {
      if (ADDRESS_RE.test(v)) out.push(v)
      return
    }
    if (Array.isArray(v)) {
      for (const item of v) walk(item)
      return
    }
    if (typeof v === 'object') {
      for (const item of Object.values(v as Record<string, unknown>)) walk(item)
    }
  }
}

export function effectiveIgnoreRelatives(
  entry: { address: { toString(): string }; template?: string },
  structure: {
    overrides?: Record<string, { ignoreRelatives?: string[] } | undefined>
  },
  templateService: TemplateService,
): { template: Set<string>; override: Set<string> } {
  const template = new Set<string>()
  const override = new Set<string>()

  if (entry.template) {
    try {
      const tpl = templateService.loadContractTemplate(entry.template)
      for (const field of tpl.ignoreRelatives ?? []) template.add(field)
    } catch {
      // Template referenced by the entry no longer exists; treat as no ignores.
    }
  }

  const ovr = structure.overrides?.[entry.address.toString()]
  for (const field of ovr?.ignoreRelatives ?? []) override.add(field)

  return { template, override }
}

export type DiscoveryIndex = {
  nameByAddress: Map<string, string>
  templateByAddress: Map<string, string | undefined>
  addressesInDiscovery: Set<string>
}

export function buildDiscoveryIndex(discovery: {
  // biome-ignore lint/suspicious/noExplicitAny: entry shape varies across discovery versions
  entries: any[]
}): DiscoveryIndex {
  const nameByAddress = new Map<string, string>()
  const templateByAddress = new Map<string, string | undefined>()
  const addressesInDiscovery = new Set<string>()
  for (const e of discovery.entries) {
    const key = e.address.toString().toLowerCase()
    nameByAddress.set(key, e.name ?? (e.type === 'EOA' ? 'EOA' : '???'))
    templateByAddress.set(key, e.template)
    addressesInDiscovery.add(key)
  }
  return { nameByAddress, templateByAddress, addressesInDiscovery }
}

// Addresses the discovery engine auto-filters out of relatives for an entry
// (regardless of which field they appear in): the entry's own implementations,
// beacons, and historical implementations from $pastUpgrades. Computed from
// the entry's `values` to mirror AddressAnalyzer.ts.
export function proxyFilteredAddresses(
  // biome-ignore lint/suspicious/noExplicitAny: entry shape varies
  entry: any,
): Set<string> {
  const out = new Set<string>()
  const v = entry.values as Record<string, unknown> | undefined
  if (!v) return out
  for (const addr of extractAddresses(v.$implementation)) {
    out.add(addr.toLowerCase())
  }
  for (const addr of extractAddresses(v.$beacon)) {
    out.add(addr.toLowerCase())
  }
  // $pastUpgrades is `[blockNumber, txHash, implementations[]][]`. The
  // implementations are at index [2] of each tuple.
  const pu = v.$pastUpgrades
  if (Array.isArray(pu)) {
    for (const tuple of pu) {
      if (Array.isArray(tuple) && tuple.length >= 3) {
        for (const addr of extractAddresses(tuple[2])) {
          out.add(addr.toLowerCase())
        }
      }
    }
  }
  return out
}

export function analyzeOutgoing(
  // biome-ignore lint/suspicious/noExplicitAny: entry shape varies
  entry: any,
  structure: {
    overrides?: Record<string, { ignoreRelatives?: string[] } | undefined>
  },
  templateService: TemplateService,
  index: DiscoveryIndex,
): EntryOutgoing {
  const ignored = effectiveIgnoreRelatives(entry, structure, templateService)
  const proxyFiltered = proxyFilteredAddresses(entry)
  const fields: OutgoingField[] = []
  const leakingAddrs = new Set<string>()
  const ignoredAddrs = new Set<string>()

  if (entry.values && typeof entry.values === 'object') {
    for (const [field, value] of Object.entries(
      entry.values as Record<string, unknown>,
    )) {
      const allAddrs = extractAddresses(value)
      if (allAddrs.length === 0) continue
      // Drop addresses that the engine auto-filters via the per-entry
      // ignoredAddresses list (proxy implementations, beacons, past upgrades).
      // A field whose only targets are all proxy-filtered isn't actually
      // walked, so we omit it from the output entirely.
      const addrs = allAddrs.filter((a) => !proxyFiltered.has(a.toLowerCase()))
      if (addrs.length === 0) continue
      const inTemplate = ignored.template.has(field)
      const inOverride = ignored.override.has(field)
      const ignore: RelativeIgnore = inTemplate
        ? { status: 'ignored', source: 'template' }
        : inOverride
          ? { status: 'ignored', source: 'override' }
          : { status: 'leaking' }
      const targets: RelativeTarget[] = addrs.map((address) => {
        const lower = address.toLowerCase()
        return {
          address,
          label: index.nameByAddress.get(lower) ?? '???',
          template: index.templateByAddress.get(lower),
          inDiscovery: index.addressesInDiscovery.has(lower),
        }
      })
      for (const t of targets) {
        if (ignore.status === 'leaking')
          leakingAddrs.add(t.address.toLowerCase())
        else ignoredAddrs.add(t.address.toLowerCase())
      }
      fields.push({ field, ignore, targets })
    }
  }

  return {
    address: entry.address.toString(),
    name: entry.name ?? (entry.type === 'EOA' ? 'EOA' : '???'),
    template: entry.template,
    fields,
    leakingTargetCount: leakingAddrs.size,
    ignoredTargetCount: ignoredAddrs.size,
  }
}
