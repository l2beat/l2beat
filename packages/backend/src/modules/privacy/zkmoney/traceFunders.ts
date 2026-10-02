import type { ZkMoneyFundingParams } from '@l2beat/config'
import type { IRpcClient, LogsProvider } from '@l2beat/shared'
import {
  assert,
  assertUnreachable,
  EthereumAddress,
  type Log,
  UnixTime,
} from '@l2beat/shared-pure'
import chunk from 'lodash/chunk'
import { mapInBatches } from '../utils/mapInBatches'
import { ReceiptLogCache } from '../utils/ReceiptLogCache'
import { attributeFunders, eventKey } from './attributeFunders'
import { resolveDeposit, type ZkMoneyDeposit } from './deposits'
import { fetchFundingHistory, readBalances } from './fundingHistory'

/**
 * Funding older than this is not replayed: a SIPA balance held at the start
 * of the window counts as untraceable until emptied. This bounds every scan
 * instead of rescanning from the factory deployment on each update, at the
 * cost of leaving such deposits unattributed (never misattributed).
 */
export const FUNDING_LOOKBACK = 30 * UnixTime.DAY

// Each resolution fetches a receipt and makes 1-2 factory calls.
const DEPOSIT_RESOLUTION_BATCH_SIZE = 20
// SIPAs go into one topic filter of the funding-history queries.
const SIPAS_PER_HISTORY_QUERY = 50

export interface TraceFundersDependencies {
  rpc: IRpcClient
  logsProvider: LogsProvider
  getBlockNumberAtOrBefore: (timestamp: UnixTime) => Promise<number>
}

export interface PortalDepositEvent {
  log: Log
  timestamp: UnixTime
}

/**
 * Finds who funded each portal deposit: the sender itself for direct
 * deposits, the replayed funder of the SIPA otherwise.
 *
 * @returns funder per deposit log; deposits without a single traceable funder
 * are absent
 */
export async function traceZkMoneyFunders(
  deposits: PortalDepositEvent[],
  params: ZkMoneyFundingParams,
  deps: TraceFundersDependencies,
): Promise<Map<Log, EthereumAddress>> {
  const context = { rpc: deps.rpc, receipts: new ReceiptLogCache(deps.rpc) }
  const resolved = await mapInBatches(
    deposits,
    DEPOSIT_RESOLUTION_BATCH_SIZE,
    async (event): Promise<ResolvedDeposit | undefined> => {
      const deposit = await resolveDeposit(event.log, params, context)
      return deposit && { ...deposit, event }
    },
  )

  const funders = new Map<Log, EthereumAddress>()
  const depositsBySipa = new Map<EthereumAddress, ResolvedDeposit[]>()
  for (const deposit of resolved) {
    if (deposit === undefined) continue
    switch (deposit.senderKind) {
      case 'invalid':
        break
      case 'direct':
        if (deposit.sender !== EthereumAddress.ZERO) {
          funders.set(deposit.event.log, deposit.sender)
        }
        break
      case 'deposit':
      case 'registration': {
        const sipaDeposits = depositsBySipa.get(deposit.sender) ?? []
        sipaDeposits.push(deposit)
        depositsBySipa.set(deposit.sender, sipaDeposits)
        break
      }
      default:
        assertUnreachable(deposit.senderKind)
    }
  }

  for (const batch of chunk([...depositsBySipa], SIPAS_PER_HISTORY_QUERY)) {
    const traced = await traceSipaFunders(new Map(batch), params, deps)
    for (const [log, funder] of traced) funders.set(log, funder)
  }
  return funders
}

interface ResolvedDeposit extends ZkMoneyDeposit {
  event: PortalDepositEvent
}

async function traceSipaFunders(
  depositsBySipa: Map<EthereumAddress, ResolvedDeposit[]>,
  params: ZkMoneyFundingParams,
  deps: TraceFundersDependencies,
): Promise<Map<Log, EthereumAddress>> {
  const sipas = [...depositsBySipa.keys()]
  const events = [...depositsBySipa.values()].flat().map(({ event }) => event)
  const [firstEvent] = events
  assert(firstEvent !== undefined, 'No deposits to trace')
  // One configuration watches one portal, so every event shares its emitter.
  const portal = EthereumAddress(firstEvent.log.address)
  const fromBlock = await getLookbackStart(events, params, deps)
  const toBlock = Math.max(...events.map(({ log }) => log.blockNumber))
  const [initialBalances, history] = await Promise.all([
    readBalances(deps.rpc, sipas, params.fundingTokens, fromBlock - 1),
    fetchFundingHistory(
      deps.logsProvider,
      sipas,
      params.fundingTokens,
      fromBlock,
      toBlock,
    ),
  ])

  const funders = new Map<Log, EthereumAddress>()
  for (const [sipa, deposits] of depositsBySipa) {
    const sipaBalances = initialBalances.get(sipa)
    assert(sipaBalances !== undefined, `Missing balances of SIPA ${sipa}`)
    const fundersByTransfer = attributeFunders({
      history,
      initialBalances: sipaBalances,
      sipa,
      token: params.tokenAddress,
      portal,
      exchange: params.exchangeAddress,
    })
    for (const deposit of deposits) {
      const funder = fundersByTransfer.get(
        eventKey({
          transactionHash: deposit.event.log.transactionHash,
          logIndex: deposit.fundingTransfer.logIndex,
        }),
      )
      if (funder !== undefined) funders.set(deposit.event.log, funder)
    }
  }
  return funders
}

async function getLookbackStart(
  events: PortalDepositEvent[],
  params: ZkMoneyFundingParams,
  deps: TraceFundersDependencies,
): Promise<number> {
  const earliest = Math.min(...events.map(({ timestamp }) => timestamp))
  const lookbackBlock = await deps.getBlockNumberAtOrBefore(
    UnixTime(earliest - FUNDING_LOOKBACK),
  )
  return Math.max(params.historyFromBlock, lookbackBlock)
}
