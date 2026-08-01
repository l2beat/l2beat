/**
 * Axelar AMB and token bridge
 * this token bridge is confusingly branded under 'Squid'
 */
import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import { findBestTransferLogByExactAmount, findParsedAround } from './logScan'
import { getBestEffortBridgeTypeFromPartialSupplyAction } from './partialSupplyActionBridgeType'
import {
  createEventParser,
  createInteropEventType,
  defineNetworks,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const parseContractCall = createEventParser(
  'event ContractCall(address indexed sender,string destinationChain,string destinationContractAddress,bytes32 indexed payloadHash,bytes payload)',
)

const parseContractCallWithToken = createEventParser(
  'event ContractCallWithToken(address indexed sender,string destinationChain,string destinationContractAddress,bytes32 indexed payloadHash,bytes payload, string symbol, uint256 amount)',
)

const parseContractCallApproved = createEventParser(
  'event ContractCallApproved(bytes32 indexed commandId,string sourceChain, string sourceAddress, address indexed contractAddress,bytes32 indexed payloadHash,bytes32 sourceTxHash,uint256 sourceEventIndex)',
)

const parseContractCallApprovedWithMint = createEventParser(
  'event ContractCallApprovedWithMint(bytes32 indexed commandId,string sourceChain, string sourceAddress, address indexed contractAddress,bytes32 indexed payloadHash,string symbol, uint256 amount, bytes32 sourceTxHash,uint256 sourceEventIndex)',
)

const parseContractCallExecuted = createEventParser(
  'event ContractCallExecuted(bytes32 indexed commandId)',
)

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)
const parsePayloadVerified = createEventParser(
  'event PayloadVerified(address dvn, bytes header, uint256 confirmations, bytes32 proofHash)',
)

// https://docs.axelar.dev/resources/contract-addresses/mainnet/
// chainconfeeg
export const AXELAR_NETWORKS = defineNetworks('axelar', [
  { axelarChainName: 'Ethereum', chain: 'ethereum' },
  { axelarChainName: 'arbitrum', chain: 'arbitrum' },
  { axelarChainName: 'Arbitrum', chain: 'arbitrum' }, // yeah
  { axelarChainName: 'Avalanche', chain: 'avalanche' },
  { axelarChainName: 'base', chain: 'base' },
  { axelarChainName: 'Base', chain: 'base' },
  { axelarChainName: 'mantle', chain: 'mantle' },
  { axelarChainName: 'binance', chain: 'bsc' },
  { axelarChainName: 'linea', chain: 'linea' },
  { axelarChainName: 'optimism', chain: 'optimism' },
  { axelarChainName: 'Polygon', chain: 'polygonpos' },
  { axelarChainName: 'celo', chain: 'celo' },
  { axelarChainName: 'Avalanche', chain: 'avalanche' },
  { axelarChainName: 'hyperliquid', chain: 'hyperevm' },
  { axelarChainName: 'monad', chain: 'monad' },
  { axelarChainName: 'solana', chain: 'solana' },
  // tempo unsupported
])

export const ContractCall = createInteropEventType<{
  sender: EthereumAddress
  destinationContractAddress: string
  payloadHash: `0x${string}`
  $dstChain?: string
}>('axelar.ContractCall', { direction: 'outgoing' })

export const ContractCallWithToken = createInteropEventType<{
  sender: EthereumAddress
  destinationContractAddress: string
  payloadHash: `0x${string}`
  tokenAddress?: Address32
  symbol: string
  amount: bigint
  $dstChain?: string
  srcWasBurned?: boolean
}>('axelar.ContractCallWithToken', { direction: 'outgoing' })

export const ContractCallApproved = createInteropEventType<{
  commandId: `0x${string}`
  sourceAddress: string
  contractAddress: EthereumAddress
  srcTxHash: `0x${string}`
  payloadHash: `0x${string}`
  $srcChain?: string
}>('axelar.ContractCallApproved', { direction: 'incoming' })

export const ContractCallApprovedWithMint = createInteropEventType<{
  commandId: `0x${string}`
  sourceAddress: string
  contractAddress: EthereumAddress
  symbol: string
  amount: bigint
  srcTxHash: `0x${string}`
  payloadHash: `0x${string}`
  $srcChain?: string
}>('axelar.ContractCallApprovedWithMint', { direction: 'incoming' })

export const ContractCallExecuted = createInteropEventType<{
  commandId: `0x${string}`
  tokenAddressUnsafe?: Address32
  amountUnsafe?: bigint
  isLayerZeroApp?: boolean
  dstWasMinted?: boolean
}>('axelar.ContractCallExecuted', { direction: 'incoming' })

export class AxelarPlugin implements InteropPlugin {
  readonly name = 'axelar'

  constructor(private oneSidedChains: string[] = []) {}

