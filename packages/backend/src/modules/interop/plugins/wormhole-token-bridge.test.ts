import { Address32, type Block, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { Log } from 'viem'
import type { InteropTransaction } from '../dto/interopTransaction'
import { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { WormholeConfig } from './wormhole/wormhole.config'
import { WormholeTokenBridgePlugin } from './wormhole-token-bridge'

describe(WormholeTokenBridgePlugin.name, () => {
  describe('capture', () => {
    it('reads the token past EIP-7708 logs when the bridge unwraps WETH', async () => {
      const configs = new InteropConfigStore(undefined)
      await configs.set(WormholeConfig, [
        { chain: 'ethereum', wormholeChainId: 2, tokenBridge: TOKEN_BRIDGE },
        { chain: 'base', wormholeChainId: 30 },
      ])
      const plugin = new WormholeTokenBridgePlugin(configs)

      // completeTransferAndUnwrapETH emits TransferRedeemed, then calls
      // WETH.withdraw (ETH to the bridge, then Withdrawal) and pays out ETH.
      const txLogs = [
        log(TOKEN_BRIDGE, TRANSFER_REDEEMED_TOPICS, '0x', 10),
        ethTransferLog(WETH, TOKEN_BRIDGE, 11),
        log(WETH, [WITHDRAWAL_TOPIC, pad(TOKEN_BRIDGE)], AMOUNT_DATA, 12),
        ethTransferLog(TOKEN_BRIDGE, RECIPIENT, 13),
      ]

      const events = plugin.capture({
        log: txLogs[0],
        txLogs,
        tx: { hash: TX_HASH } as InteropTransaction,
        block: { timestamp: 1_793_190_588 } as Block,
        chain: 'ethereum',
      })

      expect(events?.[0]?.args).toEqual(
        expect.subset({ dstTokenAddress: Address32.from(WETH) }),
      )
    })
  })
})

const TX_HASH = `0x${'11'.repeat(32)}`
const TOKEN_BRIDGE = EthereumAddress(
  '0x3ee18b2214aaf7ce1d01e8f5a3b4ebf3eac1f0d4',
)
const WETH = EthereumAddress('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
const RECIPIENT = EthereumAddress('0xeea3304dd7a7292c7087a28a4db25a628b2c6afb')
const BASE_TOKEN_BRIDGE = EthereumAddress(
  '0x8d2de8d2f73f1f4cab472ac9a881c9b123c79627',
)

const TRANSFER_REDEEMED_TOPICS = [
  '0xcaf280c8cfeba144da67230d9b009c8f868a75bac9a528fa0474be1ba317c169',
  `0x${(30).toString(16).padStart(64, '0')}`,
  pad(BASE_TOKEN_BRIDGE),
  `0x${(1234).toString(16).padStart(64, '0')}`,
]
const TRANSFER_TOPIC =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const WITHDRAWAL_TOPIC =
  '0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65'
const AMOUNT_DATA = `0x${(10n ** 17n).toString(16).padStart(64, '0')}`

function ethTransferLog(
  from: EthereumAddress,
  to: EthereumAddress,
  logIndex: number,
): Log {
  return log(
    '0xfffffffffffffffffffffffffffffffffffffffe',
    [TRANSFER_TOPIC, pad(from), pad(to)],
    AMOUNT_DATA,
    logIndex,
  )
}

function log(
  address: string,
  topics: string[],
  data: string,
  logIndex: number,
): Log {
  return {
    address,
    topics,
    data,
    logIndex,
    transactionHash: TX_HASH,
  } as unknown as Log
}

function pad(address: EthereumAddress): string {
  return `0x${address.slice(2).toLowerCase().padStart(64, '0')}`
}
