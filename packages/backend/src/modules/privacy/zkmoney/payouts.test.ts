import { assert, type Log } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { DepositSenderKind, ZkMoneyDeposit } from './deposits'
import { locateDeposit } from './operation'
import { findDepositFinalizer, findWithdrawalFinalizer } from './payouts'
import {
  ALICE,
  BOB,
  DEPOSIT_FEE,
  DEPOSIT_PAYOUT_PARAMS,
  FUNDED,
  OPERATION_EXECUTOR,
  PORTAL,
  portalDeposit,
  SIPA,
  sweep,
  transfer,
  USDC,
  WITHDRAWAL_EXECUTOR,
  WITHDRAWAL_PAYOUT_PARAMS,
  withdrawal,
} from './test/fixtures'

// Receipts are synthetic logs encoded with the real ABIs. A withdrawal
// executes 100 DAI: the executor sends the principal, then the tip.
describe(findWithdrawalFinalizer.name, () => {
  it('credits the tip recipient, even when it also receives the principal', () => {
    const portalEvent = withdrawal(1, { logIndex: 3 })

    const finalizer = findWithdrawalFinalizer(
      [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 1 }),
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 10n, { logIndex: 2 }),
        portalEvent,
      ],
      portalEvent,
      WITHDRAWAL_PAYOUT_PARAMS,
    )

    expect(finalizer).toEqual(ALICE)
  })

  it('follows a tip paid to the operation executor to its caller, including subsidies', () => {
    const portalEvent = withdrawal(1, { logIndex: 3 })

    const finalizer = findWithdrawalFinalizer(
      [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 1 }),
        transfer(WITHDRAWAL_EXECUTOR, OPERATION_EXECUTOR, 10n, { logIndex: 2 }),
        portalEvent,
        transfer(BOB, OPERATION_EXECUTOR, 5n, { logIndex: 4 }),
        transfer(OPERATION_EXECUTOR, BOB, 15n, { logIndex: 5 }),
      ],
      portalEvent,
      WITHDRAWAL_PAYOUT_PARAMS,
    )

    expect(finalizer).toEqual(BOB)
  })

  it('ignores a withdrawal without a tip', () => {
    const portalEvent = withdrawal(1, { logIndex: 3 })

    const finalizer = findWithdrawalFinalizer(
      [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 100n, { logIndex: 1 }),
        portalEvent,
      ],
      portalEvent,
      WITHDRAWAL_PAYOUT_PARAMS,
    )

    expect(finalizer).toEqual(undefined)
  })

  it('ignores a withdrawal through a custom executor', () => {
    const portalEvent = withdrawal(1, { logIndex: 3 }, SIPA)

    const finalizer = findWithdrawalFinalizer(
      [
        transfer(SIPA, ALICE, 90n, { logIndex: 1 }),
        transfer(SIPA, BOB, 10n, { logIndex: 2 }),
        portalEvent,
      ],
      portalEvent,
      WITHDRAWAL_PAYOUT_PARAMS,
    )

    expect(finalizer).toEqual(undefined)
  })

  it('ignores a tip transfer emitted by another token', () => {
    const portalEvent = withdrawal(1, { logIndex: 3 })

    const finalizer = findWithdrawalFinalizer(
      [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 1 }),
        transfer(WITHDRAWAL_EXECUTOR, BOB, 10n, { logIndex: 2 }, USDC),
        portalEvent,
      ],
      portalEvent,
      WITHDRAWAL_PAYOUT_PARAMS,
    )

    expect(finalizer).toEqual(undefined)
  })

  it('reads each batched withdrawal from its own part of the receipt', () => {
    const first = withdrawal(1, { logIndex: 3 })
    const second = withdrawal(2, { logIndex: 7 })
    const receipt = [
      transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 1 }),
      transfer(WITHDRAWAL_EXECUTOR, OPERATION_EXECUTOR, 10n, { logIndex: 2 }),
      first,
      transfer(OPERATION_EXECUTOR, ALICE, 10n, { logIndex: 4 }),
      transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 5 }),
      transfer(WITHDRAWAL_EXECUTOR, BOB, 10n, { logIndex: 6 }),
      second,
    ]

    expect(
      findWithdrawalFinalizer(receipt, first, WITHDRAWAL_PAYOUT_PARAMS),
    ).toEqual(ALICE)
    expect(
      findWithdrawalFinalizer(receipt, second, WITHDRAWAL_PAYOUT_PARAMS),
    ).toEqual(BOB)
  })

  it('rejects ambiguous forwarding by the operation executor', () => {
    const portalEvent = withdrawal(1, { logIndex: 3 })

    const finalizer = findWithdrawalFinalizer(
      [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 1 }),
        transfer(WITHDRAWAL_EXECUTOR, OPERATION_EXECUTOR, 10n, { logIndex: 2 }),
        portalEvent,
        transfer(OPERATION_EXECUTOR, ALICE, 10n, { logIndex: 4 }),
        transfer(OPERATION_EXECUTOR, BOB, 10n, { logIndex: 5 }),
      ],
      portalEvent,
      WITHDRAWAL_PAYOUT_PARAMS,
    )

    expect(finalizer).toEqual(undefined)
  })
})

