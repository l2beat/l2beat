import type { IRpcClient } from '@l2beat/shared'
import { expect } from 'earl'
import { ReceiptLogCache } from '../utils/ReceiptLogCache'
import {
  findZkMoneyDepositFinalizer,
  findZkMoneyWithdrawalFinalizer,
} from './paidFinalizers'
import {
  ALICE,
  BOB,
  DEPOSIT_FEE,
  DEPOSIT_PAYOUT_PARAMS,
  FUNDED,
  mockZkMoneyRpc,
  PORTAL,
  portalDeposit,
  SIPA,
  sweep,
  transfer,
  WITHDRAWAL_EXECUTOR,
  WITHDRAWAL_PAYOUT_PARAMS,
  withdrawal,
} from './test/fixtures'

// Synthetic receipts encoded with the real ABIs; the RPC mock serves them and
// plays the SIPA factory. The pure payout rules are covered in payouts.test.ts,
// these tests cover the receipt and factory lookups around them.
describe(findZkMoneyDepositFinalizer.name, () => {
  const portalEvent = portalDeposit(1, { logIndex: 4 })
  const receipt = [
    transfer(SIPA, BOB, DEPOSIT_FEE, { logIndex: 1 }),
    transfer(SIPA, PORTAL, FUNDED, { logIndex: 2 }),
    transfer(PORTAL, BOB, 1n, { logIndex: 3 }),
    portalEvent,
    sweep(1, { logIndex: 5 }),
  ]

  it('credits the sweep fee recipient of a factory-authenticated SIPA', async () => {
    const finalizer = await findZkMoneyDepositFinalizer(
      portalEvent,
      DEPOSIT_PAYOUT_PARAMS,
      context(mockZkMoneyRpc({ receipt })),
    )

    expect(finalizer).toEqual(BOB)
  })

  it('ignores a sweep from a clone the factory does not vouch for', async () => {
    const finalizer = await findZkMoneyDepositFinalizer(
      portalEvent,
      DEPOSIT_PAYOUT_PARAMS,
      context(mockZkMoneyRpc({ receipt, intent: 0 })),
    )

    expect(finalizer).toEqual(undefined)
  })
})

describe(findZkMoneyWithdrawalFinalizer.name, () => {
  it('reads batched withdrawals from one receipt fetch', async () => {
    const first = withdrawal(1, { logIndex: 3 })
    const second = withdrawal(2, { logIndex: 6 })
    const rpc = mockZkMoneyRpc({
      receipt: [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 1 }),
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 10n, { logIndex: 2 }),
        first,
        transfer(WITHDRAWAL_EXECUTOR, BOB, 90n, { logIndex: 4 }),
        transfer(WITHDRAWAL_EXECUTOR, BOB, 10n, { logIndex: 5 }),
        second,
      ],
    })
    const shared = context(rpc)

    const finalizers = await Promise.all(
      [first, second].map((event) =>
        findZkMoneyWithdrawalFinalizer(event, WITHDRAWAL_PAYOUT_PARAMS, shared),
      ),
    )

    expect(finalizers).toEqual([ALICE, BOB])
    expect(rpc.getTransactionReceipt).toHaveBeenCalledTimes(1)
  })
})

function context(rpc: IRpcClient) {
  return { rpc, receipts: new ReceiptLogCache(rpc) }
}
