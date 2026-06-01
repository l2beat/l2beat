import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { encodePacked, keccak256 } from 'viem'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  defineNetworks,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

type Hex = `0x${string}`

const INPUT_COMPACT = EthereumAddress(
  '0x0000000000cd5f7fDEc90a03a31F79E5Fbc6A9Cf',
)
const INPUT_ESCROW = EthereumAddress(
  '0x000025c3226C00B2Cdc200005a1600509f4e00C0',
)
const OUTPUT_SETTLER = EthereumAddress(
  '0x0000000000eC36B683C2E6AC89e9A75989C22a2e',
)
const POLYMER_ORACLE = EthereumAddress(
  '0x0000003E06000007A224AeE90052fA6bb46d43C9',
)

const LIFI_INTENTS_NETWORKS = defineNetworks('lifi-intents', [
  {
    chain: 'ethereum',
    chainId: 1,
    inputCompact: INPUT_COMPACT,
    inputEscrow: INPUT_ESCROW,
    outputSettler: OUTPUT_SETTLER,
    polymerOracle: POLYMER_ORACLE,
  },
  {
    chain: 'base',
    chainId: 8453,
    inputCompact: INPUT_COMPACT,
    inputEscrow: INPUT_ESCROW,
    outputSettler: OUTPUT_SETTLER,
    polymerOracle: POLYMER_ORACLE,
  },
  {
    chain: 'arbitrum',
    chainId: 42161,
    inputCompact: INPUT_COMPACT,
    inputEscrow: INPUT_ESCROW,
    outputSettler: OUTPUT_SETTLER,
    polymerOracle: POLYMER_ORACLE,
  },
  {
    chain: 'optimism',
    chainId: 10,
    inputCompact: INPUT_COMPACT,
    inputEscrow: INPUT_ESCROW,
    outputSettler: OUTPUT_SETTLER,
    polymerOracle: POLYMER_ORACLE,
  },
])

const standardOrder =
  '(address user, uint256 nonce, uint256 originChainId, uint32 expires, uint32 fillDeadline, address inputOracle, uint256[2][] inputs, (bytes32 oracle, bytes32 settler, uint256 chainId, bytes32 token, uint256 amount, bytes32 recipient, bytes callbackData, bytes context)[] outputs)'

const intentRegisteredLog = `event IntentRegistered(bytes32 indexed orderId, ${standardOrder} order)`
const parseIntentRegistered = createEventParser(intentRegisteredLog)

const openLog = `event Open(bytes32 indexed orderId, ${standardOrder} order)`
const parseOpen = createEventParser(openLog)

const outputFilledLog =
  'event OutputFilled(bytes32 indexed orderId, bytes32 solver, uint32 timestamp, (bytes32 oracle, bytes32 settler, uint256 chainId, bytes32 token, uint256 amount, bytes32 recipient, bytes callbackData, bytes context) output, uint256 finalAmount)'
const parseOutputFilled = createEventParser(outputFilledLog)

const outputProvenLog =
  'event OutputProven(uint256 chainid, bytes32 remoteIdentifier, bytes32 application, bytes32 payloadHash)'
const parseOutputProven = createEventParser(outputProvenLog)

interface MandateOutput {
  oracle: Hex
  settler: Hex
  chainId: bigint
  token: Hex
  amount: bigint
  recipient: Hex
  callbackData: Hex
  context: Hex
}

interface StandardOrder {
  inputs: readonly (readonly [bigint, bigint])[]
  outputs: readonly MandateOutput[]
  originChainId: bigint
}

export const LifiIntentsOutputRequested = createInteropEventType<{
  orderId: Hex
  outputHash: Hex
  originChainId: number
  destinationChainId: number
  $dstChain: string
  outputIndex: number
  inputCount: number
  outputCount: number
  inputToken?: Address32
  inputAmount?: bigint
  outputToken: Address32
  outputAmount: bigint
}>('lifi-intents.OutputRequested', {
  direction: 'outgoing',
  ttl: 30 * UnixTime.DAY,
})

