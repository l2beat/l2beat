import {
  Address32,
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
import { decodeGasZipDeposit } from './gaszip.decoder'

const parseDeposit = createEventParser(
  'event Deposit(address from, uint256 chains, uint256 amount, bytes32 to)',
)

export const GasZipDeposit = createInteropEventType<{
  $dstChain: string
  depositor: Address32
  amount: string
  tokenAddress: Address32
  depositType: string
  destinationChains: string
  destinationAddress?: Address32
}>('gaszip.Deposit')

export const GasZipFill = createInteropEventType<{
  receiver: Address32
  amount: string
  tokenAddress: Address32
}>('gaszip.Fill')

export class GasZipPlugin implements InteropPlugin {
  name = 'gaszip'

  captureTx(input: TxToCapture) {
    const network = GASZIP_NETWORKS.find((n) => n.chain === input.tx.chain)
    if (!network) return

    const depositAddress = Address32.from(DEPOSIT_EOA_ADDRESS)
    if (input.tx.txTo === depositAddress) {
      let decoded
      try {
        decoded = decodeGasZipDeposit(input.tx.txData)
      } catch (_error) {
        return
      }
      if (decoded.destinationChainIds.length === 0) return
      if (!input.tx.txValue || input.tx.txValue === 0n) return
      if (!input.tx.txFrom) return

      const destinationChains = decoded.destinationChainIds.map((gaszipId) => ({
        gaszipId,
        chain: getChainNameByGaszipId(gaszipId),
      }))

      const destinationAddress = decoded.destinationAddress ?? input.tx.txFrom
      const events = []

      for (const dc of destinationChains) {
        events.push(
          GasZipDeposit.create(input.tx, {
            $dstChain: dc.chain,
            depositor: input.tx.txFrom,
            amount: (
              input.tx.txValue / BigInt(destinationChains.length)
            ).toString(),
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
      input.tx.txFrom ===
      GASZIP_NETWORKS.find((n) => n.chain === input.tx.chain)?.solver
    ) {
      return [
        GasZipFill.create(input.tx, {
          receiver:
            input.tx.txTo ??
            Address32.from('0x0000000000000000000000000000000000000000'),
          amount: input.tx.txValue?.toString() ?? '0',
          tokenAddress: Address32.NATIVE,
        }),
      ]
    }
  }

  capture(input: LogToCapture) {
    const network = GASZIP_NETWORKS.find((b) => b.chain === input.ctx.chain)
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
        GasZipDeposit.create(input.ctx, {
          $dstChain: dc.chain,
          depositor: Address32.from(deposit.from),
          amount: (
            deposit.amount / BigInt(destinationChains.length)
          ).toString(),
          tokenAddress: Address32.NATIVE,
          depositType: 'CONTRACT',
          destinationChains: JSON.stringify(destinationChains),
          destinationAddress: Address32.from(deposit.to),
        }),
      )
    }
    return events
  }
  matchTypes = [GasZipFill]
  match(gasZipFill: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (!GasZipFill.checkType(gasZipFill)) return

    const gasZipDeposit = db.find(GasZipDeposit, {
      $dstChain: gasZipFill.ctx.chain,
      // amount: ~gasZipFill.args.amount, // TODO: we need a way to match approximate amounts (e.g. 5% tolerance)
      destinationAddress: gasZipFill.args.receiver,
    })
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
        dstEvent: gasZipFill,
        dstTokenAddress: gasZipFill.args.tokenAddress,
        dstAmount: BigInt(gasZipFill.args.amount),
      }),
    ]
  }
}
