import type { Method } from '../../types'
import { defineMethod } from '../defineMethod'
import { ERC20ROUTER_TRANSACTION_SIGNATURE } from './const'

export const ERC20ROUTER_methods: Method[] = [
  defineMethod(
    ERC20ROUTER_TRANSACTION_SIGNATURE,
    ([targets, datas]) => {
      if (targets.length !== datas.length) {
        return []
      }
      return datas.map((data: string, index: number) => ({
        type: 'recursive',
        calldata: data,
        to: targets[index],
      }))
    },
    'ERC20Router',
  ),
]
