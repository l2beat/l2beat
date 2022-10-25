import { UnixTime } from '@l2beat/types'

import { DailyTransactionCount } from '../../../core/transaction-count/TransactionCounter'

export function getTip(
  projectCounts: DailyTransactionCount[][],
  now?: UnixTime,
) {
  return projectCounts.reduce<UnixTime>((minTip, counts) => {
    const counterTip = counts.at(-1)?.timestamp
    return counterTip?.lt(minTip) ? counterTip : minTip
  }, now ?? UnixTime.now())
}
