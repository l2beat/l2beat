import type { ConfigReader } from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { toJsonSchema, type Validator, v as z } from '@l2beat/validate'
import { randomUUID } from 'crypto'
import { getCodeFromDisk } from '../getCode'
import { readReachableEntries } from '../readReachableEntries'
import { safeStringSchema } from '../safeStringSchema'
import type { ApiAgentShowEvent } from '../types'
import type { CodeSource } from './codeAnchor'
import { describeContext } from './context'
import { cutText } from './excerpt'
import { describePermissions } from './permissions'
import {
  describeEntry,
  readAgentEntries,
  resolveRef,
  toAgentEntries,
} from './resolveRef'
import { type ResolvedStep, StepResolver } from './steps'
import type { AgentTabs } from './tabs'
import { ToolError } from './toolError'

export const STEPS_MAX = 30
// The tab answers from memory, so this only waits out a tab that went away.
const CONTEXT_TIMEOUT_MS = 2_000
const NOTE_CHARACTERS_MAX = 2_000
export const CALL_CHARACTERS_MAX = 40_000
const OTHER_MATCHES_MAX = 10

const NO_TAB =
  'DiscoUI has no open tab. Ask the researcher to open DiscoUI, or pass dryRun to only read the code.'

export interface DiscoUi {
  configReader: ConfigReader
  tabs: AgentTabs
}

export interface AgentTool {
  name: string
  description: string
  inputSchema: object
  // Clients may run a tool that only reads without asking the researcher.
  readOnly: boolean
  run: (args: unknown, ui: DiscoUi) => string[] | Promise<string[]>
}

// Names and chain:0x addresses are far shorter.
const REF_CHARACTERS_MAX = 200
const refSchema = z
  .string()
  .check(
    (v) => v.length > 0 && v.length <= REF_CHARACTERS_MAX,
    `Contract ref must be 1 to ${REF_CHARACTERS_MAX} characters`,
  )

const stepSchema = z.object({
  note: z
    .string()
    .check(
      (v) => v.length <= NOTE_CHARACTERS_MAX,
      `Note over ${NOTE_CHARACTERS_MAX} characters, put the details in your reply`,
    ),
  contracts: z.array(refSchema).optional(),
  code: z
    .object({
      contract: refSchema,
      find: z.string().check((v) => v.length > 0, 'Empty snippet'),
    })
    .optional(),
})

const showSchema = z.object({
  project: safeStringSchema
    .optional()
    .meta({ description: 'defaults to the project open in DiscoUI' }),
  dryRun: z.boolean().optional().meta({
    description: 'print the code the steps open without showing anything',
  }),
  steps: z
    .array(stepSchema)
    .check(
      (v) => v.length > 0 && v.length <= STEPS_MAX,
      `Between 1 and ${STEPS_MAX} steps`,
    ),
})
export type ShowInput = z.infer<typeof showSchema>

export const AGENT_TOOLS: AgentTool[] = [
  tool({
    name: 'show',
    description: [
      "Walks the researcher through contracts and code in DiscoUI's open tab. Each step selects its contracts in the graph, opens the code at a snippet and shows the note; the researcher pages through the steps.",
      'A step: {"note": "1-3 sentences of markdown", "contracts"?: ["Bridge", "eth:0x..."], "code"?: {"contract": "ProxyAdmin", "find": "function upgrade("}}.',
      'find is a literal snippet copied from the source. It opens inside the function that implements it, past interface declarations; the result prints that function and lists other places with the snippet.',
      'Use dryRun first to read what each step opens, then show notes that say what the code does.',
    ].join(' '),
    input: showSchema,
    readOnly: false,
    run: (input, ui) => show(ui, input),
  }),
  tool({
    name: 'context',
    description:
      'Says what the researcher looks at in DiscoUI\'s open tab: the project, the selected contracts, the code around their selection in the code panel, and the step of your show on screen. Call it when they ask about "this".',
    input: z.object({}),
    readOnly: true,
    run: (_, ui) => context(ui),
  }),
  tool({
    name: 'permissions',
    description:
      'Lists who can act on a contract, from the permission model: each ultimate holder (EOA or multisig with its threshold), the contracts its control goes through with their delays, and who is granted it directly. Call it for "who can upgrade/control/pause X".',
    input: z.object({
      project: safeStringSchema
        .optional()
        .meta({ description: 'defaults to the project open in DiscoUI' }),
      contract: refSchema,
    }),
    readOnly: true,
    run: (input, ui) => permissions(ui, input.project, input.contract),
  }),
  tool({
    name: 'clear',
    description: 'Hides the note show put in DiscoUI.',
    input: z.object({}),
    readOnly: false,
    run: (_, ui) => clear(ui),
  }),
]

function tool<T>(definition: {
  name: string
  description: string
  input: Validator<T>
  readOnly: boolean
  run: (input: T, ui: DiscoUi) => string[] | Promise<string[]>
}): AgentTool {
  return {
    name: definition.name,
    description: definition.description,
    inputSchema: toInputSchema(definition.input),
    readOnly: definition.readOnly,
    run: (args, ui) =>
      definition.run(parseArguments(definition.input, args), ui),
  }
}

// MCP wants a bare object schema, without the JSON Schema dialect.
function toInputSchema(input: Validator<unknown>): object {
  const { $schema: _, ...schema } = toJsonSchema(input) as Record<
    string,
    unknown
  >
  return { ...schema, type: 'object' }
}

function parseArguments<T>(input: Validator<T>, args: unknown): T {
  const parsed = input.safeParse(args ?? {})
  if (!parsed.success) {
    throw new ToolError('Invalid arguments', {
      at: parsed.path || '@',
      problem: parsed.message,
    })
  }
  return parsed.data
}

