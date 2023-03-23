import { ethers } from 'ethers'

import { abiToArray } from './abiToArray'

export function getFieldName(
  field: string,
  viewABI: ethers.utils.Interface,
): string {
  const correspondingViewFunction = abiToArray(viewABI).find(
    (fn) => fn.split('(')[0] === field,
  )

  if (correspondingViewFunction) {
    return correspondingViewFunction
  }

  return field
}
