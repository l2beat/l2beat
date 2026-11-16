import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ApiAgentGraph, ApiAgentLayout } from '../types'
import { cutText } from './excerpt'
import { type AgentEntry, resolveRef } from './resolveRef'
import { ToolError } from './toolError'

type LoadedGraph = Extract<ApiAgentGraph, { status: 'loaded' }>
type ArrangedLayout = Extract<ApiAgentLayout, { status: 'arranged' }>
type NameOf = (id: string, fallback: string) => string

// The agent read these in graph already; a long list only repeats it.
const KEPT_BELOW_NAMES_MAX = 30
// A contract with many fields to one target reads as that target's role.
const FIELD_NAMES_MAX = 3

export const GRAPH_DESCRIPTION = [
  "Reads the researcher's node view in DiscoUI as drawn: each drawn item with its position and size in canvas pixels (at x,y w×h), the links it draws to other items with the fields they come from, and the contracts it hides.",
  'A group the researcher made is one item listed with its members: it moves as one, and naming any member means the group.',
  'Call it before `layout`, to find the flows to lay out.',
].join(' ')

export const LAYOUT_DESCRIPTION = [
  "Arranges the researcher's node view in DiscoUI from the structure you give; DiscoUI computes the positions from the sizes it draws. Call `graph` first.",
  'Lanes stack top to bottom, one per flow or concern. In a lane, columns go left to right in the direction of the flow, and the contracts of a column stack top to bottom:',
  '{"lanes": [{"columns": [["L1Bridge"], ["Inbox", "Outbox"], ["Rollup"]]}, {"columns": [["ProxyAdmin"], ["Safe"]]}]}.',
  'Name each contract once; a member of a group places its group.',
  'others: "keep" (default) arranges every drawn contract the lanes do not name below them. "hide" shows only what the lanes name: DiscoUI hides a contract by hiding the links to it, so initial contracts and contracts nothing links to stay drawn below, and a named contract linked only from contracts you did not name disappears; name one that links to it.',
  'The result names what went below and what is not drawn. The researcher undoes the whole layout with one undo.',
].join(' ')

// Refs resolve now, so a wrong or repeated name fails the call with where
// it is, and the tab gets addresses it can find.
export function resolveLanes(
  entries: readonly AgentEntry[],
  lanes: readonly { columns: string[][] }[],
): ChainSpecificAddress[][][] {
  const refByAddress = new Map<ChainSpecificAddress, string>()
  return lanes.map((lane, laneIndex) =>
    lane.columns.map((column, columnIndex) =>
      column.map((ref) => {
        const at = `lanes[${laneIndex}].columns[${columnIndex}]`
        const address = resolveAt(entries, ref, at)
        const previous = refByAddress.get(address)
        if (previous !== undefined) {
          throw new ToolError('Contract named twice', {
            at,
            ref,
            'same contract as': previous,
          })
        }
        refByAddress.set(address, ref)
        return address
      }),
    ),
  )
}

function resolveAt(
  entries: readonly AgentEntry[],
  ref: string,
  at: string,
): ChainSpecificAddress {
  try {
    return resolveRef(entries, ref)
  } catch (error) {
    if (error instanceof ToolError) {
      throw new ToolError(error.message, { at, ...error.details })
    }
    throw error
  }
}

export function describeGraph(
  project: string,
  graph: LoadedGraph,
  entries: readonly AgentEntry[],
  charactersMax: number,
): string[] {
  const names = nameReader(entries)
  const header = `${project} node view: ${graph.items.length} drawn, ${graph.hidden.length} hidden, ${graph.links.length} links. Positions are x,y w×h in canvas pixels.`
  const body: string[] = []
  const discoveredNames = new Map<string, string | undefined>(
    entries.map((entry) => [entry.address, entry.name]),
  )
  const linksBySource = groupLinks(graph)
  for (const [index, item] of graph.items.entries()) {
    body.push(describeItem(item, names, discoveredNames.get(item.id)))
    const targets = linksBySource.get(index)
    if (targets !== undefined) {
      body.push(`  → ${describeTargets(graph, targets, names)}`)
    }
  }
  const hidden = graph.hidden.map((entry) => names(entry.id, entry.name))
  body.push(`Hidden: ${hidden.join(', ') || 'nothing'}`)
  const cut = cutText(body.join('\n'), charactersMax)
  const lines = [header, cut.text]
  if (cut.isCut) {
    lines.push('(cut at the size limit, the rest is not listed)')
  }
  return lines
}

