import { BigNumber, utils } from 'ethers'

export function asNumber(
  value: BigNumber,
  decimals: number,
  precision: number
) {
  const formatted = utils.formatUnits(value, decimals)
  return parseFloat(parseFloat(formatted).toFixed(precision))
}
