import { Address32, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
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

const userRequestForAffirmationLog =
  'event UserRequestForAffirmation(bytes32 indexed messageId, bytes encodedData)'
const userRequestForSignatureLog =
  'event UserRequestForSignature(bytes32 indexed messageId, bytes encodedData)'
const affirmationCompletedLog =
  'event AffirmationCompleted(address indexed sender, address indexed executor, bytes32 indexed messageId, bool status)'
const relayedMessageLog =
  'event RelayedMessage(address indexed sender, address indexed executor, bytes32 indexed messageId, bool status)'

const tokensBridgingInitiatedLog =
  'event TokensBridgingInitiated(address indexed token, address indexed sender, uint256 value, bytes32 indexed messageId)'
const tokensBridgedLog =
  'event TokensBridged(address indexed token, address indexed recipient, uint256 value, bytes32 indexed messageId)'

const xdaiUserRequestForAffirmationLog =
  'event UserRequestForAffirmation(address recipient, uint256 value, bytes32 nonce)'
const xdaiAffirmationCompletedLog =
  'event AffirmationCompleted(address recipient, uint256 value, bytes32 transactionHash)'
const xdaiUserRequestForSignatureLog =
  'event UserRequestForSignature(address recipient, uint256 value, bytes32 nonce, address token)'
const xdaiRelayedMessageLog =
  'event RelayedMessage(address recipient, uint256 value, bytes32 transactionHash)'
const paidInterestLog =
  'event PaidInterest(address indexed token, address to, uint256 value)'

const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'

const FOREIGN_AMB = ChainSpecificAddress(
  'eth:0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e',
)
const HOME_AMB = ChainSpecificAddress(
  'gno:0x75Df5AF045d91108662D8080fD1FEFAd6aA0bb59',
)
const FOREIGN_OMNIBRIDGE = ChainSpecificAddress(
  'eth:0x88ad09518695c6c3712AC10a214bE5109a655671',
)
const HOME_OMNIBRIDGE = ChainSpecificAddress(
  'gno:0xf6A78083ca3e2a662D6dd1703c939c8aCE2e268d',
)
const FOREIGN_XDAI_BRIDGE = ChainSpecificAddress(
  'eth:0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016',
)
const HOME_XDAI_BRIDGE = ChainSpecificAddress(
  'gno:0x7301CFA0e1756B71869E93d4e4Dca5c7d0eb0AA6',
)
// XDaiForeignBridge.erc20token() returns USDS. Requests for DAI are fulfilled
// by a destination-side conversion and do not change the backing asset.
const XDAI_BRIDGE_BACKING_TOKEN = Address32.from(
  '0xdc035d45d973e3ec169d2276ddab16f1e407384f',
)

type GnosisBridgeChain = 'ethereum' | 'gnosis'

interface AmbMessageRequestedArgs {
  messageId: `0x${string}`
  $dstChain: GnosisBridgeChain
}

interface AmbMessageRelayedArgs {
  messageId: `0x${string}`
  $srcChain: GnosisBridgeChain
}

interface XdaiTransferFinalizedArgs {
  nonce: `0x${string}`
  amount: bigint
}

interface XdaiWithdrawalFinalizedArgs {
  nonce: `0x${string}`
  amount: bigint
}

const AmbMessageRequested = createInteropEventType<AmbMessageRequestedArgs>(
  'gnosisbridge.AmbMessageRequested',
  {
    direction: 'outgoing',
    ttl: 30 * UnixTime.DAY,
  },
)

const AmbMessageRelayed = createInteropEventType<AmbMessageRelayedArgs>(
  'gnosisbridge.AmbMessageRelayed',
  {
    direction: 'incoming',
    ttl: 30 * UnixTime.DAY,
  },
)

const OmnibridgeTransferInitiated = createInteropEventType<{
  messageId: `0x${string}`
  token: Address32
  amount: bigint
  wasBurned: boolean | undefined
  $dstChain: GnosisBridgeChain
}>('gnosisbridge.OmnibridgeTransferInitiated', {
  direction: 'outgoing',
  ttl: 30 * UnixTime.DAY,
})

const OmnibridgeTransferFinalized = createInteropEventType<{
  messageId: `0x${string}`
  token: Address32
  amount: bigint
  wasMinted: boolean | undefined
  $srcChain: GnosisBridgeChain
}>('gnosisbridge.OmnibridgeTransferFinalized', {
  direction: 'incoming',
  ttl: 30 * UnixTime.DAY,
})

const XdaiTransferInitiated = createInteropEventType<{
  nonce: `0x${string}`
  token: Address32 | undefined
  amount: bigint
  wasBurned: boolean | undefined
}>('gnosisbridge.XdaiTransferInitiated', {
  direction: 'outgoing',
  ttl: 30 * UnixTime.DAY,
})

const XdaiTransferFinalized = createInteropEventType<XdaiTransferFinalizedArgs>(
  'gnosisbridge.XdaiTransferFinalized',
  {
    direction: 'incoming',
    ttl: 30 * UnixTime.DAY,
  },
)

const XdaiWithdrawalInitiated = createInteropEventType<{
  nonce: `0x${string}`
  token: Address32
  amount: bigint
}>('gnosisbridge.XdaiWithdrawalInitiated', {
  direction: 'outgoing',
  ttl: 30 * UnixTime.DAY,
})

const XdaiWithdrawalFinalized =
  createInteropEventType<XdaiWithdrawalFinalizedArgs>(
    'gnosisbridge.XdaiWithdrawalFinalized',
    {
      direction: 'incoming',
      ttl: 30 * UnixTime.DAY,
    },
  )

const parseUserRequestForAffirmation = createEventParser(
  userRequestForAffirmationLog,
)
const parseUserRequestForSignature = createEventParser(
  userRequestForSignatureLog,
)
const parseAffirmationCompleted = createEventParser(affirmationCompletedLog)
const parseRelayedMessage = createEventParser(relayedMessageLog)
const parseTokensBridgingInitiated = createEventParser(
  tokensBridgingInitiatedLog,
)
const parseTokensBridged = createEventParser(tokensBridgedLog)
const parseXdaiUserRequestForAffirmation = createEventParser(
  xdaiUserRequestForAffirmationLog,
)
const parseXdaiAffirmationCompleted = createEventParser(
  xdaiAffirmationCompletedLog,
)
const parseXdaiUserRequestForSignature = createEventParser(
  xdaiUserRequestForSignatureLog,
)
const parseXdaiRelayedMessage = createEventParser(xdaiRelayedMessageLog)
const parsePaidInterest = createEventParser(paidInterestLog)
const parseTransfer = createEventParser(transferLog)

export class GnosisBridgePlugin implements InteropPluginResyncable {
  readonly name = 'gnosisbridge'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: userRequestForAffirmationLog,
        addresses: [FOREIGN_AMB],
      },
      {
        type: 'event',
        signature: userRequestForSignatureLog,
        addresses: [HOME_AMB],
      },
      {
        type: 'event',
        signature: affirmationCompletedLog,
        addresses: [HOME_AMB],
      },
      {
        type: 'event',
        signature: relayedMessageLog,
        addresses: [FOREIGN_AMB],
      },
      {
        type: 'event',
        signature: tokensBridgingInitiatedLog,
        includeTxEvents: [transferLog],
        addresses: [FOREIGN_OMNIBRIDGE, HOME_OMNIBRIDGE],
      },
      {
        type: 'event',
        signature: tokensBridgedLog,
        includeTxEvents: [transferLog],
        addresses: [FOREIGN_OMNIBRIDGE, HOME_OMNIBRIDGE],
      },
      {
        type: 'event',
        signature: xdaiUserRequestForAffirmationLog,
        includeTxEvents: [transferLog, paidInterestLog],
        addresses: [FOREIGN_XDAI_BRIDGE],
      },
      {
        type: 'event',
        signature: xdaiAffirmationCompletedLog,
        addresses: [HOME_XDAI_BRIDGE],
      },
      {
        type: 'event',
        signature: xdaiUserRequestForSignatureLog,
        addresses: [HOME_XDAI_BRIDGE],
      },
      {
        type: 'event',
        signature: xdaiRelayedMessageLog,
        includeTxEvents: [transferLog],
        addresses: [FOREIGN_XDAI_BRIDGE],
      },
    ]
  }

  capture(input: LogToCapture) {
    const counterparty = getCounterparty(input.chain)
    if (!counterparty) return

    if (input.chain === 'ethereum') {
      const requested = parseUserRequestForAffirmation(input.log, [
        ChainSpecificAddress.address(FOREIGN_AMB),
      ])
      if (requested) {
        return [
          AmbMessageRequested.create(input, {
            messageId: requested.messageId,
            $dstChain: counterparty,
          }),
        ]
      }

      const relayed = parseRelayedMessage(input.log, [
        ChainSpecificAddress.address(FOREIGN_AMB),
      ])
      if (relayed?.status) {
        return [
          AmbMessageRelayed.create(input, {
            messageId: relayed.messageId,
            $srcChain: counterparty,
          }),
        ]
      }

      const xdaiInitiated = parseXdaiUserRequestForAffirmation(input.log, [
        ChainSpecificAddress.address(FOREIGN_XDAI_BRIDGE),
      ])
      if (xdaiInitiated) {
        const transfer = findTokenTransferBefore(input, xdaiInitiated.value, {
          boundary: (log) =>
            parseXdaiUserRequestForAffirmation(log, null) !== undefined,
        })
        // payInterest() emits the regular bridge request without moving an
        // ERC-20 in the same transaction. Its following PaidInterest event is
        // the only source of the bridged token address.
        const paidInterest = findPaidInterestAfter(
          input,
          xdaiInitiated.value,
          xdaiInitiated.recipient,
        )
        return [
          XdaiTransferInitiated.create(input, {
            nonce: xdaiInitiated.nonce,
            token:
              transfer?.token ??
              (paidInterest ? Address32.from(paidInterest.token) : undefined),
            amount: xdaiInitiated.value,
            wasBurned: transfer?.wasBurned,
          }),
        ]
      }

      const xdaiFinalized = parseXdaiRelayedMessage(input.log, [
        ChainSpecificAddress.address(FOREIGN_XDAI_BRIDGE),
      ])
      if (xdaiFinalized) {
        return [
          XdaiWithdrawalFinalized.create(input, {
            nonce: xdaiFinalized.transactionHash,
            amount: xdaiFinalized.value,
          }),
        ]
      }
    } else {
      const requested = parseUserRequestForSignature(input.log, [
        ChainSpecificAddress.address(HOME_AMB),
      ])
      if (requested) {
        return [
          AmbMessageRequested.create(input, {
            messageId: requested.messageId,
            $dstChain: counterparty,
          }),
        ]
      }

      const relayed = parseAffirmationCompleted(input.log, [
        ChainSpecificAddress.address(HOME_AMB),
      ])
      if (relayed?.status) {
        return [
          AmbMessageRelayed.create(input, {
            messageId: relayed.messageId,
            $srcChain: counterparty,
          }),
        ]
      }

      const xdaiFinalized = parseXdaiAffirmationCompleted(input.log, [
        ChainSpecificAddress.address(HOME_XDAI_BRIDGE),
      ])
      if (xdaiFinalized) {
        return [
          XdaiTransferFinalized.create(input, {
            nonce: xdaiFinalized.transactionHash,
            amount: xdaiFinalized.value,
          }),
        ]
      }

      const xdaiInitiated = parseXdaiUserRequestForSignature(input.log, [
        ChainSpecificAddress.address(HOME_XDAI_BRIDGE),
      ])
      if (xdaiInitiated) {
        return [
          XdaiWithdrawalInitiated.create(input, {
            nonce: xdaiInitiated.nonce,
            token: Address32.from(xdaiInitiated.token),
            amount: xdaiInitiated.value,
          }),
        ]
      }
    }

    const omnibridge = ChainSpecificAddress.address(
      input.chain === 'ethereum' ? FOREIGN_OMNIBRIDGE : HOME_OMNIBRIDGE,
    )
    const initiated = parseTokensBridgingInitiated(input.log, [omnibridge])
    if (initiated) {
      const token = Address32.from(initiated.token)
      const transfer = findTokenTransferBefore(input, initiated.value, {
        token,
        boundary: (log) =>
          parseTokensBridgingInitiated(log, null) !== undefined,
      })
      return [
        OmnibridgeTransferInitiated.create(input, {
          messageId: initiated.messageId,
          token,
          amount: initiated.value,
          wasBurned: transfer?.wasBurned,
          $dstChain: counterparty,
        }),
      ]
    }

    const finalized = parseTokensBridged(input.log, [omnibridge])
    if (finalized) {
      const token = Address32.from(finalized.token)
      const transfer = findTokenTransferBefore(input, finalized.value, {
        token,
        boundary: (log) => parseTokensBridged(log, null) !== undefined,
      })
      return [
        OmnibridgeTransferFinalized.create(input, {
          messageId: finalized.messageId,
          token,
          amount: finalized.value,
          wasMinted: transfer?.wasMinted,
          $srcChain: counterparty,
        }),
      ]
    }
  }

  matchTypes = [
    AmbMessageRelayed,
    XdaiTransferFinalized,
    XdaiWithdrawalFinalized,
  ]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (AmbMessageRelayed.checkType(event)) {
      return this.matchAmbMessage(event, db)
    }
    if (XdaiTransferFinalized.checkType(event)) {
      return this.matchXdaiDeposit(event, db)
    }
    if (XdaiWithdrawalFinalized.checkType(event)) {
      return this.matchXdaiWithdrawal(event, db)
    }
  }

  private matchAmbMessage(
    event: InteropEvent<AmbMessageRelayedArgs>,
    db: InteropEventDb,
  ): MatchResult | undefined {
    const requested = db.find(AmbMessageRequested, {
      messageId: event.args.messageId,
      $dstChain: event.ctx.chain as GnosisBridgeChain,
      ctx: { chain: event.args.$srcChain },
    })
    if (!requested) return

    const initiated = db.find(OmnibridgeTransferInitiated, {
      messageId: event.args.messageId,
      $dstChain: event.ctx.chain as GnosisBridgeChain,
      ctx: { chain: event.args.$srcChain },
    })
    const finalized = db.find(OmnibridgeTransferFinalized, {
      messageId: event.args.messageId,
      $srcChain: event.args.$srcChain,
      ctx: { chain: event.ctx.chain },
    })

    const message = Result.Message('gnosisbridge.Message', {
      app: initiated && finalized ? 'omnibridge' : 'unknown',
      srcEvent: requested,
      dstEvent: event,
    })
    if (!initiated || !finalized) return [message]

    const transferType =
      requested.ctx.chain === 'ethereum'
        ? 'gnosisbridge.L1ToL2Transfer'
        : 'gnosisbridge.L2ToL1Transfer'

    return [
      message,
      Result.Transfer(transferType, {
        srcEvent: initiated,
        srcTokenAddress: initiated.args.token,
        srcAmount: initiated.args.amount,
        srcWasBurned: initiated.args.wasBurned,
        dstEvent: finalized,
        dstTokenAddress: finalized.args.token,
        dstAmount: finalized.args.amount,
        dstWasMinted: finalized.args.wasMinted,
      }),
    ]
  }

  private matchXdaiDeposit(
    event: InteropEvent<XdaiTransferFinalizedArgs>,
    db: InteropEventDb,
  ): MatchResult | undefined {
    const initiated = db.find(XdaiTransferInitiated, {
      nonce: event.args.nonce,
      ctx: { chain: 'ethereum' },
    })
    if (!initiated) return

    return [
      Result.Message('gnosisbridge.Message', {
        app: 'xdai-bridge',
        srcEvent: initiated,
        dstEvent: event,
      }),
      Result.Transfer('gnosisbridge.L1ToL2Transfer', {
        srcEvent: initiated,
        srcTokenAddress: initiated.args.token,
        srcAmount: initiated.args.amount,
        srcWasBurned: initiated.args.wasBurned,
        dstEvent: event,
        dstTokenAddress: Address32.NATIVE,
        dstAmount: event.args.amount,
        dstWasMinted: true,
      }),
    ]
  }

  private matchXdaiWithdrawal(
    event: InteropEvent<XdaiWithdrawalFinalizedArgs>,
    db: InteropEventDb,
  ): MatchResult | undefined {
    const initiated = db.find(XdaiWithdrawalInitiated, {
      nonce: event.args.nonce,
      ctx: { chain: 'gnosis' },
    })
    if (!initiated) return

    return [
      Result.Message('gnosisbridge.Message', {
        app: 'xdai-bridge',
        srcEvent: initiated,
        dstEvent: event,
      }),
      Result.Transfer('gnosisbridge.L2ToL1Transfer', {
        srcEvent: initiated,
        srcTokenAddress: Address32.NATIVE,
        srcAmount: initiated.args.amount,
        srcWasBurned: true,
        dstEvent: event,
        dstTokenAddress: XDAI_BRIDGE_BACKING_TOKEN,
        dstAmount: event.args.amount,
        dstWasMinted: false,
      }),
    ]
  }
}

