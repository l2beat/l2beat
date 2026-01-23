import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { findParsedAround } from './hyperlane-hwr'
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

// == Event signatures ==

const newPriorityRequestIdLog =
  'event NewPriorityRequestId(uint256 indexed txId, bytes32 indexed txHash)'

const bridgehubDepositBaseTokenInitiatedLog =
  'event BridgehubDepositBaseTokenInitiated(uint256 indexed chainId, address indexed from, bytes32 assetId, uint256 amount)'

const bridgehubDepositInitiatedLog =
  'event BridgehubDepositInitiated(uint256 indexed chainId, bytes32 indexed txDataHash, address indexed from, bytes32 assetId, bytes bridgeMintCalldata)'

const newPriorityRequestLog =
  'event NewPriorityRequest(uint256 txId, bytes32 txHash, uint64 expirationTimestamp, (uint256 txType, uint256 from, uint256 to, uint256 gasLimit, uint256 gasPerPubdataByteLimit, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, uint256 paymaster, uint256 nonce, uint256 value, uint256[4] reserved, bytes data, bytes signature, uint256[] factoryDeps, bytes paymasterInput, bytes reservedDynamic) transaction, bytes[] factoryDeps)'

const l1MessageSentLog =
  'event L1MessageSent(address indexed sender, bytes32 indexed hash, bytes message)'

const withdrawalLog =
  'event Withdrawal(address indexed l2Sender, address indexed l1Receiver, uint256 amount)'

const l2ToL1LogSentLog =
  'event L2ToL1LogSent((uint8 l2ShardId, bool isService, uint16 txNumberInBlock, address sender, bytes32 key, bytes32 value) _l2log)'

const bridgeMintLog =
  'event BridgeMint(uint256 indexed chainId, bytes32 indexed assetId, address receiver, uint256 amount)'

// BridgeMint (index_topic_1 uint256 chainId, index_topic_2 bytes32 assetId, index_topic_3 address receiver, data uint256 amount)

const bridgeBurnLog =
  'event BridgeBurn(uint256 indexed chainId, bytes32 indexed assetId, address indexed sender, address receiver, uint256 amount)'

const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'

// == Parsers ==

const parseNewPriorityRequestId = createEventParser(newPriorityRequestIdLog)
const parseBridgehubDepositBaseTokenInitiated = createEventParser(
  bridgehubDepositBaseTokenInitiatedLog,
)
const parseBridgehubDepositInitiated = createEventParser(
  bridgehubDepositInitiatedLog,
)
const parseNewPriorityRequest = createEventParser(newPriorityRequestLog)
const parseL1MessageSent = createEventParser(l1MessageSentLog)
const parseWithdrawal = createEventParser(withdrawalLog)
const parseL2ToL1LogSent = createEventParser(l2ToL1LogSentLog)
const parseBridgeMint = createEventParser(bridgeMintLog)
const parseBridgeBurn = createEventParser(bridgeBurnLog)
const parseTransfer = createEventParser(transferLog)

// == Networks ==

interface ZkStackNetwork {
  chainId: number
  chain: string
  diamondAddress: ChainSpecificAddress
  l1AssetRouter: ChainSpecificAddress
  l1NativeTokenVault: ChainSpecificAddress
  l2SharedBridge: ChainSpecificAddress
  l2L1Messenger: ChainSpecificAddress
  l2EthToken: ChainSpecificAddress
}

// this would equally work without all specific addresses except diamond
// but they are probably good for perf/resyncing
const ZKSTACK_SUPPORTED = defineNetworks<ZkStackNetwork>('zkstack', [
  {
    chainId: 324,
    chain: 'zksync2',
    diamondAddress: ChainSpecificAddress(
      'eth:0x32400084C286CF3E17e7B677ea9583e60a000324',
    ),
    l1AssetRouter: ChainSpecificAddress(
      'eth:0x8829AD80E425C646DAB305381ff105169FeEcE56',
    ),
    l1NativeTokenVault: ChainSpecificAddress(
      'eth:0xbeD1EB542f9a5aA6419Ff3deb921A372681111f6',
    ),
    l2SharedBridge: ChainSpecificAddress(
      'zksync:0x0000000000000000000000000000000000010004',
    ),
    l2L1Messenger: ChainSpecificAddress(
      'zksync:0x0000000000000000000000000000000000008008',
    ),
    l2EthToken: ChainSpecificAddress(
      'zksync:0x000000000000000000000000000000000000800A',
    ),
  },
])

