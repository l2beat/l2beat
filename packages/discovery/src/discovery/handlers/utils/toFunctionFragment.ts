import { utils } from 'ethers'

export function toFunctionFragment(abiEntry: string): utils.FunctionFragment {
  const abi = new utils.Interface([abiEntry])
  const fragment = Object.values(abi.functions)[0]
  if (!fragment) {
    throw new Error('Abi entry is not a function')
  }
  return fragment
}
