import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { Method, Operation } from '../types'

export function defineMethod(
  humanReadableAbi: string,
  countOperations: (
    decoded: utils.Result,
    calldata: `0x${string}`,
  ) => Operation[],
  contractName?: string,
): Method {
  const contractInterface = new utils.Interface([humanReadableAbi])
  const fragment = singleFunction(contractInterface)
  return {
    name: fragment.name,
    contractName: contractName,
    selector: contractInterface.getSighash(fragment),
    signature: fragment.format(),
    count(calldata: `0x${string}`) {
      const decoded = contractInterface.decodeFunctionData(fragment, calldata)
      return countOperations(decoded, calldata)
    },
  }
}

export function functionSelector(humanReadableAbi: string): string {
  const contractInterface = new utils.Interface([humanReadableAbi])
  return contractInterface.getSighash(singleFunction(contractInterface))
}

function singleFunction(
  contractInterface: utils.Interface,
): utils.FunctionFragment {
  const fragments = Object.values(contractInterface.functions)
  assert(fragments.length === 1)
  return fragments[0]
}
