import {
  ConfigReader,
  type ConfigRegistry,
  type EntryParameters,
  getDiscoveryPaths,
  TemplateService,
  toAddressArray,
} from '@l2beat/discovery'
import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  command,
  flag,
  number,
  option,
  optional,
  positional,
  string,
} from 'cmd-ts'
import {
  effectiveIgnoreRelatives,
  proxyFilteredAddresses,
} from './discoveryRelatives'
import { ChainSpecificAddressValue } from './types'

export const Leaks = command({
  name: 'leaks',
  description:
    'Rank contracts in a project by leaking relatives (address fields that would be walked by BFS but are not ignored).',
  args: {
    project: positional({
      type: string,
      displayName: 'project',
      description: 'project to analyze',
    }),
    top: option({
      type: number,
      long: 'top',
      description: 'show only the top N entries',
      defaultValue: () => 10,
      defaultValueIsSerializable: true,
    }),
    address: option({
      type: optional(ChainSpecificAddressValue),
      long: 'address',
      short: 'a',
      description:
        'dump the full breakdown for a single entry (chain-prefixed address, e.g. eth:0x...)',
    }),
    all: flag({
      long: 'all',
      description: 'show every leaking entry, not just the top N',
    }),
    showIgnored: flag({
      long: 'show-ignored',
      description: 'also print fields that are already ignored',
    }),
  },
  handler: ({ project, top, address, all, showIgnored }) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const templateService = new TemplateService(paths.discovery)

    const config = configReader.readConfig(project)
    const discovery = configReader.readDiscovery(project)
    const index = buildDiscoveryIndex(discovery)

    const summaries: EntryOutgoing[] = discovery.entries
      .filter((e) => e.type !== 'EOA')
      .map((entry) => analyzeOutgoing(entry, config, templateService, index))

    if (address !== undefined) {
      const target = summaries.find((s) => s.address === address)
      if (target === undefined) {
        console.log(
          `No entry matching '${address}' in ${project}/discovered.json`,
        )
        return
      }
      printEntry(target, { showIgnored: true })
      return
    }

    const ranked = summaries
      .filter((s) => s.leakingTargetCount > 0)
      .sort((a, b) => b.leakingTargetCount - a.leakingTargetCount)

    const limit = all ? ranked.length : top
    const shown = ranked.slice(0, limit)

    if (shown.length === 0) {
      console.log(
        `No leaking relatives in ${project}. Every address-typed field is either covered by ignoreRelatives or returns an in-discovery target.`,
      )
      return
    }

    const totalLeakingEntries = ranked.length
    const totalLeakingTargets = ranked.reduce(
      (acc, s) => acc + s.leakingTargetCount,
      0,
    )
    console.log(
      `${totalLeakingEntries} entries leak relatives (${totalLeakingTargets} total leaking targets across all fields).`,
    )
    console.log(
      `Showing top ${shown.length}${all ? '' : ` of ${totalLeakingEntries}`}, ranked by leaking-target count.\n`,
    )

    for (const s of shown) {
      printEntry(s, { showIgnored })
      console.log('')
    }

    if (!all && ranked.length > shown.length) {
      console.log(
        `... ${ranked.length - shown.length} more leaking entries (use --all or --top N to see them).`,
      )
    }
  },
})

function printEntry(
  entry: EntryOutgoing,
  opts: { showIgnored: boolean },
): void {
  const header =
    `${String(entry.leakingTargetCount).padStart(3)} leaks  ` +
    `${entry.name}` +
    (entry.template ? `  [${entry.template}]` : '') +
    `  ${entry.address}`
  console.log(header)

  const leaking = entry.fields.filter((f) => f.ignore.status === 'leaking')
  const ignored = opts.showIgnored
    ? entry.fields.filter((f) => f.ignore.status === 'ignored')
    : []
  const internal = opts.showIgnored
    ? entry.fields.filter((f) => f.ignore.status === 'internal')
    : []

  if (leaking.length === 0 && ignored.length === 0 && internal.length === 0) {
    console.log('  (no address-typed fields)')
    return
  }

  for (const f of leaking) {
    const targetLine = formatTargets(f)
    console.log(`  L  .${f.field}  ${targetLine}`)
  }

  for (const f of ignored) {
    assert(f.ignore.status === 'ignored')
    const targetLine = formatTargets(f)
    console.log(`  I  .${f.field}  ${targetLine}  [${f.ignore.source}]`)
  }

  for (const f of internal) {
    const targetLine = formatTargets(f)
    console.log(`  .  .${f.field}  ${targetLine}  [internal]`)
  }
}

