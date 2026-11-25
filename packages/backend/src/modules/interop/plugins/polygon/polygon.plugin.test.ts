import { Address32, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { InMemoryEventDb } from '../../engine/capture/InMemoryEventDb'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import type { InteropEvent } from '../types'
import { PolygonPlugin } from './polygon.plugin'

describe(PolygonPlugin.name, () => {
  describe('match', () => {
    it('matches the earliest of identical withdrawals', () => {
      const db = new InMemoryEventDb()
      db.addEvent(withdrawal('0xbb', 200))
      const earliest = withdrawal('0xaa', 100)
      db.addEvent(earliest)

      const result = new PolygonPlugin({
        get: () => undefined,
      } as unknown as InteropConfigStore).match(
        event(
          'polygon.WithdrawalFinalized',
          { matchId: MATCH_ID, rootToken: ROOT_TOKEN, recipient, amount: 1n },
          { chain: 'ethereum', txHash: '0xcc', timestamp: 300, logIndex: 0 },
        ),
        db,
      )

      const transfer = result?.find((r) => r.kind === 'InteropTransfer')
      expect(transfer?.src.event).toEqual(earliest)
    })
  })
})

const MATCH_ID = 'match'
const ROOT_TOKEN = Address32.NATIVE
const recipient = EthereumAddress('0x00000000000000000000000000000000000000aa')

function withdrawal(txHash: string, timestamp: UnixTime) {
  return event(
    'polygon.WithdrawalInitiated',
    { matchId: MATCH_ID, rootToken: ROOT_TOKEN, recipient, amount: 1n },
    { chain: 'polygonpos', txHash, timestamp, logIndex: 0 },
  )
}

function event(
  type: string,
  args: unknown,
  ctx: InteropEvent['ctx'],
): InteropEvent {
  return {
    plugin: 'polygon',
    eventId: `${type}:${ctx.txHash}`,
    type,
    expiresAt: UnixTime.now() + UnixTime.DAY,
    ctx,
    args,
  }
}
