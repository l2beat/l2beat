/* axelar

For general message passing:
    - ContractCall on SRC chain
    - ContractCallApproved on DST chain
    - ContractCallExecuted on DST chain
*/

import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import { findParsedAround } from './hyperlane-hwr'
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

// ExpressExecutedWithToken (index_topic_1 bytes32 commandId, string sourceChain, string sourceAddress, bytes32 payloadHash, string symbol, index_topic_2 uint256 amount, index_topic_3 address expressExecutor)
const parseExpressExecutedWithToken = createEventParser(
  'event ExpressExecutedWithToken(bytes32 indexed commandId,string sourceChain, string sourceAddress, bytes32 payloadHash, string symbol, uint256 indexed amount, address indexed expressExecutor)',
)

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)
const parsePayloadVerified = createEventParser(
  'event PayloadVerified(address dvn, bytes header, uint256 confirmations, bytes32 proofHash)',
)

// https://docs.axelar.dev/resources/contract-addresses/mainnet/
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
])

export const SquidExpressExecutedWithToken = createInteropEventType<{
  commandId: `0x${string}`
  tokenAddress?: Address32
  amount: bigint
  symbol: string
  $srcChain?: string
}>('axelar.ExpressExecutedWithToken')

export const ContractCall = createInteropEventType<{
  sender: EthereumAddress
  destinationContractAddress: string
  payloadHash: `0x${string}`
  $dstChain?: string
}>('axelar.ContractCall')

export const ContractCallWithToken = createInteropEventType<{
  sender: EthereumAddress
  destinationContractAddress: string
  payloadHash: `0x${string}`
  tokenAddress?: Address32
  symbol: string
  amount: bigint
  $dstChain?: string
}>('axelar.ContractCallWithToken')

export const ContractCallApproved = createInteropEventType<{
  commandId: `0x${string}`
  sourceAddress: string
  contractAddress: EthereumAddress
  srcTxHash: `0x${string}`
  payloadHash: `0x${string}`
  $srcChain?: string
}>('axelar.ContractCallApproved')

export const ContractCallApprovedWithMint = createInteropEventType<{
  commandId: `0x${string}`
  sourceAddress: string
  contractAddress: EthereumAddress
  symbol: string
  amount: bigint
  srcTxHash: `0x${string}`
  payloadHash: `0x${string}`
  $srcChain?: string
}>('axelar.ContractCallApprovedWithMint')

export const ContractCallExecuted = createInteropEventType<{
  commandId: `0x${string}`
  tokenAddressUnsafe?: Address32
  amountUnsafe?: bigint
  isLayerZeroApp?: boolean
}>('axelar.ContractCallExecuted')

export class AxelarPlugin implements InteropPlugin {
  readonly name = 'axelar'

  capture(input: LogToCapture) {
    const expressExecutedWithToken = parseExpressExecutedWithToken(
      input.log,
      null,
    )
    if (expressExecutedWithToken) {
      const tokenAddress = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log, _index) => {
          const transfer = parseTransfer(log, null)
          if (!transfer) return
          // compare amount to not match a rogue Transfer event
          if (transfer.value !== expressExecutedWithToken.amount) return
          return Address32.from(log.address)
        },
      )

      const srcChain = findChain(
        AXELAR_NETWORKS,
        (x) => x.axelarChainName,
        expressExecutedWithToken.sourceChain,
      )

