import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { iterateLogs } from './logScan'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'
import { findWormholeChain, WormholeConfig } from './wormhole/wormhole.config'
import { LogMessagePublished } from './wormhole/wormhole.plugin'

const transferRedeemedLog =
  'event TransferRedeemed(uint16 indexed emitterChainId, bytes32 indexed emitterAddress,uint64 indexed sequence)'

const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'

const parseLogTransferRedeemed = createEventParser(transferRedeemedLog)

const parseTransfer = createEventParser(transferLog)

const wethWithdrawalLog = 'event Withdrawal(address indexed src, uint256 wad)'

const parseWethWithdrawal = createEventParser(wethWithdrawalLog)

const ZERO_ADDRESS = EthereumAddress(
  '0x0000000000000000000000000000000000000000',
)

export const TransferRedeemed = createInteropEventType<{
  sequence: bigint
  $srcChain: string
  srcWormholeChainId: number
  sender: EthereumAddress
  dstTokenAddress?: Address32 | undefined
  dstAmount?: bigint | undefined
  dstWasMinted?: boolean | undefined
}>('wormhole.LogTransferRedeemed')

export class WormholeTokenBridgePlugin implements InteropPluginResyncable {
  readonly name = 'wormhole-token-bridge'

  constructor(
    private configs: InteropConfigStore,
    private oneSidedChains: string[] = [],
  ) {}

  getDataRequests(): DataRequest[] {
    const networks = this.configs.get(WormholeConfig) ?? []
    const tokenBridgeAddresses: ChainSpecificAddress[] = []
    for (const network of networks) {
      if (!network.tokenBridge || this.oneSidedChains.includes(network.chain)) {
        continue
      }
      try {
        tokenBridgeAddresses.push(
          ChainSpecificAddress.fromLong(network.chain, network.tokenBridge),
        )
      } catch {
        // Chain not supported by ChainSpecificAddress, skip
      }
    }

    return [
      {
        type: 'event',
        signature: transferRedeemedLog,
        includeTxEvents: [transferLog, wethWithdrawalLog],
        addresses: tokenBridgeAddresses,
      },
    ]
  }

  capture(input: LogToCapture) {
    const wormholeNetworks = this.configs.get(WormholeConfig)
    if (!wormholeNetworks) return

    // Only capture from known tokenBridge addresses.
    // Portal Token Bridge Relayer contracts also emit TransferRedeemed with
    // the same (emitterChainId, emitterAddress, sequence), causing duplicates.
    const network = wormholeNetworks.find((n) => n.chain === input.chain)
    if (!network?.tokenBridge) return
    const parsed = parseLogTransferRedeemed(input.log, [network.tokenBridge])
    if (!parsed) return
    const redeemed = findRedeemedTokens(input, network.tokenBridge)

    const senderAddress = EthereumAddress(
      `0x${parsed.emitterAddress.slice(-40)}`,
    )

    return [
      TransferRedeemed.create(input, {
        sequence: parsed.sequence,
        $srcChain: findWormholeChain(wormholeNetworks, parsed.emitterChainId),
        dstTokenAddress: redeemed?.tokenAddress,
        dstAmount: redeemed?.amount,
        srcWormholeChainId: parsed.emitterChainId,
        sender: senderAddress,
        dstWasMinted: redeemed?.wasMinted,
      }),
    ]
  }

  matchTypes = [TransferRedeemed, LogMessagePublished]
  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (TransferRedeemed.checkType(event)) {
      const logMessagePublished = db.find(LogMessagePublished, {
        sequence: event.args.sequence,
        wormholeChainId: event.args.srcWormholeChainId,
        sender: event.args.sender,
      })
      if (!logMessagePublished) {
        const srcChain = event.args.$srcChain
        if (!this.oneSidedChains.includes(srcChain)) return

        return [
          Result.Transfer('wormhole-tokenbridge.Transfer', {
            srcChain,
            dstEvent: event,
            dstTokenAddress: event.args.dstTokenAddress,
            dstAmount: event.args.dstAmount,
            dstWasMinted: event.args.dstWasMinted,
            bridgeType: 'lockAndMint',
          }),
        ]
      }

      const tokenChain = extractTokenChain(logMessagePublished.args.payload)
      const srcWasBurned =
        tokenChain !== undefined
          ? tokenChain !== logMessagePublished.args.wormholeChainId
          : undefined

      return [
        Result.Message('wormhole.Message', {
          app: 'wormhole-tokenbridge',
          srcEvent: logMessagePublished,
          dstEvent: event,
        }),
        Result.Transfer('wormhole-tokenbridge.Transfer', {
          srcEvent: logMessagePublished,
          dstEvent: event,
          srcTokenAddress: logMessagePublished.args.srcTokenAddress,
          srcAmount: logMessagePublished.args.srcAmount,
          dstTokenAddress: event.args.dstTokenAddress,
          dstAmount: event.args.dstAmount,
          srcWasBurned,
          dstWasMinted: event.args.dstWasMinted,
        }),
      ]
    }

