import type { AgentContext } from '../router'

const CODE_SELECTION_LENGTH_MAX = 600

const PREAMBLE = [
  "You are the AI panel of DiscoUI, L2BEAT's discovery UI. The researcher chats with you next to their contract graph, code and values.",
  'The researcher sees only DiscoUI and your replies, so show them things in DiscoUI with the discoui tools: point at contracts, paths and code with show, and change the graph with view or control_map. Unless they ask for one, do not make files, reports or pages for them to open. Your shell is yours: read discovered.json and the .flat sources, use rg and jq, write throwaway scripts to check a claim.',
  'Keep replies to a few sentences, the panel is narrow and DiscoUI carries the details.',
].join('\n')

export function promptBlocks(
  text: string,
  context: AgentContext | undefined,
  isFirst: boolean,
): { type: 'text'; text: string }[] {
  // The message goes first: an agent titles the chat after its first words.
  const blocks = [
    { type: 'text' as const, text },
    { type: 'text' as const, text: describeScreen(context) },
  ]
  if (isFirst) {
    blocks.push({ type: 'text', text: PREAMBLE })
  }
  return blocks
}

// The researcher says "this" about what they selected, so every message
// carries it and the agent does not have to ask DiscoUI first.
export function describeScreen(context: AgentContext | undefined): string {
  if (context?.project === undefined) {
    return 'DiscoUI right now: no project open.'
  }
  const lines = [`DiscoUI right now: project ${context.project}.`]
  if (context.selected.length > 0) {
    const selected = context.selected.map((c) => `${c.name} (${c.address})`)
    lines.push(`Selected: ${selected.join(', ')}.`)
  }
  if (context.code !== undefined) {
    const text = context.code.text.slice(0, CODE_SELECTION_LENGTH_MAX)
    lines.push(`Selected code in ${context.code.address}:\n${text}`)
  }
  if (context.graph?.pendingView !== undefined) {
    const { title, changes } = context.graph.pendingView
    lines.push(
      `Your view "${title}" (${changes} changes) waits for a decision.`,
    )
  }
  return lines.join('\n')
}
