/**
 * One parsed view of a human-readable ABI, for the questions the templatizer
 * asks of it: which functions discovery does not read by itself, which
 * constructor V1 decodes with, every declaration of an event, and which
 * function a signature names.
 *
 * Duplicate fragments are dropped before parsing because merged proxy and
 * implementation ABIs repeat signatures and ethers logs a warning per repeat.
 * One index per ABI array: the worklist, the checks of every round and the
 * dry run all ask about the same array.
 */
import { utils } from 'ethers'

const indexes = new WeakMap<readonly string[], AbiIndex>()

export class AbiIndex {
  readonly functions: utils.FunctionFragment[]
  readonly events: utils.EventFragment[]
  /** The ABI's first constructor, the one V1's `constructorArgs` handler decodes with; undefined when none is declared. */
  readonly deploy: utils.ConstructorFragment | undefined

  private constructor(fragments: utils.Fragment[]) {
    const coder = new utils.Interface(fragments)
    this.functions = Object.values(coder.functions)
    this.events = Object.values(coder.events)
    this.deploy = fragments.find(
      (fragment): fragment is utils.ConstructorFragment =>
        fragment.type === 'constructor',
    )
  }

  static of(abi: readonly string[]): AbiIndex {
    let index = indexes.get(abi)
    if (index === undefined) {
      index = AbiIndex.parse(abi)
      indexes.set(abi, index)
    }
    return index
  }

  private static parse(abi: readonly string[]): AbiIndex {
    const seen = new Set<string>()
    const fragments: utils.Fragment[] = []
    for (const entry of abi) {
      const fragment = utils.Fragment.from(entry)
      const key = identity(fragment)
      if (!seen.has(key)) {
        seen.add(key)
        fragments.push(fragment)
      }
    }
    return new AbiIndex(fragments)
  }

  /** The function a signature such as `owners(uint256)` names. */
  functionBySignature(signature: string): utils.FunctionFragment | undefined {
    return this.functions.find((f) => sighash(f) === signature)
  }

  /**
   * Every declaration of the name: a contract that changed an event's
   * parameters across upgrades declares it twice, and the merged ABI keeps
   * both. V1 reads a bare name as the first one.
   */
  eventDeclarations(name: string): utils.EventFragment[] {
    return this.events.filter((event) => event.name === name)
  }
}

/**
 * Deduplication key. A merged ABI can hold the proxy's constructor and an
 * implementation's; V1 decodes with the first, so every later one is dropped
 * like a repeat (ethers would keep the first too, with a warning per repeat).
 */
function identity(fragment: utils.Fragment): string {
  return fragment.type === 'constructor' ? 'constructor' : sighash(fragment)
}

export function sighash(fragment: utils.Fragment): string {
  return fragment.format(utils.FormatTypes.sighash)
}
