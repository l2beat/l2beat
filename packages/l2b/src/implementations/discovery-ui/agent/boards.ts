import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import type { ProjectEntry } from './entries'
import {
  controlPaths,
  formatDelay,
  indexPermissionPaths,
  type PermissionPath,
} from './permissionPaths'
import { AgentRefError, resolveRef } from './resolveRef'
import { SelectorResolver, typeOf } from './selectors'
import {
  type AgentView,
  agentViewSchema,
  resolveView,
  type UpgradeRoute,
  upgradeRoutes,
} from './views'

// A board is what the researcher asked to see, written as blocks DiscoUI
// draws. Rows and columns name contracts by selector and values by path, so
// a saved board shows the discovery of the day it is opened, not the day it
// was written.
export const PROPERTIES = [
  'name',
  'address',
  'type',
  'template',
  'chain',
  'category',
  'upgradedBy',
  'upgradeDelay',
  'upgradeRoute',
] as const
type Property = (typeof PROPERTIES)[number]
const ROW_PLACEHOLDER = '{row}'
const ROWS_MAX = 500
const JSON_TEXT_LENGTH_MAX = 200

const cellInputSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
])

// A column reads one thing per row, or nothing and shows the cells rows
// bring under its label.
const columnSchema = z
  .object({
    label: z.string(),
    property: z.enum(PROPERTIES).optional(),
    field: z.string().optional(),
    selector: z.string().optional(),
  })
  .check(
    (c) =>
      [c.property, c.field, c.selector].filter((b) => b !== undefined).length <=
      1,
    'A column takes one of property, field and selector',
  )
type BoardColumn = z.infer<typeof columnSchema>

const rowSchema = z.union([
  z.string(),
  z.object({
    contract: z.string().optional(),
    cells: z.record(z.string(), cellInputSchema).optional(),
  }),
])

const BLOCK_SCHEMAS = {
  text: z.object({ type: z.literal('text'), text: z.string() }),
  table: z.object({
    type: z.literal('table'),
    title: z.string().optional(),
    rows: z.array(rowSchema),
    columns: z.array(columnSchema).optional(),
  }),
  view: z.object({
    type: z.literal('view'),
    label: z.string(),
    // project and dryRun are the board's and do not apply.
    view: agentViewSchema,
  }),
  html: z.object({
    type: z.literal('html'),
    html: z.string(),
    heightPx: z.number().optional(),
  }),
}
const blockSchema = z.union([
  BLOCK_SCHEMAS.text,
  BLOCK_SCHEMAS.table,
  BLOCK_SCHEMAS.view,
  BLOCK_SCHEMAS.html,
])
export type BoardBlock = z.infer<typeof blockSchema>

export const boardBlocksSchema = z.array(blockSchema)
export const boardSpecSchema = z.object({
  title: z.string().check((v) => v.length > 0, 'A board needs a title'),
  blocks: boardBlocksSchema,
})
export type BoardSpec = z.infer<typeof boardSpecSchema>

type SpecResult =
  | { success: true; data: BoardSpec }
  | { success: false; message: string }

// A failed union names every variant's mismatch. The block's type says which
// one its author meant, so a hand edit hears about that one alone.
export function parseBoardSpec(value: unknown): SpecResult {
  const result = boardSpecSchema.safeParse(value)
  if (result.success) {
    return result
  }
  const blocks = (value as { blocks?: unknown } | null)?.blocks
  const list: unknown[] = Array.isArray(blocks) ? blocks : []
  for (const [index, block] of list.entries()) {
    const message = blockProblem(block)
    if (message !== undefined) {
      return { success: false, message: `At .blocks[${index}]${message}` }
    }
  }
  return {
    success: false,
    message: `At ${result.path || '@'}: ${result.message}`,
  }
}

function blockProblem(block: unknown): string | undefined {
  const type = (block as { type?: unknown } | null)?.type
  const types = Object.keys(BLOCK_SCHEMAS)
  if (typeof type !== 'string' || !types.includes(type)) {
    return `.type: a block is one of ${types.join(', ')}`
  }
  const result =
    BLOCK_SCHEMAS[type as keyof typeof BLOCK_SCHEMAS].safeParse(block)
  return result.success ? undefined : `${result.path}: ${result.message}`
}

