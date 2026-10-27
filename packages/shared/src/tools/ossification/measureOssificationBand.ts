import {
  getOssificationSentiment,
  type OssificationBand,
} from '@l2beat/shared-pure'
import { measureOssification } from './measureOssification'
import type { OssificationHistory } from './types'

/**
 * The band the score falls in at `now`. Unscored without a history, and while
 * a critical contract is unverified: unverified code cannot be scored, as the
 * ossification table says.
 */
export function measureOssificationBand(
  history: OssificationHistory | undefined,
  now: number,
): OssificationBand {
  if (!history) {
    return 'unscored'
  }
  const { score, contracts } = measureOssification(history, now)
  return contracts.every((c) => c.isVerified)
    ? getOssificationSentiment(score)
    : 'unscored'
}
