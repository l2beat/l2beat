import {
  type AbiFunction,
  type DecodeFunctionDataReturnType,
  decodeFunctionData,
  parseAbiItem,
  toFunctionSelector,
} from 'viem'
import type { Method, Operation } from './types'

export const methods: Method[] = [
  defineMethod(
    parseAbiItem(
      'function handleOps((address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature)[] calldata ops, address beneficiary)',
    ),
    ([ops]) => {
      return ops.flatMap((op) => {
        const operations: Operation[] = []
        if (op.initCode && op.initCode !== '0x') {
          operations.push({
            type: 'static',
            name: 'contract deployment',
            count: 1,
          })
        }
        operations.push({ type: 'recursive', calldata: op.callData })
        return operations
      })
    },
  ),
  defineMethod(
    parseAbiItem('function executeBatch(address[] addresses, bytes[] inputs)'),
    ([addresses, inputs]) => {
      if (addresses.length !== inputs.length) {
        return []
      }
      return inputs.map((input: string) => ({
        type: 'recursive',
        calldata: input,
      }))
    },
  ),
  defineMethod(
    parseAbiItem('function execute(address,uint256,bytes)'),
    ([, , calldata]) => {
      return [{ type: 'recursive', calldata }]
    },
  ),
  defineMethod(
    parseAbiItem(
      'function executeBatch((address to, uint256 value, bytes data)[] calls)',
    ),
    ([calls]) => {
      return calls.map((call) => ({
        type: 'recursive',
        calldata: call.data,
      }))
    },
  ),
  defineMethod(
    parseAbiItem(
      'function executeBatch(address[] targets, uint256[] values, bytes[] inputs)',
    ),
    ([, , inputs]) => {
      return inputs.map((input: string) => ({
        type: 'recursive',
        calldata: input,
      }))
    },
  ),
]

function defineMethod<T extends AbiFunction>(
  abi: T,
  countOperations: (
    decoded: DecodeFunctionDataReturnType<[T]>['args'],
  ) => Operation[],
): Method {
  return {
    name: abi.name,
    selector: toFunctionSelector(abi),
    count(calldata: `0x${string}`) {
      const decoded = decodeFunctionData({ abi: [abi], data: calldata })
      return countOperations(decoded.args)
    },
  }
}
