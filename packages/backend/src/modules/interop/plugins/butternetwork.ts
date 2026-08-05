import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { decodeAbiParameters, parseAbiParameters } from 'viem'
import { findTransferLogAround, findTransferLogBefore } from './logScan'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  defineNetworks,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const messageOutLog =
  'event MessageOut(bytes32 indexed orderId, uint256 indexed chainAndGasLimit, bytes payload)'
const messageInLog =
  'event MessageIn(bytes32 indexed orderId, uint256 indexed chainAndGasLimit, address token, uint256 amount, address to, bytes from, bytes payload, bool result, bytes reason)'
const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'

const parseMessageOut = createEventParser(messageOutLog)
const parseMessageIn = createEventParser(messageInLog)
const parseTransfer = createEventParser(transferLog)

const MESSAGE_OUT_PAYLOAD = parseAbiParameters(
  'uint256, address, address, uint256, address, address, bytes, bytes',
)

const UINT64_MASK = (1n << 64n) - 1n

type ButterNetwork = {
  chain: string
  chainId: number
  bridge: EthereumAddress
}

// https://github.com/butternetwork/butter-mos-contracts/blob/main/evmv3/constants/chains.json
// https://github.com/butternetwork/butter-mos-contracts/blob/main/evmv3/deployments/deploy.json
const BUTTER_NETWORKS = defineNetworks<ButterNetwork>('butternetwork', [
  {
    chain: 'ethereum',
    chainId: 1,
    bridge: EthereumAddress('0x0000317Bec33Af037b5fAb2028f52d14658F6A56'),
  },
  {
    chain: 'arbitrum',
    chainId: 42161,
    bridge: EthereumAddress('0x0000317Bec33Af037b5fAb2028f52d14658F6A56'),
  },
  {
    chain: 'base',
    chainId: 8453,
    bridge: EthereumAddress('0x0000317Bec33Af037b5fAb2028f52d14658F6A56'),
  },
  {
    chain: 'optimism',
    chainId: 10,
    bridge: EthereumAddress('0x0000317Bec33Af037b5fAb2028f52d14658F6A56'),
  },
  {
    chain: 'polygonpos',
    chainId: 137,
    bridge: EthereumAddress('0x0000317Bec33Af037b5fAb2028f52d14658F6A56'),
  },
  {
    chain: 'zksync2',
    chainId: 324,
    bridge: EthereumAddress('0xdeF84C4B412361E3A98A5277C108D7F0Df02fA3d'),
  },
  {
    chain: 'bsc',
    chainId: 56,
    bridge: EthereumAddress('0x0000317Bec33Af037b5fAb2028f52d14658F6A56'),
  },
  {
    chain: 'linea',
    chainId: 59144,
    bridge: EthereumAddress('0x0000317Bec33Af037b5fAb2028f52d14658F6A56'),
  },
  {
    chain: 'xlayer',
    chainId: 196,
    bridge: EthereumAddress('0x0000317Bec33Af037b5fAb2028f52d14658F6A56'),
  },
  {
    chain: 'unichain',
    chainId: 130,
    bridge: EthereumAddress('0x0000317Bec33Af037b5fAb2028f52d14658F6A56'),
  },
  {
    chain: 'avalanche',
    chainId: 43114,
    bridge: EthereumAddress('0x0000317Bec33Af037b5fAb2028f52d14658F6A56'),
  },
])

const BUTTER_BRIDGES = BUTTER_NETWORKS.map((network) => network.bridge)

type MessageOutPayload = {
  messageType: number
  token: Address32
  amount: bigint
}

function decodeMessageOutPayload(
  payload: `0x${string}`,
): MessageOutPayload | undefined {
  try {
    const [header, , token, amount] = decodeAbiParameters(
      MESSAGE_OUT_PAYLOAD,
      payload,
    )

    return {
      messageType: Number(header & 0xffn),
      token: Address32.from(EthereumAddress(token)),
      amount,
    }
  } catch {
    return undefined
  }
}

function decodeRoute(chainAndGasLimit: bigint) {
  const srcChainId = Number(chainAndGasLimit >> 192n)
  const dstChainId = Number((chainAndGasLimit >> 128n) & UINT64_MASK)

  const srcNetwork = BUTTER_NETWORKS.find(
    (network) => network.chainId === srcChainId,
  )
  const dstNetwork = BUTTER_NETWORKS.find(
    (network) => network.chainId === dstChainId,
  )

  if (!srcNetwork || !dstNetwork) return undefined

  return { srcNetwork, dstNetwork }
}

function resolveSourceBurn(
  input: LogToCapture,
  token: Address32,
  amount: bigint,
): boolean | undefined {
  const bridge = Address32.from(input.log.address)
  const logIndex = input.log.logIndex ?? -1

  const burn = findTransferLogBefore(
    input.txLogs,
    logIndex,
    (log) => parseTransfer(log, null),
    (transfer) =>
      transfer.logAddress.toLowerCase() === token.toLowerCase() &&
      transfer.value === amount &&
      transfer.from === bridge &&
      transfer.to === Address32.ZERO,
  )
  if (burn.transfer) return true

  const lock = findTransferLogBefore(
    input.txLogs,
    logIndex,
    (log) => parseTransfer(log, null),
    (transfer) =>
      transfer.logAddress.toLowerCase() === token.toLowerCase() &&
      transfer.value === amount &&
      transfer.to === bridge,
  )
  if (lock.transfer) return false

  return undefined
}

