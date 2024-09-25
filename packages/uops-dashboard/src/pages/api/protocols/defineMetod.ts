import type { Method, Operation } from '@/types'
import {
  type AbiFunction,
  type DecodeFunctionDataReturnType,
  decodeFunctionData,
  toFunctionSelector,
  toFunctionSignature,
} from 'viem'

export function defineMethod<T extends AbiFunction>(
  abi: T,
  countOperations: (
    decoded: DecodeFunctionDataReturnType<[T]>['args'],
  ) => Operation[],
  contractName?: string,
): Method {
  abi.inputs
  return {
    name: abi.name,
    contractName: contractName,
    selector: toFunctionSelector(abi),
    signature: toFunctionSignature(abi),
    count(calldata: `0x${string}`) {
      const decoded = decodeFunctionData({ abi: [abi], data: calldata })
      return countOperations(decoded.args)
    },
  }
}