  capture(input: LogToCapture) {
    const contractCall = parseContractCall(input.log, null)
    if (contractCall) {
      const dstChain = findChain(
        AXELAR_NETWORKS,
        (x) => x.axelarChainName,
        contractCall.destinationChain,
      )
      return [
        ContractCall.create(input, {
          sender: EthereumAddress(contractCall.sender),
          destinationContractAddress: contractCall.destinationContractAddress,
          payloadHash: contractCall.payloadHash,
          $dstChain: dstChain === 'Unknown_axelar' ? undefined : dstChain,
        }),
      ]
    }

    const contractCallWithToken = parseContractCallWithToken(input.log, null)
    if (contractCallWithToken) {
      const transferMatch = findBestTransferLogByExactAmount(
        input.txLogs,
        contractCallWithToken.amount,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log) => parseTransfer(log, null),
      )

      const dstChain = findChain(
        AXELAR_NETWORKS,
        (x) => x.axelarChainName,
        contractCallWithToken.destinationChain,
      )

      return [
        ContractCallWithToken.create(input, {
          sender: EthereumAddress(contractCallWithToken.sender),
          destinationContractAddress:
            contractCallWithToken.destinationContractAddress,
          payloadHash: contractCallWithToken.payloadHash,
          tokenAddress: transferMatch.transfer?.logAddress,
          symbol: contractCallWithToken.symbol,
          amount: contractCallWithToken.amount,
          $dstChain: dstChain === 'Unknown_axelar' ? undefined : dstChain,
          srcWasBurned: transferMatch.transfer
            ? transferMatch.transfer.to === Address32.ZERO
            : undefined,
        }),
      ]
    }

    const contractCallApproved = parseContractCallApproved(input.log, null)
    if (contractCallApproved) {
      const srcChain = findChain(
        AXELAR_NETWORKS,
        (x) => x.axelarChainName,
        contractCallApproved.sourceChain,
      )

      return [
        ContractCallApproved.create(input, {
          commandId: contractCallApproved.commandId,
          payloadHash: contractCallApproved.payloadHash,
          sourceAddress: contractCallApproved.sourceAddress,
          contractAddress: EthereumAddress(
            contractCallApproved.contractAddress,
          ),
          srcTxHash: contractCallApproved.sourceTxHash,
          $srcChain: srcChain === 'Unknown_axelar' ? undefined : srcChain,
        }),
      ]
    }

    const contractCallApprovedWithMint = parseContractCallApprovedWithMint(
      input.log,
      null,
    )
    if (contractCallApprovedWithMint) {
      const srcChain = findChain(
        AXELAR_NETWORKS,
        (x) => x.axelarChainName,
        contractCallApprovedWithMint.sourceChain,
      )

      return [
        ContractCallApprovedWithMint.create(input, {
          commandId: contractCallApprovedWithMint.commandId,
          payloadHash: contractCallApprovedWithMint.payloadHash,
          sourceAddress: contractCallApprovedWithMint.sourceAddress,
          contractAddress: EthereumAddress(
            contractCallApprovedWithMint.contractAddress,
          ),
          symbol: contractCallApprovedWithMint.symbol,
          amount: contractCallApprovedWithMint.amount,
          srcTxHash: contractCallApprovedWithMint.sourceTxHash,
          $srcChain: srcChain === 'Unknown_axelar' ? undefined : srcChain,
        }),
      ]
    }

