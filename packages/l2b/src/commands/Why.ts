import {
  ConfigReader,
  getDiscoveryPaths,
  TemplateService,
} from '@l2beat/discovery'
import { boolean, command, flag, positional, string } from 'cmd-ts'
import {
  effectiveIgnoreRelatives,
  extractAddresses,
} from './discoveryRelatives'

export const Why = command({
  name: 'why',
  description:
    "Trace why a given address ends up in a project's discovered.json by listing every contract and field that references it, and marking which references are walked vs. ignored.",
  args: {
    project: positional({
      type: string,
      displayName: 'project',
      description: 'name of the project to inspect',
    }),
    address: positional({
      type: string,
      displayName: 'address',
      description:
        'chain-prefixed address to trace, e.g. eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    }),
    root: flag({
      type: boolean,
      long: 'root',
      short: 'r',
      description:
        "show the shortest non-ignored path from any of the project's initialAddresses to the target, hop-by-hop. Useful for finding the boundary contract that pulls a foreign cluster into the discovery.",
    }),
  },
  handler: (args) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const templateService = new TemplateService(paths.discovery)

    const projectConfig = configReader.readConfig(args.project)
    const discovery = configReader.readDiscovery(args.project)

    const target = args.address.toLowerCase()
    const targetEntry = discovery.entries.find(
      (e) => e.address.toLowerCase() === target,
    )

    console.log(
      `Tracing ${args.address}${targetEntry ? ` (${targetEntry.name ?? targetEntry.type})` : ' (not in discovered.json)'} in project ${args.project}\n`,
    )

    type Hit = {
      from: string
      address: string
      field: string
      ignored: boolean
      ignoreSource: 'template' | 'override' | undefined
    }
    const hits: Hit[] = []

    for (const entry of discovery.entries) {
      if (entry.address.toLowerCase() === target) continue
      if (!('values' in entry) || entry.values === undefined) continue

      const ignoredFields = effectiveIgnoreRelatives(
        entry,
        projectConfig.structure,
        templateService,
      )

      for (const [field, value] of Object.entries(entry.values)) {
        if (!referencesAddress(value, target)) continue
        hits.push({
          from: entry.name ?? '???',
          address: entry.address,
          field,
          ignored:
            ignoredFields.template.has(field) ||
            ignoredFields.override.has(field),
          ignoreSource: ignoredFields.template.has(field)
            ? 'template'
            : ignoredFields.override.has(field)
              ? 'override'
              : undefined,
        })
      }
    }

    if (hits.length === 0) {
      console.log(
        '  No references found. The address may be in initialAddresses, reached via a proxy implementation, or unreachable from the seed.',
      )
      return
    }

    const leaking = hits.filter((h) => !h.ignored)
    const ignored = hits.filter((h) => h.ignored)

    if (leaking.length > 0) {
      console.log(`LEAKING (${leaking.length}):`)
      for (const h of leaking) {
        console.log(`  ${h.from.padEnd(35)} ${h.address}  .${h.field}`)
      }
      console.log('')
    }

    if (ignored.length > 0) {
      console.log(`IGNORED via ignoreRelatives (${ignored.length}):`)
      for (const h of ignored) {
        const tag = h.ignoreSource === 'template' ? 'template' : 'override'
        console.log(
          `  ${h.from.padEnd(35)} ${h.address}  .${h.field}  [${tag}]`,
        )
      }
      console.log('')
    }

    if (leaking.length === 0 && targetEntry) {
      console.log(
        'Every reference is already ignored. The address still appears in entries because some other path reached it first (e.g. a proxy implementation, an entrypoint, or the initialAddresses).',
      )
    } else if (leaking.length > 0) {
      console.log(
        "To remove this address from the discovery, add the LEAKING fields above to the corresponding template's `ignoreRelatives` (or use a per-address override).",
      )
    }

    if (args.root) {
      const path = findShortestRootPath(
        target,
        discovery,
        projectConfig.structure,
        templateService,
      )
      console.log('')
      if (path === undefined) {
        console.log(
          'ROOT PATH: target is not reachable from any initialAddress through non-ignored fields. It may be in initialAddresses itself or only reached via proxy machinery.',
        )
      } else {
        console.log(`ROOT PATH (${path.length - 1} hops):`)
        for (const [i, node] of path.entries()) {
          if (i === 0) {
            console.log(`  ${node.name.padEnd(35)} ${node.address}  [seed]`)
          } else {
            console.log(`    └─ .${node.viaField}`)
            console.log(`  ${node.name.padEnd(35)} ${node.address}`)
          }
        }
      }
    }
  },
})

type PathNode = {
  address: string
  name: string
  viaField: string
}

function findShortestRootPath(
  target: string,
  // biome-ignore lint/suspicious/noExplicitAny: discovered.json shape
  discovery: any,
  // biome-ignore lint/suspicious/noExplicitAny: structure config shape
  structure: any,
  templateService: TemplateService,
): PathNode[] | undefined {
  // Build forward edges: address -> [(toAddress, viaField)] using only
  // non-ignored fields. We compute effective ignoreRelatives for each entry
  // (template + per-address override) and skip those fields.
  type Edge = { to: string; field: string }
  const edges = new Map<string, Edge[]>()
  // biome-ignore lint/suspicious/noExplicitAny: entry shape
  for (const entry of discovery.entries as any[]) {
    if (!entry.values) continue
    const ignored = effectiveIgnoreRelatives(entry, structure, templateService)
    const out: Edge[] = []
    for (const [field, value] of Object.entries(entry.values)) {
      if (ignored.template.has(field) || ignored.override.has(field)) continue
      for (const addr of extractAddresses(value)) {
        out.push({ to: addr.toLowerCase(), field })
      }
    }
    edges.set(entry.address.toString().toLowerCase(), out)
  }

  // Name index for output
  const nameByAddress = new Map<string, string>()
  // biome-ignore lint/suspicious/noExplicitAny: entry shape
  for (const e of discovery.entries as any[]) {
    nameByAddress.set(
      e.address.toString().toLowerCase(),
      e.name ?? (e.type === 'EOA' ? 'EOA' : '???'),
    )
  }

  // BFS from each initialAddress
  // biome-ignore lint/suspicious/noExplicitAny: structure shape
  const seeds = (structure.initialAddresses as any[]).map((a) =>
    a.toString().toLowerCase(),
  )

  const visited = new Set<string>()
  const parent = new Map<string, { from: string; field: string }>()
  const queue: string[] = []
  for (const seed of seeds) {
    if (visited.has(seed)) continue
    visited.add(seed)
    queue.push(seed)
    if (seed === target) {
      return [
        { address: seed, name: nameByAddress.get(seed) ?? '???', viaField: '' },
      ]
    }
  }

  while (queue.length > 0) {
    const cur = queue.shift() as string
    const out = edges.get(cur) ?? []
    for (const { to, field } of out) {
      if (visited.has(to)) continue
      visited.add(to)
      parent.set(to, { from: cur, field })
      if (to === target) {
        // Reconstruct path
        const path: PathNode[] = []
        let node = to
        while (true) {
          const p = parent.get(node)
          path.unshift({
            address: node,
            name: nameByAddress.get(node) ?? '???',
            viaField: p?.field ?? '',
          })
          if (!p) break
          node = p.from
        }
        return path
      }
      queue.push(to)
    }
  }

  return undefined
}

function referencesAddress(value: unknown, target: string): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.toLowerCase() === target
  if (Array.isArray(value))
    return value.some((v) => referencesAddress(v, target))
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some((v) =>
      referencesAddress(v, target),
    )
  }
  return false
}
