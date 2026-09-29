import type { Method } from '../../types'
import { defineMethod } from '../defineMethod'

export const EIP712_methods: Method[] = [
  defineMethod(
    'function batchCall(tuple(address target, bool allowFailure, uint256 value, bytes callData)[] calls)',
    ([calls]) => {
      return calls.map((call: { target: string; callData: string }) => ({
        type: 'recursive',
        calldata: call.callData,
        to: call.target,
      }))
    },
    'ClaveSmartWallet',
  ),
]
