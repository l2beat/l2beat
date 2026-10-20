import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  boolean,
  command,
  flag,
  positional,
  restPositionals,
  string,
  subcommands,
} from 'cmd-ts'
import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join, relative, resolve } from 'path'
import {
  formatBench,
  formatFindings,
} from '../implementations/xref/bench/report'
import { runBench } from '../implementations/xref/bench/runBench'
import {
  type FlatEntry,
  FlatWorkspace,
  locateFlat,
} from '../implementations/xref/FlatWorkspace'
import { findReferences } from '../implementations/xref/findReferences'
import { listCalls } from '../implementations/xref/listCalls'
import { runLanguageServer } from '../implementations/xref/lsp/runLanguageServer'
import {
  type Definition,
  type DefinitionResult,
  describeAddress,
  resolveDefinition,
} from '../implementations/xref/resolveDefinition'

const showSource = flag({
  type: boolean,
  long: 'source',
  short: 's',
  description: 'print the source of every definition',
})

const XrefDefinition = command({
  name: 'def',
  description:
    'Go to the definition of the symbol at a position in a .flat file, following addresses from discovered.json across contracts.',
  args: {
    location: positional({
      type: string,
      displayName: 'file:line:column',
      description: '1-based position, e.g. .flat/Bridge/Bridge.sol:120:24',
    }),
    source: showSource,
  },
  handler: ({ location, source }) => {
    const { workspace, path, offset } = openFlat(location)
    const result = resolveDefinition(workspace, path, offset)
    printResult(workspace, result, source, '')
  },
})

const XrefReferences = command({
  name: 'refs',
  description:
    'Find every reference to the symbol at a position, across all .flat files of the project, including calls from other contracts.',
  args: {
    location: positional({
      type: string,
      displayName: 'file:line:column',
      description: '1-based position, on a declaration or on any use of it',
    }),
    calls: flag({
      type: boolean,
      long: 'calls',
      description: 'only list call sites',
    }),
  },
  handler: ({ location, calls }) => {
    const { workspace, path, offset } = openFlat(location)
    const result = findReferences(workspace, path, offset)
    console.log(result.symbol || 'nothing to find here')
    for (const target of result.targets) {
      console.log(`  defined: ${formatDefinition(target)}`)
    }
    const references = result.references.filter((r) => !calls || r.isCall)
    console.log(`${references.length} ${calls ? 'calls' : 'references'}`)
    for (const reference of references) {
      const { line, column } = reference.position
      const where = `${displayPath(reference.path)}:${line}:${column}`
      const copies =
        reference.copies.length > 0
          ? ` (+${reference.copies.length} identical files)`
          : ''
      const text = lineAt(workspace.text(reference.path), reference.offset)
      const kind = reference.elsewhere
        ? 'same code elsewhere'
        : reference.resolution
      console.log(`  ${where}  ${text}  [${kind}]${copies}`)
    }
  },
})

function openFlat(location: string) {
  const { path, line, column } = parseLocation(location)
  const flat = locateFlat(path)
  assert(flat !== undefined, 'Path is not inside a .flat directory')
  const workspace = FlatWorkspace.fromProject(
    new ConfigReader(flat.projectsDirectory),
    flat.project,
  )
  const offset = workspace.source(path).offsetOf({ line, column })
  return { workspace, path, offset }
}

function lineAt(text: string, offset: number): string {
  const start = text.lastIndexOf('\n', offset) + 1
  const end = text.indexOf('\n', offset)
  return text
    .slice(start, end === -1 ? undefined : end)
    .trim()
    .slice(0, 120)
}

const XrefCalls = command({
  name: 'calls',
  description:
    'List the calls a contract function makes, each resolved to its definition through discovered.json.',
  args: {
    project: positional({ type: string, displayName: 'project' }),
    contract: positional({
      type: string,
      displayName: 'contract',
      description: 'entry name or chain-prefixed address',
    }),
    function: positional({ type: string, displayName: 'function' }),
    source: showSource,
  },
  handler: (args) => {
    const workspace = openWorkspace(args.project)
    const entry = findEntry(workspace, args.contract)
    const sites = listCalls(workspace, entry, args.function)
    if (sites.length === 0) {
      console.log('No resolvable calls found.')
    }
    for (const site of sites) {
      const where = `${displayPath(site.path)}:${site.position.line}:${site.position.column}`
      console.log(`${where}  ${site.caller}`)
      printResult(workspace, site.result, args.source, '  ')
      console.log('')
    }
  },
})

