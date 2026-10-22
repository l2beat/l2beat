import { formatCurrency } from '@l2beat/shared-pure'
import type { ResolvedCrops } from '~/components/garden/crops'
import { formatTimestamp } from '~/utils/dates'
import type { OssificationStats } from '../projects/ossification/getOssificationStats'

/**
 * Lists the measured ossification under Security, which it caps. While the
 * ossification feature is off there is none, and the crops stay as they are.
 */
export function withOssification(
  crops: ResolvedCrops,
  ossification: OssificationStats | undefined,
): ResolvedCrops {
  if (!ossification) {
    return crops
  }
  const { score, isUnverified, timeline, exposure } = ossification
  const lines = [
    isUnverified
      ? 'No score: some critical contracts are unverified.'
      : `Score: ${score} of 100.`,
    `No critical change since ${formatTimestamp(timeline.clockStart, { mode: 'date' })}.`,
    ...(exposure !== null
      ? [`Battle-tested exposure: ${formatCurrency(exposure, 'usd')}·years.`]
      : []),
  ]
  return { ...crops, security: { ...crops.security, ossification: lines } }
}
