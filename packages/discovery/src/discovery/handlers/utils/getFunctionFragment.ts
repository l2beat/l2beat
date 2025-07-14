import type { utils } from 'ethers'

import { toFunctionFragment } from './toFunctionFragment'

export function getFunctionFragment(
  method: string,
  abi: string[],
  predicate: (fragment: utils.FunctionFragment) => boolean,
): utils.FunctionFragment {
  if (method.includes(' ')) {
    const fragment = toFunctionFragment(method)
    if (!predicate(fragment)) {
      throw new Error('Invalid method abi')
    }
    return fragment
  }
  const fragment = abi
    .filter((x) => x.startsWith(`function ${method}`))
    .map(toFunctionFragment)
    .find(predicate)
  if (!fragment) {
    throw new Error(`Cannot find a matching method for ${method}`)
  }
  return fragment
}
