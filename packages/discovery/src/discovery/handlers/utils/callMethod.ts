import { Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { getErrorMessage } from '../../../utils/getErrorMessage'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { isRevert } from '../../utils/isRevert'
import { isIntNumeric } from '../../utils/normalizeDiffPath'
import { toContractValue } from './toContractValue'

export const EXEC_REVERT_MSG = 'Execution reverted'

export async function callMethod(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  fragment: utils.FunctionFragment,
  parameters: unknown[],
  blockNumber: number,
  pickFields?: string[],
) {
  const abi = new utils.Interface([fragment])

  try {
    const callData = Bytes.fromHex(abi.encodeFunctionData(fragment, parameters))
    const result = await provider.call(address, callData, blockNumber)

    const value = decodeMethodResult(abi, fragment, result, pickFields)
    return { value }
  } catch (e) {
    return {
      error: isRevert(e) ? EXEC_REVERT_MSG : getErrorMessage(e),
    }
  }
}

// NOTE(radomski): To understand the behavoiur of this function, let's
// understand the behaviour of Solidity and ethers.js. In Solidity, a function
// can return multiple values, this is represented as a tuple. Take for example
// something like this:
// `function f1() returns (uint256, address)`
// The return is a tuple of two values, with Python notation this is equivalent
// to `(uint256, address)`. Now if a function returns a single value:
// `function f1() returns (address)`
// It's still a tuple, but with a single value, this is equivalent to
// `(address)`. ethers.js respects this behaviour, so when decoding a return
// value, it will always return an array, even if the return is a single value.
// More complex types are built on this base, for example an array like this:
// `function f1() returns (uint256[])`
// This is equivalent to `(uint256[])`, and ethers.js will return an array of
// arrays `[[]]`. The same goes for structs, but remember that structs are
// re-encoded as tuples.
// `function f1() returns (tuple(uint256 v1, address v2))`
// This is equivalent to `(uint256, address)`, and ethers.js will return an
// array of arrays `[[]]`.
//
// Our behaviour is based on this. If the return is a single value, we will
// drop the containing tuple. In all other cases we leave it as is.
export function decodeMethodResult(
  abi: utils.Interface,
  fragment: utils.FunctionFragment,
  result: Bytes,
  pickFields?: string[],
) {
  const decoded = abi.decodeFunctionResult(fragment, result.toString())
  const extracted = decoded.length === 1 ? decoded[0] : decoded

  if (!Array.isArray(extracted) && pickFields !== undefined) {
    throw new Error('Cannot pick fields from a non-struct-like return value')
  }

  const filtered = pickFields
    ? pickFields.map((instr) => executePickInstruction(extracted, instr))
    : extracted

  return toContractValue(filtered)
}

function executePickInstruction(
  decoded: utils.Result,
  instr: string,
): utils.Result {
  const parts = instr.split('.')
  let current = decoded
  for (const part of parts) {
    const index = isIntNumeric(part) ? parseInt(part) : part
    current = current[index]
  }
  return current as utils.Result
}
