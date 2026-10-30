import { ChainSpecificAddress } from '@l2beat/shared-pure'

export interface AgentEntry {
  address: ChainSpecificAddress
  name: string | undefined
}

export class AgentRefError extends Error {
  constructor(
    message: string,
    readonly ref: string,
    readonly candidates: string[],
  ) {
    super(message, { cause: { ref, candidates } })
  }
}

const SUGGESTIONS_MAX = 5

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
      throw new AgentRefError('Address is not in the project', ref, [])
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

  const exact = onChain.filter((e) => e.name === name)
  const matches =
    exact.length > 0
      ? exact
      : onChain.filter((e) => e.name?.toLowerCase() === name.toLowerCase())
  if (matches.length === 1) {
    return (matches[0] as AgentEntry).address
  }
  if (matches.length > 1) {
    throw new AgentRefError(
      'Name is ambiguous',
      ref,
      matches.map((e) => describe(e)),
    )
  }
  throw new AgentRefError(
    'No contract with this name',
    ref,
    suggest(onChain, name),
  )
}

export function describe(entry: AgentEntry): string {
  return `${entry.address} (${entry.name ?? 'unnamed'})`
}

function suggest(entries: readonly AgentEntry[], name: string): string[] {
  const needle = name.toLowerCase()
  return entries
    .filter((e) => {
      const candidate = e.name?.toLowerCase()
      if (candidate === undefined) {
        return false
      }
      return candidate.includes(needle) || needle.includes(candidate)
    })
    .slice(0, SUGGESTIONS_MAX)
    .map((e) => describe(e))
}
