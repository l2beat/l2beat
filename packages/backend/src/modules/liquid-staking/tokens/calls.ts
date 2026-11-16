import type { CallParameters, MulticallV3Response } from '@l2beat/shared'
import { Bytes, ChainSpecificAddress } from '@l2beat/shared-pure'
import type { utils } from 'ethers'

export const UNIT = 10n ** 18n

export function encodeCall(
  abi: utils.Interface,
  address: ChainSpecificAddress,
  functionName: string,
  args: unknown[] = [],
): CallParameters {
  return {
    to: ChainSpecificAddress.address(address),
    input: Bytes.fromHex(abi.encodeFunctionData(functionName, args)),
  }
}

/**
 * What the call returned, or nothing if it reverted. The multicall reports a
 * call to an address without code as a success with no data, so that gives
 * nothing too.
 */
export function returnData(response: MulticallV3Response): Bytes | undefined {
  return response.success && response.data.length > 0
    ? response.data
    : undefined
}

export function word(data: Bytes, index: number): bigint {
  return BigInt(data.slice(index * 32, (index + 1) * 32).toString())
}

export function uint(data: Bytes): bigint {
  return word(data, 0)
}
