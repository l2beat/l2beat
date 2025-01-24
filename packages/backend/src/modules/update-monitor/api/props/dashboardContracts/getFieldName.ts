import type { ethers } from 'ethers'

import { abiToArray } from './abiToArray'

export function getFieldName(
  viewABI: ethers.utils.Interface,
  field: string,
): string {
  const correspondingViewFunction = abiToArray(viewABI).find(
    (fn) => fn.split('(')[0] === field,
  )

  if (correspondingViewFunction) {
    return correspondingViewFunction
  }

  return field
}
