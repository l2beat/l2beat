import {
  Address32,
  createEventParser,
  createInteropEventType,
  type InteropPlugin,
  type LogToCapture,
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
  depositor: string
  amount: string
  tokenAddress: Address32
  depositType: string
  destinationChains: string
  destinationAddress?: Address32
}>('gaszip.Deposit')

export class GasZipPlugin implements InteropPlugin {
  name = 'gaszip'

  captureTx(input: TxToCapture) {
    const network = GASZIP_NETWORKS.find((n) => n.chain === input.tx.chain)
    if (!network) return

    const depositAddress = Address32.from(DEPOSIT_EOA_ADDRESS)
    if (input.tx.txTo !== depositAddress) return

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
    if (destinationChains.length > 1)
      console.log(`GasZip deposit to multiple chains: ${input.tx.txHash}`)

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
          depositor: deposit.from,
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
}
