import { assert, EthereumAddress, type Log } from '@l2beat/shared-pure'
import { ERC20_TRANSFER_TOPIC } from '../utils/erc20'
import { RECOVERED_TOPIC, SWEEP_TOPIC } from './abi'
import { parseTransfer } from './operation'

export interface FunderReplayOptions {
  /** Token transfers into or out of the SIPA, plus its Sweep and Recovered events. */
  history: Log[]
  /** Balances just before `history` starts, per funding token. */
  initialBalances: Map<EthereumAddress, bigint>
  sipa: EthereumAddress
  token: EthereumAddress
  portal: EthereumAddress
  exchange: EthereumAddress
}

/**
 * Replays each token balance of one SIPA, retaining every possible funder
 * until the balance is emptied. Swaps through the exchange carry the input
 * provenance into the deposit token. Fees and the portal transfer belong to
 * the same sweep. Mixed funding and balances of unknown origin (including
 * balances held before `history` starts) leave the sweep unattributed.
 *
 * @returns funder per portal funding transfer, keyed by {@link eventKey}
 */
export function attributeFunders(
  options: FunderReplayOptions,
): Map<string, EthereumAddress> {
  const { sipa, token, portal, exchange } = options
  const balances = new Map<EthereumAddress, Balance>(
    [...options.initialBalances].map(([asset, amount]) => [
      asset,
      { amount, funders: new Set(), unknown: amount > 0n },
    ]),
  )
  let routed = emptyProvenance()
  let swapped = emptyProvenance()
  const funders = new Map<string, EthereumAddress>()

  for (const log of inChainOrder(options.history)) {
    const emitter = EthereumAddress(log.address)
    if (emitter === sipa && isSweepOrRecovery(log)) {
      routed = emptyProvenance()
      swapped = emptyProvenance()
      continue
    }
    const balance = balances.get(emitter)
    if (balance === undefined || log.topics[0] !== ERC20_TRANSFER_TOPIC) {
      continue
    }
    const transfer = parseTransfer(log)
    if (transfer.amount === 0n || transfer.from === transfer.to) continue

    if (transfer.to === sipa) {
      if (emitter === token && transfer.from === exchange) {
        // Only a swap output paired with a swap input is an internal transfer.
        if (swapped.funders.size === 0) swapped.unknown = true
        mergeProvenance(balance, swapped)
        swapped = emptyProvenance()
      } else if (transfer.from === EthereumAddress.ZERO) {
        balance.unknown = true
      } else {
        balance.funders.add(transfer.from)
      }
      balance.amount += transfer.amount
    }

    if (transfer.from === sipa) {
      assert(balance.amount >= transfer.amount, 'Incomplete SIPA token history')
      if (emitter !== token && transfer.to === exchange) {
        mergeProvenance(swapped, balance)
      }
      if (emitter === token) {
        mergeProvenance(routed, balance)
        const funder = soleFunder(routed)
        if (transfer.to === portal && funder !== undefined) {
          funders.set(eventKey(log), funder)
        }
      }
      balance.amount -= transfer.amount
      if (balance.amount <= 0n) {
        balance.amount = 0n
        balance.funders.clear()
        balance.unknown = false
      }
    }
  }
  return funders
}

export function eventKey(log: {
  transactionHash: string
  logIndex: number
}): string {
  return `${log.transactionHash.toLowerCase()}:${log.logIndex}`
}

interface Provenance {
  funders: Set<EthereumAddress>
  unknown: boolean
}

interface Balance extends Provenance {
  amount: bigint
}

function emptyProvenance(): Provenance {
  return { funders: new Set(), unknown: false }
}

function mergeProvenance(target: Provenance, source: Provenance): void {
  for (const funder of source.funders) target.funders.add(funder)
  target.unknown ||= source.unknown
}

function soleFunder(provenance: Provenance): EthereumAddress | undefined {
  if (provenance.unknown || provenance.funders.size !== 1) return undefined
  const [funder] = provenance.funders
  return funder
}

/** Overlapping log queries can return the same log twice. */
function inChainOrder(logs: Log[]): Log[] {
  const unique = new Map(logs.map((log) => [eventKey(log), log]))
  return [...unique.values()].sort(
    (a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex,
  )
}

function isSweepOrRecovery(log: Log): boolean {
  return log.topics[0] === SWEEP_TOPIC || log.topics[0] === RECOVERED_TOPIC
}
