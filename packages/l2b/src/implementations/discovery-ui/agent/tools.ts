import type { ConfigReader } from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { type Validator, v as z } from '@l2beat/validate'
import type { BoardStore } from './boardStore'
import { projectSchema, readProjectEntries } from './entries'
import { controlPaths, indexPermissionPaths } from './permissionPaths'
import {
  contextSummary,
  nameLookup,
  printPermissionPath,
  printState,
  printStep,
  printViewResult,
  tabsLabel,
  warnOutdated,
} from './printing'
import { AgentRefError, resolveRef } from './resolveRef'
import type { AgentContext, AgentReceipt } from './router'
import { SELECTOR_HELP, SelectorResolver } from './selectors'
import type { AgentSession } from './session'
import {
  AgentCodeError,
  type AgentStep,
  agentShowSchema,
  namesOf,
  resolveStep,
} from './steps'
import {
  type AgentViewRequest,
  agentViewSchema,
  COLORS,
  controlMapRequest,
  resolveView,
} from './views'

// Only a tab with a pending view answers a discard, so silence comes sooner.
const DISCARD_TIMEOUT_MS = 1_500

const NO_TAB =
  'No DiscoUI tab is open. Pass project to store the answer: it appears when the researcher opens that project in DiscoUI.'

export interface DiscoUi {
  configReader: ConfigReader
  session: AgentSession<AgentContext, AgentReceipt>
  boards: BoardStore
}

export interface AgentTool {
  name: string
  description: string
  input: Validator<unknown>
  // Shown to the agent next to the schema, per top-level argument.
  argumentHelp: Record<string, string>
  readOnly: boolean
  run: (input: unknown, ui: DiscoUi) => Promise<string[]> | string[]
  // Names the mistake in arguments the schema refused, when the schema's own
  // message would list every variant of a union.
  explainInvalid?: (args: unknown) => string | undefined
}

// The agent reads the message, fixes what it names and calls again.
export class ToolError extends Error {
  constructor(
    message: string,
    readonly detail?: string,
  ) {
    super(message, { cause: { detail } })
  }
}

const projectArgument = {
  project: 'defaults to the project open in DiscoUI',
}

export const AGENT_TOOLS: AgentTool[] = [
  tool({
    name: 'context',
    description:
      'What the researcher looks at in DiscoUI: project, selected contracts, open panels, the code they selected, the agent step on screen and a summary of the graph. Read it first: "this" means the selection. `state` lists the graph contract by contract.',
    input: z.object({}),
    argumentHelp: {},
    readOnly: true,
    run: (_, ui) => [JSON.stringify(contextSummary(readContext(ui)), null, 2)],
  }),
  tool({
    name: 'state',
    description:
      'The graph in the open tab: which contracts are visible, in which groups, and which are hidden, plus any pending agent view.',
    input: z.object({}),
    argumentHelp: {},
    readOnly: true,
    run: (_, ui) => {
      const context = readContext(ui)
      const lines: string[] = []
      warnOutdated(lines, context.outdatedTabs)
      printState(lines, context)
      return lines
    },
  }),
  tool({
    name: 'find',
    description: `Lists the contracts selectors match, to check them before a view; when nothing matches, the values that exist. Selectors:\n  ${SELECTOR_HELP.join('\n  ')}`,
    input: z.object({
      project: projectSchema.optional(),
      selectors: z.array(z.string()),
    }),
    argumentHelp: projectArgument,
    readOnly: true,
    run: (input, ui) => find(ui, input.project, input.selectors),
  }),
  tool({
    name: 'permissions',
    description:
      'Start here for "who controls this". Lists who can act on a contract: through which contracts, with what delay, the multisigs behind each holder and a ready path for show. When nothing is modelled on the contract itself, follows its $admin and owner to the nearest contract that has permissions.',
    input: z.object({
      project: projectSchema.optional(),
      contract: z.string(),
    }),
    argumentHelp: projectArgument,
    readOnly: true,
    run: (input, ui) => permissions(ui, input.project, input.contract),
  }),
  tool({
    name: 'show',
    description:
      'Points at your answer in every open DiscoUI tab. Each step draws paths, selects a contract and opens its code at a snippet; several steps make a tour the researcher pages through, three to six read best for "how does this work". Contracts are names (Bridge), chain:Name (arb1:L2Timelock) when a name repeats across chains, or chain:0x addresses. A step: {"note": "1-3 sentences", "paths"?: [["Council", "ProxyAdmin", "Bridge"]] each holder first, "nodes"?: ["Escrow"] shown on their own, "select"?: "Bridge" defaults to the code contract or the first shown, "code"?: {"ref": "ProxyAdmin", "find": "function upgrade("} where a function header opens its implementation}. The result prints the code each step opens. dryRun prints it without showing anything: read the code first, then show notes that say what it does.',
    input: agentShowSchema,
    argumentHelp: {
      ...projectArgument,
      dryRun: 'print the code the steps open without showing them',
    },
    readOnly: false,
    run: (input, ui) => show(ui, input),
  }),
  tool({
    name: 'view',
    description: `Changes the graph in the open tab: hides and shows contracts, groups and colors them and arranges groups in lanes. The researcher sees it as a pending view to Keep, Save as a layout or Discard; views sent before they decide stack. The result says what actually happened: what else got hidden, what stayed to keep things connected. Use dryRun instead of trying a view out on the researcher. hide also hides what is only reachable through those contracts; only hides everything else, keeping what connects them; arrange is keep or lanes, one column per group; select is the contract the panels show once the view is applied. Every contract list takes selectors:\n  ${SELECTOR_HELP.join('\n  ')}\nColors: ${COLORS.join(', ')}.`,
    input: agentViewSchema,
    argumentHelp: {
      ...projectArgument,
      title: 'what the view shows, in a few words',
    },
    readOnly: false,
    run: async (input, ui) => {
      const project = projectOrOpen(ui, input.project)
      return await sendView(ui, project, input)
    },
  }),
  tool({
    name: 'control_map',
    description:
      'Start here for "show me the power structure". Shows who can upgrade what as a view: one lane per fastest way to upgrade, with its holders, the multisigs that sign for them, its delay and every contract it reaches. Red: no delay, orange: under a week, green: a week or more, teal: not upgradeable.',
    input: z.object({
      project: projectSchema.optional(),
      hide: z.array(z.string()).optional(),
      dryRun: z.boolean().optional(),
    }),
    argumentHelp: {
      ...projectArgument,
      hide: 'selectors to leave out of the map',
      dryRun: 'report what the map would do without changing the graph',
    },
    readOnly: false,
    run: (input, ui) => controlMap(ui, input),
  }),
  tool({
    name: 'discard',
    description:
      'Reverts the pending agent views in the open tab to the graph from before them.',
    input: z.object({}),
    argumentHelp: {},
    readOnly: false,
    run: async (_, ui) => discard(ui),
  }),
  tool({
    name: 'clear',
    description: 'Removes what show put in DiscoUI.',
    input: z.object({}),
    argumentHelp: {},
    readOnly: false,
    run: (_, ui) => [`Cleared in ${tabsLabel(ui.session.clear())}`],
  }),
]

