import type { ConfigReader } from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import { getCodeFromDisk } from '../getCode'
import { anchorSnippet, type CodeSource } from './codeAnchor'
import { readAgentEntries } from './entries'
import { type Excerpt, excerptAt } from './excerpt'
import { type AgentEntry, describeEntry, resolveRef } from './resolveRef'
import { ToolError } from './toolError'

export interface StepInput {
  note: string
  contracts?: string[]
  code?: { contract: string; find: string }
}

export interface ResolvedStep {
  note: string
  // The code contract first: the code panel shows the first selected one.
  select: ChainSpecificAddress[]
  names: string[]
  code: ResolvedCode | undefined
}

export interface ResolvedCode {
  address: ChainSpecificAddress
  contract: string
  sourceIndex: number
  sourceName: string
  offset: number
  length: number
  line: number
  excerpt: Excerpt
  // Other places with the snippet, as "Source.sol:line".
  others: string[]
}

// Resolves every step of one call, reading each contract's code once.
export class StepResolver {
  private readonly entries: AgentEntry[]
  private readonly sources = new Map<ChainSpecificAddress, CodeSource[]>()

  constructor(
    private readonly configReader: ConfigReader,
    private readonly project: string,
  ) {
    this.entries = readAgentEntries(configReader, project)
  }

  resolve(step: StepInput): ResolvedStep {
    const code = step.code && this.resolveCode(step.code)
    const select = [
      ...new Set([
        ...(code ? [code.address] : []),
        ...(step.contracts ?? []).map((ref) => resolveRef(this.entries, ref)),
      ]),
    ]
    const names = select.map((address) => describeEntry(this.entryAt(address)))
    return { note: step.note, select, names, code }
  }

  private resolveCode(code: { contract: string; find: string }): ResolvedCode {
    const address = resolveRef(this.entries, code.contract)
    const sources = this.readSources(address, code.contract)
    const anchor = anchorSnippet(sources, code.find)
    if (anchor === undefined) {
      throw new ToolError('Snippet not found in the contract source', {
        contract: code.contract,
        find: code.find,
      })
    }
    const { match } = anchor
    const source = sources[match.sourceIndex]
    if (source === undefined) {
      throw new Error('Match outside the sources', { cause: match })
    }
    return {
      address,
      contract: this.entryAt(address).name ?? address,
      sourceIndex: match.sourceIndex,
      sourceName: source.name,
      offset: match.offset,
      length: code.find.length,
      line: match.line,
      excerpt: excerptAt(source.code, match, code.find.length),
      others: anchor.others.map(
        (m) => `${sources[m.sourceIndex]?.name}:${m.line}`,
      ),
    }
  }

  private readSources(address: ChainSpecificAddress, ref: string) {
    const cached = this.sources.get(address)
    if (cached !== undefined) {
      return cached
    }
    let sources: CodeSource[]
    try {
      sources = getCodeFromDisk(
        this.configReader,
        this.project,
        address,
      ).sources
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
