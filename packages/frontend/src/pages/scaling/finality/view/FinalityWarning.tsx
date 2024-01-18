import React from 'react'

import { Link } from '../../../../components/Link'

export function FinalityWarning() {
  return (
    <p className="my-4 rounded-lg bg-yellow-500 p-2 text-center text-xs font-medium text-black">
      Please note, the values on the page reflect the time required to achieve
      ordering finality, at which point transactions cannot be reverted or
      reordered. For simplicity, they do not include the overhead time to reach
      L1 finality, which is the same for all projects (around 13 minutes under
      good network conditions). The actionable settlement time on the L1 (that
      affects your ability to withdraw your funds on the L1) for these
      transactions may be longer. In most other cases, however, this does not
      apply (e.g., when transferring funds to an exchange). For more information
      on how finality works for L2 transactions, check{' '}
      <Link
        href="https://medium.com/l2beat/tracking-time-to-finality-of-l2-transactions-051d32f5d5ba"
        textClassName="!text-blue-700 group-hover:!text-blue-550"
      >
        our article
      </Link>
      .
    </p>
  )
}
