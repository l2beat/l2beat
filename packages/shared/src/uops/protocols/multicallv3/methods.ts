import { parseAbiItem } from 'viem'
import type { Method } from '../../types'
import { defineMethod } from '../defineMethod'

export const MULTICALLV3_methods: Method[] = [
  defineMethod(
    parseAbiItem(
      'function aggregate((address target, bytes callData)[] calls)',
    ),
    ([calls]) => {
      return calls.map((call) => ({
        type: 'recursive',
        calldata: call.callData,
        to: call.target,
      }))
    },
    'Multicall3',
  ),
  defineMethod(
    parseAbiItem(
      'function aggregate3((address target, bool allowFailure, bytes callData)[] calls)',
    ),
    ([calls]) => {
      return calls.map((call) => ({
        type: 'recursive',
        calldata: call.callData,
        to: call.target,
      }))
    },
    'Multicall3',
  ),
]
