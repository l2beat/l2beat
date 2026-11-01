import { Address32 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { InMemoryEventDb } from '../engine/capture/InMemoryEventDb'
import { findMayanForwardedForSend, MayanForwarded } from './mayan-forwarder'
import { createInteropEventType } from './types'

describe(findMayanForwardedForSend.name, () => {
  const Send = createInteropEventType<{ $dstChain: string }>('test.Send')
  const ctx = (logIndex: number) => ({
    chain: 'ethereum',
    txHash: '0xabc',
    timestamp: 0,
    logIndex,
  })
  const send = (logIndex: number, $dstChain: string) => ({
    ...Send.mock({ $dstChain }),
    ctx: ctx(logIndex),
  })
  const forwarded = (logIndex: number, $dstChain: string) => ({
    ...MayanForwarded.mock({
      methodSignature: '0x12345678',
      tokenIn: Address32.NATIVE,
      $dstChain,
    }),
    ctx: ctx(logIndex),
  })

  it('takes only a forwarder before the next send', () => {
    const db = new InMemoryEventDb()
    const first = send(1, 'solana')
    const second = send(3, 'solana')
    const own = forwarded(4, 'solana')
    for (const event of [first, second, own]) db.addEvent(event)

    expect(
      findMayanForwardedForSend(db, first, second, 'solana', () => true),
    ).toEqual(undefined)
    expect(
      findMayanForwardedForSend(db, second, undefined, 'solana', () => true),
    ).toEqual(own)
  })

  it('skips a forwarder to another chain', () => {
    const db = new InMemoryEventDb()
    const first = send(1, 'solana')
    const other = forwarded(2, 'sui')
    for (const event of [first, other]) db.addEvent(event)

    expect(
      findMayanForwardedForSend(db, first, undefined, 'solana', () => true),
    ).toEqual(undefined)
  })
})
