import { Address32, type Block } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { Log } from 'viem'
import type { InteropTransaction } from '../dto/interopTransaction'
import { AgglayerPlugin } from './agglayer'

describe(AgglayerPlugin.name, () => {
  describe('capture', () => {
    it('records a native ETH bridge as native when an EIP-7708 log precedes it', () => {
      const plugin = new AgglayerPlugin()

      const events = plugin.capture({
        log: BRIDGE_EVENT_LOG,
        txLogs: [ETH_TRANSFER_LOG, BRIDGE_EVENT_LOG],
        tx: { hash: TX_HASH } as InteropTransaction,
        block: { timestamp: 1_793_190_588 } as Block,
        chain: 'ethereum',
      })

      expect(events?.[0]?.args).toEqual(
        expect.subset({
          amount: 0x6ae1eab3n,
          srcTokenAddress: Address32.NATIVE,
          srcWasBurned: false,
        }),
      )
    })
  })
})

// Sepolia tx 0xa0eb36baed047fe80a23cac20c5d7257dda4a6af1b89652e34fa98069a05e3f1,
// a native ETH bridgeAsset after Glamsterdam.
const TX_HASH =
  '0xa0eb36baed047fe80a23cac20c5d7257dda4a6af1b89652e34fa98069a05e3f1'

const ETH_TRANSFER_LOG = {
  address: '0xfffffffffffffffffffffffffffffffffffffffe',
  topics: [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '0x000000000000000000000000eea3304dd7a7292c7087a28a4db25a628b2c6afb',
    '0x000000000000000000000000528e26b25a34a4a5d0dbda1d57d318153d2ed582',
  ],
  data: '0x000000000000000000000000000000000000000000000000000000006ae1eab3',
  transactionHash: TX_HASH,
  logIndex: 0xc6,
} as unknown as Log

// destinationNetwork changed from 69 (a Sepolia-only network) to 20 (Katana),
// so the mainnet network list resolves it.
const BRIDGE_EVENT_LOG = {
  address: '0x528e26b25a34a4a5d0dbda1d57d318153d2ed582',
  topics: [
    '0x501781209a1f8899323b96b4ef08b168df93e0a90c673d1e4cce39366cb62f9b',
  ],
  data: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000eea3304dd7a7292c7087a28a4db25a628b2c6afb000000000000000000000000000000000000000000000000000000006ae1eab3000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000350510000000000000000000000000000000000000000000000000000000000000000',
  transactionHash: TX_HASH,
  logIndex: 0xc7,
} as unknown as Log