export type CellPart = { text: string } | { address: string; name: string }

export interface ResolvedRow {
  address: string | undefined
  cells: CellPart[][]
}

export type ResolvedBlock =
  | { type: 'text'; text: string }
  | {
      type: 'table'
      title: string | undefined
      columns: string[]
      // Columns of related contracts, which "Show in graph" draws with the
      // rows. Values like signers would only crowd the graph.
      graphColumns: number[]
      rows: ResolvedRow[]
    }
  | { type: 'view'; label: string; view: AgentView }
  // A block that did not bind keeps its place, so the board reads as written.
  | { type: 'problem'; text: string }
  | { type: 'html'; html: string; heightPx: number | undefined }

export interface ResolvedBoard {
  blocks: ResolvedBlock[]
  // What did not bind, for the author to fix: a selector that matched
  // nothing, a field no row has.
  problems: string[]
}

export function resolveBoard(
  entries: readonly ProjectEntry[],
  spec: BoardSpec,
): ResolvedBoard {
  const resolver = new SelectorResolver(entries)
  const byAddress = new Map(entries.map((e) => [e.address as string, e]))
  // A column selector that fails, fails the same way for every row.
  const problems = new Set<string>()
  const upgrades = upgradeLookups(entries)
  const binding = { entries, resolver, byAddress, problems, ...upgrades }
  const blocks = spec.blocks.map((block): ResolvedBlock => {
    switch (block.type) {
      case 'table':
        return resolveTable(block, binding)
      case 'view':
        return resolveViewBlock(block, binding)
      case 'html':
        return { type: 'html', html: block.html, heightPx: block.heightPx }
      case 'text':
        return block
    }
  })
  return { blocks, problems: [...problems] }
}

// The board resolves again whenever it opens, and a contract a view named
// may be gone from the discovery by then.
function resolveViewBlock(
  block: Extract<BoardBlock, { type: 'view' }>,
  binding: Binding,
): ResolvedBlock {
  try {
    const { view } = resolveView(binding.entries, block.view)
    return { type: 'view', label: block.label, view }
  } catch (error) {
    if (!(error instanceof AgentRefError)) {
      throw error
    }
    const problem = `${block.label}: ${describeRefError(error)}`
    binding.problems.add(problem)
    return { type: 'problem', text: problem }
  }
}

interface Binding extends UpgradeLookups {
  entries: readonly ProjectEntry[]
  resolver: SelectorResolver
  byAddress: ReadonlyMap<string, ProjectEntry>
  problems: Set<string>
}

interface UpgradeLookups {
  upgradesOf: (target: ChainSpecificAddress) => UpgradeRoute[]
  fastestUpgradePath: (
    target: ChainSpecificAddress,
  ) => PermissionPath | undefined
}

// The permission model is costly to build, and most boards never ask it.
function upgradeLookups(entries: readonly ProjectEntry[]): UpgradeLookups {
  const byAddress = new Map(entries.map((e) => [e.address, e]))
  let routes: ((t: ChainSpecificAddress) => UpgradeRoute[]) | undefined
  let index: Map<ChainSpecificAddress, PermissionPath[]> | undefined
  return {
    upgradesOf: (target) => {
      routes ??= upgradeRoutes(entries, byAddress)
      return routes(target)
    },
    fastestUpgradePath: (target) => {
      index ??= indexPermissionPaths(entries)
      const upgrades = controlPaths(target, byAddress, index).paths.filter(
        (p) => p.permission === 'upgrade',
      )
      return upgrades.sort((a, b) => a.delaySeconds - b.delaySeconds)[0]
    },
  }
}

type TableBlock = Extract<BoardBlock, { type: 'table' }>
type RowInput = TableBlock['rows'][number]

