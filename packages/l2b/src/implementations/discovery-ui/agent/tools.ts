import type { ConfigReader } from '@l2beat/discovery'
import { type Validator, v as z } from '@l2beat/validate'
import { randomUUID } from 'crypto'
import { isMadeOf } from './characters'
import { cutText } from './excerpt'
import { AgentRefError } from './resolveRef'
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
  input: Validator<unknown>
  // Shown to the agent next to the schema, per top-level argument.
  argumentHelp: Record<string, string>
  readOnly: boolean
  run: (input: unknown, ui: DiscoUi) => string[]
}

const projectSchema = z
  .string()
  .check((v) => isMadeOf(v, '_-'), 'Project must be alphanumeric')
const refSchema = z.string().check((v) => v.length > 0, 'Empty contract ref')

const stepSchema = z.object({
  note: z
    .string()
    .check(
      (v) => v.length <= NOTE_CHARACTERS_MAX,
      'Note over 2000 characters, put the details in your reply',
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
  project: projectSchema.optional(),
  dryRun: z.boolean().optional(),
  steps: z
    .array(stepSchema)
    .check(
      (v) => v.length > 0 && v.length <= STEPS_MAX,
      'Between 1 and 30 steps',
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
    argumentHelp: {
      project: 'defaults to the project open in DiscoUI',
      dryRun: 'print the code the steps open without showing anything',
    },
    readOnly: false,
    run: (input, ui) => show(ui, input),
  }),
  tool({
    name: 'clear',
    description: 'Hides the note show put in DiscoUI.',
    input: z.object({}),
    argumentHelp: {},
    readOnly: false,
    run: (_, ui) => clear(ui),
  }),
]

function tool<T>(definition: {
  name: string
  description: string
  input: Validator<T>
  argumentHelp: Record<string, string>
  readOnly: boolean
  run: (input: T, ui: DiscoUi) => string[]
}): AgentTool {
  return definition as AgentTool
}

// Rejections name what to fix, so the agent can correct itself and retry.
export function runTool(
  tool: AgentTool,
  args: unknown,
  ui: DiscoUi,
): { text: string; isError: boolean } {
  const input = tool.input.safeParse(args ?? {})
  if (!input.success) {
    const message = `At ${input.path || '@'}: ${input.message}`
    return { text: `Invalid arguments: ${message}`, isError: true }
  }
  try {
    return { text: tool.run(input.data, ui).join('\n'), isError: false }
  } catch (error) {
    if (error instanceof ToolError) {
      return { text: error.describe(), isError: true }
    }
    if (error instanceof AgentRefError) {
      return { text: describeRefError(error), isError: true }
    }
    throw error
  }
}

function describeRefError(error: AgentRefError): string {
  const lines = [`${error.message}: ${error.ref}`]
  if (error.candidates.length > 0) {
    lines.push('Candidates:', ...error.candidates.map((c) => `  ${c}`))
  }
  return lines.join('\n')
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
  if (!ui.configReader.hasDiscovery(project)) {
    throw new ToolError('No discovered project', { project })
  }
  const resolver = new StepResolver(ui.configReader, project)
  const steps = input.steps.map((step) => resolver.resolve(step))
  const lines = [
    isDryRun
      ? `Dry run, nothing shown. ${project}, ${steps.length} steps:`
      : `Shown in DiscoUI. ${project}, ${steps.length} steps:`,
  ]
  printSteps(lines, steps)
  if (active !== undefined && !isDryRun) {
    ui.tabs.send(active.id, showEvent(project, steps))
  }
  return lines
}

function showEvent(project: string, steps: ResolvedStep[]) {
  return {
    type: 'show',
    id: randomUUID(),
    project,
    steps: steps.map((step) => ({
      note: step.note,
      select: step.select,
      code: step.code && {
        address: step.code.address,
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
    lines.push(`  contracts: ${step.names.join(', ') || 'none'}`)
    const code = step.code
    if (code === undefined) {
      continue
    }
    lines.push(`  code: ${code.sourceName}:${code.line} in ${code.contract}`)
    const excerpt = cutText(code.excerpt.text, charactersLeft)
    charactersLeft -= excerpt.text.length
    if (excerpt.text.length > 0) {
      lines.push('```', excerpt.text, '```')
    }
    if (code.excerpt.isCut || excerpt.isCut) {
      lines.push('  (excerpt cut, read the rest in the source)')
    }
    const others = code.others.slice(0, OTHER_MATCHES_MAX)
    if (others.length > 0) {
      const more = code.others.length - others.length
      const tail = more > 0 ? ` and ${more} more` : ''
      lines.push(`  also found at: ${others.join(', ')}${tail}`)
    }
  }
}

function clear(ui: DiscoUi): string[] {
  const active = ui.tabs.active()
  if (active === undefined) {
    return ['DiscoUI has no open tab, nothing to clear']
  }
  ui.tabs.send(active.id, { type: 'clear' })
  return ['Cleared']
}
