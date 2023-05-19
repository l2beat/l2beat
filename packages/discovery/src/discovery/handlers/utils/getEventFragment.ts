import { utils } from 'ethers'

import { toEventFragment } from './toEventFragment'

export function getEventFragment(
  event: string,
  abi: string[],
  predicate: (fragment: utils.EventFragment) => boolean,
) {
  if (event.includes(' ')) {
    const fragment = toEventFragment(event)
    if (!predicate(fragment)) {
      throw new Error('Invalid event abi')
    }
    return fragment
  } else {
    const fragment = abi
      .filter((x) => x.startsWith(`event ${event}`))
      .map(toEventFragment)
      .find(predicate)
    if (!fragment) {
      throw new Error(`Cannot find a matching event for ${event}`)
    }
    return fragment
  }
}
