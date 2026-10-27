import type { ConfigReader } from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import { getCodeFromDisk } from '../getCode'
import { projectSchema } from './entries'
import { type CodeAnchor, findCodeAnchor } from './findCodeAnchor'
import { type AgentEntry, resolveRef } from './resolveRef'

const STEPS_MAX = 30

const refSchema = z.string().check((v) => v.length > 0, 'Empty contract ref')

const agentStepSchema = z.object({
  note: z.string(),
  paths: z.array(z.array(refSchema)).optional(),
  nodes: z.array(refSchema).optional(),
  select: refSchema.optional(),
  code: z
    .object({
      ref: refSchema,
      find: z.string().check((v) => v.length > 0, 'Empty code snippet'),
    })
    .optional(),
})
export type AgentStepRequest = z.infer<typeof agentStepSchema>

export const agentShowSchema = z.object({
  project: projectSchema.optional(),
  steps: z
    .array(agentStepSchema)
    .check(
      (v) => v.length > 0 && v.length <= STEPS_MAX,
      'Between 1 and 30 steps',
    ),
})
export type AgentShowRequest = z.infer<typeof agentShowSchema>

export interface AgentStep {
  note: string
  paths: ChainSpecificAddress[][]
  nodes: ChainSpecificAddress[]
  select: ChainSpecificAddress | undefined
  // The line DiscoUI shows, which the researcher reads: past the Flattener
  // note, so 12 more than in the .flat file.
  code: (CodeAnchor & { address: ChainSpecificAddress }) | undefined
}

export function namesOf(
  entries: readonly AgentEntry[],
  steps: readonly AgentStep[],
) {
  const shown = new Set<string>()
  for (const step of steps) {
    for (const address of [...step.paths.flat(), ...step.nodes]) {
      shown.add(address)
    }
    if (step.code) shown.add(step.code.address)
  }
  const names: Record<string, string> = {}
  for (const entry of entries) {
    if (shown.has(entry.address) && entry.name !== undefined) {
      names[entry.address] = entry.name
    }
  }
  return names
}

export class AgentCodeError extends Error {
  constructor(
    message: string,
    readonly details: { ref: string; find?: string },
  ) {
    super(message, { cause: details })
  }
}

export function resolveStep(
  configReader: ConfigReader,
  project: string,
  entries: readonly AgentEntry[],
  step: AgentStepRequest,
): AgentStep {
  const resolve = (ref: string) => resolveRef(entries, ref)
  const paths = (step.paths ?? []).map((path) => path.map(resolve))
  const nodes = (step.nodes ?? []).map(resolve)
  const code =
    step.code && resolveCode(configReader, project, entries, step.code)
  const select =
    step.select !== undefined
      ? resolve(step.select)
      : (code?.address ?? paths[0]?.[0] ?? nodes[0])
  // The code panel shows the selected contract, so the snippet must be in it.
  if (code !== undefined && select !== code.address) {
    throw new AgentCodeError('Select the contract whose code is shown', {
      ref: step.select ?? '',
    })
  }
  return { note: step.note, paths, nodes, select, code }
}

function resolveCode(
  configReader: ConfigReader,
  project: string,
  entries: readonly AgentEntry[],
  code: { ref: string; find: string },
) {
  const address = resolveRef(entries, code.ref)
  let sources: { name: string; code: string }[]
  try {
    sources = getCodeFromDisk(configReader, project, address).sources
  } catch {
    throw new AgentCodeError('Contract has no source code', { ref: code.ref })
  }
  const anchor = findCodeAnchor(sources, code.find)
  if (anchor === undefined) {
    throw new AgentCodeError('Snippet not found in the contract source', {
      ref: code.ref,
      find: code.find,
    })
  }
  return { address, ...anchor }
}
