import {
  type AbiFunction,
  type DecodeFunctionDataReturnType,
  decodeFunctionData,
  toFunctionSelector,
} from 'viem'
import { Method, Operation } from '../types'

export function defineMethod<T extends AbiFunction>(
  abi: T,
  countOperations: (
    decoded: DecodeFunctionDataReturnType<[T]>['args'],
  ) => Operation[],
): Method {
  abi.inputs
  return {
    selector: toFunctionSelector(abi),
    count(calldata: `0x${string}`) {
      const decoded = decodeFunctionData({ abi: [abi], data: calldata })
      return countOperations(decoded.args)
    },
  }
}
