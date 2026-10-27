// Mirrors ChatEvent of l2b's discovery-ui/agent/chat/events.ts, which the
// server builds from the agent's protocol messages.
export type ChatStatus = 'idle' | 'starting' | 'ready' | 'working' | 'failed'
export type ToolStatus = 'pending' | 'in_progress' | 'completed' | 'failed'

export interface ConfigOption {
  id: string
  name: string
  category: string | undefined
  value: string
  choices: { value: string; name: string; description: string | undefined }[]
}

export interface PermissionChoice {
  id: string
  name: string
  kind: string
}

export type ChatEvent =
  | { type: 'status'; status: ChatStatus; provider?: string; error?: string }
  | { type: 'user'; text: string }
  | { type: 'text'; role: 'agent' | 'thought'; text: string }
  | {
      type: 'tool'
      id: string
      title?: string
      kind?: string
      status?: ToolStatus
      output?: string
      outputAppend?: string
      dryRun?: boolean
    }
  | { type: 'plan'; entries: { content: string; status: string }[] }
  | {
      type: 'permission'
      id: string
      title: string
      choices: PermissionChoice[]
    }
  | { type: 'permission-done'; id: string; choice: string | undefined }
  | { type: 'turn-end'; stopReason: string }
  | { type: 'error'; message: string }
  | { type: 'config'; options: ConfigOption[] }
  | { type: 'title'; title: string }
  | { type: 'usage'; used: number; size: number }

export type StreamEvent = ChatEvent | { type: 'replay'; events: ChatEvent[] }

export type ChatItem =
  | { kind: 'user'; text: string }
  | { kind: 'agent'; text: string }
  | { kind: 'thought'; text: string }
  | {
      kind: 'tool'
      id: string
      title: string
      toolKind: string | undefined
      status: ToolStatus
      output: string
      dryRun: boolean
    }
  | { kind: 'plan'; entries: { content: string; status: string }[] }
  | {
      kind: 'permission'
      id: string
      title: string
      choices: PermissionChoice[]
      // undefined while it waits, null when the turn was cancelled.
      choice: string | null | undefined
    }
  | { kind: 'notice'; text: string; tone: 'info' | 'error' }

export interface ChatState {
  items: ChatItem[]
  status: ChatStatus
  provider: string | undefined
  error: string | undefined
  // From sending a message until its turn ends, including while the agent
  // still starts.
  inTurn: boolean
  config: ConfigOption[]
  title: string | undefined
  usage: { used: number; size: number } | undefined
}

export const EMPTY_CHAT: ChatState = {
  items: [],
  status: 'idle',
  provider: undefined,
  error: undefined,
  inTurn: false,
  config: [],
  title: undefined,
  usage: undefined,
}

// Terminal output streams in; a long one keeps its end, where results are.
const TOOL_OUTPUT_LENGTH_MAX = 8_000

const STOP_NOTICES: Record<string, string> = {
  cancelled: 'Stopped.',
  refusal: 'The agent refused to continue.',
  max_tokens: 'The agent ran out of output tokens.',
  max_turn_requests: 'The agent hit its limit of steps for one message.',
}

export function reduceChat(state: ChatState, event: StreamEvent): ChatState {
  switch (event.type) {
    case 'replay':
      return event.events.reduce(reduceChat, EMPTY_CHAT)
    case 'status':
      return {
        ...state,
        status: event.status,
        provider: event.provider ?? state.provider,
        error: event.status === 'failed' ? event.error : undefined,
        inTurn: event.status === 'failed' ? false : state.inTurn,
      }
    case 'user':
      return {
        ...state,
        inTurn: true,
        items: [...state.items, { kind: 'user', text: event.text }],
      }
    case 'text':
      return {
        ...state,
        items: appendText(state.items, event.role, event.text),
      }
    case 'tool':
      return { ...state, items: upsertTool(state.items, event) }
    case 'plan':
      return { ...state, items: upsertPlan(state.items, event.entries) }
    case 'permission':
      return {
        ...state,
        items: [
          ...state.items,
          {
            kind: 'permission',
            id: event.id,
            title: event.title,
            choices: event.choices,
            choice: undefined,
          },
        ],
      }
    case 'permission-done':
      return { ...state, items: settlePermission(state.items, event) }
    case 'turn-end':
      return endTurn(state, event.stopReason)
    case 'error':
      return {
        ...state,
        inTurn: false,
        items: [
          ...state.items,
          { kind: 'notice', text: event.message, tone: 'error' },
        ],
      }
    case 'config':
      return { ...state, config: event.options }
    case 'title':
      return { ...state, title: event.title }
    case 'usage':
      return { ...state, usage: { used: event.used, size: event.size } }
  }
}