function getNetworkByChainId(chainId: bigint): ZkStackNetwork | undefined {
  return ZKSTACK_SUPPORTED.find((n) => BigInt(n.chainId) === chainId)
}

function getNetworkByDiamondAddress(
  address: EthereumAddress,
): ZkStackNetwork | undefined {
  return ZKSTACK_SUPPORTED.find(
    (n) => ChainSpecificAddress.address(n.diamondAddress) === address,
  )
}

function getNetworkByL2Chain(chain: string): ZkStackNetwork | undefined {
  return ZKSTACK_SUPPORTED.find((n) => n.chain === chain)
}

const ZKSYNC_GAS_ASSET_ID =
  '0x05e1c3ae4b9732444ae25217ac7666e46fa365fee1768de00c9fcb65532b7609'

function zkstackWithdrawMatchId(
  assetId: `0x${string}`,
  receiver: EthereumAddress,
  amount: bigint,
): string {
  return `${assetId.toLowerCase()}-${receiver.toLowerCase()}-${amount.toString()}`
}

// == Event types ==

const NewPriorityRequestId = createInteropEventType<{
  txId: bigint
  txHash: `0x${string}`
  $dstChain: string
}>('zkstack.NewPriorityRequestId', { direction: 'outgoing' })

const BridgehubDepositBaseTokenInitiated = createInteropEventType<{
  chainId: number
  amount: bigint
  srcTokenAddress?: Address32
  srcAmount?: bigint
  $dstChain: string
}>('zkstack.BridgehubDepositBaseTokenInitiated', { direction: 'outgoing' })

const BridgehubDepositInitiated = createInteropEventType<{
  chainId: number
  assetId: `0x${string}`
  srcTokenAddress: Address32
  srcAmount: bigint
  $dstChain: string
}>('zkstack.BridgehubDepositInitiated', { direction: 'outgoing' })

const L2ToL1LogSent = createInteropEventType<object>('zkstack.L2ToL1LogSent', {
  direction: 'incoming', // TODO: for now incoming
})

const L1MessageSent = createInteropEventType<object>('zkstack.L1MessageSent', {
  direction: 'outgoing',
})

const Withdrawal = createInteropEventType<{
  matchId: string
  assetId: `0x${string}`
  receiver: EthereumAddress
  srcTokenAddress: Address32
  srcAmount: bigint
}>('zkstack.Withdrawal', { direction: 'outgoing' })

const BridgeBurn = createInteropEventType<{
  matchId: string
  assetId: `0x${string}`
  receiver: EthereumAddress
  srcTokenAddress: Address32
  srcAmount: bigint
}>('zkstack.BridgeBurn', { direction: 'outgoing' })

const BridgeMint = createInteropEventType<{
  chainId: number
  assetId: `0x${string}`
  dstTokenAddress: Address32
  dstAmount: bigint
}>('zkstack.BridgeMint', { direction: 'incoming' })

const BridgeMintL1 = createInteropEventType<{
  matchId: string
  chainId: number
  assetId: `0x${string}`
  receiver: EthereumAddress
  dstTokenAddress?: Address32
  dstAmount: bigint
}>('zkstack.BridgeMintL1', { direction: 'incoming' })

