import {
  ConfigReader,
  getDiscoveryPaths,
  TemplateService,
} from '@l2beat/discovery'
import { command, positional, string } from 'cmd-ts'
import {
  effectiveIgnoreRelatives,
  extractAddresses,
  proxyFilteredAddresses,
} from './discoveryRelatives'

export const Inspect = command({
  name: 'inspect',
  description:
    "Pretty-print a single entry from a project's discovered.json: name, type, template, proxy info, and all values, with addresses cross-referenced against the rest of the entries. Address-typed fields are tagged [LEAKING] or [IGNORED] based on the entry's effective ignoreRelatives, so you can see which fields the BFS would walk.",
  args: {
    project: positional({
      type: string,
      displayName: 'project',
      description: 'project to look up the entry in',
    }),
    addressOrName: positional({
      type: string,
      displayName: 'addressOrName',
      description:
        "chain-prefixed address (e.g. eth:0x...) or unique contract name from the project's discovered.json",
    }),
  },
  handler: (args) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const templateService = new TemplateService(paths.discovery)
    const projectConfig = configReader.readConfig(args.project)
    const discovery = configReader.readDiscovery(args.project)

    const isAddress = args.addressOrName.includes(':')
    let entry
    if (isAddress) {
      entry = discovery.entries.find(
        (e) =>
          e.address.toString().toLowerCase() ===
          args.addressOrName.toLowerCase(),
      )
      if (entry === undefined) {
        console.log(
          `No entry with address '${args.addressOrName}' in ${args.project}/discovered.json`,
        )
        return
      }
    } else {
      const matches = discovery.entries.filter(
        (e) => e.name === args.addressOrName,
      )
      if (matches.length === 0) {
        console.log(
          `No entry named '${args.addressOrName}' in ${args.project}/discovered.json`,
        )
        return
      }
      if (matches.length > 1) {
        console.log(
          `Found ${matches.length} entries named '${args.addressOrName}' in ${args.project}/discovered.json:`,
        )
        for (const m of matches) console.log(`  ${m.address}`)
        console.log(
          'Pass a chain-prefixed address (eth:0x...) to disambiguate.',
        )
        return
      }
      // biome-ignore lint/style/noNonNullAssertion: just checked
      entry = matches[0]!
    }

    // Build a name index for cross-referencing addresses inside values
    const nameByAddress = new Map<string, string>()
    for (const e of discovery.entries) {
      const key = e.address.toString().toLowerCase()
      const label = e.name ?? (e.type === 'EOA' ? 'EOA' : '???')
      nameByAddress.set(key, label)
    }

    console.log(`address    ${entry.address}`)
    console.log(`name       ${entry.name ?? '(unnamed)'}`)
    console.log(`type       ${entry.type}`)
    if (entry.template) console.log(`template   ${entry.template}`)
    if (entry.proxyType) console.log(`proxyType  ${entry.proxyType}`)
    if (entry.sourceHashes) {
      console.log('sourceHashes:')
      for (const h of entry.sourceHashes) console.log(`  ${h}`)
    }

    if (entry.values && Object.keys(entry.values).length > 0) {
      const ignored = effectiveIgnoreRelatives(
        entry,
        projectConfig.structure,
        templateService,
      )
      const proxyFiltered = proxyFilteredAddresses(entry)
      console.log('\nvalues:')
      const keys = Object.keys(entry.values).sort()
      const maxKeyLen = Math.min(Math.max(...keys.map((k) => k.length)), 32)
      for (const k of keys) {
        const v = entry.values[k]
        const formatted = formatValue(v, nameByAddress)
        const tag = leakTag(k, v, ignored, proxyFiltered)
        console.log(`  ${k.padEnd(maxKeyLen)}  ${formatted}${tag}`)
      }
    }

    if (entry.errors && Object.keys(entry.errors).length > 0) {
      console.log('\nerrors:')
      for (const [field, error] of Object.entries(entry.errors)) {
        console.log(`  ${field}: ${error}`)
      }
    }

    if (entry.ignoreInWatchMode && entry.ignoreInWatchMode.length > 0) {
      console.log(
        `\nignoreInWatchMode: [${entry.ignoreInWatchMode.join(', ')}]`,
      )
    }

    if (
      entry.directlyReceivedPermissions &&
      entry.directlyReceivedPermissions.length > 0
    ) {
      console.log(
        `\ndirectlyReceivedPermissions (${entry.directlyReceivedPermissions.length}):`,
      )
      for (const p of entry.directlyReceivedPermissions) {
        printPermission(p, nameByAddress)
      }
    }

    if (entry.receivedPermissions && entry.receivedPermissions.length > 0) {
      console.log(
        `\nreceivedPermissions (${entry.receivedPermissions.length}):`,
      )
      for (const p of entry.receivedPermissions) {
        printPermission(p, nameByAddress)
      }
    }

    if (entry.controlsMajorityOfUpgradePermissions) {
      console.log('\ncontrolsMajorityOfUpgradePermissions: true')
    }
  },
})

function printPermission(
  // biome-ignore lint/suspicious/noExplicitAny: ReceivedPermission shape
  p: any,
  nameByAddress: Map<string, string>,
): void {
  const fromLabel = nameByAddress.get(String(p.from).toLowerCase()) ?? '?'
  const tag = `[${p.permission}${p.delay ? ` delay=${p.delay}s` : ''}]`
  console.log(`  ${tag} from ${p.from} (${fromLabel})`)
  if (p.role) console.log(`    role: ${p.role}`)
  if (p.description) console.log(`    desc: ${p.description}`)
  if (p.condition) console.log(`    cond: ${p.condition}`)
  if (p.via && p.via.length > 0) {
    const vias = p.via
      .map(
        // biome-ignore lint/suspicious/noExplicitAny: via shape
        (v: any) => {
          const label =
            nameByAddress.get(String(v.address).toLowerCase()) ?? '?'
          const delay = v.delay ? ` delay=${v.delay}s` : ''
          return `${v.address} (${label})${delay}`
        },
      )
      .join(' -> ')
    console.log(`    via:  ${vias}`)
  }
}

function formatValue(
  value: unknown,
  nameByAddress: Map<string, string>,
): string {
  const json = JSON.stringify(value)
  if (json === undefined) return 'undefined'
  // Annotate any chain-prefixed addresses with their entry name in parentheses
  return json.replace(/"([a-z0-9]+:0x[0-9a-fA-F]{40})"/g, (match, addr) => {
    const label = nameByAddress.get(String(addr).toLowerCase())
    if (label === undefined) return match
    return `${match} (${label})`
  })
}

function leakTag(
  field: string,
  value: unknown,
  ignored: { template: Set<string>; override: Set<string> },
  proxyFiltered: Set<string>,
): string {
  const addrs = extractAddresses(value)
  if (addrs.length === 0) return ''
  if (ignored.template.has(field)) return '  [IGNORED via template]'
  if (ignored.override.has(field)) return '  [IGNORED via override]'
  // If every target is in the engine's per-entry ignoredAddresses set
  // (proxy implementation, beacon, past upgrade), the BFS won't walk them
  // even though no ignoreRelatives entry covers the field.
  const liveTargets = addrs.filter((a) => !proxyFiltered.has(a.toLowerCase()))
  if (liveTargets.length === 0) return '  [IGNORED via proxy]'
  if (liveTargets.length < addrs.length) return '  [LEAKING (partial)]'
  return '  [LEAKING]'
}