function resolveTable(table: TableBlock, binding: Binding): ResolvedBlock {
  const label = table.title ?? 'Table'
  const expanded = expandRows(table.rows, label, binding)
  if (expanded.length > ROWS_MAX) {
    binding.problems.add(
      `${label}: showing ${ROWS_MAX} of ${expanded.length} rows`,
    )
  }
  const rows = expanded.slice(0, ROWS_MAX)
  const columns = columnsOf(table, rows)
  const resolved = rows.map((row) => ({
    address: row.address,
    cells: columns.map((column) => resolveCell(column, row, label, binding)),
  }))
  for (const [index, column] of columns.entries()) {
    if (column.field !== undefined && rows.length > 0) {
      const isEmpty = resolved.every((r) => r.cells[index]?.length === 0)
      if (isEmpty) {
        binding.problems.add(
          `${label}: no row has field ${column.field}${fieldHint(rows, binding)}`,
        )
      }
    }
  }
  return {
    type: 'table',
    title: table.title,
    columns: columns.map((c) => c.label),
    graphColumns: columns.flatMap((c, i) =>
      c.selector === undefined ? [] : [i],
    ),
    rows: resolved,
  }
}

const NAME_COLUMN: BoardColumn = { label: 'Contract', property: 'name' }

// A row of a contract selects it when clicked, so the table always says which
// contract it is, even when its author only asked for values.
function columnsOf(table: TableBlock, rows: readonly Row[]): BoardColumn[] {
  const columns = table.columns ?? []
  if (columns.length === 0) {
    return [NAME_COLUMN]
  }
  // An address column does not count: people read a contract by its name.
  const namesRows = columns.some(
    (c) => c.property === 'name' || c.label === NAME_COLUMN.label,
  )
  const hasContracts = rows.some((r) => r.address !== undefined)
  return namesRows || !hasContracts ? columns : [NAME_COLUMN, ...columns]
}

interface Row {
  address: string | undefined
  cells: Record<string, unknown>
}

// A contract two selectors match is one row, where the first put it.
function expandRows(
  inputs: readonly RowInput[],
  label: string,
  binding: Binding,
): Row[] {
  const rows: Row[] = []
  const listed = new Set<string>()
  for (const input of inputs) {
    if (typeof input !== 'string') {
      rows.push(contractRow(input, label, binding))
      continue
    }
    const matched = resolveSelector(input, label, binding)
    if (matched.length === 0) {
      binding.problems.add(`${label}: rows ${input} matched nothing`)
    }
    for (const address of matched) {
      if (listed.has(address)) continue
      listed.add(address)
      rows.push({ address, cells: {} })
    }
  }
  return rows
}

function contractRow(
  input: Exclude<RowInput, string>,
  label: string,
  binding: Binding,
): Row {
  const cells = input.cells ?? {}
  if (input.contract === undefined) {
    return { address: undefined, cells }
  }
  try {
    return { address: resolveRef(binding.entries, input.contract), cells }
  } catch (error) {
    if (!(error instanceof AgentRefError)) {
      throw error
    }
    binding.problems.add(`${label}: ${describeRefError(error)}`)
    return { address: undefined, cells }
  }
}

function resolveSelector(
  selector: string,
  label: string,
  binding: Binding,
): string[] {
  try {
    return binding.resolver.resolve(selector)
  } catch (error) {
    if (!(error instanceof AgentRefError)) {
      throw error
    }
    binding.problems.add(`${label}: ${describeRefError(error)}`)
    return []
  }
}

function describeRefError(error: AgentRefError): string {
  const candidates = error.candidates.slice(0, 3).join(', ')
  const hint = candidates.length > 0 ? ` (try ${candidates})` : ''
  return `${error.message}: ${error.ref}${hint}`
}

function resolveCell(
  column: BoardColumn,
  row: Row,
  table: string,
  binding: Binding,
): CellPart[] {
  if (Object.hasOwn(row.cells, column.label)) {
    return formatValue(row.cells[column.label], binding.byAddress)
  }
  const entry =
    row.address === undefined ? undefined : binding.byAddress.get(row.address)
  if (entry === undefined) {
    return []
  }
  if (column.property !== undefined) {
    return propertyOf(entry, column.property, binding)
  }
  if (column.field !== undefined) {
    return formatValue(readPath(entry.values, column.field), binding.byAddress)
  }
  if (column.selector !== undefined) {
    return columnSelector(column, column.selector, entry, table, binding)
  }
  return []
}

