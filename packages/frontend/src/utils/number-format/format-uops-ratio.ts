import { formatNumber } from './format-number'

export function formatUopsRatio(ratio: number): string {
  switch (ratio < 1.01) {
    case true:
      return '<1.01'
    case false:
      return formatNumber(ratio, 2)
  }
}
