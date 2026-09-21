/**
 * Reads every parameterless view/pure getter, as V1's system handlers do.
 *
 * Selection mirrors `getSystemHandlers` exactly (`constant`, at least one
 * output, no inputs, field named through `rewriteSolidityIdentifier`), minus
 * the `LimitedArrayHandler` that V1 adds for single-`uint256` functions: that
 * probe guesses five indices and its output is a plan decision here, taken by
 * the model with an `array@1` step over a real length.
 *
 * All calls are issued in one tick so V1's provider folds them into a single
 * multicall, and a revert is a field with an error rather than a missing
 * field, because V1 writes reverts into `errors` and the benchmark reads them.
 */
import { type IProvider, rewriteSolidityIdentifier } from '@l2beat/discovery'
import { utils } from 'ethers'
import { callFragment } from '../execute/callFragment'
import type { Baseline, BaselineField } from '../types/Baseline'
import type { Prepared } from '../types/Prepared'

export async function buildBaseline(
  provider: IProvider,
  prepared: Pick<Prepared, 'abi' | 'address'>,
): Promise<Baseline> {
  const getters = selectGetters(prepared.abi)
  const outcomes = await Promise.all(
    getters.map((fragment) =>
      callFragment(provider, prepared.address, fragment, []),
    ),
  )
  const fields = getters.map((fragment, i): [string, BaselineField] => [
    rewriteSolidityIdentifier(fragment.name),
    { fragment: fragment.format(utils.FormatTypes.full), ...outcomes[i] },
  ])
  return { fields: Object.fromEntries(fields.sort(byName)) }
}

/** V1's `getSystemHandlers` filter, without the uint256 array probe. */
export function selectGetters(abi: string[]): utils.FunctionFragment[] {
  const contract = new utils.Interface(abi)
  return Object.values(contract.functions).filter(
    (fragment) =>
      fragment.constant &&
      (fragment.outputs?.length ?? 0) > 0 &&
      fragment.inputs.length === 0,
  )
}

function byName(a: [string, unknown], b: [string, unknown]): number {
  return a[0].localeCompare(b[0])
}
