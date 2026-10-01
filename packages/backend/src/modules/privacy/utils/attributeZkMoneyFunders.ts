import { assert, type Log } from '@l2beat/shared-pure'
import { eventKey, tokenInterface, zkMoneyInterface } from './zkMoneyEvents'

type Provenance = { funders: Set<string>; unknown: boolean }
type Balance = Provenance & { amount: bigint }
const empty = (): Provenance => ({ funders: new Set(), unknown: false })
function merge(target: Provenance, source: Provenance) {
  for (const funder of source.funders) target.funders.add(funder)
  target.unknown ||= source.unknown
}

/**
 * Replay each token balance, retaining all possible funders until it is emptied.
 * Swaps carry the input provenance into DAI. Fees and the portal transfer belong
 * to the same sweep. Mixed or pre-existing unknown balances are excluded.
 */
export function attributeZkMoneyFunders(
  logs: Log[],
  initialBalances: Map<string, bigint>,
  sipa: string,
  token: string,
  portal: string,
  exchange: string,
): Map<string, string> {
  sipa = sipa.toLowerCase()
  token = token.toLowerCase()
  portal = portal.toLowerCase()
  exchange = exchange.toLowerCase()
  const balances = new Map<string, Balance>(
    [...initialBalances].map(([asset, amount]) => [
      asset.toLowerCase(),
      { amount, funders: new Set(), unknown: amount > 0n },
    ]),
  )
  let routed = empty()
  let swapped = empty()
  const result = new Map<string, string>()
  const ordered = [
    ...new Map(logs.map((log) => [eventKey(log), log])).values(),
  ].sort((a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex)

  for (const log of ordered) {
    const asset = log.address.toLowerCase()
    if (
      asset === sipa &&
      (log.topics[0] === zkMoneyInterface.getEventTopic('Sweep') ||
        log.topics[0] === zkMoneyInterface.getEventTopic('Recovered'))
    ) {
      routed = empty()
      swapped = empty()
      continue
    }
    const balance = balances.get(asset)
    if (!balance || log.topics[0] !== tokenInterface.getEventTopic('Transfer'))
      continue
    const args = tokenInterface.parseLog(log).args
    const from = String(args.from).toLowerCase()
    const to = String(args.to).toLowerCase()
    const amount = BigInt(args.value.toString())
    if (amount === 0n || from === to) continue

    if (to === sipa) {
      if (asset === token && from === exchange) {
        // Only the verified 3pool swap output is an internal transfer.
        if (swapped.funders.size === 0) swapped.unknown = true
        merge(balance, swapped)
        swapped = empty()
      } else if (from === '0x0000000000000000000000000000000000000000') {
        balance.unknown = true
      } else {
        balance.funders.add(from)
      }
      balance.amount += amount
    }
    if (from === sipa) {
      assert(balance.amount >= amount, 'Incomplete SIPA token history')
      if (asset !== token && to === exchange) merge(swapped, balance)
      if (asset === token) {
        merge(routed, balance)
        if (to === portal && !routed.unknown && routed.funders.size === 1) {
          const [funder] = routed.funders
          if (funder !== undefined) result.set(eventKey(log), funder)
        }
      }
      balance.amount -= amount
      if (balance.amount <= 0n) {
        balance.amount = 0n
        balance.funders.clear()
        balance.unknown = false
      }
    }
  }
  return result
}
