import {
  ConfigReader,
  type ConfigRegistry,
  type DiscoveryOutput,
  getDiscoveryPaths,
  TemplateService,
  toAddressArray,
} from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { boolean, command, flag, positional, string } from 'cmd-ts'
import partition from 'lodash/partition'
import {
  effectiveIgnoreRelatives,
  proxyFilteredAddresses,
} from './discoveryRelatives'
import { ChainSpecificAddressValue } from './types'

export const Why = command({
  name: 'why',
  description:
    'Trace why an address ends up in a project by listing every contract and field that references it, marked as walked or ignored.',
  args: {
    project: positional({
      type: string,
      displayName: 'project',
      description: 'project to inspect',
    }),
    address: positional({
      type: ChainSpecificAddressValue,
      displayName: 'address',
      description: 'chain-prefixed address to trace (e.g. eth:0x...)',
    }),
    root: flag({
      type: boolean,
      long: 'root',
      short: 'r',
      description:
        'also show the shortest non-ignored path from an initial address to the target',
    }),
  },
  handler: ({ project, address, root }) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const templateService = new TemplateService(paths.discovery)

    const projectConfig = configReader.readConfig(project)
    const discovery = configReader.readDiscovery(project)

    const targetEntry = discovery.entries.find((e) => e.address === address)

    console.log(
      `Tracing ${address}${targetEntry ? ` (${targetEntry.name ?? targetEntry.type})` : ' (not in discovered.json)'} in project ${project}\n`,
    )

    type Hit = {
      from: string
      address: ChainSpecificAddress
      field: string
      ignored: boolean
      ignoreSource: 'template' | 'override' | undefined
    }
    const hits: Hit[] = []

    for (const entry of discovery.entries) {
      if (entry.address === address) continue
      if (!('values' in entry) || entry.values === undefined) continue

      const ignoredFields = effectiveIgnoreRelatives(
        entry,
        projectConfig,
        templateService,
      )

      for (const [field, value] of Object.entries(entry.values)) {
        if (!toAddressArray(value).includes(address)) continue
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

    const [ignored, leaking] = partition(hits, (h) => h.ignored)

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

    if (root) {
      const path = findShortestRootPath(
        address,
        discovery,
        projectConfig,
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
  address: ChainSpecificAddress
  name: string
  viaField: string
}

function findShortestRootPath(
  target: ChainSpecificAddress,
  discovery: DiscoveryOutput,
  config: ConfigRegistry,
  templateService: TemplateService,
): PathNode[] | undefined {
  // Build forward edges: address -> [(toAddress, viaField)] using only
  // non-ignored fields. We compute effective ignoreRelatives for each entry
  // (template + per-address override) and skip those fields. We also drop
  // addresses the engine auto-filters per-entry (proxy implementation, beacon,
  // past upgrades) so the path mirrors what the BFS actually walks.
  type Edge = { to: ChainSpecificAddress; field: string }
  const edges = new Map<string, Edge[]>()
  for (const entry of discovery.entries) {
    if (!entry.values) continue
    const ignored = effectiveIgnoreRelatives(entry, config, templateService)
    const proxyFiltered = proxyFilteredAddresses(entry)
    const out: Edge[] = []
    for (const [field, value] of Object.entries(entry.values)) {
      if (ignored.template.has(field) || ignored.override.has(field)) continue
      for (const addr of toAddressArray(value)) {
        if (proxyFiltered.has(addr)) continue
        out.push({ to: addr, field })
      }
    }
    edges.set(entry.address, out)
  }

  const nameByAddress = new Map<ChainSpecificAddress, string>()
  for (const e of discovery.entries) {
    nameByAddress.set(e.address, e.name ?? (e.type === 'EOA' ? 'EOA' : '???'))
  }

  const visited = new Set<string>()
  const parent = new Map<
    string,
    { from: ChainSpecificAddress; field: string }
  >()
  const queue: ChainSpecificAddress[] = []
  for (const seed of config.structure.initialAddresses) {
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
    const cur = queue.shift() as ChainSpecificAddress
    const out = edges.get(cur) ?? []
    for (const { to, field } of out) {
      if (visited.has(to)) continue
      visited.add(to)
      parent.set(to, { from: cur, field })
      if (to === target) {
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