export function tool<T>(definition: {
  name: string
  description: string
  input: Validator<T>
  argumentHelp: Record<string, string>
  readOnly: boolean
  run: (input: T, ui: DiscoUi) => Promise<string[]> | string[]
  explainInvalid?: (args: unknown) => string | undefined
}): AgentTool {
  return definition as AgentTool
}

// Rejections name what to fix, so the agent can correct itself and retry.
export async function runTool(
  tool: AgentTool,
  args: unknown,
  ui: DiscoUi,
): Promise<{ text: string; isError: boolean }> {
  const input = tool.input.safeParse(args ?? {})
  if (!input.success) {
    const message =
      tool.explainInvalid?.(args) ?? `At ${input.path || '@'}: ${input.message}`
    return { text: `Invalid arguments: ${message}`, isError: true }
  }
  try {
    const lines = await tool.run(input.data, ui)
    return { text: lines.join('\n'), isError: false }
  } catch (error) {
    const rejection = describeRejection(error)
    if (rejection === undefined) {
      throw error
    }
    return { text: rejection, isError: true }
  }
}

function describeRejection(error: unknown): string | undefined {
  if (error instanceof ToolError) {
    return error.detail === undefined
      ? error.message
      : `${error.message}: ${error.detail}`
  }
  if (error instanceof AgentRefError) {
    const lines = [`${error.message}: ${error.ref}`]
    if (error.candidates.length > 0) {
      lines.push('  candidates:', ...error.candidates.map((c) => `    ${c}`))
    }
    return lines.join('\n')
  }
  if (error instanceof AgentCodeError) {
    const lines = [`${error.message}: ${error.details.ref}`]
    if (error.details.find !== undefined) {
      lines.push(`  find: ${error.details.find}`)
    }
    return lines.join('\n')
  }
  return undefined
}

function readContext(ui: DiscoUi) {
  if (ui.session.tabCount === 0) {
    throw new ToolError(NO_TAB)
  }
  const context = ui.session.context
  if (context === undefined) {
    throw new ToolError(
      'The DiscoUI tab has not reported what it shows yet, try again',
    )
  }
  return {
    tabs: ui.session.tabCount,
    outdatedTabs: ui.session.outdatedTabCount,
    ...context,
  }
}

export function projectOrOpen(
  ui: DiscoUi,
  project: string | undefined,
): string {
  if (project !== undefined) {
    if (!ui.configReader.hasDiscovery(project)) {
      throw new ToolError('No discovered project', project)
    }
    return project
  }
  const open = readContext(ui).project
  if (open === undefined) {
    throw new ToolError('No project open in DiscoUI, pass project')
  }
  return open
}