    if (LogMessagePublished.checkType(event)) {
      const networks = this.configs.get(WormholeConfig) ?? []
      const network = networks.find((n) => n.chain === event.ctx.chain)
      if (!network?.tokenBridge || event.args.sender !== network.tokenBridge) {
        return
      }

      const dstChain = event.args.$dstChain
      if (!dstChain || !this.oneSidedChains.includes(dstChain)) return

      const hasCounterpart = db.find(TransferRedeemed, {
        sequence: event.args.sequence,
        srcWormholeChainId: event.args.wormholeChainId,
        sender: event.args.sender,
      })
      if (hasCounterpart) return

      const tokenChain = extractTokenChain(event.args.payload)
      const srcWasBurned =
        tokenChain !== undefined
          ? tokenChain !== event.args.wormholeChainId
          : undefined

      return [
        Result.Transfer('wormhole-tokenbridge.Transfer', {
          srcEvent: event,
          dstChain,
          srcTokenAddress: event.args.srcTokenAddress,
          srcAmount: event.args.srcAmount,
          srcWasBurned,
          bridgeType: 'lockAndMint',
        }),
      ]
    }
  }
}

interface RedeemedTokens {
  tokenAddress: Address32
  amount: bigint
  wasMinted: boolean
}

// The bridge mints or releases the tokens after TransferRedeemed. A legacy
// relayer fee or a token tax adds smaller payouts of the same token, so the
// largest payout before the next redemption is the user's. A native payout is
// a single unwrap that runs before any recipient code, so it is never replaced
// by a later Withdrawal, which any contract can emit.
function findRedeemedTokens(
  input: LogToCapture,
  tokenBridge: EthereumAddress,
): RedeemedTokens | undefined {
  let redeemed: RedeemedTokens | undefined
  // biome-ignore lint/style/noNonNullAssertion: It's there
  for (const [log] of iterateLogs(input.txLogs, input.log.logIndex!, 'after')) {
    if (parseLogTransferRedeemed(log, [tokenBridge])) break

    const payout = parseRedeemedTokens(log, tokenBridge)
    if (!payout) continue
    if (!redeemed) {
      redeemed = payout
    } else if (
      redeemed.tokenAddress !== Address32.NATIVE &&
      payout.tokenAddress === redeemed.tokenAddress &&
      payout.wasMinted === redeemed.wasMinted &&
      payout.amount > redeemed.amount
    ) {
      redeemed = payout
    }
  }
  return redeemed
}

function parseRedeemedTokens(
  log: LogToCapture['txLogs'][number],
  tokenBridge: EthereumAddress,
): RedeemedTokens | undefined {
  // completeTransferAndUnwrapETH unwraps WETH and sends native ETH
  const withdrawal = parseWethWithdrawal(log, null)
  if (withdrawal) {
    if (EthereumAddress(withdrawal.src) !== tokenBridge) return
    return {
      tokenAddress: Address32.NATIVE,
      amount: withdrawal.wad,
      wasMinted: false,
    }
  }

  const transfer = parseTransfer(log, null)
  if (!transfer) return
  const from = EthereumAddress(transfer.from)
  if (from !== ZERO_ADDRESS && from !== tokenBridge) return
  return {
    tokenAddress: Address32.from(log.address),
    amount: transfer.value,
    wasMinted: from === ZERO_ADDRESS,
  }
}

// Portal Token Bridge payload: tokenChain is at bytes 65-67
// See wormhole.plugin.ts for full format
function extractTokenChain(payload: `0x${string}`): number | undefined {
  try {
    const data = payload.slice(2)
    if (data.length < 134) return undefined
    const payloadType = Number.parseInt(data.slice(0, 2), 16)
    if (payloadType !== 1 && payloadType !== 3) return undefined
    return Number.parseInt(data.slice(130, 134), 16)
  } catch {
    return undefined
  }
}