export class ZkStackPlugin implements InteropPluginResyncable {
  readonly name = 'zkstack'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: newPriorityRequestIdLog,
        addresses: ZKSTACK_SUPPORTED.map((n) => n.diamondAddress),
      },
      {
        type: 'event',
        signature: bridgehubDepositBaseTokenInitiatedLog,
        includeTxEvents: [newPriorityRequestLog],
        addresses: ZKSTACK_SUPPORTED.map((n) => n.l1AssetRouter),
      },
      {
        type: 'event',
        signature: bridgehubDepositInitiatedLog,
        includeTxEvents: [bridgeBurnLog, transferLog],
        addresses: ZKSTACK_SUPPORTED.map((n) => n.l1AssetRouter),
      },
      {
        type: 'event',
        signature: bridgeMintLog,
        includeTxEvents: [transferLog],
        addresses: ZKSTACK_SUPPORTED.map((n) => n.l1NativeTokenVault),
      },
      {
        type: 'event',
        signature: l2ToL1LogSentLog,
        addresses: ZKSTACK_SUPPORTED.map((n) => n.l2L1Messenger),
      },
      {
        type: 'event',
        signature: l1MessageSentLog,
        addresses: ZKSTACK_SUPPORTED.map((n) => n.l2L1Messenger),
      },
      {
        type: 'event',
        signature: withdrawalLog,
        addresses: ZKSTACK_SUPPORTED.map((n) => n.l2EthToken),
      },
      {
        type: 'event',
        signature: bridgeBurnLog,
        includeTxEvents: [transferLog],
        addresses: ZKSTACK_SUPPORTED.map((n) => n.l2SharedBridge),
      },
      {
        type: 'event',
        signature: bridgeMintLog,
        includeTxEvents: [transferLog],
        addresses: ZKSTACK_SUPPORTED.map((n) => n.l2SharedBridge),
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const newPriorityRequestId = parseNewPriorityRequestId(input.log, [
        ...ZKSTACK_SUPPORTED.map((n) =>
          ChainSpecificAddress.address(n.diamondAddress),
        ),
      ])
      if (newPriorityRequestId) {
        const network = getNetworkByDiamondAddress(
          EthereumAddress(input.log.address),
        )
        if (!network) return

        return [
          NewPriorityRequestId.create(input, {
            txId: newPriorityRequestId.txId,
            txHash: newPriorityRequestId.txHash,
            $dstChain: network.chain,
          }),
        ]
      }

      const baseTokenDeposit = parseBridgehubDepositBaseTokenInitiated(
        input.log,
        [
          ...ZKSTACK_SUPPORTED.map((n) =>
            ChainSpecificAddress.address(n.l1AssetRouter),
          ),
        ],
      )
      if (baseTokenDeposit) {
        const network = getNetworkByChainId(baseTokenDeposit.chainId)
        if (!network) return

        const startLogIndex = input.log.logIndex ?? -1
        const priorityRequestValue = findParsedAround(
          input.txLogs,
          startLogIndex,
          (log) => {
            const parsed = parseNewPriorityRequest(log, [
              ChainSpecificAddress.address(network.diamondAddress),
            ])
            if (!parsed) return
            return parsed.transaction.value
          },
        )

        const isTransfer = (priorityRequestValue ?? 0n) > 0n
        const srcTokenAddress = isTransfer ? Address32.NATIVE : undefined
        const srcAmount = isTransfer ? baseTokenDeposit.amount : undefined

        return [
          BridgehubDepositBaseTokenInitiated.create(input, {
            chainId: Number(baseTokenDeposit.chainId),
            amount: baseTokenDeposit.amount,
            srcTokenAddress,
            srcAmount,
            $dstChain: network.chain,
          }),
        ]
      }

      const depositInitiated = parseBridgehubDepositInitiated(input.log, [
        ...ZKSTACK_SUPPORTED.map((n) =>
          ChainSpecificAddress.address(n.l1AssetRouter),
        ),
      ])
      if (depositInitiated) {
        const network = getNetworkByChainId(depositInitiated.chainId)
        if (!network) return

        const startLogIndex = input.log.logIndex ?? -1
        const bridgeBurn = findParsedAround(
          input.txLogs,
          startLogIndex,
          (log) => {
            const parsed = parseBridgeBurn(log, null)
            if (!parsed) return
            if (parsed.chainId !== depositInitiated.chainId) return
            if (parsed.assetId !== depositInitiated.assetId) return
            return parsed
          },
        )
        if (!bridgeBurn) return

        const transferMatch = findParsedAround(
          input.txLogs,
          startLogIndex,
          (log) => {
            const transfer = parseTransfer(log, null)
            if (!transfer) return
            if (transfer.value !== bridgeBurn.amount) return
            return {
              tokenAddress: Address32.from(log.address),
              amount: transfer.value,
            }
          },
        )
        if (!transferMatch) return

        return [
          BridgehubDepositInitiated.create(input, {
            chainId: Number(depositInitiated.chainId),
            assetId: depositInitiated.assetId,
            srcTokenAddress: transferMatch.tokenAddress,
            srcAmount: bridgeBurn.amount,
            $dstChain: network.chain,
          }),
        ]
      }

      const bridgeMint = parseBridgeMint(input.log, [
        ...ZKSTACK_SUPPORTED.map((n) =>
          ChainSpecificAddress.address(n.l1NativeTokenVault),
        ),
      ])
      if (bridgeMint) {
        // must be from supported chain to ethereum
        if (input.chain !== 'ethereum') return
        const $srcChain = getNetworkByChainId(bridgeMint.chainId)
        if (!$srcChain) return

        const receiver = EthereumAddress(bridgeMint.receiver)
        const matchId = zkstackWithdrawMatchId(
          bridgeMint.assetId,
          receiver,
          bridgeMint.amount,
        )

        const startLogIndex = input.log.logIndex ?? -1
        const transferMatch = findParsedAround(
          input.txLogs,
          startLogIndex,
          (log) => {
            const transfer = parseTransfer(log, null)
            if (!transfer) return
            if (transfer.value !== bridgeMint.amount) return
            return {
              tokenAddress: Address32.from(log.address),
              amount: transfer.value,
            }
          },
        )

        const dstTokenAddress =
          transferMatch?.tokenAddress ??
          (bridgeMint.assetId.toLowerCase() === ZKSYNC_GAS_ASSET_ID
            ? Address32.NATIVE
            : undefined)

        return [
          BridgeMintL1.create(input, {
            matchId,
            chainId: Number(bridgeMint.chainId),
            assetId: bridgeMint.assetId,
            receiver,
            dstTokenAddress,
            dstAmount: bridgeMint.amount,
          }),
        ]
      }

      return
    }

    // only capture events that are on ethereum ^ or a supported L2 v
    const network = getNetworkByL2Chain(input.chain)
    if (!network) return

    const l1MessageSent = parseL1MessageSent(input.log, [
      ChainSpecificAddress.address(network.l2L1Messenger),
    ])
    if (l1MessageSent) {
      return [L1MessageSent.create(input, {})]
    }

    // to capture this event seems useless but is needed for gas token deposits to L2
    // since they do not emit anything else
    const l2ToL1LogSent = parseL2ToL1LogSent(input.log, [
      ChainSpecificAddress.address(network.l2L1Messenger),
    ])
    if (l2ToL1LogSent) {
      return [L2ToL1LogSent.create(input, {})]
    }

    const withdrawal = parseWithdrawal(input.log, [
      ChainSpecificAddress.address(network.l2EthToken),
    ])
    if (withdrawal) {
      const receiver = EthereumAddress(withdrawal.l1Receiver)
      const matchId = zkstackWithdrawMatchId(
        ZKSYNC_GAS_ASSET_ID,
        receiver,
        withdrawal.amount,
      )
      return [
        Withdrawal.create(input, {
          matchId,
          assetId: ZKSYNC_GAS_ASSET_ID,
          receiver,
          srcTokenAddress: Address32.NATIVE,
          srcAmount: withdrawal.amount,
        }),
      ]
    }

    const bridgeBurn = parseBridgeBurn(input.log, [
      ChainSpecificAddress.address(network.l2SharedBridge),
    ])
    if (bridgeBurn) {
      if (bridgeBurn.chainId !== 1n) return

      const startLogIndex = input.log.logIndex ?? -1
      const transferMatch = findParsedAround(
        input.txLogs,
        startLogIndex,
        (log) => {
          const transfer = parseTransfer(log, null)
          if (!transfer) return
          if (transfer.value !== bridgeBurn.amount) return
          return {
            tokenAddress: Address32.from(log.address),
            amount: transfer.value,
          }
        },
      )
      if (!transferMatch) return

      const receiver = EthereumAddress(bridgeBurn.receiver)
      const matchId = zkstackWithdrawMatchId(
        bridgeBurn.assetId,
        receiver,
        bridgeBurn.amount,
      )

      return [
        BridgeBurn.create(input, {
          matchId,
          assetId: bridgeBurn.assetId,
          receiver,
          srcTokenAddress: transferMatch.tokenAddress,
          srcAmount: bridgeBurn.amount,
        }),
      ]
    }

    const bridgeMint = parseBridgeMint(input.log, [
      ChainSpecificAddress.address(network.l2SharedBridge),
    ])
    if (bridgeMint) {
      // bridgeMint is emitted on both sides, we make sure to capture the incoming one
      if (bridgeMint.chainId !== 1n) return

      const startLogIndex = input.log.logIndex ?? -1
      const transferMatch = findParsedAround(
        input.txLogs,
        startLogIndex,
        (log) => {
          const transfer = parseTransfer(log, null)
          if (!transfer) return
          if (transfer.value !== bridgeMint.amount) return
          return {
            tokenAddress: Address32.from(log.address),
            amount: transfer.value,
          }
        },
      )
      if (!transferMatch) return

      return [
        BridgeMint.create(input, {
          chainId: Number(bridgeMint.chainId),
          assetId: bridgeMint.assetId,
          dstTokenAddress: transferMatch.tokenAddress,
          dstAmount: bridgeMint.amount,
        }),
      ]
    }
  }

  matchTypes = [NewPriorityRequestId, BridgeMintL1]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (NewPriorityRequestId.checkType(event)) {
      const l2LogSent = db.find(L2ToL1LogSent, {
        ctx: { txHash: event.args.txHash, chain: event.args.$dstChain },
      })
      if (!l2LogSent) return

      const baseTokenDeposit = db.find(BridgehubDepositBaseTokenInitiated, {
        sameTxBefore: event,
      })
      if (!baseTokenDeposit) return

      const depositInitiated = db.find(BridgehubDepositInitiated, {
        sameTxBefore: event,
      })

      // erc-20 case
      if (depositInitiated) {
        const bridgeMint = db.find(BridgeMint, {
          sameTxBefore: l2LogSent,
        })
        if (!bridgeMint) return

        return [
          Result.Message('zksync.Message', {
            app: 'canonical-erc20',
            srcEvent: event,
            dstEvent: l2LogSent,
          }),
          Result.Transfer('canonical-erc20.Transfer', {
            srcEvent: depositInitiated,
            srcTokenAddress: depositInitiated.args.srcTokenAddress,
            srcAmount: depositInitiated.args.srcAmount,
            dstEvent: bridgeMint,
            dstTokenAddress: bridgeMint.args.dstTokenAddress,
            dstAmount: bridgeMint.args.dstAmount,
          }),
        ]
      }

      // gas token case
      if (
        baseTokenDeposit.args.srcAmount !== undefined &&
        baseTokenDeposit.args.srcTokenAddress !== undefined
      ) {
        return [
          Result.Message('zksync.Message', {
            app: 'canonical-gas',
            srcEvent: event,
            dstEvent: l2LogSent,
          }),
          Result.Transfer('canonical-gas.Transfer', {
            srcEvent: baseTokenDeposit,
            srcTokenAddress: baseTokenDeposit.args.srcTokenAddress,
            srcAmount: baseTokenDeposit.args.srcAmount,
            dstEvent: l2LogSent,
            dstTokenAddress: Address32.NATIVE,
            dstAmount: baseTokenDeposit.args.amount,
          }),
        ]
      }

      // message case (no transfer)
      return [
        Result.Message('zksync.Message', {
          app: 'unknown',
          srcEvent: event,
          dstEvent: l2LogSent,
        }),
      ]
    }

    if (BridgeMintL1.checkType(event)) {
      const gasWithdrawal = db.find(Withdrawal, {
        matchId: event.args.matchId,
      })
      if (gasWithdrawal) {
        const l1MessageSent = db.find(L1MessageSent, {
          sameTxBefore: gasWithdrawal,
        })
        if (!l1MessageSent) return

        return [
          Result.Message('zksync.Message', {
            app: 'canonical-gas',
            srcEvent: l1MessageSent,
            dstEvent: event,
          }),
          Result.Transfer('canonical-gas.Transfer', {
            srcEvent: gasWithdrawal,
            srcTokenAddress: gasWithdrawal.args.srcTokenAddress,
            srcAmount: gasWithdrawal.args.srcAmount,
            dstEvent: event,
            dstTokenAddress: event.args.dstTokenAddress ?? Address32.NATIVE,
            dstAmount: event.args.dstAmount,
            extraEvents: [gasWithdrawal],
          }),
        ]
      }

      const bridgeBurn = db.find(BridgeBurn, {
        matchId: event.args.matchId,
      })
      if (!bridgeBurn) return

      const l1MessageSent = db.find(L1MessageSent, {
        sameTxAfter: bridgeBurn,
      })
      if (!l1MessageSent) return

      return [
        Result.Message('zksync.Message', {
          app: 'canonical-erc20',
          srcEvent: l1MessageSent,
          dstEvent: event,
        }),
        Result.Transfer('canonical-erc20.Transfer', {
          srcEvent: bridgeBurn,
          srcTokenAddress: bridgeBurn.args.srcTokenAddress,
          srcAmount: bridgeBurn.args.srcAmount,
          dstEvent: event,
          dstTokenAddress: event.args.dstTokenAddress,
          dstAmount: event.args.dstAmount,
        }),
      ]
    }
  }
}