// Named by the column's selector, not the row's, so a typo is one problem
// rather than one per row.
function columnSelector(
  column: BoardColumn,
  selector: string,
  entry: ProjectEntry,
  table: string,
  binding: Binding,
): CellPart[] {
  try {
    return binding.resolver
      .resolve(selector.split(ROW_PLACEHOLDER).join(entry.address))
      .map((address) => contractPart(address, binding.byAddress))
  } catch (error) {
    if (!(error instanceof AgentRefError)) {
      throw error
    }
    binding.problems.add(
      `${table}: column ${column.label}: ${error.message} in ${selector}`,
    )
    return []
  }
}

function propertyOf(
  entry: ProjectEntry,
  property: Property,
  binding: Binding,
): CellPart[] {
  switch (property) {
    case 'name':
      return [{ address: entry.address, name: entry.name ?? entry.address }]
    // A link, so DiscoUI shortens it like every other address.
    case 'address':
      return [{ address: entry.address, name: entry.address }]
    case 'type':
      return [{ text: typeOf(entry) }]
    case 'template':
      return entry.template === undefined ? [] : [{ text: entry.template }]
    case 'chain':
      return [{ text: ChainSpecificAddress.chain(entry.address) }]
    case 'category':
      return entry.category === undefined ? [] : [{ text: entry.category }]
    case 'upgradedBy':
    case 'upgradeDelay':
      return fastestUpgrade(entry.address, property, binding)
    case 'upgradeRoute': {
      const path = binding.fastestUpgradePath(entry.address)?.path ?? []
      return path
        .slice(0, -1)
        .flatMap((address, i) => [
          ...(i > 0 ? [{ text: '→' }] : []),
          contractPart(address, binding.byAddress),
        ])
    }
  }
}

// The quickest way to upgrade, the one users have the least time to react
// to: who holds it, or how long it takes.
function fastestUpgrade(
  target: ChainSpecificAddress,
  property: 'upgradedBy' | 'upgradeDelay',
  binding: Binding,
): CellPart[] {
  const routes = binding.upgradesOf(target)
  if (routes.length === 0) {
    return []
  }
  const delay = Math.min(...routes.map((r) => r.delaySeconds))
  if (property === 'upgradeDelay') {
    return [{ text: delay === 0 ? 'no delay' : formatDelay(delay) }]
  }
  const holders = new Set(
    routes.filter((r) => r.delaySeconds === delay).map((r) => r.holder),
  )
  return [...holders].map((h) => contractPart(h, binding.byAddress))
}

// Field paths are the ones the values panel shows: a.b.0.c.
function readPath(values: unknown, path: string): unknown {
  let value = values
  for (const key of path.split('.')) {
    if (typeof value !== 'object' || value === null) {
      return undefined
    }
    value = (value as Record<string, unknown>)[key]
  }
  return value
}

function formatValue(
  value: unknown,
  byAddress: ReadonlyMap<string, ProjectEntry>,
): CellPart[] {
  if (value === undefined || value === null) {
    return []
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => formatValue(item, byAddress))
  }
  if (typeof value === 'string' && byAddress.has(value)) {
    return [contractPart(value, byAddress)]
  }
  if (typeof value === 'object') {
    const text = JSON.stringify(value)
    return [{ text: text.slice(0, JSON_TEXT_LENGTH_MAX) }]
  }
  return [{ text: String(value) }]
}

function contractPart(
  address: string,
  byAddress: ReadonlyMap<string, ProjectEntry>,
): CellPart {
  return { address, name: byAddress.get(address)?.name ?? address }
}

function fieldHint(rows: Row[], binding: Binding): string {
  const first = rows.find((r) => r.address !== undefined)?.address
  const values = first === undefined ? {} : binding.byAddress.get(first)?.values
  const keys = Object.keys(values ?? {}).slice(0, 12)
  return keys.length > 0 ? ` (the first row has ${keys.join(', ')})` : ''
}
