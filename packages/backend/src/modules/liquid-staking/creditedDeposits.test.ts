import { expect, mockFn } from 'earl'
import { utils } from 'ethers'
import {
  type DepositsRpc,
  decodeDeposit,
  readCreditedDeposits,
} from './creditedDeposits'

const ETH = 10n ** 18n

describe(decodeDeposit.name, () => {
  it('reads the little-endian gwei amount as wei, and the index', () => {
    expect(decodeDeposit(depositLog(32_000_000_000n, 1_639_287))).toEqual({
      amount: 32n * ETH,
      index: 1_639_287,
    })
  })
})

describe(readCreditedDeposits.name, () => {
  const blocks = { previousDayFrom: 1, from: 100, to: 199 }
  const deposits = (byBlock: Record<number, [number, number][]>) =>
    mockFn(async (from: number) =>
      (byBlock[from] ?? []).map(([eth, index]) =>
        depositLog(BigInt(eth) * 10n ** 9n, index),
      ),
    )

  it('takes the queued deposits the counter moved over, made today or yesterday', async () => {
    const getLogs = deposits({
      1: [
        [32, 9],
        [1, 10],
        [31, 11],
      ],
      100: [
        [32, 12],
        [32, 13],
      ],
    })

    const credited = await readCreditedDeposits(
      { getLogs } as unknown as DepositsRpc,
      blocks,
      { start: 10, end: 13 },
    )

    expect(credited).toEqual(64n * ETH)
    expect(getLogs.calls.map((c) => c.args.slice(0, 2))).toEqual([
      [100, 199],
      [1, 99],
    ])
  })

  it("takes the day's deposits from Electra on, as they skip the queue", async () => {
    const getLogs = deposits({
      100: [
        [32, 2_045_200],
        [2048, 2_045_201],
      ],
    })

    const credited = await readCreditedDeposits(
      { getLogs } as unknown as DepositsRpc,
      blocks,
      { start: 2_045_126, end: 2_045_126 },
    )

    expect(credited).toEqual(2080n * ETH)
    expect(getLogs).toHaveBeenCalledTimes(1)
  })

  it('fails when a queued deposit is missing', async () => {
    const getLogs = deposits({ 100: [[32, 12]] })

    await expect(
      readCreditedDeposits({ getLogs } as unknown as DepositsRpc, blocks, {
        start: 10,
        end: 13,
      }),
    ).toBeRejectedWith('Credited deposits not found')
  })
})

function depositLog(gwei: bigint, index = 0) {
  const iface = new utils.Interface([
    'event DepositEvent(bytes pubkey, bytes withdrawal_credentials, bytes amount, bytes signature, bytes index)',
  ])
  const amount = Buffer.alloc(8)
  amount.writeBigUInt64LE(gwei)
  const indexBytes = Buffer.alloc(8)
  indexBytes.writeBigUInt64LE(BigInt(index))
  return iface.encodeEventLog(iface.getEvent('DepositEvent'), [
    `0x${'11'.repeat(48)}`,
    `0x${'22'.repeat(32)}`,
    `0x${amount.toString('hex')}`,
    `0x${'33'.repeat(96)}`,
    `0x${indexBytes.toString('hex')}`,
  ])
}
