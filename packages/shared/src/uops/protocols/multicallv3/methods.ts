import type { Method } from '../../types'
import { defineMethod } from '../defineMethod'

export const MULTICALLV3_methods: Method[] = [
  defineMethod(
    'function aggregate(tuple(address target, bytes callData)[] calls)',
    ([calls]) => {
      return calls.map((call: { target: string; callData: string }) => ({
        type: 'recursive',
        calldata: call.callData,
        to: call.target,
      }))
    },
    'Multicall3',
  ),
  defineMethod(
    'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls)',
    ([calls]) => {
      return calls.map((call: { target: string; callData: string }) => ({
        type: 'recursive',
        calldata: call.callData,
        to: call.target,
      }))
    },
    'Multicall3',
  ),
]
