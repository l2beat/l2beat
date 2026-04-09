import {
  ConfigReader,
  getDiscoveryPaths,
  TemplateService,
} from '@l2beat/discovery'
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
  analyzeOutgoing,
  buildDiscoveryIndex,
  type EntryOutgoing,
} from './discoveryRelatives'

export const Leaks = command({
  name: 'leaks',
  description:
    "Rank a project's discovered.json by which contracts emit the most leaking relatives. Each address-typed field is marked LEAKING (would be walked by the BFS) or IGNORED (covered by ignoreRelatives in a template or per-address override). Use this during the milestone-1 cleanup loop to find the boundary contracts that need cuts.",
  args: {
    project: positional({
      type: string,
      displayName: 'project',
      description: 'project to analyze',
    }),
    top: option({
      type: optional(number),
      long: 'top',
      description:
        'show only the top N entries by leaking-target count (default: 10)',
    }),
    address: option({
      type: optional(string),
      long: 'address',
      short: 'a',
      description:
        'instead of a ranking, dump the full outgoing-field breakdown for this single entry (chain-prefixed address or unique contract name)',
    }),
    all: flag({
      long: 'all',
      description:
        'show every entry that has any leaking field, not just the top N',
    }),
    showIgnored: flag({
      long: 'show-ignored',
      description:
        'also print fields that are already ignored (default: only LEAKING fields are shown in the ranking)',
    }),
  },
  handler: ({ project, top, address, all, showIgnored }) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const templateService = new TemplateService(paths.discovery)

    const projectConfig = configReader.readConfig(project)
    const discovery = configReader.readDiscovery(project)
    const index = buildDiscoveryIndex(discovery)

    const summaries: EntryOutgoing[] = discovery.entries
      .filter((e) => e.type !== 'EOA')
      .map((entry) =>
        analyzeOutgoing(entry, projectConfig.structure, templateService, index),
      )

    if (address !== undefined) {
      const target = resolveEntry(address, summaries)
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

    const limit = all ? ranked.length : (top ?? 10)
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

function resolveEntry(
  addressOrName: string,
  summaries: EntryOutgoing[],
): EntryOutgoing | undefined {
  if (addressOrName.includes(':')) {
    return summaries.find(
      (s) => s.address.toLowerCase() === addressOrName.toLowerCase(),
    )
  }
  const matches = summaries.filter((s) => s.name === addressOrName)
  if (matches.length === 1) return matches[0]
  if (matches.length > 1) {
    console.log(
      `Found ${matches.length} entries named '${addressOrName}'. Pass a chain-prefixed address to disambiguate:`,
    )
    for (const m of matches) console.log(`  ${m.address}`)
    return undefined
  }
  return undefined
}

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
  const ignored = entry.fields.filter((f) => f.ignore.status === 'ignored')

  if (leaking.length === 0 && ignored.length === 0) {
    console.log('  (no address-typed fields)')
    return
  }

  for (const f of leaking) {
    const targetLine = formatTargets(f)
    console.log(`  L  .${f.field}  ${targetLine}`)
  }

  if (opts.showIgnored) {
    for (const f of ignored) {
      // biome-ignore lint/suspicious/noExplicitAny: narrow above
      const source = (f.ignore as any).source as string
      const targetLine = formatTargets(f)
      console.log(`  I  .${f.field}  ${targetLine}  [${source}]`)
    }
  }
}

function formatTargets(f: {
  targets: { address: string; label: string; template?: string }[]
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