// A SIPA sweep pays its fee, funds the portal, and emits a Sweep matching the
// portal event. The deposit is located with the real `locateDeposit`.
describe(findDepositFinalizer.name, () => {
  it('credits the sweep fee recipient', () => {
    const portalEvent = portalDeposit(1, { logIndex: 4 })
    const receipt = sweepReceipt(portalEvent, DEPOSIT_FEE)

    const finalizer = findDepositFinalizer(
      deposit(receipt, portalEvent, 'deposit'),
      portalEvent,
      DEPOSIT_PAYOUT_PARAMS,
    )

    expect(finalizer).toEqual(BOB)
  })

  it('ignores a sweep whose fee differs from the configured one', () => {
    const portalEvent = portalDeposit(1, { logIndex: 4 })
    const receipt = sweepReceipt(portalEvent, DEPOSIT_FEE + 1n)

    const finalizer = findDepositFinalizer(
      deposit(receipt, portalEvent, 'deposit'),
      portalEvent,
      DEPOSIT_PAYOUT_PARAMS,
    )

    expect(finalizer).toEqual(undefined)
  })

  it('ignores a deposit without a matching Sweep event', () => {
    const portalEvent = portalDeposit(1, { logIndex: 4 })
    const receipt = sweepReceipt(portalEvent, DEPOSIT_FEE).slice(0, -1)

    const finalizer = findDepositFinalizer(
      deposit(receipt, portalEvent, 'deposit'),
      portalEvent,
      DEPOSIT_PAYOUT_PARAMS,
    )

    expect(finalizer).toEqual(undefined)
  })

  it('ignores a deposit not sent by an authenticated SIPA', () => {
    const portalEvent = portalDeposit(1, { logIndex: 4 })
    const receipt = sweepReceipt(portalEvent, DEPOSIT_FEE)

    const finalizer = findDepositFinalizer(
      deposit(receipt, portalEvent, 'direct'),
      portalEvent,
      DEPOSIT_PAYOUT_PARAMS,
    )

    expect(finalizer).toEqual(undefined)
  })
})

function sweepReceipt(portalEvent: Log, fee: bigint): Log[] {
  return [
    transfer(SIPA, BOB, fee, { logIndex: 1 }),
    transfer(SIPA, PORTAL, FUNDED, { logIndex: 2 }),
    transfer(PORTAL, BOB, 1n, { logIndex: 3 }),
    portalEvent,
    sweep(1, { logIndex: 5 }),
  ]
}

function deposit(
  receipt: Log[],
  portalEvent: Log,
  senderKind: DepositSenderKind,
): ZkMoneyDeposit {
  const located = locateDeposit(receipt, portalEvent, DEPOSIT_PAYOUT_PARAMS)
  assert(located, 'Fixture deposit must be locatable')
  return { ...located, senderKind }
}
