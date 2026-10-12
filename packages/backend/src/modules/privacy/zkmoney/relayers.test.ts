import { expect } from 'earl'
import { ReceiptLogCache } from '../utils/ReceiptLogCache'
import { extractZkMoneyWithdrawalRelayer } from './relayers'
import {
  ALICE,
  BOB,
  mockZkMoneyRpc,
  OPERATION_EXECUTOR,
  PORTAL,
  SIPA,
  transfer,
  USDC,
  WITHDRAWAL_EXECUTOR,
  WITHDRAWAL_RELAYER_PARAMS,
  withdrawal,
} from './test/fixtures'

describe(extractZkMoneyWithdrawalRelayer.name, () => {
  const portalEvent = withdrawal(1, { logIndex: 3 })

  it('counts a paid withdrawal finalized by another address', async () => {
    const rpc = mockZkMoneyRpc({
      receipt: [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 1 }),
        transfer(WITHDRAWAL_EXECUTOR, BOB, 10n, { logIndex: 2 }),
        portalEvent,
      ],
    })

    expect(await extract(portalEvent, rpc)).toEqual({
      relayerAddress: BOB,
    })
  })

  it('excludes a recipient collecting its own tip even when someone else submits', async () => {
    const rpc = mockZkMoneyRpc({
      receipt: [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 1 }),
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 10n, { logIndex: 2 }),
        portalEvent,
      ],
    })

    expect(await extract(portalEvent, rpc)).toEqual(undefined)
  })

  it('excludes a recipient submitting its own withdrawal even when the tip goes elsewhere', async () => {
    const rpc = mockZkMoneyRpc({
      submitter: ALICE,
      receipt: [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 1 }),
        transfer(WITHDRAWAL_EXECUTOR, BOB, 10n, { logIndex: 2 }),
        portalEvent,
      ],
    })

    expect(await extract(portalEvent, rpc)).toEqual(undefined)
  })

  it('recognizes self-finalization through fee forwarding', async () => {
    const rpc = mockZkMoneyRpc({
      target: OPERATION_EXECUTOR,
      receipt: [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 1 }),
        transfer(WITHDRAWAL_EXECUTOR, OPERATION_EXECUTOR, 10n, { logIndex: 2 }),
        portalEvent,
        transfer(OPERATION_EXECUTOR, ALICE, 15n, { logIndex: 4 }),
      ],
    })

    expect(await extract(portalEvent, rpc)).toEqual(undefined)
  })

  it('counts a tip forwarded to another address, including subsidies', async () => {
    const rpc = mockZkMoneyRpc({
      target: OPERATION_EXECUTOR,
      receipt: [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 1 }),
        transfer(WITHDRAWAL_EXECUTOR, OPERATION_EXECUTOR, 10n, { logIndex: 2 }),
        portalEvent,
        transfer(OPERATION_EXECUTOR, BOB, 15n, { logIndex: 4 }),
      ],
    })

    expect(await extract(portalEvent, rpc)).toEqual({
      relayerAddress: BOB,
    })
  })

  it('counts a zero-tip withdrawal sent directly to the portal by another address', async () => {
    const rpc = mockZkMoneyRpc({
      receipt: [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 100n, { logIndex: 1 }),
        portalEvent,
      ],
    })

    expect(await extract(portalEvent, rpc)).toEqual({
      relayerAddress: BOB,
    })
  })

  it('excludes a recipient sending its own zero-tip withdrawal', async () => {
    const rpc = mockZkMoneyRpc({
      submitter: ALICE,
      receipt: [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 100n, { logIndex: 1 }),
        portalEvent,
      ],
    })

    expect(await extract(portalEvent, rpc)).toEqual(undefined)
  })

  it('leaves a zero-tip withdrawal through an unknown helper unattributed', async () => {
    const rpc = mockZkMoneyRpc({
      target: SIPA,
      receipt: [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 100n, { logIndex: 1 }),
        portalEvent,
      ],
    })

    expect(await extract(portalEvent, rpc)).toEqual(undefined)
  })

  it('leaves ambiguous forwarding unattributed instead of falling back to the sender', async () => {
    const rpc = mockZkMoneyRpc({
      receipt: [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 1 }),
        transfer(WITHDRAWAL_EXECUTOR, OPERATION_EXECUTOR, 10n, { logIndex: 2 }),
        portalEvent,
        transfer(OPERATION_EXECUTOR, ALICE, 10n, { logIndex: 4 }),
        transfer(OPERATION_EXECUTOR, BOB, 10n, { logIndex: 5 }),
      ],
    })

    expect(await extract(portalEvent, rpc)).toEqual(undefined)
  })

  it('ignores unsupported withdrawal executors', async () => {
    const custom = withdrawal(1, { logIndex: 3 }, SIPA)
    const rpc = mockZkMoneyRpc({ receipt: [custom] })

    expect(await extract(custom, rpc)).toEqual(undefined)
    expect(rpc.getTransaction).not.toHaveBeenCalled()
  })

  it('ignores a tip emitted by another token', async () => {
    const rpc = mockZkMoneyRpc({
      receipt: [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 1 }),
        transfer(WITHDRAWAL_EXECUTOR, BOB, 10n, { logIndex: 2 }, USDC),
        portalEvent,
      ],
    })

    expect(await extract(portalEvent, rpc)).toEqual(undefined)
  })

  it('rejects transfers that do not account for the portal execution amount', async () => {
    const rpc = mockZkMoneyRpc({
      receipt: [
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 1 }),
        transfer(WITHDRAWAL_EXECUTOR, BOB, 11n, { logIndex: 2 }),
        portalEvent,
      ],
    })

    expect(await extract(portalEvent, rpc)).toEqual(undefined)
  })

  it('excludes each refund flow without fetching a receipt', async () => {
    const rpc = mockZkMoneyRpc({})
    for (const flow of [1, 2, 3]) {
      const refund = withdrawal(1, { logIndex: 3 }, WITHDRAWAL_EXECUTOR, flow)
      expect(await extract(refund, rpc)).toEqual(undefined)
    }
    expect(rpc.getTransactionReceipt).not.toHaveBeenCalled()
  })

  it('filters operations independently and fetches a batched transaction only once', async () => {
    const first = withdrawal(1, { logIndex: 3 })
    const second = withdrawal(2, { logIndex: 6 })
    const rpc = mockZkMoneyRpc({
      submitter: BOB,
      target: PORTAL,
      receipt: [
        transfer(WITHDRAWAL_EXECUTOR, BOB, 90n, { logIndex: 1 }),
        transfer(WITHDRAWAL_EXECUTOR, BOB, 10n, { logIndex: 2 }),
        first,
        transfer(WITHDRAWAL_EXECUTOR, ALICE, 90n, { logIndex: 4 }),
        transfer(WITHDRAWAL_EXECUTOR, BOB, 10n, { logIndex: 5 }),
        second,
      ],
    })
    const context = { rpc, receipts: new ReceiptLogCache(rpc) }

    const results = await Promise.all(
      [first, second].map((event) =>
        extractZkMoneyWithdrawalRelayer(
          event,
          WITHDRAWAL_RELAYER_PARAMS,
          context,
        ),
      ),
    )

    expect(results).toEqual([undefined, { relayerAddress: BOB }])
    expect(rpc.getTransactionReceipt).toHaveBeenCalledTimes(1)
    expect(rpc.getTransaction).toHaveBeenCalledTimes(1)
  })
})

function extract(
  event: ReturnType<typeof withdrawal>,
  rpc: ReturnType<typeof mockZkMoneyRpc>,
) {
  return extractZkMoneyWithdrawalRelayer(event, WITHDRAWAL_RELAYER_PARAMS, {
    rpc,
    receipts: new ReceiptLogCache(rpc),
  })
}
