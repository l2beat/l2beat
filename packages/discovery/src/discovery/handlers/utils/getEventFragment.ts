import type { utils } from 'ethers'

import { toEventFragment } from './toEventFragment.js'

export function getEventFragment(
  event: string,
  abi: string[],
): utils.EventFragment {
  if (event.includes(' ')) {
    return toEventFragment(event)
  }
  const fragment = abi
    .filter((x) => x.startsWith(`event ${event}(`))
    .map(toEventFragment)[0]

  if (!fragment) {
    throw new Error(`Cannot find a matching event for ${event}`)
  }
  return fragment
}
