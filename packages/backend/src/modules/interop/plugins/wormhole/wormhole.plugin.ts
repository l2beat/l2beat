import {
  Address32,
  assert,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import {
  forwardedERC20Log,
  forwardedEthLog,
  logToProtocolData,
  swapAndForwardedERC20Log,
  swapAndForwardedEthLog,
} from '../mayan-forwarder'
import { MAYAN_SWIFT } from '../mayan-swift.utils'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
} from '../types'
import { FOLKS_CHAIN_ID_TO_CHAIN } from './folks-finance'
import { WormholeConfig } from './wormhole.config'

// Mayan Circle contract address (same on all chains)
export const MAYAN_CIRCLE = EthereumAddress(
  '0x875d6d37EC55c8cF220B9E5080717549d8Aa8EcA',
)

// only these are accompanied by LogMessagePublished
export const MAYAN_CIRCLE_WORMHOLE_EMITTING_METHODS = new Set([
  '0x2072197f', // mayanCircle.bridgeWithFee
  '0x1c59b7fc', // mayanCircle.createOrder (legacy)
])

const logMessagePublishedLog =
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)'

const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'

// Folks Finance uses Wormhole for cross-chain messaging
const folksSendMessageLog =
  'event SendMessage(bytes32 operationId, ((uint16,uint16,uint256,uint256,uint256),bytes32,uint16,bytes32,bytes,uint64,bytes) message)'

const parseLogMessagePublished = createEventParser(logMessagePublishedLog)

const parseTransfer = createEventParser(transferLog)

const parseFolksSendMessage = createEventParser(folksSendMessageLog)

export const LogMessagePublished = createInteropEventType<{
  payload: `0x${string}`
  sequence: bigint
  wormholeChainId: number
  sender: EthereumAddress
  srcTokenAddress?: Address32
  srcAmount?: bigint
  $dstChain?: string
}>('wormhole.LogMessagePublished')

export class WormholePlugin implements InteropPluginResyncable {
  readonly name = 'wormhole'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const networks = this.configs.get(WormholeConfig) ?? []
    const coreContractAddresses: ChainSpecificAddress[] = []
    for (const network of networks) {
      if (!network.coreContract) continue
      try {
        coreContractAddresses.push(
          ChainSpecificAddress.fromLong(network.chain, network.coreContract),
        )
      } catch {
        // Chain not supported by ChainSpecificAddress, skip
      }
    }

