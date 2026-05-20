import { Address32 } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import { InMemoryEventDb } from '../../engine/capture/InMemoryEventDb'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import {
  CCIPPlugin,
  CCIPSendRequested,
  ExecutionStateChanged,
} from './ccip.plugin'

describe(CCIPPlugin.name, () => {
  it('defers destination-only one-sided transfers to CCTP when marked from same-tx logs', () => {
    const db = new InMemoryEventDb()
    const token = Address32.from('0x1111111111111111111111111111111111111111')
    const ccipEvent = ExecutionStateChanged.mock({
      messageId: `0x${'11'.repeat(32)}`,
      state: 2,
      $srcChain: 'Unknown_solana',
      dstTokens: [
        { address: token, amount: 1n, wasMinted: true, isCctpBacked: true },
      ],
    })
    ccipEvent.ctx = {
      chain: 'base',
      timestamp: 123,
      logIndex: 46,
      txHash: '0xabc',
    }

    const plugin = new CCIPPlugin(mockObject<InteropConfigStore>(), ['solana'])

    expect(plugin.match(ccipEvent, db)).toEqual([])
  })

  it('keeps destination-only one-sided transfers when not marked as CCTP-backed', () => {
    const db = new InMemoryEventDb()
    const token = Address32.from('0x1111111111111111111111111111111111111111')
    const ccipEvent = ExecutionStateChanged.mock({
      messageId: `0x${'11'.repeat(32)}`,
      state: 2,
      $srcChain: 'Unknown_solana',
      dstTokens: [{ address: token, amount: 1n, wasMinted: true }],
    })
    ccipEvent.ctx = {
      chain: 'base',
      timestamp: 123,
      logIndex: 46,
      txHash: '0xabc',
    }

    const plugin = new CCIPPlugin(mockObject<InteropConfigStore>(), ['solana'])
    const result = plugin.match(ccipEvent, db)

    expect(result?.length).toEqual(1)
    expect(result?.[0]?.kind).toEqual('InteropTransfer')
    if (result?.[0]?.kind === 'InteropTransfer') {
      expect(result[0].type).toEqual('ccip.Transfer')
    }
  })

  it('defers source-only one-sided transfers to CCTP when marked from same-tx logs', () => {
    const db = new InMemoryEventDb()
    const token = Address32.from('0x1111111111111111111111111111111111111111')
    const ccipEvent = CCIPSendRequested.mock({
      messageId: `0x${'11'.repeat(32)}`,
      $dstChain: 'Unknown_solana',
      token,
      amount: 1n,
      index: 0,
      wasBurned: true,
      isCctpBacked: true,
    })
    ccipEvent.ctx = {
      chain: 'base',
      timestamp: 123,
      logIndex: 46,
      txHash: '0xabc',
    }

    const plugin = new CCIPPlugin(mockObject<InteropConfigStore>(), ['solana'])

    expect(plugin.match(ccipEvent, db)).toEqual(undefined)
  })

  it('defers two-sided token transfers to CCTP when the destination is marked from same-tx logs', () => {
    const db = new InMemoryEventDb()
    const token = Address32.from('0x1111111111111111111111111111111111111111')
    const sendEvent = CCIPSendRequested.mock({
      messageId: `0x${'11'.repeat(32)}`,
      $dstChain: 'base',
      token,
      amount: 1n,
      index: 0,
      wasBurned: true,
    })
    sendEvent.ctx = {
      chain: 'solana',
      timestamp: 123,
      logIndex: 10,
      txHash: '0xabc',
    }
    db.addEvent(sendEvent)

    const receiveEvent = ExecutionStateChanged.mock({
      messageId: `0x${'11'.repeat(32)}`,
      state: 2,
      $srcChain: 'Unknown_solana',
      dstTokens: [
        { address: token, amount: 1n, wasMinted: true, isCctpBacked: true },
      ],
    })
    receiveEvent.ctx = {
      chain: 'base',
      timestamp: 456,
      logIndex: 46,
      txHash: '0xdef',
    }

    const plugin = new CCIPPlugin(mockObject<InteropConfigStore>(), ['solana'])
    const result = plugin.match(receiveEvent, db)

    expect(result?.map((x) => x.kind)).toEqual(['InteropMessage'])
    expect(result?.[0]?.kind === 'InteropMessage' && result[0].type).toEqual(
      'ccip.Message',
    )
  })
})