export const LifiIntentsOutputFilled = createInteropEventType<{
  orderId: Hex
  outputHash: Hex
  payloadHash: Hex
  chainId: number
  solver: Hex
  timestamp: number
  token: Address32
  amount: bigint
  finalAmount: bigint
}>('lifi-intents.OutputFilled', {
  direction: 'incoming',
  ttl: 30 * UnixTime.DAY,
})

const LifiIntentsOutputPayload = createInteropEventType<{
  payloadHash: Hex
  remoteChainId: number
  remoteIdentifier: Hex
  application: Hex
}>('lifi-intents.OutputPayload', {
  direction: 'outgoing',
  ttl: 30 * UnixTime.DAY,
})

export const LifiIntentsOutputProven = createInteropEventType<{
  payloadHash: Hex
  remoteChainId: number
  remoteIdentifier: Hex
  application: Hex
}>('lifi-intents.OutputProven', {
  direction: 'incoming',
  ttl: 30 * UnixTime.DAY,
})

export class LifiIntentsPlugin implements InteropPluginResyncable {
  readonly name = 'lifi-intents'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: intentRegisteredLog,
        addresses: toChainSpecificAddresses((n) => n.inputCompact),
      },
      {
        type: 'event',
        signature: openLog,
        addresses: toChainSpecificAddresses((n) => n.inputEscrow),
      },
      {
        type: 'event',
        signature: outputFilledLog,
        addresses: toChainSpecificAddresses((n) => n.outputSettler),
      },
      {
        type: 'event',
        signature: outputProvenLog,
        addresses: toChainSpecificAddresses((n) => n.polymerOracle),
      },
    ]
  }

  capture(input: LogToCapture) {
    const network = LIFI_INTENTS_NETWORKS.find((n) => n.chain === input.chain)
    if (!network) return

    const intentRegistered = parseIntentRegistered(input.log, [
      network.inputCompact,
    ])
    if (intentRegistered) {
      return this.captureOrder(
        input,
        intentRegistered.orderId,
        intentRegistered.order,
      )
    }

    const open = parseOpen(input.log, [network.inputEscrow])
    if (open) {
      return this.captureOrder(input, open.orderId, open.order)
    }

    const outputFilled = parseOutputFilled(input.log, [network.outputSettler])
    if (outputFilled) {
      const output = normalizeOutput(outputFilled.output)
      const outputHash = hashMandateOutput(output)
      const payloadHash = hashFillDescription(
        normalizeBytes32(outputFilled.solver),
        normalizeBytes32(outputFilled.orderId),
        Number(outputFilled.timestamp),
        output,
      )

      const remoteIdentifier = normalizeBytes32(output.oracle)
      const application = normalizeBytes32(output.settler)
      return [
        LifiIntentsOutputFilled.create(input, {
          orderId: normalizeBytes32(outputFilled.orderId),
          outputHash,
          payloadHash,
          chainId: Number(output.chainId),
          solver: normalizeBytes32(outputFilled.solver),
          timestamp: Number(outputFilled.timestamp),
          token: identifierToAddress32(output.token),
          amount: output.amount,
          finalAmount: outputFilled.finalAmount,
        }),
        // Separate event so transfer matching can consume OutputFilled while
        // settlement matching can still observe Polymer proof usage later.
        LifiIntentsOutputPayload.create(input, {
          payloadHash,
          remoteChainId: Number(output.chainId),
          remoteIdentifier,
          application,
        }),
      ]
    }

    const outputProven = parseOutputProven(input.log, [network.polymerOracle])
    if (outputProven) {
      return [
        LifiIntentsOutputProven.create(input, {
          payloadHash: normalizeBytes32(outputProven.payloadHash),
          remoteChainId: Number(outputProven.chainid),
          remoteIdentifier: normalizeBytes32(outputProven.remoteIdentifier),
          application: normalizeBytes32(outputProven.application),
        }),
      ]
    }
  }

  matchTypes = [
    LifiIntentsOutputFilled,
    LifiIntentsOutputRequested,
    LifiIntentsOutputProven,
  ]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (LifiIntentsOutputFilled.checkType(event)) {
      return this.matchOutputFilled(event, db)
    }

    if (LifiIntentsOutputRequested.checkType(event)) {
      return this.matchOutputRequested(event, db)
    }

    if (LifiIntentsOutputProven.checkType(event)) {
      return this.matchOutputProven(event, db)
    }
  }

  private captureOrder(
    input: LogToCapture,
    orderId: Hex,
    order: StandardOrder,
  ) {
    const inputCount = order.inputs.length
    const outputCount = order.outputs.length
    const singleInput = inputCount === 1 ? order.inputs[0] : undefined
    const originChainId = Number(order.originChainId)

    return order.outputs.map((rawOutput, outputIndex) => {
      const output = normalizeOutput(rawOutput)
      const destinationChainId = Number(output.chainId)

      return LifiIntentsOutputRequested.create(input, {
        orderId: normalizeBytes32(orderId),
        outputHash: hashMandateOutput(output),
        originChainId,
        destinationChainId,
        $dstChain: findChain(
          LIFI_INTENTS_NETWORKS,
          (n) => n.chainId,
          destinationChainId,
        ),
        outputIndex,
        inputCount,
        outputCount,
        inputToken: singleInput
          ? identifierToAddress32(singleInput[0])
          : undefined,
        inputAmount: singleInput?.[1],
        outputToken: identifierToAddress32(output.token),
        outputAmount: output.amount,
      })
    })
  }

  private matchOutputFilled(
    outputFilled: InteropEvent<{
      orderId: Hex
      outputHash: Hex
      payloadHash: Hex
      chainId: number
      solver: Hex
      timestamp: number
      token: Address32
      amount: bigint
      finalAmount: bigint
    }>,
    db: InteropEventDb,
  ) {
    const outputRequested = db.find(LifiIntentsOutputRequested, {
      orderId: outputFilled.args.orderId,
      outputHash: outputFilled.args.outputHash,
    })
    if (!outputRequested) return

    return createTransferMatch(outputRequested, outputFilled)
  }

  private matchOutputRequested(
    outputRequested: InteropEvent<{
      orderId: Hex
      outputHash: Hex
      originChainId: number
      destinationChainId: number
      $dstChain: string
      outputIndex: number
      inputCount: number
      outputCount: number
      inputToken?: Address32
      inputAmount?: bigint
      outputToken: Address32
      outputAmount: bigint
    }>,
    db: InteropEventDb,
  ) {
    const outputFilled = db.find(LifiIntentsOutputFilled, {
      orderId: outputRequested.args.orderId,
      outputHash: outputRequested.args.outputHash,
    })
    if (!outputFilled) return

    return createTransferMatch(outputRequested, outputFilled)
  }

  private matchOutputProven(
    outputProven: InteropEvent<{
      payloadHash: Hex
      remoteChainId: number
      remoteIdentifier: Hex
      application: Hex
    }>,
    db: InteropEventDb,
  ): MatchResult | undefined {
    const payload = db.find(LifiIntentsOutputPayload, {
      payloadHash: outputProven.args.payloadHash,
      remoteChainId: outputProven.args.remoteChainId,
      remoteIdentifier: outputProven.args.remoteIdentifier,
      application: outputProven.args.application,
    })
    if (!payload) return

    return [
      Result.Message('lifi-intents.SettlementMessage', {
        app: 'lifi-intents',
        srcEvent: payload,
        dstEvent: outputProven,
      }),
    ]
  }
}