    const contractCallExecuted = parseContractCallExecuted(input.log, null)
    if (contractCallExecuted) {
      const nearestTransferInfo = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log, _index) => {
          const transfer = parseTransfer(log, null)
          if (transfer) {
            const from = Address32.from(transfer.from)
            const axelarGatewayAddress = Address32.from(input.log.address)
            // checking whether the token came from the gateway, not sure this is enough
            if (from === axelarGatewayAddress || from === Address32.ZERO)
              return {
                address: Address32.from(log.address),
                amount: transfer.value,
                minted: from === Address32.ZERO,
              }
          }
          const payloadVerified = parsePayloadVerified(log, null)
          if (payloadVerified) {
            return { isLayerZeroApp: true }
          }
        },
      )

      const tokenAddressUnsafe = nearestTransferInfo?.address
      const amountUnsafe = nearestTransferInfo?.amount

      return [
        ContractCallExecuted.create(input, {
          commandId: contractCallExecuted.commandId,
          tokenAddressUnsafe,
          amountUnsafe,
          isLayerZeroApp: nearestTransferInfo?.isLayerZeroApp,
          dstWasMinted: nearestTransferInfo?.minted,
        }),
      ]
    }
  }

  /* Match algorithm:

  1. Start with contractCallExecuted on DST chain
  2. Find corresponding contractCallApproved or contractCallApprovedWithMint on DST chain using commandId
  3. Find corresponding contractCall or contractCallWithToken on SRC chain using payloadHash and srcTxHash

  */

  matchTypes = [ContractCallExecuted, ContractCallWithToken]
  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (ContractCallExecuted.checkType(event)) {
      return this.matchExecuted(event, db)
    }

    if (ContractCallWithToken.checkType(event)) {
      return this.matchOneSidedSent(event, db)
    }
  }

  private matchExecuted(
    contractCallExecuted: InteropEvent<{
      commandId: `0x${string}`
      tokenAddressUnsafe?: Address32
      amountUnsafe?: bigint
      isLayerZeroApp?: boolean
      dstWasMinted?: boolean
    }>,
    db: InteropEventDb,
  ): MatchResult | undefined {
    const contractCallApproved = db.find(ContractCallApproved, {
      commandId: contractCallExecuted.args.commandId,
    })
    if (contractCallApproved) {
      const contractCall = db.find(ContractCall, {
        ctx: {
          txHash: contractCallApproved.args.srcTxHash, // TODO: this does not match if axelar chain is used as an intermediate hop, same with the payloadHash
        },
      })
      if (!contractCall) return
      return [
        Result.Message('axelar.Message', {
          app: contractCallExecuted.args.isLayerZeroApp
            ? 'layerzero-wrapper'
            : 'unknown',
          srcEvent: contractCall,
          dstEvent: contractCallExecuted,
          extraEvents: [contractCallApproved],
        }),
      ]
    }

    const contractCallApprovedWithMint = db.find(ContractCallApprovedWithMint, {
      commandId: contractCallExecuted.args.commandId,
    })
    if (!contractCallApprovedWithMint) return

    const contractCallWithToken = db.find(ContractCallWithToken, {
      ctx: {
        txHash: contractCallApprovedWithMint.args.srcTxHash, // TODO: this does not match if axelar chain is used as an intermediate hop, same with the payloadHash
      },
    })

    const matchingUnsafeAmount =
      contractCallApprovedWithMint.args.amount ===
      contractCallExecuted.args.amountUnsafe

    if (!contractCallWithToken) {
      const srcChain = contractCallApprovedWithMint.args.$srcChain
      if (!srcChain || !this.oneSidedChains.includes(srcChain)) return

      return [
        Result.Transfer('axelar.Transfer', {
          srcChain,
          dstEvent: contractCallExecuted,
          dstTokenAddress: matchingUnsafeAmount
            ? contractCallExecuted.args.tokenAddressUnsafe
            : undefined,
          dstAmount: matchingUnsafeAmount
            ? contractCallApprovedWithMint.args.amount
            : undefined,
          dstWasMinted: contractCallExecuted.args.dstWasMinted,
          bridgeType: getBestEffortBridgeTypeFromPartialSupplyAction({
            srcWasBurned: undefined,
            dstWasMinted: contractCallExecuted.args.dstWasMinted,
          }),
          extraEvents: [contractCallApprovedWithMint],
        }),
      ]
    }

    const srcTokenAddress = contractCallWithToken.args.tokenAddress
    const dstTokenAddress = matchingUnsafeAmount
      ? contractCallExecuted.args.tokenAddressUnsafe
      : undefined
    const srcWasBurned = contractCallWithToken.args.srcWasBurned
    const dstWasMinted = contractCallExecuted.args.dstWasMinted
    return [
      Result.Message('axelar.Message', {
        app: 'axelar-tokenbridge',
        srcEvent: contractCallWithToken,
        dstEvent: contractCallExecuted,
        extraEvents: [contractCallApprovedWithMint],
      }),
      Result.Transfer('axelar.Transfer', {
        srcEvent: contractCallWithToken,
        srcTokenAddress,
        srcAmount: contractCallWithToken.args.amount,
        srcWasBurned,
        dstEvent: contractCallExecuted,
        dstTokenAddress,
        dstAmount: matchingUnsafeAmount
          ? contractCallApprovedWithMint.args.amount
          : undefined,
        dstWasMinted,
      }),
    ]
  }

  private matchOneSidedSent(
    contractCallWithToken: InteropEvent<{
      sender: EthereumAddress
      destinationContractAddress: string
      payloadHash: `0x${string}`
      tokenAddress?: Address32
      symbol: string
      amount: bigint
      $dstChain?: string
      srcWasBurned?: boolean
    }>,
    db: InteropEventDb,
  ): MatchResult | undefined {
    const dstChain = contractCallWithToken.args.$dstChain
    if (!dstChain || !this.oneSidedChains.includes(dstChain)) return

    const hasCounterpart = db.find(ContractCallApprovedWithMint, {
      srcTxHash: contractCallWithToken.ctx.txHash as `0x${string}`,
    })
    if (hasCounterpart) return

    return [
      Result.Transfer('axelar.Transfer', {
        srcEvent: contractCallWithToken,
        dstChain,
        srcTokenAddress: contractCallWithToken.args.tokenAddress,
        srcAmount: contractCallWithToken.args.amount,
        srcWasBurned: contractCallWithToken.args.srcWasBurned,
        bridgeType: getBestEffortBridgeTypeFromPartialSupplyAction({
          srcWasBurned: contractCallWithToken.args.srcWasBurned,
          dstWasMinted: undefined,
        }),
      }),
    ]
  }
}
