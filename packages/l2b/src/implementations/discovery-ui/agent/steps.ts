import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { anchorSnippet, type CodeSource } from './codeAnchor'
import { type Excerpt, excerptAt } from './excerpt'
import { type AgentEntry, resolveRef } from './resolveRef'
import { ToolError } from './toolError'
import type { ShowInput } from './tools'

type StepInput = ShowInput['steps'][number]
type CodeInput = NonNullable<StepInput['code']>

export interface ResolvedStep {
  note: string
  // The code contract first: the code panel shows the first selected one.
  contracts: AgentEntry[]
  code: ResolvedCode | undefined
}

export interface ResolvedCode {
  entry: AgentEntry
  sourceIndex: number
  sourceName: string
  offset: number
  length: number
  line: number
  excerpt: Excerpt
  // Other places with the snippet.
  others: { sourceName: string; line: number }[]
}

// Resolves every step of one call, reading each contract's code once.
export class StepResolver {
  private readonly sources = new Map<ChainSpecificAddress, CodeSource[]>()

  constructor(
    private readonly entries: readonly AgentEntry[],
    private readonly readSources: (
      address: ChainSpecificAddress,
    ) => CodeSource[],
  ) {}

  resolve(step: StepInput): ResolvedStep {
    const code = step.code && this.resolveCode(step.code)
    const addresses = new Set([
      ...(code ? [code.entry.address] : []),
      ...(step.contracts ?? []).map((ref) => resolveRef(this.entries, ref)),
    ])
    const contracts = [...addresses].map((address) => this.entryAt(address))
    return { note: step.note, contracts, code }
  }

  private resolveCode(code: CodeInput): ResolvedCode {
    const entry = this.entryAt(resolveRef(this.entries, code.contract))
    const sources = this.readCached(entry.address, code.contract)
    const anchor = anchorSnippet(sources, code.find)
    if (anchor === undefined) {
      throw new ToolError('Snippet not found in the contract source', {
        contract: code.contract,
        find: code.find,
      })
    }
    const { match } = anchor
    return {
      entry,
      sourceIndex: match.sourceIndex,
      sourceName: sourceAt(sources, match.sourceIndex).name,
      offset: match.offset,
      length: code.find.length,
      line: match.line,
      excerpt: excerptAt(
        sourceAt(sources, match.sourceIndex).code,
        match,
        code.find.length,
      ),
      others: anchor.others.map((m) => ({
        sourceName: sourceAt(sources, m.sourceIndex).name,
        line: m.line,
      })),
    }
  }

  private readCached(address: ChainSpecificAddress, ref: string) {
    const cached = this.sources.get(address)
    if (cached !== undefined) {
      return cached
    }
    let sources: CodeSource[]
    try {
      sources = this.readSources(address)
    } catch (error) {
      // Missing or outdated .flat files: the agent tells the researcher.
      throw new ToolError('Cannot read the contract source', {
        contract: ref,
        reason: error instanceof Error ? error.message : String(error),
      })
    }
    this.sources.set(address, sources)
    return sources
  }

  private entryAt(address: ChainSpecificAddress): AgentEntry {
    const entry = this.entries.find((e) => e.address === address)
    if (entry === undefined) {
      throw new Error('Resolved address outside the entries', {
        cause: { address },
      })
    }
    return entry
  }
}

function sourceAt(sources: CodeSource[], index: number): CodeSource {
  const source = sources[index]
  if (source === undefined) {
    throw new Error('Match outside the sources', { cause: { index } })
  }
  return source
}
