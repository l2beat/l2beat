/**
 * gaszip (standalone) plugin based on tx calldata in addition to logs
 * good API available at https://backend.gas.zip/v2/search/TXHASH for checking
 */

import type { Logger } from '@l2beat/backend-tools'
import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import {
  createEventParser,
  createInteropEventType,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
  type TxToCapture,
} from '../types'
import {
  DEPOSIT_CONTRACT_ADDRESS,
  DEPOSIT_EOA_ADDRESS,
  GASZIP_NETWORKS,
  getChainNameByGaszipId,
} from './gaszip.config'
import { decodeGasZipDeposit, extractFirstTwentyHex } from './gaszip.decoder'

const parseDeposit = createEventParser(
  'event Deposit(address from, uint256 chains, uint256 amount, bytes32 to)',
)

export const GasZipDeposit = createInteropEventType<{
  $dstChain: string
  depositor: Address32
  amount: bigint
  tokenAddress: Address32
  depositType: string
  destinationChains: string
  destinationAddress?: Address32
}>('gaszip.Deposit', { direction: 'outgoing' })

export const GasZipFill = createInteropEventType<{
  receiver: Address32
  amount: bigint
  tokenAddress: Address32
}>('gaszip.Fill', { direction: 'incoming' })

export class GasZipPlugin implements InteropPlugin {
  readonly name = 'gaszip'

  constructor(private logger: Logger) {}

  captureTx(input: TxToCapture) {
    const network = GASZIP_NETWORKS.find((n) => n.chain === input.chain)
    if (!network) return

    if (input.tx.to === DEPOSIT_EOA_ADDRESS) {
      let decoded
      try {
        decoded = decodeGasZipDeposit((input.tx.data ?? '0x') as string)
      } catch (_error) {
        return
      }
      if (decoded.destinationChainIds.length === 0) return
      if (!input.tx.value || input.tx.value === 0n) return
      if (!input.tx.from) return

      const destinationChains = decoded.destinationChainIds.map((gaszipId) => ({
        gaszipId,
        chain: getChainNameByGaszipId(gaszipId),
      }))

      const destinationAddress =
        decoded.destinationAddress ?? Address32.from(input.tx.from)
      const events = []

      for (const dc of destinationChains) {
        events.push(
          GasZipDeposit.createTx(input, {
            $dstChain: dc.chain,
            depositor: Address32.from(input.tx.from),
            amount: (input.tx.value ?? 0n) / BigInt(destinationChains.length),
            tokenAddress: Address32.NATIVE,
            depositType: decoded.type,
            destinationChains: JSON.stringify(destinationChains),
            destinationAddress,
          }),
        )
      }
      return events
    }
    if (
      input.tx.from &&
      EthereumAddress(input.tx.from) ===
        GASZIP_NETWORKS.find((n) => n.chain === input.chain)?.solver
    ) {
      return [
        GasZipFill.createTx(input, {
          receiver: input.tx.to ? Address32.from(input.tx.to) : Address32.ZERO,
          amount: input.tx.value ?? 0n,
          tokenAddress: Address32.NATIVE,
        }),
      ]
    }
  }

  capture(input: LogToCapture) {
    const network = GASZIP_NETWORKS.find((b) => b.chain === input.chain)
    if (!network) {
      return
    }

    const deposit = parseDeposit(input.log, [DEPOSIT_CONTRACT_ADDRESS])
    if (!deposit) return

    // Decode the chains parameter (packed as 16-bit values)
    const chainIds: number[] = []
    let remaining = deposit.chains
    while (remaining > 0n) {
      const chainId = Number(remaining & 0xffffn)
      chainIds.push(chainId)
      remaining = remaining >> 16n
    }
    chainIds.reverse() // Reverse to get original order

    if (chainIds.length === 0) return

    const destinationChains = chainIds.map((gaszipId) => ({
      gaszipId,
      chain: getChainNameByGaszipId(gaszipId),
    }))

    const events = []
    for (const dc of destinationChains) {
      events.push(
        GasZipDeposit.create(input, {
          $dstChain: dc.chain,
          depositor: Address32.from(deposit.from),
          amount: deposit.amount / BigInt(destinationChains.length),
          tokenAddress: Address32.NATIVE,
          depositType: 'CONTRACT',
          destinationChains: JSON.stringify(destinationChains),
          destinationAddress: Address32.from(extractFirstTwentyHex(deposit.to)),
        }),
      )
    }
    return events
  }
  matchTypes = [GasZipFill]
  match(gasZipFill: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (!GasZipFill.checkType(gasZipFill)) return

    const gasZipDeposits = db.findApproximate(
      GasZipDeposit,
      {
        $dstChain: gasZipFill.ctx.chain,
        destinationAddress: gasZipFill.args.receiver,
      },
      {
        key: 'amount',
        valueBigInt: gasZipFill.args.amount,
        toleranceUp: 0.1, // see examples, 5% was too low
        toleranceDown: 0.03, // for some reason some fills are more
      },
    )
    const gasZipDeposit = gasZipDeposits[0]
    if (!gasZipDeposit) return

    return [
      Result.Message('gaszip.Message', {
        app: 'gaszip',
        srcEvent: gasZipDeposit,
        dstEvent: gasZipFill,
      }),
      Result.Transfer('gaszip.Transfer', {
        srcEvent: gasZipDeposit,
        srcTokenAddress: gasZipDeposit.args.tokenAddress,
        srcAmount: BigInt(gasZipDeposit.args.amount),
        srcWasBurned: false,
        dstEvent: gasZipFill,
        dstTokenAddress: gasZipFill.args.tokenAddress,
        dstAmount: BigInt(gasZipFill.args.amount),
        dstWasMinted: false,
      }),
    ]
  }
}
