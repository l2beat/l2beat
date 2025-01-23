import { parseAbiItem } from 'viem'
import type { Method } from '../../types'
import { defineMethod } from '../defineMethod'

export const EIP712_methods: Method[] = [
  defineMethod(
    parseAbiItem(
      'function batchCall((address target, bool allowFailure, uint256 value, bytes callData)[] calls)',
    ),
    ([calls]) => {
      return calls.map((call) => ({
        type: 'recursive',
        calldata: call.callData,
        to: call.target,
      }))
    },
    'ClaveSmartWallet',
  ),
]
