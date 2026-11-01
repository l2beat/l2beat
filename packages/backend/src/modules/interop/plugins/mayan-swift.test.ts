import { Logger } from '@l2beat/backend-tools'
import { expect, mockObject } from 'earl'
import { InMemoryEventDb } from '../engine/capture/InMemoryEventDb'
import { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { match } from '../engine/match/InteropMatchingLoop'
import type { TokenMap } from '../engine/match/TokenMap'
import {
  MayanSwiftPlugin,
  OrderCreated,
  OrderRefunded,
  OrderUnlocked,
} from './mayan-swift'
import type { InteropEvent } from './types'

const KEY = `0x${'11'.repeat(32)}`

describe(MayanSwiftPlugin.name, () => {
  it('counts an order to a one-sided chain once the source chain unlocks it', async () => {
    const db = new InMemoryEventDb()
    const created = onBase(
      OrderCreated.mock({ key: KEY, $dstChain: 'solana', amountIn: 100n }),
      100,
      '0x01',
    )
    db.addEvent(created)

    const beforeUnlock = await matchOnce(db)
    expect(beforeUnlock.transfers).toEqual([])
    expect(beforeUnlock.unsupported).toEqual([])

    const unlocked = onBase(
      OrderUnlocked.mock({ key: KEY, $srcChain: 'solana' }),
      900,
      '0x02',
    )
    db.addEvent(unlocked)

    const afterUnlock = await matchOnce(db)
    expect(afterUnlock.transfers.length).toEqual(1)
    const transfer = afterUnlock.transfers[0]
    expect(transfer.src.event).toEqual(created)
    expect(transfer.src.tokenAmount).toEqual(100n)
    expect(transfer.dst.chain).toEqual('solana')
    expect(transfer.events).toEqual([created, unlocked])
    expect(transfer.timestamp).toEqual(900)
  })

  it('never counts a refunded order to a one-sided chain', async () => {
    const db = new InMemoryEventDb()
    db.addEvent(
      onBase(
        OrderCreated.mock({ key: KEY, $dstChain: 'solana', amountIn: 100n }),
        100,
        '0x01',
      ),
    )
    expect((await matchOnce(db)).transfers).toEqual([])

    db.addEvent(
      onBase(
        OrderRefunded.mock({ key: KEY, refundedAmount: 100n }),
        900,
        '0x02',
      ),
    )

    const afterRefund = await matchOnce(db)
    expect(afterRefund.transfers).toEqual([])
    expect(afterRefund.messages.map((m) => m.app)).toEqual([
      'mayan-swift-refund',
    ])
  })
})

function onBase<T>(event: InteropEvent<T>, timestamp: number, txHash: string) {
  event.ctx = { chain: 'base', logIndex: 0, timestamp, txHash }
  return event
}

function matchOnce(db: InMemoryEventDb) {
  return match(
    db,
    (type) => db.getEvents(type),
    db.getEventTypes(),
    db.getEventCount(),
    [new MayanSwiftPlugin(new InteropConfigStore(undefined), ['solana'])],
    ['base'],
    ['solana'],
    Logger.SILENT,
    mockObject<TokenMap>({}),
  )
}
