import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
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

const messageSentLog =
  'event MessageSent(address indexed _from, address indexed _to, uint256 _fee, uint256 _value, uint256 _nonce, bytes _calldata, bytes32 indexed _messageHash)'
const messageClaimedLog = 'event MessageClaimed(bytes32 indexed _messageHash)'
const bridgingInitiatedV2Log =
  'event BridgingInitiatedV2(address indexed sender, address indexed recipient, address indexed token, uint256 amount)'
const bridgingFinalizedV2Log =
  'event BridgingFinalizedV2(address indexed nativeToken, address indexed bridgedToken, uint256 amount, address indexed recipient)'

const L1_MESSAGE_SERVICE = ChainSpecificAddress(
  'eth:0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
)
const L2_MESSAGE_SERVICE = ChainSpecificAddress(
  'linea:0x508Ca82Df566dCD1B0DE8296e70a96332cD644ec',
)

const L1_TOKEN_BRIDGE = ChainSpecificAddress(
  'eth:0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319',
)
const L2_TOKEN_BRIDGE = ChainSpecificAddress(
  'linea:0x353012dc4a9A6cF55c941bADC267f82004A8ceB9',
)

const parseMessageSent = createEventParser(messageSentLog)
const parseMessageClaimed = createEventParser(messageClaimedLog)
const parseBridgingInitiatedV2 = createEventParser(bridgingInitiatedV2Log)
const parseBridgingFinalizedV2 = createEventParser(bridgingFinalizedV2Log)

type CounterpartyChain = 'ethereum' | 'linea'

const MessageSent = createInteropEventType<{
  messageHash: `0x${string}`
  value: bigint
  $dstChain: CounterpartyChain
}>('linea.MessageSent', { direction: 'outgoing', ttl: 30 * UnixTime.DAY })

const MessageClaimed = createInteropEventType<{
  messageHash: `0x${string}`
  $srcChain: CounterpartyChain
}>('linea.MessageClaimed', { direction: 'incoming', ttl: 30 * UnixTime.DAY })

const BridgingInitiatedV2 = createInteropEventType<{
  token: Address32
  amount: bigint
  $dstChain: CounterpartyChain
}>('linea.BridgingInitiatedV2', {
  direction: 'outgoing',
  ttl: 30 * UnixTime.DAY,
})

const BridgingFinalizedV2 = createInteropEventType<{
  nativeToken: Address32
  bridgedToken: Address32
  amount: bigint
  $srcChain: CounterpartyChain
}>('linea.BridgingFinalizedV2', {
  direction: 'incoming',
  ttl: 30 * UnixTime.DAY,
})

const MESSAGE_SERVICE_ADDRESSES = [
  ChainSpecificAddress.address(L1_MESSAGE_SERVICE),
  ChainSpecificAddress.address(L2_MESSAGE_SERVICE),
]
const TOKEN_BRIDGE_ADDRESSES = [
  ChainSpecificAddress.address(L1_TOKEN_BRIDGE),
  ChainSpecificAddress.address(L2_TOKEN_BRIDGE),
]

function getCounterpartyChain(chain: string): 'ethereum' | 'linea' | undefined {
  if (chain === 'ethereum') return 'linea'
  if (chain === 'linea') return 'ethereum'
}

