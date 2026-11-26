import { type Block, EthereumAddress, type Log } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { GasZipPlugin } from '../../plugins/gaszip/gaszip.plugin'
import { InteropConfigStore } from '../config/InteropConfigStore'
import { getItemsToCapture } from './getItemsToCapture'

describe(getItemsToCapture.name, () => {
  it('groups logs by transaction in block order and skips unmatched items', () => {
    const block = makeBlock([
      { hash: '0xa' },
      { hash: undefined },
      { hash: '0xb' },
      { hash: '0xc' },
    ])
    const logs = [
      makeLog('0xb', 0),
      makeLog('0xa', 1),
      makeLog('0xb', 2),
      makeLog('0xunknown', 3),
    ]

    const { txsToCapture, logsToCapture } = getItemsToCapture(
      'ethereum',
      block,
      logs,
    )

    expect(txsToCapture.map((t) => t.tx.hash)).toEqual(['0xa', '0xb', '0xc'])
    expect(txsToCapture.map((t) => t.txLogs.map((l) => l.logIndex))).toEqual([
      [1],
      [0, 2],
      [],
    ])
    expect(logsToCapture.map((l) => [l.tx.hash, l.log.logIndex])).toEqual([
      ['0xa', 1],
      ['0xb', 0],
      ['0xb', 2],
    ])
    expect(logsToCapture[0]?.txLogs).toEqual(txsToCapture[0]?.txLogs)
    expect(logsToCapture[0]?.block).toEqual(block)
    expect(logsToCapture[0]?.chain).toEqual('ethereum')
  })

  it('shares the prepared items for the same block and logs objects', () => {
    const block = makeBlock([{ hash: '0xa' }])
    const logs = [makeLog('0xa', 0)]

    const first = getItemsToCapture('ethereum', block, logs)
    const again = getItemsToCapture('ethereum', block, logs)
    const otherLogs = getItemsToCapture('ethereum', block, [...logs])
    const otherChain = getItemsToCapture('base', block, logs)
    const otherBlock = getItemsToCapture(
      'ethereum',
      makeBlock([{ hash: '0xa' }]),
      logs,
    )

    expect(again).toExactlyEqual(first)
    expect(otherLogs).not.toExactlyEqual(first)
    expect(otherChain).not.toExactlyEqual(first)
    expect(otherBlock).not.toExactlyEqual(first)
    expect(otherLogs).toEqual(first)
  })

  it('checksums addresses the RPC sends lowercase', () => {
    const depositEoa = '0x391e7c679d29bd940d63be94ad22a25d25b5a604'
    const block = makeBlock([
      { hash: '0xa', to: depositEoa, data: '0x010037', value: 1n },
    ])
    const logs = [{ ...makeLog('0xa', 0), address: depositEoa }]

    const { txsToCapture, logsToCapture } = getItemsToCapture(
      'ethereum',
      block,
      logs,
    )

    expect(logsToCapture[0]?.log.address).toEqual(
      EthereumAddress(depositEoa) as `0x${string}`,
    )
    const plugin = new GasZipPlugin(new InteropConfigStore(undefined))
    expect(plugin.captureTx(txsToCapture[0]!)?.length).toEqual(1)
  })
})

function makeBlock(transactions: Block['transactions']): Block {
  return {
    number: 100,
    hash: '0xblock',
    logsBloom: '0x',
    timestamp: 1_000,
    transactions: transactions.map((tx) => ({
      from: '0x0000000000000000000000000000000000000001',
      to: '0x0000000000000000000000000000000000000002',
      data: '0x',
      type: '0x2',
      value: 0n,
      ...tx,
    })),
  }
}

function makeLog(transactionHash: string, logIndex: number): Log {
  return {
    address: '0x0000000000000000000000000000000000000003',
    topics: ['0x01'],
    data: '0x',
    blockNumber: 100,
    blockHash: '0xblock',
    transactionHash,
    logIndex,
  }
}
