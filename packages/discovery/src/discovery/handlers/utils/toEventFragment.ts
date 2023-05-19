import { utils } from 'ethers'

export function toEventFragment(abiEntry: string) {
  const abi = new utils.Interface([abiEntry])
  const fragment = Object.values(abi.events)[0]
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!fragment) {
    throw new Error('Abi entry is not an event')
  }
  return fragment
}