function appendText(
  items: ChatItem[],
  role: 'agent' | 'thought',
  text: string,
): ChatItem[] {
  const last = items[items.length - 1]
  if (last?.kind === role) {
    return [...items.slice(0, -1), { kind: role, text: last.text + text }]
  }
  return [...items, { kind: role, text }]
}

function upsertTool(
  items: ChatItem[],
  event: Extract<ChatEvent, { type: 'tool' }>,
): ChatItem[] {
  const index = items.findLastIndex(
    (item) => item.kind === 'tool' && item.id === event.id,
  )
  const previous = items[index]
  const tool =
    previous?.kind === 'tool'
      ? previous
      : {
          kind: 'tool' as const,
          id: event.id,
          title: 'Tool',
          toolKind: undefined,
          status: 'pending' as const,
          output: '',
          dryRun: false,
        }
  let output = event.output ?? tool.output
  if (event.outputAppend !== undefined) {
    output = (output + event.outputAppend).slice(-TOOL_OUTPUT_LENGTH_MAX)
  }
  const updated: ChatItem = {
    ...tool,
    title: event.title ?? tool.title,
    toolKind: event.kind ?? tool.toolKind,
    status: event.status ?? tool.status,
    output,
    dryRun: event.dryRun ?? tool.dryRun,
  }
  if (index === -1) {
    return [...items, updated]
  }
  return items.map((item, i) => (i === index ? updated : item))
}

// A plan is revised as the agent works through it; the turn shows its
// latest version where it first appeared.
function upsertPlan(
  items: ChatItem[],
  entries: { content: string; status: string }[],
): ChatItem[] {
  const turnStart = items.findLastIndex((item) => item.kind === 'user')
  const index = items.findLastIndex((item) => item.kind === 'plan')
  if (index > turnStart) {
    return items.map((item, i) =>
      i === index ? { kind: 'plan', entries } : item,
    )
  }
  return [...items, { kind: 'plan', entries }]
}

function settlePermission(
  items: ChatItem[],
  event: Extract<ChatEvent, { type: 'permission-done' }>,
): ChatItem[] {
  return items.map((item) =>
    item.kind === 'permission' && item.id === event.id
      ? { ...item, choice: event.choice ?? null }
      : item,
  )
}

function endTurn(state: ChatState, stopReason: string): ChatState {
  const notice = STOP_NOTICES[stopReason]
  if (notice === undefined) {
    return { ...state, inTurn: false }
  }
  return {
    ...state,
    inTurn: false,
    items: [...state.items, { kind: 'notice', text: notice, tone: 'info' }],
  }
}

export type ActivityStep = Extract<ChatItem, { kind: 'tool' | 'thought' }>

// The transcript as drawn: the tool calls and thoughts between two pieces of
// text form one activity block. Keys are the index of the block's first
// item, so blocks keep them while the transcript grows.
export type ChatBlock =
  | {
      kind: 'item'
      key: number
      item: Exclude<ChatItem, ActivityStep>
      opensResponse: boolean
    }
  | {
      kind: 'activity'
      key: number
      steps: ActivityStep[]
      opensResponse: boolean
    }

export function toBlocks(items: readonly ChatItem[]): ChatBlock[] {
  const blocks: ChatBlock[] = []
  let previous: ChatItem | undefined
  for (const [index, item] of items.entries()) {
    const opensResponse = isResponseStart(item, previous)
    const last = blocks[blocks.length - 1]
    if (item.kind === 'tool' || item.kind === 'thought') {
      if (last?.kind === 'activity' && isStep(previous)) {
        last.steps.push(item)
      } else {
        blocks.push({
          kind: 'activity',
          key: index,
          steps: [item],
          opensResponse,
        })
      }
    } else {
      blocks.push({ kind: 'item', key: index, item, opensResponse })
    }
    previous = item
  }
  return blocks
}

function isResponseStart(item: ChatItem, previous: ChatItem | undefined) {
  if (item.kind === 'user') {
    return false
  }
  return previous === undefined || previous.kind === 'user'
}

function isStep(item: ChatItem | undefined): boolean {
  return item?.kind === 'tool' || item?.kind === 'thought'
}
