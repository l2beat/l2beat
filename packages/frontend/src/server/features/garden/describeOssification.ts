import { formatCurrency } from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'
import type { OssificationStats } from '../projects/ossification/getOssificationStats'

/**
 * The measured ossification, as the lines listed under Security, which it
 * caps. None while the ossification feature is off.
 */
export function describeOssification(
  ossification: OssificationStats | undefined,
): string[] {
  if (!ossification) {
    return []
  }
  const { score, isUnverified, timeline, exposure } = ossification
  return [
    isUnverified
      ? 'No score: some critical contracts are unverified.'
      : `Score: ${score} of 100.`,
    `No critical change since ${formatTimestamp(timeline.clockStart, { mode: 'date' })}.`,
    ...(exposure !== null
      ? [`Battle-tested exposure: ${formatCurrency(exposure, 'usd')}·years.`]
      : []),
  ]
}