function find(
  ui: DiscoUi,
  project: string | undefined,
  selectors: string[],
): string[] {
  const entries = readProjectEntries(
    ui.configReader,
    projectOrOpen(ui, project),
  )
  const resolver = new SelectorResolver(entries)
  const byAddress = new Map(entries.map((e) => [e.address, e]))
  const lines: string[] = []
  for (const selector of selectors) {
    const found = resolver.resolve(selector)
    lines.push(`${selector}: ${found.length}`)
    const known = found.length === 0 ? resolver.knownValues(selector) : []
    if (known.length > 0) lines.push(`  values here: ${known.join(', ')}`)
    for (const address of found) {
      const entry = byAddress.get(address)
      const template = entry?.template ? `  ${entry.template}` : ''
      lines.push(`  ${entry?.name ?? '(unnamed)'}  ${address}${template}`)
    }
  }
  return lines
}

function permissions(
  ui: DiscoUi,
  project: string | undefined,
  contract: string,
): string[] {
  const entries = readProjectEntries(
    ui.configReader,
    projectOrOpen(ui, project),
  )
  const targetAddress = resolveRef(entries, contract)
  const byAddress = new Map(entries.map((e) => [e.address, e]))
  const name = nameLookup(entries)
  const control = controlPaths(
    targetAddress,
    byAddress,
    indexPermissionPaths(entries),
  )
  const lines: string[] = []
  if (control.inherited !== undefined) {
    const { chain, controller } = control.inherited
    lines.push(
      `Nothing is modelled on ${name(targetAddress)} itself. It is controlled through ${chain.map(name).join(' → ')}, so these are the permissions on ${name(controller)}.`,
    )
  }
  const count = control.paths.length
  lines.push(
    `${count} ${count === 1 ? 'way' : 'ways'} to act on ${name(targetAddress)} (${targetAddress})`,
  )
  for (const path of control.paths) {
    printPermissionPath(lines, path, byAddress, name)
  }
  return lines
}

function show(ui: DiscoUi, input: z.infer<typeof agentShowSchema>): string[] {
  const project = projectOrOpen(ui, input.project)
  const entries = readProjectEntries(ui.configReader, project)
  const resolved = input.steps.map((step) =>
    resolveStep(ui.configReader, project, entries, step),
  )
  const steps = resolved.map(({ step }) => step)
  const names = namesOf(entries, steps)
  const lines = [
    input.dryRun === true
      ? `Not shown, the code these steps open in ${project}:`
      : showSteps(ui, project, steps, names),
  ]
  for (const [index, { step, excerpt }] of resolved.entries()) {
    printStep(lines, index, steps.length, step, excerpt, names)
  }
  return lines
}

function showSteps(
  ui: DiscoUi,
  project: string,
  steps: AgentStep[],
  names: ReturnType<typeof namesOf>,
): string {
  const tabs = ui.session.show({ type: 'show', project, steps, names })
  return tabs === 0
    ? `No DiscoUI tab is open. Stored: it appears when the researcher opens ${project} in DiscoUI.`
    : `Shown in ${tabsLabel(tabs)}: ${project}`
}

async function controlMap(
  ui: DiscoUi,
  input: { project?: string; hide?: string[]; dryRun?: boolean },
): Promise<string[]> {
  const project = projectOrOpen(ui, input.project)
  const entries = readProjectEntries(ui.configReader, project)
  const resolver = new SelectorResolver(entries)
  const excluded = new Set<ChainSpecificAddress>()
  const misses: string[] = []
  for (const selector of input.hide ?? []) {
    const matched = resolver.resolve(selector)
    if (matched.length === 0) misses.push(selector)
    for (const address of matched) excluded.add(address)
  }
  const spec = controlMapRequest(entries, project, excluded)
  const lines = await sendView(ui, project, { ...spec, dryRun: input.dryRun })
  for (const group of spec.groups ?? []) {
    lines.push(`  lane "${group.name}": ${group.contracts.length} contracts`)
  }
  if (misses.length > 0) {
    lines.push(`hide matched nothing, so it hid nothing: ${misses.join(', ')}`)
  }
  return lines
}

async function sendView(
  ui: DiscoUi,
  project: string,
  request: AgentViewRequest,
): Promise<string[]> {
  const entries = readProjectEntries(ui.configReader, project)
  const { view, matches } = resolveView(entries, request)
  const { tabs, receipt } = await ui.session.request({
    type: 'view',
    project,
    view,
    dryRun: request.dryRun === true,
  })
  const lines: string[] = []
  printViewResult(
    lines,
    { title: request.title, dryRun: request.dryRun },
    { tabs, matches, receipt, outdatedTabs: ui.session.outdatedTabCount },
    entries,
  )
  return lines
}

async function discard(ui: DiscoUi): Promise<string[]> {
  const { tabs, receipt } = await ui.session.request(
    { type: 'discard' },
    DISCARD_TIMEOUT_MS,
  )
  const undone = receipt?.undone
  const lines = [
    tabs === 0
      ? 'No DiscoUI tab can show views'
      : undone === undefined
        ? 'No tab had a pending view'
        : `Put back the graph from before ${undone === 1 ? 'the view' : `${undone} views`}`,
  ]
  warnOutdated(lines, ui.session.outdatedTabCount)
  return lines
}