function createTransferMatch(
  outputRequested: InteropEvent<{
    orderId: Hex
    outputHash: Hex
    originChainId: number
    destinationChainId: number
    $dstChain: string
    outputIndex: number
    inputCount: number
    outputCount: number
    inputToken?: Address32
    inputAmount?: bigint
    outputToken: Address32
    outputAmount: bigint
  }>,
  outputFilled: InteropEvent<{
    orderId: Hex
    outputHash: Hex
    payloadHash: Hex
    chainId: number
    solver: Hex
    timestamp: number
    token: Address32
    amount: bigint
    finalAmount: bigint
  }>,
): MatchResult {
  const includeSourceToken =
    outputRequested.args.inputCount === 1 &&
    outputRequested.args.outputCount === 1

  return [
    Result.Message('lifi-intents.Message', {
      app: 'lifi-intents',
      srcEvent: outputRequested,
      dstEvent: outputFilled,
    }),
    Result.Transfer('lifi-intents.Transfer', {
      srcEvent: outputRequested,
      srcTokenAddress: includeSourceToken
        ? outputRequested.args.inputToken
        : undefined,
      srcAmount: includeSourceToken
        ? outputRequested.args.inputAmount
        : undefined,
      srcWasBurned: false,
      dstEvent: outputFilled,
      dstTokenAddress: outputFilled.args.token,
      dstAmount: outputFilled.args.finalAmount,
      dstWasMinted: false,
      bridgeType: 'nonMinting',
    }),
  ]
}

