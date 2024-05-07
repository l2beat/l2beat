import { utils } from 'ethers'

export function toEventFragment(abiEntry: string): utils.EventFragment {
  const abi = new utils.Interface([abiEntry])
  const fragment = Object.values(abi.events)[0]
  if (!fragment) {
    throw new Error('Abi entry is not an event')
  }
  return fragment
}
