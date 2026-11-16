import { v as z } from '@l2beat/validate'
import type { ApiAgentBoard, ApiBoardBlock, ApiBoardCell } from '../types'
import { type AgentEntry, resolveRef } from './resolveRef'
import { ToolError } from './toolError'

// The agent is the board's only writer and every cell has a type, so the
// tab draws text and contract links, never markup or code the agent sent.
const BLOCKS_MAX = 30
const TEXT_CHARACTERS_MAX = 20_000
const LABEL_CHARACTERS_MAX = 200
const CELL_CHARACTERS_MAX = 2_000
const COLUMNS_MAX = 20
const ROWS_MAX = 500

const labelSchema = z
  .string()
  .check(
    (v) => v.length > 0 && v.length <= LABEL_CHARACTERS_MAX,
    `Between 1 and ${LABEL_CHARACTERS_MAX} characters`,
  )

const cellSchema = z.union([
  z
    .string()
    .check(
      (v) => v.length <= CELL_CHARACTERS_MAX,
      `A cell over ${CELL_CHARACTERS_MAX} characters, put the details in a text block`,
    ),
  z.object({ contract: labelSchema }),
])

const textBlockSchema = z.object({
  type: z.literal('text'),
  text: z
    .string()
    .check(
      (v) => v.length > 0 && v.length <= TEXT_CHARACTERS_MAX,
      `Between 1 and ${TEXT_CHARACTERS_MAX} characters`,
    ),
})

const tableBlockSchema = z
  .object({
    type: z.literal('table'),
    title: labelSchema.optional(),
    columns: z
      .array(labelSchema)
      .check(
        (v) => v.length > 0 && v.length <= COLUMNS_MAX,
        `Between 1 and ${COLUMNS_MAX} columns`,
      ),
    rows: z
      .array(z.array(cellSchema))
      .check((v) => v.length <= ROWS_MAX, `At most ${ROWS_MAX} rows`),
  })
  .check(
    (table) => table.rows.every((row) => row.length === table.columns.length),
    'Every row has one cell per column',
  )

export const boardBlocksSchema = z
  .array(z.union([textBlockSchema, tableBlockSchema]))
  .check(
    (v) => v.length > 0 && v.length <= BLOCKS_MAX,
    `Between 1 and ${BLOCKS_MAX} blocks`,
  )
export const boardTitleSchema = labelSchema

type BlockInput = z.infer<typeof boardBlocksSchema>[number]
type CellInput = z.infer<typeof cellSchema>

export const BOARD_DESCRIPTION = [
  'Shows the researcher a board in DiscoUI\'s board panel, next to their graph: text and tables they keep open while they work. Use it for "list", "compare" or "show me a table of": find the answer with your other tools, then put it here instead of in a long reply.',
  'Blocks: {"type": "text", "text": "markdown"} and {"type": "table", "title"?: "...", "columns": ["Contract", "Upgraded by"], "rows": [[{"contract": "Bridge"}, "ProxyAdmin, 7d delay"]]}.',
  'A cell is text, or {"contract": ref} for a contract of the project: it shows the contract\'s name and selects it in the graph when clicked.',
  'Each call replaces the board. It shows what you wrote, and does not change when the discovery does, so say in a text block where the numbers come from. Your reply then only says what the board shows.',
].join(' ')

// Contract cells resolve now, so a wrong name fails the call with what to
// fix, and the tab gets addresses it can select.
export function resolveBoard(
  entries: readonly AgentEntry[],
  input: { id: string; project: string; title: string; blocks: BlockInput[] },
): ApiAgentBoard {
  const byAddress = new Map(entries.map((entry) => [entry.address, entry]))
  const resolveCell = (cell: CellInput): ApiBoardCell => {
    if (typeof cell === 'string') {
      return { type: 'text', text: cell }
    }
    const address = resolveRef(entries, cell.contract)
    const name = byAddress.get(address)?.name
    return name === undefined
      ? { type: 'contract', address }
      : { type: 'contract', address, name }
  }
  const blocks = input.blocks.map((block, index): ApiBoardBlock => {
    if (block.type === 'text') {
      return { type: 'text', text: block.text }
    }
    try {
      return {
        type: 'table',
        title: block.title,
        columns: block.columns,
        rows: block.rows.map((row) => row.map(resolveCell)),
      }
    } catch (error) {
      if (error instanceof ToolError) {
        // Which table, so the agent fixes the right one.
        throw new ToolError(error.message, {
          block: `${index}${block.title === undefined ? '' : ` (${block.title})`}`,
          ...error.details,
        })
      }
      throw error
    }
  })
  return { id: input.id, project: input.project, title: input.title, blocks }
}

// What the researcher sees, so the agent need not read the board back.
export function describeBoard(board: ApiAgentBoard): string[] {
  const lines = [
    `Board "${board.title}" shown in DiscoUI's board panel. ${board.project}, ${board.blocks.length} blocks:`,
  ]
  for (const block of board.blocks) {
    if (block.type === 'text') {
      lines.push('  text')
      continue
    }
    const contracts = block.rows
      .flat()
      .filter((cell) => cell.type === 'contract').length
    const title = block.title === undefined ? '' : ` "${block.title}"`
    lines.push(
      `  table${title}: ${block.rows.length} rows, ${block.columns.length} columns, ${contracts} contract links`,
    )
  }
  return lines
}
