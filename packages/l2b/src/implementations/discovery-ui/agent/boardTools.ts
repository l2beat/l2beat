import { v as z } from '@l2beat/validate'
import { announce, resolveBoardOf } from './boardRouter'
import { type Board, listSavedBoards } from './boardStore'
import {
  boardBlocksSchema,
  PROPERTIES,
  parseBoardSpec,
  type ResolvedBlock,
} from './boards'
import { projectSchema } from './entries'
import { tabsLabel } from './printing'
import { AgentRefError } from './resolveRef'
import { SELECTOR_HELP } from './selectors'
import { type DiscoUi, projectOrOpen, ToolError, tool } from './tools'

const BLOCKS_HELP = [
  '{"type":"text","text":"markdown"}',
  `{"type":"table","title"?,"rows":[...],"columns"?:[...]}: a row is a selector, one row per contract it matches, or {"contract"?: "Bridge", "cells"?: {"<column label>": value you computed}}. A column is {"label"} plus one of "property" (${PROPERTIES.join('|')}), "field" (a discovered value path: $threshold, $members, owner, a.b.0) or "selector" run per row, where {row} is the row's contract: "upgradeableBy:{row}". A row's cells win over its column. A table of contracts starts with a Contract column naming each row unless a column shows its name. Contracts and addresses in cells are links that select them in DiscoUI, columns sort, and every table has a button that shows its contracts in the graph.`,
  '{"type":"view","label":"button text","view":{...the view tool\'s fields}}: a button that applies the view when the researcher wants it.',
  '{"type":"html","html":"...","heightPx"?}: only for what the others cannot draw, like a chart. It runs sandboxed without network and is as tall as its content: leave out heightPx unless the page fills its frame, like a canvas at 100% height; window.discoui.select("eth:0x…") selects a contract, and DiscoUI\'s colors are CSS variables: --text, --muted, --line, --surface, --blue, --orange, --red, --green, --yellow, --teal.',
]

export const BOARD_DESCRIPTION = `Shows the researcher a board in DiscoUI's board panel: text, tables bound to the discovery, view buttons, next to their graph. Use it for "show me a table of", "list everything that", "compare": find the answer any way you like, then put it here instead of in a long reply or a file. The researcher keeps it open, edits it, saves it to the project's boards/ folder or closes it. Prefer selectors and fields over values you copied: a saved board reads the discovery again when opened, while computed cells stay as you wrote them, so say in a text block where they come from. Pass id to change a board instead of opening another. The researcher reads the board, so your reply only says what it shows. Blocks:\n  ${BLOCKS_HELP.join('\n  ')}\nSelectors:\n  ${SELECTOR_HELP.join('\n  ')}`

const boardSchema = z.object({
  project: projectSchema.optional(),
  id: z.string().optional(),
  title: z.string().check((v) => v.length > 0, 'A board needs a title'),
  blocks: boardBlocksSchema,
})

export const BOARD_TOOLS = [
  tool({
    name: 'board',
    description: BOARD_DESCRIPTION,
    input: boardSchema,
    argumentHelp: {
      project: 'defaults to the project open in DiscoUI',
      id: 'the board to replace, from an earlier board call',
      title: 'what the board shows, in a few words',
    },
    readOnly: false,
    run: (input, ui) => showBoard(ui, input),
    explainInvalid: (args) => {
      const spec = parseBoardSpec(args)
      return spec.success ? undefined : spec.message
    },
  }),
  tool({
    name: 'boards',
    description:
      'The boards open in DiscoUI and the ones saved for the project; with id, the spec of one, to change it with board.',
    input: z.object({
      project: projectSchema.optional(),
      id: z.string().optional(),
    }),
    argumentHelp: { project: 'defaults to the project open in DiscoUI' },
    readOnly: true,
    run: (input, ui) => listBoards(ui, input.project, input.id),
  }),
]