// Rejections name what to fix, so the agent can correct itself and retry.
export async function runTool(
  tool: AgentTool,
  args: unknown,
  ui: DiscoUi,
): Promise<{ text: string; isError: boolean }> {
  try {
    return { text: (await tool.run(args, ui)).join('\n'), isError: false }
  } catch (error) {
    if (error instanceof ToolError) {
      return { text: error.describe(), isError: true }
    }
    throw error
  }
}

function show(ui: DiscoUi, input: ShowInput): string[] {
  const isDryRun = input.dryRun === true
  const active = ui.tabs.active()
  if (active === undefined && !isDryRun) {
    throw new ToolError(NO_TAB)
  }
  const project = requireProject(ui, input.project ?? active?.project)
  const resolver = new StepResolver(
    readAgentEntries(ui.configReader, project),
    (address) => readSources(ui.configReader, project, address),
  )
  const steps = input.steps.map((step) => resolver.resolve(step))
  const lines = [
    isDryRun
      ? `Dry run, nothing shown. ${project}, ${steps.length} steps:`
      : `Shown in DiscoUI. ${project}, ${steps.length} steps:`,
  ]
  printSteps(lines, steps)
  if (active !== undefined && !isDryRun) {
    ui.tabs.show(active.id, showEvent(project, steps))
  }
  return lines
}

// The code panel's editor splits lines on \r\n and \r too and joins them
// with \n, so offsets and hashes only match the text it shows.
function readSources(
  configReader: ConfigReader,
  project: string,
  address: ChainSpecificAddress,
): CodeSource[] {
  return getCodeFromDisk(configReader, project, address).sources.map(
    (source) => ({
      name: source.name,
      code: source.code.replaceAll('\r\n', '\n').replaceAll('\r', '\n'),
    }),
  )
}

function requireProject(ui: DiscoUi, project: string | undefined): string {
  if (project === undefined) {
    throw new ToolError('No project open in DiscoUI, pass project')
  }
  if (!hasDiscovery(ui.configReader, project)) {
    throw new ToolError('No discovered project', { project })
  }
  return project
}

function permissions(
  ui: DiscoUi,
  requested: string | undefined,
  contract: string,
): string[] {
  const project = requireProject(ui, requested ?? ui.tabs.active()?.project)
  const entries = readReachableEntries(ui.configReader, project)
  const target = resolveRef(toAgentEntries(entries), contract)
  return describePermissions(entries, target)
}

// ConfigReader throws for a project it cannot find, which here is a typo in
// the agent's call, not a failure.
function hasDiscovery(configReader: ConfigReader, project: string): boolean {
  try {
    return configReader.hasDiscovery(project)
  } catch {
    return false
  }
}

function showEvent(project: string, steps: ResolvedStep[]): ApiAgentShowEvent {
  return {
    type: 'show',
    id: randomUUID(),
    project,
    steps: steps.map((step) => ({
      note: step.note,
      select: step.contracts.map((entry) => entry.address),
      code: step.code && {
        address: step.code.entry.address,
        sourceIndex: step.code.sourceIndex,
        offset: step.code.offset,
        length: step.code.length,
      },
    })),
  }
}

function printSteps(lines: string[], steps: ResolvedStep[]) {
  let charactersLeft = CALL_CHARACTERS_MAX
  for (const [index, step] of steps.entries()) {
    lines.push('', `Step ${index + 1}/${steps.length}`)
    const contracts = step.contracts.map((entry) => describeEntry(entry))
    lines.push(`  contracts: ${contracts.join(', ') || 'none'}`)
    const code = step.code
    if (code === undefined) {
      continue
    }
    const contract = code.entry.name ?? code.entry.address
    lines.push(`  code: ${code.sourceName}:${code.line} in ${contract}`)
    const excerpt = cutText(code.excerpt.text, charactersLeft)
    charactersLeft -= excerpt.text.length
    if (excerpt.text.length > 0) {
      lines.push('```', excerpt.text, '```')
    }
    if (code.excerpt.isCut || excerpt.isCut) {
      lines.push('  (excerpt cut, read the rest in the source)')
    }
    const others = code.others
      .slice(0, OTHER_MATCHES_MAX)
      .map((other) => `${other.sourceName}:${other.line}`)
    if (others.length > 0) {
      const more = code.others.length - others.length
      const tail = more > 0 ? ` and ${more} more` : ''
      lines.push(`  also found at: ${others.join(', ')}${tail}`)
    }
  }
}

async function context(ui: DiscoUi): Promise<string[]> {
  const active = ui.tabs.active()
  if (active === undefined) {
    throw new ToolError(
      'DiscoUI has no open tab. Ask the researcher to open it.',
    )
  }
  const answer = await ui.tabs.askContext(active.id, CONTEXT_TIMEOUT_MS)
  if (answer === undefined) {
    throw new ToolError(
      'DiscoUI did not answer. Ask the researcher to reload it.',
    )
  }
  const project = answer.project
  if (project === undefined) {
    return ['DiscoUI shows no project.']
  }
  // Like a project whose discovery was removed after the tab opened it.
  if (!hasDiscovery(ui.configReader, project)) {
    return [`DiscoUI shows ${project}, which has no discovery.`]
  }
  return describeContext(
    { ...answer, project },
    readAgentEntries(ui.configReader, project),
    (address) => readSources(ui.configReader, project, address),
  )
}

function clear(ui: DiscoUi): string[] {
  if (!ui.tabs.clearShow()) {
    return ['DiscoUI has no open tab, nothing to clear']
  }
  return ['Cleared']
}
