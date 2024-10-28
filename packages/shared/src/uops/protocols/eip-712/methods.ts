import { parseAbiItem } from 'viem'
import { Method } from '../../types'
import { defineMethod } from '../defineMetod'

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
