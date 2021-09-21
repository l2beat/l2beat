import { BigNumber, constants } from 'ethers'

export function divOrZero(value: BigNumber, by: BigNumber) {
  if (by.eq(0)) {
    return constants.Zero
  }
  return value.div(by)
}