function resolveDestinationMint(
  input: LogToCapture,
  token: Address32,
  amount: bigint,
): boolean | undefined {
  const bridge = Address32.from(input.log.address)
  const logIndex = input.log.logIndex ?? -1
  const mint = findTransferLogAround(
    input.txLogs,
    logIndex,
    (log) => parseTransfer(log, null),
    (transfer) =>
      transfer.logAddress.toLowerCase() === token.toLowerCase() &&
      transfer.value === amount &&
      transfer.from === Address32.ZERO &&
      transfer.to === bridge,
  )

  if (mint.transfer) return true

  const release = findTransferLogAround(
    input.txLogs,
    logIndex,
    (log) => parseTransfer(log, null),
    (transfer) =>
      transfer.logAddress.toLowerCase() === token.toLowerCase() &&
      transfer.value === amount &&
      transfer.from === bridge,
  )
  return release.transfer ? false : undefined
}

function getBridgeType(
  srcWasBurned: boolean | undefined,
  dstWasMinted: boolean | undefined,
) {
  if (srcWasBurned === true && dstWasMinted === true) {
    return 'burnAndMint' as const
  }
  if (srcWasBurned === false && dstWasMinted === true) {
    return 'lockAndMint' as const
  }
  if (srcWasBurned === false && dstWasMinted === false) {
    return 'nonMinting' as const
  }
  return undefined
}

export const ButterMessageOut = createInteropEventType<{
  orderId: `0x${string}`
  $dstChain: string
  messageType: number
  token: Address32
  amount: bigint
  srcWasBurned?: boolean
}>('butternetwork.MessageOut', {
  direction: 'outgoing',
  ttl: 30 * UnixTime.DAY,
})

export const ButterMessageIn = createInteropEventType<{
  orderId: `0x${string}`
  $srcChain: string
  token: Address32
  amount: bigint
  result: boolean
  dstWasMinted?: boolean
}>('butternetwork.MessageIn', {
  direction: 'incoming',
  ttl: 30 * UnixTime.DAY,
})

export class ButterNetworkPlugin implements InteropPluginResyncable {
  readonly name = 'butternetwork'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: messageOutLog,
        includeTxEvents: [transferLog],
        addresses: BUTTER_NETWORKS.map((network) =>
          ChainSpecificAddress.fromLong(network.chain, network.bridge),
        ),
      },
      {
        type: 'event',
        signature: messageInLog,
        includeTxEvents: [transferLog],
        addresses: BUTTER_NETWORKS.map((network) =>
          ChainSpecificAddress.fromLong(network.chain, network.bridge),
        ),
      },
    ]
  }

  capture(input: LogToCapture) {
    const messageOut = parseMessageOut(input.log, BUTTER_BRIDGES)
    if (messageOut) {
      const route = decodeRoute(messageOut.chainAndGasLimit)
      const payload = decodeMessageOutPayload(messageOut.payload)
      if (!route || !payload || route.srcNetwork.chain !== input.chain) {
        return
      }

      return [
        ButterMessageOut.create(input, {
          orderId: messageOut.orderId,
          $dstChain: route.dstNetwork.chain,
          messageType: payload.messageType,
          token: payload.token,
          amount: payload.amount,
          srcWasBurned: resolveSourceBurn(input, payload.token, payload.amount),
        }),
      ]
    }

    const messageIn = parseMessageIn(input.log, BUTTER_BRIDGES)
    if (messageIn) {
      const route = decodeRoute(messageIn.chainAndGasLimit)
      if (!route || route.dstNetwork.chain !== input.chain) {
        return
      }

      const token = Address32.from(EthereumAddress(messageIn.token))
      return [
        ButterMessageIn.create(input, {
          orderId: messageIn.orderId,
          $srcChain: route.srcNetwork.chain,
          token,
          amount: messageIn.amount,
          result: messageIn.result,
          dstWasMinted: resolveDestinationMint(input, token, messageIn.amount),
        }),
      ]
    }
  }

  matchTypes = [ButterMessageIn]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (!ButterMessageIn.checkType(event)) return

    const messageOut = db.find(ButterMessageOut, {
      orderId: event.args.orderId,
      ctx: { chain: event.args.$srcChain },
      $dstChain: event.ctx.chain,
    })
    if (!messageOut) return

    const results: MatchResult = [
      Result.Message('butternetwork.Message', {
        app: 'butternetwork',
        srcEvent: messageOut,
        dstEvent: event,
      }),
    ]

    if (
      event.args.result &&
      (messageOut.args.messageType === 3 || messageOut.args.messageType === 4)
    ) {
      results.push(
        Result.Transfer('butternetwork.Transfer', {
          srcEvent: messageOut,
          srcTokenAddress: messageOut.args.token,
          srcAmount: messageOut.args.amount,
          srcWasBurned: messageOut.args.srcWasBurned,
          dstEvent: event,
          dstTokenAddress: event.args.token,
          dstAmount: event.args.amount,
          dstWasMinted: event.args.dstWasMinted,
          bridgeType: getBridgeType(
            messageOut.args.srcWasBurned,
            event.args.dstWasMinted,
          ),
        }),
      )
    }

    return results
  }
}