export class LineaPlugin implements InteropPluginResyncable {
  readonly name = 'linea'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: messageSentLog,
        addresses: [L1_MESSAGE_SERVICE, L2_MESSAGE_SERVICE],
      },
      {
        type: 'event',
        signature: messageClaimedLog,
        addresses: [L1_MESSAGE_SERVICE, L2_MESSAGE_SERVICE],
      },
      {
        type: 'event',
        signature: bridgingInitiatedV2Log,
        addresses: [L1_TOKEN_BRIDGE, L2_TOKEN_BRIDGE],
      },
      {
        type: 'event',
        signature: bridgingFinalizedV2Log,
        addresses: [L1_TOKEN_BRIDGE, L2_TOKEN_BRIDGE],
      },
    ]
  }

  capture(input: LogToCapture) {
    const counterparty = getCounterpartyChain(input.chain)
    if (!counterparty) return

    const messageSent = parseMessageSent(input.log, MESSAGE_SERVICE_ADDRESSES)
    if (messageSent) {
      return [
        MessageSent.create(input, {
          messageHash: messageSent._messageHash,
          value: messageSent._value,
          $dstChain: counterparty,
        }),
      ]
    }

    const messageClaimed = parseMessageClaimed(
      input.log,
      MESSAGE_SERVICE_ADDRESSES,
    )
    if (messageClaimed) {
      return [
        MessageClaimed.create(input, {
          messageHash: messageClaimed._messageHash,
          $srcChain: counterparty,
        }),
      ]
    }

    const bridgingInitiated = parseBridgingInitiatedV2(
      input.log,
      TOKEN_BRIDGE_ADDRESSES,
    )
    if (bridgingInitiated) {
      return [
        BridgingInitiatedV2.create(input, {
          token: Address32.from(EthereumAddress(bridgingInitiated.token)),
          amount: bridgingInitiated.amount,
          $dstChain: counterparty,
        }),
      ]
    }

    const bridgingFinalized = parseBridgingFinalizedV2(
      input.log,
      TOKEN_BRIDGE_ADDRESSES,
    )
    if (bridgingFinalized) {
      return [
        BridgingFinalizedV2.create(input, {
          nativeToken: Address32.from(
            EthereumAddress(bridgingFinalized.nativeToken),
          ),
          bridgedToken: Address32.from(
            EthereumAddress(bridgingFinalized.bridgedToken),
          ),
          amount: bridgingFinalized.amount,
          $srcChain: counterparty,
        }),
      ]
    }
  }

  matchTypes = [MessageClaimed]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (!MessageClaimed.checkType(event)) return

    const srcChain = getCounterpartyChain(event.ctx.chain)
    if (!srcChain) return

    const messageSent = db.find(MessageSent, {
      messageHash: event.args.messageHash,
      ctx: { chain: srcChain },
    })
    if (!messageSent) return

    const bridgingFinalized = db.find(BridgingFinalizedV2, {
      sameTxBefore: event,
    })
    let messageApp = 'unknown'
    let transfer: ReturnType<typeof Result.Transfer> | undefined

    // ETH is lock/release on L1 and burn/mint on L2 (well acshually not on L2 but that is standard L2 preminting)
    const ethSrcWasBurned = srcChain === 'linea'
    const ethDstWasMinted = srcChain === 'ethereum'

    if (messageSent.args.value > 0n) {
      messageApp = 'canonical-eth'
      transfer = Result.Transfer('linea.Transfer', {
        srcEvent: messageSent,
        srcTokenAddress: Address32.NATIVE,
        srcAmount: messageSent.args.value,
        srcWasBurned: ethSrcWasBurned,
        dstEvent: event,
        dstTokenAddress: Address32.NATIVE,
        dstAmount: messageSent.args.value,
        dstWasMinted: ethDstWasMinted,
      })
    } else if (messageSent.args.value === 0n && bridgingFinalized) {
      const bridgingInitiated = db.find(BridgingInitiatedV2, {
        sameTxAfter: messageSent,
      })
      if (bridgingInitiated) {
        const tokenDstWasMinted =
          bridgingFinalized.args.nativeToken ===
          bridgingFinalized.args.bridgedToken
        const tokenSrcWasBurned = !tokenDstWasMinted

        messageApp = 'canonical-token'
        transfer = Result.Transfer('linea.Transfer', {
          srcEvent: bridgingInitiated,
          srcTokenAddress: bridgingInitiated.args.token,
          srcAmount: bridgingInitiated.args.amount,
          srcWasBurned: tokenSrcWasBurned,
          dstEvent: bridgingFinalized,
          dstTokenAddress: bridgingFinalized.args.nativeToken,
          dstAmount: bridgingFinalized.args.amount,
          dstWasMinted: tokenDstWasMinted,
        })
      }
    }

    const message = Result.Message('linea.Message', {
      app: messageApp,
      srcEvent: messageSent,
      dstEvent: event,
    })

    if (transfer) {
      return [message, transfer]
    }
    return [message]
  }
}
