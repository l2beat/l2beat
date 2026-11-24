import { Address32, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { InMemoryEventDb } from '../../engine/capture/InMemoryEventDb'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import type { InteropEvent } from '../types'
import { ZkStackPlugin } from './zkstack.plugin'

describe(ZkStackPlugin.name, () => {
  describe('match', () => {
    it('matches an L1 finalization only to a withdrawal from its own chain', () => {
      const db = new InMemoryEventDb()
      addWithdrawal(db, 'zksync2', '0xaa', 100)
      const abstractWithdrawal = addWithdrawal(db, 'abstract', '0xbb', 200)
      const finalization = bridgeMintL1(2741)

      const result = new ZkStackPlugin({} as InteropConfigStore).match(
        finalization,
        db,
      )

      const transfer = result?.find((r) => r.kind === 'InteropTransfer')
      expect(transfer?.src.event).toEqual(abstractWithdrawal)
    })

    it('does not match a withdrawal from another chain', () => {
      const db = new InMemoryEventDb()
      addWithdrawal(db, 'zksync2', '0xaa', 100)

      const result = new ZkStackPlugin({} as InteropConfigStore).match(
        bridgeMintL1(2741),
        db,
      )

      expect(result).toEqual(undefined)
    })
  })
})

const MATCH_ID = '0x1234'
const RECEIVER = EthereumAddress('0x00000000000000000000000000000000000000aa')

function addWithdrawal(
  db: InMemoryEventDb,
  chain: string,
  txHash: string,
  timestamp: UnixTime,
) {
  db.addEvent(
    event(
      'zkstack.L1MessageSent',
      { $dstChain: 'ethereum' },
      {
        chain,
        txHash,
        timestamp,
        logIndex: 1,
      },
    ),
  )
  const withdrawal = event(
    'zkstack.Withdrawal',
    {
      matchId: MATCH_ID,
      assetId: '0x01',
      receiver: RECEIVER,
      srcTokenAddress: Address32.NATIVE,
      srcAmount: 1n,
    },
    { chain, txHash, timestamp, logIndex: 2 },
  )
  db.addEvent(withdrawal)
  return withdrawal
}

function bridgeMintL1(chainId: number) {
  return event(
    'zkstack.BridgeMintL1',
    {
      matchId: MATCH_ID,
      chainId,
      assetId: '0x01',
      receiver: RECEIVER,
      dstAmount: 1n,
    },
    { chain: 'ethereum', txHash: '0xcc', timestamp: 300, logIndex: 0 },
  )
}

function event(
  type: string,
  args: unknown,
  ctx: InteropEvent['ctx'],
): InteropEvent {
  return {
    plugin: 'zkstack',
    eventId: `${type}:${ctx.chain}:${ctx.txHash}`,
    type,
    expiresAt: UnixTime.now() + UnixTime.DAY,
    ctx,
    args,
  }
}
