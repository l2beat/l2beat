import type { ConfigReader } from '@l2beat/discovery'
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { readReachableEntries } from '../readReachableEntries'
import { ToolError } from './toolError'

export interface AgentEntry {
  address: ChainSpecificAddress
  name: string | undefined
}

const SUGGESTIONS_MAX = 5
// Two slips, like a swapped pair of letters, still read as the same name.
const TYPO_EDITS_MAX = 2

// An agent names contracts the way the researcher does, so a ref is a
// chain-specific address, a unique name, or "chain:Name" when the name repeats
// across chains.
export function resolveRef(
  entries: readonly AgentEntry[],
  ref: string,
): ChainSpecificAddress {
  // Lowercase addresses, as explorers and logs print them, count too.
  const address = ChainSpecificAddress.tryParse(ref)
  if (address !== undefined) {
    if (!entries.some((e) => e.address === address)) {
      throw new ToolError('Address is not in the project', {
        ref,
        'on other chains': onOtherChains(entries, address),
      })
    }
    return address
  }

  const separator = ref.indexOf(':')
  const chain = separator === -1 ? undefined : ref.slice(0, separator)
  const name = separator === -1 ? ref : ref.slice(separator + 1)
  const onChain =
    chain === undefined
      ? entries
      : entries.filter((e) => ChainSpecificAddress.chain(e.address) === chain)
  if (onChain.length === 0) {
    throw new ToolError('No contracts on this chain', {
      ref,
      chains: [...new Set(entries.map((e) => chainOf(e)))],
    })
  }

  const exact = onChain.filter((e) => e.name === name)
  const matches =
    exact.length > 0
      ? exact
      : onChain.filter((e) => e.name?.toLowerCase() === name.toLowerCase())
  if (matches.length === 1) {
    return (matches[0] as AgentEntry).address
  }
  if (matches.length > 1) {
    throw new ToolError('Name is ambiguous', {
      ref,
      candidates: matches.map((e) => describeEntry(e)),
    })
  }
  throw new ToolError('No contract with this name', {
    ref,
    candidates: suggest(onChain, name),
  })
}

export function describeEntry(entry: AgentEntry): string {
  return `${entry.address} (${entry.name ?? 'unnamed'})`
}

function chainOf(entry: AgentEntry): string {
  return ChainSpecificAddress.chain(entry.address)
}

// The same contract is often deployed at one address on several chains.
function onOtherChains(
  entries: readonly AgentEntry[],
  address: ChainSpecificAddress,
): string[] {
  const raw = ChainSpecificAddress.address(address)
  return entries
    .filter((e) => ChainSpecificAddress.address(e.address) === raw)
    .slice(0, SUGGESTIONS_MAX)
    .map((e) => describeEntry(e))
}

// Names that contain the ref, or that the ref contains, come first, then
// the ones a typo or two away.
function suggest(entries: readonly AgentEntry[], name: string): string[] {
  const needle = name.toLowerCase()
  const scored: { entry: AgentEntry; edits: number }[] = []
  for (const entry of entries) {
    const candidate = entry.name?.toLowerCase()
    if (candidate === undefined) {
      continue
    }
    if (candidate.includes(needle) || needle.includes(candidate)) {
      scored.push({ entry, edits: 0 })
      continue
    }
    // Names whose lengths differ by more are further apart than that anyway.
    if (Math.abs(candidate.length - needle.length) > TYPO_EDITS_MAX) {
      continue
    }
    const edits = editDistance(candidate, needle)
    if (edits <= TYPO_EDITS_MAX) {
      scored.push({ entry, edits })
    }
  }
  return scored
    .sort((a, b) => a.edits - b.edits)
    .slice(0, SUGGESTIONS_MAX)
    .map((s) => describeEntry(s.entry))
}

// Levenshtein distance over two rows of the table.
export function editDistance(source: string, target: string): number {
  let previous = Array.from({ length: target.length + 1 }, (_, i) => i)
  for (let i = 1; i <= source.length; i++) {
    const current = [i]
    for (let j = 1; j <= target.length; j++) {
      const substitution = source[i - 1] === target[j - 1] ? 0 : 1
      current[j] = Math.min(
        (previous[j] as number) + 1,
        (current[j - 1] as number) + 1,
        (previous[j - 1] as number) + substitution,
      )
    }
    previous = current
  }
  return previous[target.length] as number
}

// A contract both the project and a shared module list is one entry, and
// the zero address is drawn nowhere.
export function readAgentEntries(
  configReader: ConfigReader,
  project: string,
): AgentEntry[] {
  return toAgentEntries(readReachableEntries(configReader, project))
}

export function toAgentEntries(
  entries: readonly { address: ChainSpecificAddress; name?: string }[],
): AgentEntry[] {
  const byAddress = new Map<ChainSpecificAddress, AgentEntry>()
  for (const entry of entries) {
    if (ChainSpecificAddress.address(entry.address) === EthereumAddress.ZERO) {
      continue
    }
    if (!byAddress.has(entry.address)) {
      byAddress.set(entry.address, { address: entry.address, name: entry.name })
    }
  }
  return [...byAddress.values()]
}
