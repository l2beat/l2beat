import { formatNumber } from './formatNumber'

export function formatUopsRatio(ratio: number): string {
  if (ratio === 1) {
    return '1.00'
  }
  if (ratio < 1.01) {
    return '<1.01'
  }
  return formatNumber(ratio, 2)
}