// What the agent can pass back as a ref: the discovery's name while it is
// the only one, chain:Name while it is the only one on its chain, else the
// address. The tab's name is for what it made, like groups.
function nameReader(entries: readonly AgentEntry[]): NameOf {
  const byAddress = new Map(entries.map((entry) => [entry.address, entry]))
  const countByName = new Map<string, number>()
  for (const entry of entries) {
    for (const key of nameKeys(entry)) {
      countByName.set(key, (countByName.get(key) ?? 0) + 1)
    }
  }
  return (id, fallback) => {
    const address = ChainSpecificAddress.tryParse(id)
    const entry = address === undefined ? undefined : byAddress.get(address)
    if (entry === undefined) {
      return fallback
    }
    const unique = nameKeys(entry).find((key) => countByName.get(key) === 1)
    return unique ?? entry.address
  }
}

function nameKeys(entry: AgentEntry): string[] {
  if (entry.name === undefined) {
    return []
  }
  const qualified = `${ChainSpecificAddress.chain(entry.address)}:${entry.name}`
  // resolveRef reads a colon as the end of a chain, so a name with one
  // resolves only behind its chain.
  return entry.name.includes(':') ? [qualified] : [entry.name, qualified]
}

function describeItem(
  item: LoadedGraph['items'][number],
  names: NameOf,
  discovered: string | undefined,
): string {
  const box = `at ${Math.round(item.x)},${Math.round(item.y)} ${Math.round(item.width)}×${Math.round(item.height)}`
  if (item.members === undefined) {
    const ref = names(item.id, item.name)
    // A name that repeats is no ref, but still says what the address is.
    const name = ref === item.id && discovered ? ` "${discovered}"` : ''
    return `${ref}${name} ${box}`
  }
  const members = item.members.map((member) => names(member, member))
  return `group "${item.name}" ${box}: ${members.join(', ')}`
}

// Field names per target item, in the order the tab drew them.
function groupLinks(graph: LoadedGraph): Map<number, Map<number, string[]>> {
  const bySource = new Map<number, Map<number, string[]>>()
  for (const [source, target, fieldName] of graph.links) {
    const byTarget = bySource.get(source) ?? new Map<number, string[]>()
    bySource.set(source, byTarget)
    const fieldNames = byTarget.get(target) ?? []
    byTarget.set(target, fieldNames)
    if (!fieldNames.includes(fieldName)) {
      fieldNames.push(fieldName)
    }
  }
  return bySource
}

function describeTargets(
  graph: LoadedGraph,
  targets: ReadonlyMap<number, readonly string[]>,
  names: NameOf,
): string {
  const described: string[] = []
  for (const [target, fieldNames] of targets) {
    const item = graph.items[target]
    assert(item !== undefined, 'Link to a missing item')
    const shown = fieldNames.slice(0, FIELD_NAMES_MAX)
    const more = fieldNames.length - shown.length
    const tail = more > 0 ? `, +${more}` : ''
    described.push(`${names(item.id, item.name)} (${shown.join(', ')}${tail})`)
  }
  return described.join(', ')
}

export function describeLayout(
  input: { project: string; laneCount: number; hideOthers: boolean },
  layout: ArrangedLayout,
  entries: readonly AgentEntry[],
  charactersMax: number,
): string[] {
  const names = nameReader(entries)
  // The lists come last, so a cut takes only names.
  const lines = [
    `Arranged ${input.project}'s node view. Lanes: ${input.laneCount}, items placed: ${layout.placed.length}. The researcher can undo this layout with one undo.`,
  ]
  const below = layout.below.map((item) => names(item.id, item.name))
  if (below.length > 0) {
    lines.push(
      input.hideOthers
        ? `Could not be hidden, so arranged below the lanes: ${below.join(', ')}. DiscoUI hides a contract by hiding the links to it, so initial contracts and contracts nothing links to stay drawn.`
        : describeKeptBelow(below),
    )
  }
  const notDrawn = layout.notDrawn.map((address) => names(address, address))
  if (notDrawn.length > 0) {
    lines.push(
      input.hideOthers
        ? `Not drawn, so not placed: ${notDrawn.join(', ')}. Only contracts the lanes do not name link to them, so hiding those hid these too; name one that links to them. Or they are not in the node view at all.`
        : `Not drawn, so not placed: ${notDrawn.join(', ')}. They are hidden in the node view, or not in it at all; others: "hide" shows hidden contracts the lanes name.`,
    )
  }
  const cut = cutText(lines.join('\n'), charactersMax)
  return cut.isCut
    ? [cut.text, '(cut at the size limit, the rest is not listed)']
    : [cut.text]
}

function describeKeptBelow(below: readonly string[]): string {
  if (below.length > KEPT_BELOW_NAMES_MAX) {
    return `The ${below.length} drawn items the lanes do not name are arranged automatically below them.`
  }
  return `Arranged automatically below the lanes: ${below.join(', ')}.`
}
