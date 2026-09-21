/**
 * One `eth_call` through V1's provider, with V1's outcome shape.
 *
 * This is the single path every read of a getter takes: the baseline
 * builder calls it for each 0-arg getter and the executor for `call` and
 * `callEach` steps, so a revert or a decoding mismatch is reported the same
 * way everywhere. Mirrors V1's `callMethod` (`undefined` means the call
 * reverted) plus the formatting `decodeHandlerResults` applies afterwards.
 */
import {
  type ContractValue,
  EXEC_REVERT_MSG,
  getErrorMessage,
  type IProvider,
} from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { utils } from 'ethers'
import { formatCallResult } from '../format/formatValue'

export type CallOutcome =
  | { value: ContractValue; error?: undefined }
  | { value?: undefined; error: string }

export async function callFragment(
  provider: IProvider,
  target: ChainSpecificAddress,
  fragment: utils.FunctionFragment,
  args: readonly unknown[],
): Promise<CallOutcome> {
  try {
    const result = await provider.callMethod(target, fragment, [...args])
    if (result === undefined) {
      return { error: EXEC_REVERT_MSG }
    }
    return { value: formatCallResult(provider.chain, result, fragment) }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}
