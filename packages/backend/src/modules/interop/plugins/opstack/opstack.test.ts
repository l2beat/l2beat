import { Address32 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { utils } from 'ethers'
import type { Log } from 'viem'
import type { InteropEvent, LogToCapture, TxToCapture } from '../types'
import {
  OpStackPlugin,
  PortalDepositFinalized,
  TransactionDeposited,
} from './opstack'

describe(OpStackPlugin.name, () => {
  describe(OpStackPlugin.prototype.getDataRequests.name, () => {
    it('declares a derived tx request for portal deposits', () => {
      const plugin = new OpStackPlugin()

      const derivedRequest = plugin
        .getDataRequests()
        .find(
          (request) =>
            request.type === 'txFromEvent' &&
            request.creatorEvent === TransactionDeposited,
        )

      expect(derivedRequest).not.toEqual(undefined)
      if (!derivedRequest || derivedRequest.type !== 'txFromEvent') {
        return
      }

      expect(derivedRequest.txHashArg).toEqual('l2TxHash')
      expect(derivedRequest.chainArg).toEqual('chain')
    })
  })

  describe(OpStackPlugin.prototype.capture.name, () => {
    it('captures a portal deposit event with the derived Base tx hash', () => {
      const plugin = new OpStackPlugin()

      const captured = plugin.capture(makePortalDepositCapture())

      expect(captured).not.toEqual(undefined)
      if (!captured) {
        return
      }

      expect(captured).toHaveLength(1)
      const event = { ...captured[0], plugin: 'opstack' }
      expect(TransactionDeposited.checkType(event)).toEqual(true)
      if (!TransactionDeposited.checkType(event)) {
        return
      }

      expect(event.type).toEqual(TransactionDeposited.type)
      expect(event.args.chain).toEqual('base')
      expect(event.args.from).toEqual(Address32.from(WORKED_EXAMPLE.from))
      expect(event.args.to).toEqual(Address32.from(WORKED_EXAMPLE.to))
      expect(event.args.sourceHash).toEqual(WORKED_EXAMPLE.sourceHash)
      expect(event.args.l2TxHash).toEqual(WORKED_EXAMPLE.l2TxHash)
      expect(event.args.value).toEqual(82180496084697442374n)
    })
  })

  describe(OpStackPlugin.prototype.captureTx.name, () => {
    it('captures the derived Base deposit tx using the creator event context', () => {
      const plugin = new OpStackPlugin()
      const creatorEvent = getCreatorEvent(plugin)

      const captured = plugin.captureTx(makeDerivedTxCapture(), [creatorEvent])

      expect(captured).not.toEqual(undefined)
      if (!captured) {
        return
      }

      expect(captured).toHaveLength(1)
      const event = { ...captured[0], plugin: 'opstack' }
      expect(PortalDepositFinalized.checkType(event)).toEqual(true)
      if (!PortalDepositFinalized.checkType(event)) {
        return
      }

      expect(event.args.chain).toEqual('base')
      expect(event.args.sourceHash).toEqual(WORKED_EXAMPLE.sourceHash)
      expect(event.args.value).toEqual(82180496084697442374n)
      expect(event.ctx.chain).toEqual('base')
      expect(event.ctx.txHash).toEqual(WORKED_EXAMPLE.l2TxHash)
    })
  })
})

const transactionDepositedInterface = new utils.Interface([
  'event TransactionDeposited(address indexed from, address indexed to, uint256 indexed version, bytes opaqueData)',
])

const WORKED_EXAMPLE = {
  sourceTxHash:
    '0x7c76adb9ebe70dfdb57f495c7172b308879f87416ebcc9f2e0438d7fe86a1bee',
  l2TxHash:
    '0x95e44b32a03c8e146a9b4a70b3934b4efb48f3f2188e4304dc6e66f52ce4d8b8',
  sourceHash:
    '0xb613781250a490c408694b600c1443b4b0f12e13792551b9aa12703dfb17f879',
  blockHash:
    '0x55102b6e8f5ceb9803bfd78b9ec84ffd3e34156c821b7690f4c2b045a9696944',
  logIndex: 514,
  from: '0xf70da97812CB96acDF810712Aa562db8dfA3dbEF',
  to: '0xf70da97812CB96acDF810712Aa562db8dfA3dbEF',
  opaqueData:
    '0x000000000000000000000000000000000000000000000004747bc5c731c56846000000000000000000000000000000000000000000000004747bc5c731c5684600000000000186a000',
} as const

function makePortalDepositCapture(): LogToCapture {
  const encoded = transactionDepositedInterface.encodeEventLog(
    transactionDepositedInterface.getEvent('TransactionDeposited'),
    [WORKED_EXAMPLE.from, WORKED_EXAMPLE.to, 0, WORKED_EXAMPLE.opaqueData],
  )

  const log: Log = {
    address: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e',
    topics: encoded.topics as [`0x${string}`, ...`0x${string}`[]],
    data: encoded.data as `0x${string}`,
    blockNumber: 1n,
    blockHash: WORKED_EXAMPLE.blockHash,
    transactionHash: WORKED_EXAMPLE.sourceTxHash,
    logIndex: WORKED_EXAMPLE.logIndex,
    transactionIndex: 0,
    removed: false,
  }

  return {
    log,
    txLogs: [log],
    tx: {
      hash: WORKED_EXAMPLE.sourceTxHash,
    },
    block: {
      number: 1,
      hash: WORKED_EXAMPLE.blockHash,
      logsBloom: '0x',
      timestamp: 1,
      transactions: [{ hash: WORKED_EXAMPLE.sourceTxHash }],
    },
    chain: 'ethereum',
  }
}

function getCreatorEvent(plugin: OpStackPlugin): InteropEvent {
  const captured = plugin.capture(makePortalDepositCapture())
  if (!captured) {
    throw new Error('Expected creator event to be captured')
  }
  return { ...captured[0], plugin: 'opstack' }
}

function makeDerivedTxCapture(): TxToCapture {
  return {
    txLogs: [],
    tx: {
      hash: WORKED_EXAMPLE.l2TxHash,
    },
    block: {
      number: 1,
      hash: '0x',
      logsBloom: '0x',
      timestamp: 1,
      transactions: [{ hash: WORKED_EXAMPLE.l2TxHash }],
    },
    chain: 'base',
  }
}
