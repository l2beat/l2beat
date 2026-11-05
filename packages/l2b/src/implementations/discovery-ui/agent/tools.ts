import type { ConfigReader } from '@l2beat/discovery'
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { toJsonSchema, type Validator, v as z } from '@l2beat/validate'
import { randomUUID } from 'crypto'
import { getCodeFromDisk } from '../getCode'
import { readReachableEntries } from '../readReachableEntries'
import { safeStringSchema } from '../safeStringSchema'
import type { ApiAgentShowEvent } from '../types'
import { cutText } from './excerpt'
import { type AgentEntry, describeEntry } from './resolveRef'
import { type ResolvedStep, StepResolver } from './steps'
import type { AgentTabs } from './tabs'
import { ToolError } from './toolError'

export const STEPS_MAX = 30
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
  run: (args: unknown, ui: DiscoUi) => string[]
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
    run: (input, ui) => show(ui, input),
  }),
  tool({
    name: 'clear',
    description: 'Hides the note show put in DiscoUI.',
    input: z.object({}),
    run: (_, ui) => clear(ui),
  }),
]

function tool<T>(definition: {
  name: string
  description: string
  input: Validator<T>
  run: (input: T, ui: DiscoUi) => string[]
}): AgentTool {
  return {
    name: definition.name,
    description: definition.description,
    inputSchema: toInputSchema(definition.input),
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
export function runTool(
  tool: AgentTool,
  args: unknown,
  ui: DiscoUi,
): { text: string; isError: boolean } {
  try {
    return { text: tool.run(args, ui).join('\n'), isError: false }
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
  const project = input.project ?? active?.project
  if (project === undefined) {
    throw new ToolError('No project open in DiscoUI, pass project')
  }
  if (!hasDiscovery(ui.configReader, project)) {
    throw new ToolError('No discovered project', { project })
  }
  const resolver = new StepResolver(
    readAgentEntries(ui.configReader, project),
    (address) => getCodeFromDisk(ui.configReader, project, address).sources,
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

// ConfigReader throws for a project it cannot find, which here is a typo in
// the agent's call, not a failure.
function hasDiscovery(configReader: ConfigReader, project: string): boolean {
  try {
    return configReader.hasDiscovery(project)
  } catch {
    return false
  }
}

// A contract both the project and a shared module list is one entry, and
// the zero address is drawn nowhere.
function readAgentEntries(
  configReader: ConfigReader,
  project: string,
): AgentEntry[] {
  const byAddress = new Map<ChainSpecificAddress, AgentEntry>()
  for (const entry of readReachableEntries(configReader, project)) {
    if (ChainSpecificAddress.address(entry.address) === EthereumAddress.ZERO) {
      continue
    }
    if (!byAddress.has(entry.address)) {
      byAddress.set(entry.address, { address: entry.address, name: entry.name })
    }
  }
  return [...byAddress.values()]
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

function clear(ui: DiscoUi): string[] {
  if (!ui.tabs.clearShow()) {
    return ['DiscoUI has no open tab, nothing to clear']
  }
  return ['Cleared']
}
