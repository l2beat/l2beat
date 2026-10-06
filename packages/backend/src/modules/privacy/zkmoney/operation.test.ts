import type { Log } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { findOperationWindow, locateDeposit } from './operation'
import {
  ALICE,
  BOB,
  FUNDED,
  FUNDING_PARAMS,
  PORTAL,
  portalDeposit,
  SIPA,
  sweep,
  transfer,
  withdrawal,
} from './test/fixtures'

// Receipts are synthetic logs encoded with the real ABIs. Log indexes start
// at 40 to model a transaction that is not the first in its block, so a
// receipt position never coincides with a log index.
describe(locateDeposit.name, () => {
  it('identifies the funding transfer by its log index', () => {
    const portalEvent = portalDeposit(1, { logIndex: 44 })

    const deposit = locateDeposit(
      sweepReceipt(portalEvent),
      portalEvent,
      FUNDING_PARAMS,
    )

    expect(deposit?.sender).toEqual(SIPA)
    expect(deposit?.fundingTransfer.logIndex).toEqual(42)
  })

  it('rejects a deposit with a second matching transfer into the portal', () => {
    const portalEvent = portalDeposit(1, { logIndex: 44 })
    const donation = transfer(ALICE, PORTAL, FUNDED, { logIndex: 40 })

    const deposit = locateDeposit(
      [donation, ...sweepReceipt(portalEvent)],
      portalEvent,
      FUNDING_PARAMS,
    )

    expect(deposit).toEqual(undefined)
  })
})

describe(findOperationWindow.name, () => {
  it('limits an operation to the logs between its neighbouring portal events', () => {
    const previous = withdrawal(1, { logIndex: 41 })
    const ownTransfer = transfer(SIPA, PORTAL, FUNDED, { logIndex: 42 })
    const portalEvent = portalDeposit(1, { logIndex: 43 })
    const ownSweep = sweep(1, { logIndex: 44 })
    const next = withdrawal(2, { logIndex: 45 })

    const window = findOperationWindow(
      [
        transfer(BOB, ALICE, 1n, { logIndex: 40 }),
        previous,
        ownTransfer,
        portalEvent,
        ownSweep,
        next,
        transfer(BOB, ALICE, 1n, { logIndex: 46 }),
      ],
      portalEvent,
    )

    expect(window).toEqual({ before: [ownTransfer], after: [ownSweep] })
  })
})

/** Fee, portal funding and sponsorship refund, then the portal event and the Sweep. */
function sweepReceipt(portalEvent: Log): Log[] {
  return [
    transfer(SIPA, BOB, 2n, { logIndex: 41 }),
    transfer(SIPA, PORTAL, FUNDED, { logIndex: 42 }),
    transfer(PORTAL, BOB, 1n, { logIndex: 43 }),
    portalEvent,
    sweep(1, { logIndex: 45 }),
  ]
}