function getCounterparty(chain: string): GnosisBridgeChain | undefined {
  if (chain === 'ethereum') return 'gnosis'
  if (chain === 'gnosis') return 'ethereum'
}

function findTokenTransferBefore(
  input: LogToCapture,
  amount: bigint,
  options: {
    token?: Address32
    boundary: (log: LogToCapture['log']) => boolean
  },
) {
  let token = options.token
  let found = false
  let wasBurned = false
  let wasMinted = false

  // Bridge calls can be batched. Stop at the previous event of the same kind so
  // that an equal-amount transfer from another bridge call is never reused.
  for (const [log] of iterateLogs(
    input.txLogs,
    input.log.logIndex ?? -1,
    'before',
  )) {
    if (options.boundary(log)) break

    const transfer = parseTransfer(log, null)
    if (!transfer || transfer.value !== amount) continue

    const tokenAddress = Address32.from(log.address)
    if (token && tokenAddress !== token) continue

    token ??= tokenAddress
    found = true
    wasBurned ||= Address32.from(transfer.to) === Address32.ZERO
    wasMinted ||= Address32.from(transfer.from) === Address32.ZERO
  }

  if (!found || !token) return
  return { token, wasBurned, wasMinted }
}

function findPaidInterestAfter(
  input: LogToCapture,
  amount: bigint,
  recipient: string,
) {
  // payInterest() emits PaidInterest after its bridge request. Limit the scan
  // to this request so a batched equal-amount payment cannot provide its token.
  for (const [log] of iterateLogs(
    input.txLogs,
    input.log.logIndex ?? -1,
    'after',
  )) {
    if (parseXdaiUserRequestForAffirmation(log, null)) break

    const paidInterest = parsePaidInterest(log, [
      ChainSpecificAddress.address(FOREIGN_XDAI_BRIDGE),
    ])
    if (paidInterest?.value === amount && paidInterest.to === recipient) {
      return paidInterest
    }
  }
}