function formatTargets(f: {
  targets: { address: ChainSpecificAddress; label: string; template?: string }[]
}): string {
  if (f.targets.length === 1) {
    const t = f.targets[0]
    return `→ ${t.address}  (${t.label}${t.template ? `, ${t.template}` : ''})`
  }
  const head = f.targets
    .slice(0, 3)
    .map((t) => `${t.address.slice(0, 12)}…(${t.label})`)
    .join(', ')
  const more = f.targets.length > 3 ? `, +${f.targets.length - 3} more` : ''
  return `→ ${f.targets.length} targets: ${head}${more}`
}

export function analyzeOutgoing(
  entry: EntryParameters,
  config: ConfigRegistry,
  templateService: TemplateService,
  index: DiscoveryIndex,
): EntryOutgoing {
  const ignored = effectiveIgnoreRelatives(entry, config, templateService)
  const proxyFiltered = proxyFilteredAddresses(entry)
  const fields: OutgoingField[] = []
  const leakingAddrs = new Set<ChainSpecificAddress>()
  const ignoredAddrs = new Set<ChainSpecificAddress>()

  if (entry.values) {
    for (const [field, value] of Object.entries(entry.values)) {
      const allAddrs = toAddressArray(value)
      if (allAddrs.length === 0) continue
      const addrs = allAddrs.filter((a) => !proxyFiltered.has(a))
      if (addrs.length === 0) continue
      const inTemplate = ignored.template.has(field)
      const inOverride = ignored.override.has(field)
      const newAddrs = addrs.filter((a) => !index.nameByAddress.has(a))
      const ignore: RelativeIgnore = inTemplate
        ? { status: 'ignored', source: 'template' }
        : inOverride
          ? { status: 'ignored', source: 'override' }
          : newAddrs.length > 0
            ? { status: 'leaking' }
            : { status: 'internal' }
      const targets: RelativeTarget[] = addrs.map((address) => {
        return {
          address,
          label: index.nameByAddress.get(address) ?? '???',
          template: index.templateByAddress.get(address),
        }
      })
      if (ignore.status === 'leaking') {
        for (const a of newAddrs) leakingAddrs.add(a)
      } else if (ignore.status === 'ignored') {
        for (const t of targets) ignoredAddrs.add(t.address)
      }
      fields.push({ field, ignore, targets })
    }
  }

  return {
    address: entry.address,
    name: entry.name ?? (entry.type === 'EOA' ? 'EOA' : '???'),
    template: entry.template,
    fields,
    leakingTargetCount: leakingAddrs.size,
    ignoredTargetCount: ignoredAddrs.size,
  }
}

export type DiscoveryIndex = {
  nameByAddress: Map<ChainSpecificAddress, string>
  templateByAddress: Map<ChainSpecificAddress, string | undefined>
}

export function buildDiscoveryIndex(discovery: {
  entries: EntryParameters[]
}): DiscoveryIndex {
  const nameByAddress = new Map<ChainSpecificAddress, string>()
  const templateByAddress = new Map<ChainSpecificAddress, string | undefined>()
  for (const e of discovery.entries) {
    const key = e.address
    nameByAddress.set(key, e.name ?? (e.type === 'EOA' ? 'EOA' : '???'))
    templateByAddress.set(key, e.template)
  }
  return { nameByAddress, templateByAddress }
}

export type RelativeIgnore =
  | { status: 'leaking' }
  | { status: 'internal' }
  | { status: 'ignored'; source: 'template' | 'override' }

export type RelativeTarget = {
  address: ChainSpecificAddress
  label: string
  template?: string
}

export type OutgoingField = {
  field: string
  ignore: RelativeIgnore
  targets: RelativeTarget[]
}

export type EntryOutgoing = {
  address: ChainSpecificAddress
  name: string
  template?: string
  fields: OutgoingField[]
  leakingTargetCount: number
  ignoredTargetCount: number
}