const XrefBench = command({
  name: 'bench',
  description:
    'Score xref against ground truth from solc and the chain at the discovered block.',
  args: {
    projects: restPositionals({ type: string, displayName: 'projects' }),
  },
  handler: async ({ projects }) => {
    const paths = getDiscoveryPaths()
    const configReader = new ConfigReader(paths.discovery)
    const results = []
    for (const project of projects) {
      const result = await runBench(configReader, paths, project)
      const findingsPath = join(
        dirname(paths.cache),
        'xref-oracle',
        `${project}-findings.tsv`,
      )
      mkdirSync(dirname(findingsPath), { recursive: true })
      writeFileSync(findingsPath, formatFindings(result))
      writeFileSync(
        findingsPath.replace('-findings.tsv', '-references.txt'),
        result.references.samples.join('\n'),
      )
      results.push(result)
    }
    console.log(formatBench(results))
  },
})

const XrefLsp = command({
  name: 'lsp',
  description:
    'Language server over stdio: go to definition and hover across .flat files.',
  args: {},
  handler: () => runLanguageServer(),
})

export const Xref = subcommands({
  name: 'xref',
  description:
    'Navigate .flat sources across contracts using the addresses in discovered.json.',
  cmds: {
    def: XrefDefinition,
    refs: XrefReferences,
    calls: XrefCalls,
    lsp: XrefLsp,
    bench: XrefBench,
  },
})

function openWorkspace(project: string): FlatWorkspace {
  const configReader = new ConfigReader(getDiscoveryPaths().discovery)
  return FlatWorkspace.fromProject(configReader, project)
}

function findEntry(workspace: FlatWorkspace, contract: string): FlatEntry {
  const address = ChainSpecificAddress.tryParse(contract)
  const named = workspace.entries.filter(
    (e) =>
      e.address === address ||
      e.name === contract ||
      e.aliases?.includes(contract),
  )
  // The project's own name for a module contract wins over the module's.
  const aliased = named.filter((e) => e.aliases?.includes(contract))
  const matches = aliased.length > 0 ? aliased : named
  assert(matches.length > 0, 'Contract not found in discovery')
  assert(matches.length === 1, 'Contract name is ambiguous, use its address')
  const entry = matches[0]
  assert(entry !== undefined)
  return entry
}

function parseLocation(location: string) {
  const columnSeparator = location.lastIndexOf(':')
  const lineSeparator = location.lastIndexOf(':', columnSeparator - 1)
  assert(lineSeparator > 0, 'Expected file:line:column')
  const line = Number(location.slice(lineSeparator + 1, columnSeparator))
  const column = Number(location.slice(columnSeparator + 1))
  assert(Number.isInteger(line) && line > 0, 'Line must be a positive integer')
  assert(
    Number.isInteger(column) && column > 0,
    'Column must be a positive integer',
  )
  return { path: resolve(location.slice(0, lineSeparator)), line, column }
}

function printResult(
  workspace: FlatWorkspace,
  result: DefinitionResult,
  source: boolean,
  indent: string,
) {
  const address = result.receiver?.address
  const receiver = address ? ` = ${describeAddress(workspace, address)}` : ''
  console.log(`${indent}${result.symbol}${receiver}`)
  if (result.definitions.length === 0) {
    console.log(`${indent}  no definition found`)
  }
  for (const definition of result.definitions) {
    console.log(`${indent}  -> ${formatDefinition(definition)}`)
    if (source) {
      console.log(definitionSource(workspace, definition, `${indent}     `))
    }
  }
}

function formatDefinition(definition: Definition): string {
  const { path, position, label, resolution, entries } = definition
  const [first, ...rest] = entries
  const owner = first ? `  ${first.name} ${first.address}` : ''
  const more =
    rest.length > 0 ? ` (+${rest.length} more with identical code)` : ''
  return `${label}  ${displayPath(path)}:${position.line}:${position.column}  [${resolution}]${owner}${more}`
}

function definitionSource(
  workspace: FlatWorkspace,
  definition: Definition,
  indent: string,
): string {
  const range = definition.declaration.range
  assert(range !== undefined)
  const text = workspace.source(definition.path).text
  const lineStart = text.lastIndexOf('\n', range[0]) + 1
  return text
    .slice(lineStart, range[1] + 1)
    .split('\n')
    .map((line) => `${indent}${line}`)
    .join('\n')
}

function displayPath(path: string): string {
  return relative(process.cwd(), path)
}
