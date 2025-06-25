import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'

export function getSighash(abi: string): string {
  const iface = new utils.Interface([abi])
  const fragment = Object.values(iface.functions)[0]
  assert(fragment !== undefined, 'Abi entry is not a function')
  return iface.getSighash(fragment)
}