      return [
        SquidExpressExecutedWithToken.create(input, {
          commandId: expressExecutedWithToken.commandId,
          tokenAddress,
          amount: expressExecutedWithToken.amount,
          symbol: expressExecutedWithToken.symbol,
          $srcChain: srcChain === 'Unknown_axelar' ? undefined : srcChain,
        }),
      ]
    }

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
      const tokenAddress = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log, _index) => {
          const transfer = parseTransfer(log, null)
          if (!transfer) return
          // compare amount to not match a rogue Transfer event
          if (transfer.value !== contractCallWithToken.amount) return
          return Address32.from(log.address)
        },
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
          tokenAddress,
          symbol: contractCallWithToken.symbol,
          amount: contractCallWithToken.amount,
          $dstChain: dstChain === 'Unknown_axelar' ? undefined : dstChain,
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
      const nearestTransfer = findParsedAround(
        input.txLogs,
        // biome-ignore lint/style/noNonNullAssertion: It's there
        input.log.logIndex!,
        (log, _index) => {
          const transfer = parseTransfer(log, null)
          if (transfer) {
            const from = Address32.from(transfer.from)
            const axelarGatewayAddress = Address32.from(input.log.address)
            // checking whether the token came from the gateway, not sure this is enough
            if (from === axelarGatewayAddress)
              return {
                address: Address32.from(log.address),
                amount: transfer.value,
              }
          }
          const payloadVerified = parsePayloadVerified(log, null)
          if (payloadVerified) {
            return { isLayerZeroApp: true }
          }
        },
      )

      const tokenAddressUnsafe = nearestTransfer?.address
      const amountUnsafe = nearestTransfer?.amount

      return [
        ContractCallExecuted.create(input, {
          commandId: contractCallExecuted.commandId,
          tokenAddressUnsafe,
          amountUnsafe,
          isLayerZeroApp: nearestTransfer?.isLayerZeroApp,
        }),
      ]
    }
  }

  /* Match algorithm:

  1. Start with contractCallExecuted on DST chain
  2. Find corresponding contractCallApproved or contractCallApprovedWithMint on DST chain using commandId
  3. Find corresponding contractCall or contractCallWithToken on SRC chain using payloadHash and srcTxHash
  4. check for express execution via squid (commandId match)

  */

  matchTypes = [ContractCallExecuted]
  match(
    contractCallExecuted: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (ContractCallExecuted.checkType(contractCallExecuted)) {
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

      const contractCallApprovedWithMint = db.find(
        ContractCallApprovedWithMint,
        {
          commandId: contractCallExecuted.args.commandId,
        },
      )
      if (!contractCallApprovedWithMint) return

      const contractCallWithToken = db.find(ContractCallWithToken, {
        ctx: {
          txHash: contractCallApprovedWithMint.args.srcTxHash, // TODO: this does not match if axelar chain is used as an intermediate hop, same with the payloadHash
        },
      })
      if (!contractCallWithToken) return

      const matchingUnsafeAmount =
        contractCallApprovedWithMint.args.amount ===
        contractCallExecuted.args.amountUnsafe

      const expressExecuted = db.find(SquidExpressExecutedWithToken, {
        commandId: contractCallExecuted.args.commandId,
      })

      if (expressExecuted) {
        return [
          // TODO: do we want to count intent fill AND settlement as message/transfer?
          // INTENT FILL
          Result.Message('squid.Message', {
            app: 'axelar-squid-express',
            srcEvent: contractCallWithToken,
            dstEvent: expressExecuted,
          }),
          Result.Transfer('axelar-squid-express.Transfer', {
            srcEvent: contractCallWithToken,
            srcTokenAddress: contractCallWithToken.args.tokenAddress,
            srcAmount: contractCallWithToken.args.amount,
            dstEvent: expressExecuted,
            dstTokenAddress: expressExecuted.args.tokenAddress,
            dstAmount: expressExecuted.args.amount,
          }),
          // SETTLEMENT
          Result.Message('axelar.Message', {
            app: 'axelar-squid-express-settlement',
            srcEvent: contractCallWithToken,
            dstEvent: contractCallExecuted,
            extraEvents: [contractCallApprovedWithMint],
          }),
          Result.Transfer('axelar-squid-express-settlement.Transfer', {
            srcEvent: contractCallWithToken,
            srcTokenAddress: contractCallWithToken.args.tokenAddress,
            srcAmount: contractCallWithToken.args.amount,
            dstEvent: contractCallExecuted,
            dstTokenAddress: matchingUnsafeAmount
              ? contractCallExecuted.args.tokenAddressUnsafe
              : undefined,
            dstAmount: matchingUnsafeAmount
              ? contractCallApprovedWithMint.args.amount
              : undefined,
          }),
        ]
      }
      return [
        Result.Message('axelar.Message', {
          app: 'axelar-contractCallWithToken',
          srcEvent: contractCallWithToken,
          dstEvent: contractCallExecuted,
          extraEvents: [contractCallApprovedWithMint],
        }),
        Result.Transfer('axelar-contractCallWithToken.Transfer', {
          srcEvent: contractCallWithToken,
          srcTokenAddress: contractCallWithToken.args.tokenAddress,
          srcAmount: contractCallWithToken.args.amount,
          dstEvent: contractCallExecuted,
          dstTokenAddress: matchingUnsafeAmount
            ? contractCallExecuted.args.tokenAddressUnsafe
            : undefined,
          dstAmount: matchingUnsafeAmount
            ? contractCallApprovedWithMint.args.amount
            : undefined,
        }),
      ]
    }
  }
}