    return [
      {
        type: 'event',
        signature: logMessagePublishedLog,
        includeTxEvents: [
          transferLog,
          folksSendMessageLog,
          forwardedEthLog,
          forwardedERC20Log,
          swapAndForwardedEthLog,
          swapAndForwardedERC20Log,
        ],
        addresses: coreContractAddresses,
      },
    ]
  }

  capture(input: LogToCapture) {
    const networks = this.configs.get(WormholeConfig)
    if (!networks) return

    const network = networks.find((n) => n.chain === input.chain)
    if (!network) {
      return
    }

    assert(network.coreContract, 'We capture only chain with core contracts')

    const parsed = parseLogMessagePublished(input.log, [network.coreContract])
    if (!parsed) return

    // If the sender is the token bridge, get the src token from the Transfer event at previous log positions
    // Example: https://app.blocksec.com/phalcon/explorer/tx/base/0x7eebd35bd9b1d0b614dfe3d464d915378f2d370ab425d1ddc4510b820ed5df8d
    let srcTokenAddress: Address32 | undefined
    let srcAmount: bigint | undefined

    const senderAddress = EthereumAddress(parsed.sender)

    // Skip Mayan Swift settlement messages - they are handled by mayan-swift.ts and
    // mayan-swift-settlement.ts which create SettlementSent events with extracted order keys
    // for matching with OrderUnlocked. If we captured them here as LogMessagePublished,
    // they would remain unmatched since the settlement matching uses SettlementSent.
    if (senderAddress === MAYAN_SWIFT) {
      return
    }

    // Mayan Circle (MCTP) messages: extract $dstChain from the companion Mayan Forwarder
    // event in the same tx. Source-side messages always have a ForwardedERC20/ForwardedEth.
    // Destination-side confirmations (bridgeWithLockedFee) have no forwarder event and are
    // never matchable, so we skip them.
    if (senderAddress === MAYAN_CIRCLE) {
      const wormholeNetworks = this.configs.get(WormholeConfig) ?? []
      for (const candidateLog of input.txLogs) {
        const decoded = logToProtocolData(candidateLog, wormholeNetworks)
        if (decoded) {
          return [
            LogMessagePublished.create(input, {
              payload: parsed.payload,
              sequence: parsed.sequence,
              wormholeChainId: network.wormholeChainId,
              sender: senderAddress,
              $dstChain: decoded.dstChain,
            }),
          ]
        }
      }
      // No forwarder event found — destination-side confirmation, skip capture
      return
    }

    const logIndex = input.log.logIndex
    if (
      network.tokenBridge &&
      senderAddress === network.tokenBridge &&
      logIndex !== null
    ) {
      // Find the Transfer event to the token bridge, searching backwards from current log
      for (let i = logIndex - 1; i >= 0; i--) {
        const candidateLog = input.txLogs.find((log) => log.logIndex === i)
        if (!candidateLog) continue

        const transfer = parseTransfer(candidateLog, null)
        if (transfer && EthereumAddress(transfer.to) === network.tokenBridge) {
          srcTokenAddress = Address32.from(candidateLog.address)
          srcAmount = transfer.value
          break
        }
      }
    }

    // Try to find destination chain
    let $dstChain: string | undefined

    // Portal Token Bridge: extract destination chain from payload
    if (
      !$dstChain &&
      network.tokenBridge &&
      senderAddress === network.tokenBridge
    ) {
      const toChainId = extractTokenBridgeDestChain(parsed.payload)
      if (toChainId !== undefined) {
        const dstNetwork = networks.find((n) => n.wormholeChainId === toChainId)
        $dstChain = dstNetwork?.chain ?? `Unknown_${toChainId}`
      }
    }

    // Folks Finance: find SendMessage event after LogMessagePublished
    if (!$dstChain) {
      for (const candidateLog of input.txLogs) {
        if (
          candidateLog.logIndex === null ||
          logIndex === null ||
          candidateLog.logIndex <= logIndex
        ) {
          continue
        }
        const folksSendMessage = parseFolksSendMessage(candidateLog, null)
        if (folksSendMessage) {
          // message tuple: ((params), sender, destinationChainId, handler, payload, finalityLevel, extraArgs)
          // destinationChainId is at index 2, using Folks Finance's own chain ID system
          const folksChainId = Number(folksSendMessage.message[2])
          $dstChain =
            FOLKS_CHAIN_ID_TO_CHAIN[folksChainId] ?? `Unknown_${folksChainId}`
          break
        }
      }
    }

    return [
      LogMessagePublished.create(input, {
        payload: parsed.payload,
        sequence: parsed.sequence,
        wormholeChainId: network.wormholeChainId,
        sender: EthereumAddress(parsed.sender),
        srcTokenAddress,
        srcAmount,
        $dstChain,
      }),
    ]
  }
  // no matching because wormhole matches by (msg.sender,sequence) (sender=emitter in wormhole core contracts, not to be confused with event emitter),
  // of which the destination event depends on the app layer
}

// imported by cctps
export function findWrappedMayanWormholeLog(
  db: InteropEventDb,
  mayanForwarded: InteropEvent<{ methodSignature: `0x${string}` }>,
) {
  // Only these methods emit Wormhole LogMessagePublished on source side.
  if (
    !MAYAN_CIRCLE_WORMHOLE_EMITTING_METHODS.has(
      mayanForwarded.args.methodSignature,
    )
  ) {
    return undefined
  }

  const candidates = db
    .findAll(LogMessagePublished, {
      sender: MAYAN_CIRCLE,
      ctx: { txHash: mayanForwarded.ctx.txHash },
    })
    .filter((event) => event.ctx.chain === mayanForwarded.ctx.chain)

  if (candidates.length === 0) return undefined

  // If there are multiple candidates in the same tx, pick the one closest
  // to the source forwarder event.
  return candidates.sort((a, b) => {
    const aDistance = Math.abs(a.ctx.logIndex - mayanForwarded.ctx.logIndex)
    const bDistance = Math.abs(b.ctx.logIndex - mayanForwarded.ctx.logIndex)
    if (aDistance !== bDistance) return aDistance - bDistance
    return a.ctx.logIndex - b.ctx.logIndex
  })[0]
}

// Portal Token Bridge transfer payload format:
// [0..1)    payloadType (1 byte) - 0x01 for transfer, 0x03 for transferWithPayload
// [1..33)   amount (32 bytes)
// [33..65)  tokenAddress (32 bytes)
// [65..67)  tokenChain (2 bytes)
// [67..99)  to (32 bytes)
// [99..101) toChain (2 bytes)
function extractTokenBridgeDestChain(payload: string): number | undefined {
  try {
    // Remove 0x prefix if present
    const data = payload.startsWith('0x') ? payload.slice(2) : payload

    // Check minimum length: payloadType(2) + amount(64) + tokenAddr(64) + tokenChain(4) + to(64) + toChain(4) = 202
    if (data.length < 202) return undefined

    // Check payload type (first byte)
    const payloadType = Number.parseInt(data.slice(0, 2), 16)
    if (payloadType !== 1 && payloadType !== 3) return undefined

    // Extract toChain at chars 198-202 (bytes 99-101)
    const toChainHex = data.slice(198, 202)
    return Number.parseInt(toChainHex, 16)
  } catch {
    return undefined
  }
}