function showBoard(ui: DiscoUi, input: z.infer<typeof boardSchema>): string[] {
  const spec = { title: input.title, blocks: input.blocks }
  const existing = input.id === undefined ? undefined : openBoard(ui, input.id)
  if (
    existing !== undefined &&
    input.project !== undefined &&
    input.project !== existing.project
  ) {
    throw new ToolError(
      'The board belongs to another project',
      `${existing.id} is ${existing.project}'s`,
    )
  }
  const project = existing?.project ?? projectOrOpen(ui, input.project)
  const resolved = resolveBoardOf(ui.configReader, { project, spec })
  const board =
    existing === undefined
      ? ui.boards.open(project, spec)
      : (ui.boards.replace(existing.id, spec) ?? existing)
  const tabs = announce({ session: ui.session }, board, true)
  const lines = [
    describeAnnounce(board, project, tabs, ui.session.outdatedTabCount),
    ...resolved.blocks.map(describeBlock),
  ]
  if (resolved.problems.length > 0) {
    lines.push(
      'Did not bind, the researcher sees this too:',
      ...resolved.problems.map((p) => `  ${p}`),
    )
  }
  return lines
}

function describeAnnounce(
  board: Board,
  project: string,
  tabs: number,
  outdatedTabs: number,
): string {
  const title = `Board ${board.id} "${board.spec.title}"`
  // Tabs from before boards existed never hear of one.
  const reload =
    outdatedTabs > 0
      ? ` ${outdatedTabs === 1 ? '1 tab runs' : `${outdatedTabs} tabs run`} an older DiscoUI without boards: ask the researcher to reload.`
      : ''
  if (tabs > 0) {
    return `${title} shown in ${tabsLabel(tabs)}: ${project}.${reload}`
  }
  if (outdatedTabs > 0) {
    return `${title} is ready, but no open tab shows boards.${reload}`
  }
  return `${title} is ready, but no DiscoUI tab is open: it waits in ${project}'s board panel.`
}

function openBoard(ui: DiscoUi, id: string): Board {
  const board = ui.boards.get(id)
  if (board === undefined) {
    throw new AgentRefError(
      'No open board with this id',
      id,
      [...ui.boards.all()].map((b) => `${b.id} (${b.spec.title})`),
    )
  }
  return board
}

function describeBlock(block: ResolvedBlock): string {
  switch (block.type) {
    case 'table': {
      const linked = block.rows.filter((r) => r.address !== undefined).length
      // How full each column is, so the agent knows what the researcher sees
      // without reading the board back.
      const columns = block.columns.map((label, index) => {
        const filled = block.rows.filter((r) => r.cells[index]?.length).length
        return `${label} ${filled}/${block.rows.length}`
      })
      return `  table "${block.title ?? ''}": ${block.rows.length} rows (${linked} contracts), filled: ${columns.join(', ')}`
    }
    case 'view':
      return `  view button "${block.label}"`
    case 'html':
      return '  html'
    case 'text':
      return '  text'
    case 'problem':
      return `  not drawn: ${block.text}`
  }
}

function listBoards(
  ui: DiscoUi,
  project: string | undefined,
  id: string | undefined,
): string[] {
  if (id !== undefined) {
    return [JSON.stringify(openBoard(ui, id).spec)]
  }
  const name = projectOrOpen(ui, project)
  const open = ui.boards.list(name)
  const lines = [`${open.length} open in DiscoUI for ${name}`]
  for (const board of open) {
    const file =
      board.savedAs === undefined ? 'not saved' : `boards/${board.savedAs}.json`
    const changes = board.unsaved && board.savedAs ? ', changed since' : ''
    lines.push(`  ${board.id} "${board.spec.title}", ${file}${changes}`)
  }
  const saved = listSavedBoards(ui.configReader.getProjectPath(name))
  lines.push(`${saved.length} saved`)
  for (const board of saved) {
    lines.push(`  ${board.name} "${board.title}"`)
  }
  return lines
}
