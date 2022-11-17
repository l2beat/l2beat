import { utils } from 'ethers'

export function toFunctionFragment(abiEntry: string) {
  const abi = new utils.Interface([abiEntry])
  const fragment = Object.values(abi.functions)[0]
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!fragment) {
    throw new Error('Abi entry is not a function')
  }
  return fragment
}