function toChainSpecificAddresses(
  getAddress: (
    network: (typeof LIFI_INTENTS_NETWORKS)[number],
  ) => EthereumAddress,
) {
  return LIFI_INTENTS_NETWORKS.map((network) =>
    ChainSpecificAddress.fromLong(network.chain, getAddress(network)),
  )
}

function normalizeOutput(output: MandateOutput): MandateOutput {
  return {
    oracle: normalizeBytes32(output.oracle),
    settler: normalizeBytes32(output.settler),
    chainId: BigInt(output.chainId),
    token: normalizeBytes32(output.token),
    amount: BigInt(output.amount),
    recipient: normalizeBytes32(output.recipient),
    callbackData: normalizeBytes(output.callbackData),
    context: normalizeBytes(output.context),
  }
}

function hashMandateOutput(output: MandateOutput): Hex {
  return keccak256(
    encodePacked(
      [
        'bytes32',
        'bytes32',
        'uint256',
        'bytes32',
        'uint256',
        'bytes32',
        'uint16',
        'bytes',
        'uint16',
        'bytes',
      ],
      [
        output.oracle,
        output.settler,
        output.chainId,
        output.token,
        output.amount,
        output.recipient,
        byteLength(output.callbackData),
        output.callbackData,
        byteLength(output.context),
        output.context,
      ],
    ),
  )
}

function hashFillDescription(
  solver: Hex,
  orderId: Hex,
  timestamp: number,
  output: MandateOutput,
): Hex {
  return keccak256(
    encodePacked(
      [
        'bytes32',
        'bytes32',
        'uint32',
        'bytes32',
        'uint256',
        'bytes32',
        'uint16',
        'bytes',
        'uint16',
        'bytes',
      ],
      [
        solver,
        orderId,
        timestamp,
        output.token,
        output.amount,
        output.recipient,
        byteLength(output.callbackData),
        output.callbackData,
        byteLength(output.context),
        output.context,
      ],
    ),
  )
}

function identifierToAddress32(value: Hex | bigint): Address32 {
  const hex =
    typeof value === 'bigint'
      ? value.toString(16).padStart(64, '0')
      : value.slice(2).toLowerCase().padStart(64, '0')
  const address = hex.slice(-40)

  if (BigInt(`0x${address}`) === 0n) {
    return Address32.NATIVE
  }

  return Address32.from(`0x${address}`)
}

function normalizeBytes32(value: Hex | bigint): Hex {
  if (typeof value === 'bigint') {
    return `0x${value.toString(16).padStart(64, '0')}` as Hex
  }
  return `0x${value.slice(2).toLowerCase().padStart(64, '0')}` as Hex
}

function normalizeBytes(value: Hex): Hex {
  return value.toLowerCase() as Hex
}

function byteLength(value: Hex): number {
  return (value.length - 2) / 2
}
