import type {
  AbstractTokenRecord,
  Database,
  DeployedTokenRecord,
  InteropTransferRecord,
  TokenDatabase,
} from '@l2beat/database'
import type { ChainRecord } from '@l2beat/database/dist/repositories/ChainRepository'
import type {
  TokenIngestionQueueRecord,
  TokenIngestionQueueState,
} from '@l2beat/database/dist/repositories/TokenIngestionQueueRepository'
import { UnixTime } from '@l2beat/shared-pure'
import { InteropTransferClassifier } from '../../../shared/build'
import { Chain } from '../chains/Chain'
import type { CoingeckoClient } from '../chains/clients/coingecko/CoingeckoClient'
import type {
  Coin,
  CoinListPlatformEntry,
} from '../chains/clients/coingecko/types'
import {
  type DeployedTokenFacts,
  fetchDeployedTokenFacts,
} from '../chains/fetchDeployedTokenFacts'
import {
  buildAliasToChainMap,
  platformsToChainAddressPairs,
} from '../trpc/routers/deployedTokens/chainAliases'
import type {
  IngestionOutcome,
  IngestionStep,
  IngestionTrace,
} from './IngestionTrace'
import {
  getTokenKey,
  type InteropTransferIndex,
  type InteropTransferMatch,
  normalizeInteropTokenAddress,
  type TokenAddress,
} from './InteropTransferIndex'

interface TokenIngestionProcessorDeps {
  db: Database
  tokenDb: TokenDatabase
  coingeckoClient: CoingeckoClient
  etherscanApiKey: string | undefined
  createChain?: (chainRecord: ChainRecord) => Chain
  fetchDeployedTokenFacts?: (
    chain: Chain,
    address: string,
  ) => Promise<DeployedTokenFacts>
  generateAbstractTokenId?: () => string
  newQueueState?: Extract<TokenIngestionQueueState, 'staged' | 'pending'>
}

type AbstractTokenResolution =
  | {
      type: 'resolved'
      abstractTokenId: string
      symbolFallback: string | undefined
    }
  | {
      type: 'pending-new-coingecko'
      coingeckoId: string
      coinSymbol: string
    }
  | { type: 'missing' }
  | { type: 'conflict'; message: string }

type NewDeployedTokenResult =
  | { type: 'ready'; record: DeployedTokenRecord }
  | { type: 'error'; message: string }

const ABSTRACT_TOKEN_ID_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export class TokenIngestionProcessor {
  private coingeckoCoinMap:
    | Promise<Map<string, CoinListPlatformEntry>>
    | undefined

  constructor(private readonly deps: TokenIngestionProcessorDeps) {}

  async process(
    entry: TokenIngestionQueueRecord,
    transferIndex: InteropTransferIndex,
  ): Promise<IngestionTrace> {
    const planned = await this.plan(entry, transferIndex)
    const trace = await this.fetch(planned)
    await this.apply(entry, trace)
    return trace
  }

  async plan(
    entry: TokenIngestionQueueRecord,
    transferIndex: InteropTransferIndex,
  ): Promise<IngestionTrace> {
    const steps: IngestionStep[] = []
    const address = normalizeQueuedAddress(entry)
    if (!address) {
      steps.push({ kind: 'invalid-address', rawAddress: entry.address })
      return {
        address: { chain: entry.chain, address: entry.address },
        steps,
        outcome: { kind: 'skip', reason: 'Address could not be normalized' },
      }
    }

    const existing =
      await this.deps.tokenDb.deployedToken.findByChainAndAddress(address)
    steps.push(
      existing
        ? { kind: 'existing-token', record: existing }
        : { kind: 'no-existing-token' },
    )

    const transfers = transferIndex.findInvolving(address)
    const resolution = await this.resolveAbstractToken(
      address,
      existing,
      transfers,
      steps,
    )

    if (resolution.type === 'conflict') {
      return {
        address,
        steps,
        outcome: { kind: 'conflict', message: resolution.message },
      }
    }
    if (resolution.type === 'missing') {
      return {
        address,
        steps,
        outcome: {
          kind: 'skip',
          reason: 'No abstract token could be resolved',
        },
      }
    }

    return {
      address,
      steps,
      outcome: this.buildPlanOutcome(existing, resolution, transfers, address),
    }
  }

  async fetch(trace: IngestionTrace): Promise<IngestionTrace> {
    if (trace.outcome.kind !== 'pending') {
      return trace
    }

    const steps = [...trace.steps]
    const pending = trace.outcome

    let abstractTokenId: string
    let newAbstractToken: AbstractTokenRecord | undefined
    if (pending.abstract.kind === 'existing') {
      abstractTokenId = pending.abstract.id
      newAbstractToken = undefined
    } else {
      newAbstractToken = await this.buildAbstractToken(
        pending.abstract.coingeckoId,
      )
      abstractTokenId = newAbstractToken.id
      steps.push({
        kind: 'fetched-coingecko-abstract',
        record: newAbstractToken,
      })
    }

    if (pending.operation === 'update') {
      if (!pending.existing) {
        throw new Error('pending update outcome has no existing deployed token')
      }
      return {
        ...trace,
        steps,
        outcome: {
          kind: 'write',
          newAbstractToken,
          deployedToken: {
            type: 'update',
            pk: { chain: trace.address.chain, address: trace.address.address },
            existing: pending.existing,
            update: { abstractTokenId },
          },
          neighborsToEnqueue: pending.neighborsToEnqueue,
        },
      }
    }

    const built = await this.buildDeployedToken(
      trace.address,
      abstractTokenId,
      pending.symbolFallback,
      steps,
    )

    if (built.type === 'error') {
      return {
        ...trace,
        steps,
        outcome: { kind: 'error', message: built.message },
      }
    }

    return {
      ...trace,
      steps,
      outcome: {
        kind: 'write',
        newAbstractToken,
        deployedToken: { type: 'insert', record: built.record },
        neighborsToEnqueue: pending.neighborsToEnqueue,
      },
    }
  }

  async apply(
    entry: TokenIngestionQueueRecord,
    trace: IngestionTrace,
  ): Promise<void> {
    const { outcome } = trace
    const queue = this.deps.tokenDb.tokenIngestionQueue

    switch (outcome.kind) {
      case 'skip':
        await queue.remove(entry)
        return
      case 'conflict':
        await queue.markConflict(entry, outcome.message)
        return
      case 'error':
        await queue.markError(entry, outcome.message)
        return
      case 'noop':
        await this.deps.db.interopTransfer.markAsUnprocessedByTokens([
          { chain: trace.address.chain, tokenAddress: trace.address.address },
        ])
        await queue.remove(entry)
        return
      case 'pending':
        throw new Error(
          'apply() called with a pending outcome; call fetch() first',
        )
      case 'write':
        await this.deps.tokenDb.transaction(async () => {
          if (outcome.newAbstractToken) {
            await this.deps.tokenDb.abstractToken.insert(
              outcome.newAbstractToken,
            )
          }
          if (outcome.deployedToken.type === 'insert') {
            await this.deps.tokenDb.deployedToken.insert(
              outcome.deployedToken.record,
            )
          } else {
            await this.deps.tokenDb.deployedToken.updateByChainAndAddress(
              outcome.deployedToken.pk,
              outcome.deployedToken.update,
            )
          }
        }, 'serializable')

        for (const neighbor of outcome.neighborsToEnqueue) {
          await this.deps.tokenDb.tokenIngestionQueue.enqueue(
            neighbor,
            this.deps.newQueueState ?? 'pending',
          )
        }
        await this.deps.db.interopTransfer.markAsUnprocessedByTokens([
          { chain: trace.address.chain, tokenAddress: trace.address.address },
        ])
        await queue.remove(entry)
        return
    }
  }

  private async resolveAbstractToken(
    address: TokenAddress,
    existing: DeployedTokenRecord | undefined,
    transfers: InteropTransferMatch[],
    steps: IngestionStep[],
  ): Promise<AbstractTokenResolution> {
    const fromTransfers = await this.resolveAbstractFromNonSwappingTransfers(
      transfers,
      steps,
    )

    if (fromTransfers.type === 'conflict') {
      return fromTransfers
    }

    if (
      existing?.abstractTokenId &&
      fromTransfers.abstractTokenId &&
      existing.abstractTokenId !== fromTransfers.abstractTokenId
    ) {
      return {
        type: 'conflict',
        message: `Non-swapping transfers point to abstract token ${fromTransfers.abstractTokenId}, but the deployed token already has ${existing.abstractTokenId}.`,
      }
    }

    if (fromTransfers.abstractTokenId) {
      steps.push({
        kind: 'resolved-from-transfers',
        abstractTokenId: fromTransfers.abstractTokenId,
      })
      return {
        type: 'resolved',
        abstractTokenId: fromTransfers.abstractTokenId,
        symbolFallback: undefined,
      }
    }

    if (existing?.abstractTokenId) {
      steps.push({
        kind: 'resolved-from-existing',
        abstractTokenId: existing.abstractTokenId,
      })
      return {
        type: 'resolved',
        abstractTokenId: existing.abstractTokenId,
        symbolFallback: undefined,
      }
    }

    return await this.resolveAbstractFromCoingecko(address, steps)
  }

  private async resolveAbstractFromNonSwappingTransfers(
    transfers: InteropTransferMatch[],
    steps: IngestionStep[],
  ): Promise<
    | { type: 'resolved'; abstractTokenId: string | undefined }
    | { type: 'conflict'; message: string }
  > {
    const usableNonSwapping = transfers.filter(
      (match): match is InteropTransferMatch & { otherToken: TokenAddress } =>
        isNonSwappingTransfer(match.transfer) && match.otherToken !== undefined,
    )
    const otherTokens = uniqueTokenAddresses(
      usableNonSwapping.map((match) => match.otherToken),
    )

    const otherDeployedTokens =
      await this.deps.tokenDb.deployedToken.getByPrimaryKeys(otherTokens)
    const otherDeployedTokenMap = new Map(
      otherDeployedTokens.map((token) => [getTokenKey(token), token]),
    )

    const abstractTokenIds = new Set<string>()
    for (const otherToken of otherTokens) {
      const deployedToken = otherDeployedTokenMap.get(getTokenKey(otherToken))
      if (deployedToken?.abstractTokenId) {
        abstractTokenIds.add(deployedToken.abstractTokenId)
      }
    }

    steps.push({
      kind: 'transfer-evidence',
      total: transfers.length,
      nonSwapping: usableNonSwapping.length,
      abstractTokenIds: Array.from(abstractTokenIds),
    })

    if (abstractTokenIds.size > 1) {
      return {
        type: 'conflict',
        message: `Non-swapping transfers point to multiple abstract tokens: ${Array.from(abstractTokenIds).join(', ')}.`,
      }
    }

    return {
      type: 'resolved',
      abstractTokenId: Array.from(abstractTokenIds)[0],
    }
  }

  private async resolveAbstractFromCoingecko(
    address: TokenAddress,
    steps: IngestionStep[],
  ): Promise<AbstractTokenResolution> {
    const coin = await this.findCoingeckoCoin(address)
    if (!coin) {
      steps.push({ kind: 'coingecko-coin-not-found' })
      return { type: 'missing' }
    }
    steps.push({
      kind: 'coingecko-coin-found',
      coinId: coin.id,
      symbol: coin.symbol,
    })

    const abstractToken =
      await this.deps.tokenDb.abstractToken.findByCoingeckoId(coin.id)
    if (abstractToken) {
      steps.push({
        kind: 'resolved-from-coingecko-existing-abstract',
        abstractTokenId: abstractToken.id,
        coinId: coin.id,
      })
      return {
        type: 'resolved',
        abstractTokenId: abstractToken.id,
        symbolFallback: coin.symbol.toUpperCase(),
      }
    }

    steps.push({
      kind: 'resolved-from-coingecko-new-abstract',
      coingeckoId: coin.id,
      symbol: coin.symbol,
    })
    return {
      type: 'pending-new-coingecko',
      coingeckoId: coin.id,
      coinSymbol: coin.symbol,
    }
  }

  private buildPlanOutcome(
    existing: DeployedTokenRecord | undefined,
    resolution: Extract<
      AbstractTokenResolution,
      { type: 'resolved' | 'pending-new-coingecko' }
    >,
    transfers: InteropTransferMatch[],
    address: TokenAddress,
  ): IngestionOutcome {
    const neighborsToEnqueue = collectTransferNeighbors(address, transfers)

    if (resolution.type === 'resolved') {
      if (existing) {
        if (existing.abstractTokenId === resolution.abstractTokenId) {
          return { kind: 'noop', deployedToken: existing }
        }
        return {
          kind: 'write',
          newAbstractToken: undefined,
          deployedToken: {
            type: 'update',
            pk: { chain: address.chain, address: address.address },
            existing,
            update: { abstractTokenId: resolution.abstractTokenId },
          },
          neighborsToEnqueue,
        }
      }
      return {
        kind: 'pending',
        operation: 'insert',
        existing: undefined,
        abstract: { kind: 'existing', id: resolution.abstractTokenId },
        symbolFallback: resolution.symbolFallback,
        neighborsToEnqueue,
      }
    }

    return {
      kind: 'pending',
      operation: existing ? 'update' : 'insert',
      existing,
      abstract: {
        kind: 'new-coingecko',
        coingeckoId: resolution.coingeckoId,
        symbol: resolution.coinSymbol,
      },
      symbolFallback: resolution.coinSymbol.toUpperCase(),
      neighborsToEnqueue,
    }
  }

  private async buildDeployedToken(
    address: TokenAddress,
    abstractTokenId: string,
    symbolFallback: string | undefined,
    steps: IngestionStep[],
  ): Promise<NewDeployedTokenResult> {
    if (!address.address.startsWith('0x')) {
      return {
        type: 'error',
        message: `Automatic ingestion can only fetch deployed-token facts for contract addresses. Got ${address.address}.`,
      }
    }

    const chainRecord = await this.deps.tokenDb.chain.findByName(address.chain)
    if (!chainRecord) {
      return {
        type: 'error',
        message: `Chain ${address.chain} was not found in TokenDB.`,
      }
    }

    const facts = await this.fetchFacts(chainRecord, address.address)
    steps.push({ kind: 'fetched-facts', facts })
    if (facts.isContract === false) {
      return {
        type: 'error',
        message: `${address.chain}:${address.address} is not a deployed contract.`,
      }
    }

    const symbol = facts.symbol ?? symbolFallback
    const missingFields = [
      symbol === undefined ? 'symbol' : undefined,
      facts.decimals === undefined ? 'decimals' : undefined,
      facts.deploymentTimestamp === undefined
        ? 'deploymentTimestamp'
        : undefined,
    ].filter((field): field is string => field !== undefined)

    if (missingFields.length > 0) {
      const warningText = facts.warnings.map((warning) => warning.message)
      return {
        type: 'error',
        message: [
          `Missing required deployed-token facts: ${missingFields.join(', ')}.`,
          ...warningText,
        ].join(' '),
      }
    }

    if (
      symbol === undefined ||
      facts.decimals === undefined ||
      facts.deploymentTimestamp === undefined
    ) {
      throw new Error('Missing deployed-token facts were not handled')
    }

    return {
      type: 'ready',
      record: {
        chain: address.chain,
        address: address.address,
        abstractTokenId,
        symbol,
        decimals: facts.decimals,
        deploymentTimestamp: facts.deploymentTimestamp,
        comment: null,
        metadata: null,
      },
    }
  }

  private async fetchFacts(chainRecord: ChainRecord, address: string) {
    const createChain =
      this.deps.createChain ??
      ((record: ChainRecord) =>
        new Chain(record, { etherscanApiKey: this.deps.etherscanApiKey }))
    const fetchFacts =
      this.deps.fetchDeployedTokenFacts ?? fetchDeployedTokenFacts

    return await fetchFacts(createChain(chainRecord), address)
  }

  private async findCoingeckoCoin(
    address: TokenAddress,
  ): Promise<CoinListPlatformEntry | undefined> {
    const coinMap = await this.getCoingeckoCoinMap()
    return coinMap.get(getTokenKey(address))
  }

  private async getCoingeckoCoinMap() {
    if (!this.coingeckoCoinMap) {
      this.coingeckoCoinMap = this.buildCoingeckoCoinMap()
    }

    try {
      return await this.coingeckoCoinMap
    } catch (error) {
      this.coingeckoCoinMap = undefined
      throw error
    }
  }

  private async buildCoingeckoCoinMap() {
    const [coins, chains] = await Promise.all([
      this.deps.coingeckoClient.getCoinList({ includePlatform: true }),
      this.deps.tokenDb.chain.getAll(),
    ])
    const aliasToChain = buildAliasToChainMap(chains)
    const coinMap = new Map<string, CoinListPlatformEntry>()

    for (const coin of coins) {
      const addresses = platformsToChainAddressPairs(
        coin.platforms,
        aliasToChain,
      )

      for (const address of addresses) {
        const normalizedAddress = normalizeInteropTokenAddress(address.address)
        if (!normalizedAddress) continue

        coinMap.set(
          getTokenKey({ chain: address.chain, address: normalizedAddress }),
          coin,
        )
      }
    }

    return coinMap
  }

  private async buildAbstractToken(
    coingeckoId: string,
  ): Promise<AbstractTokenRecord> {
    const coin = await this.deps.coingeckoClient.getCoinDataById(coingeckoId)

    return {
      id: await this.generateUniqueAbstractTokenId(),
      issuer: null,
      symbol: coin.symbol.toUpperCase(),
      category: null,
      iconUrl: coin.image.large,
      coingeckoId: coin.id,
      coingeckoListingTimestamp: await this.findCoingeckoListingTimestamp(coin),
      comment: null,
      reviewed: false,
    }
  }

  private async generateUniqueAbstractTokenId() {
    for (let i = 0; i < 10; i++) {
      const id =
        this.deps.generateAbstractTokenId?.() ?? generateAbstractTokenId()
      const existing = await this.deps.tokenDb.abstractToken.findById(id)
      if (!existing) {
        return id
      }
    }

    throw new Error('Could not generate a unique abstract token id')
  }

  private async findCoingeckoListingTimestamp(coin: Coin) {
    try {
      const marketChart =
        await this.deps.coingeckoClient.getCoinMarketChartRange(
          coin.id,
          'usd',
          UnixTime.fromDate(new Date('2000-01-01')),
          UnixTime.fromDate(new Date()),
        )
      const [firstPrice] = marketChart.prices
      if (!firstPrice) return null

      return UnixTime(Math.floor(firstPrice.date.getTime() / 1000))
    } catch {
      return null
    }
  }
}

function normalizeQueuedAddress(
  entry: TokenIngestionQueueRecord,
): TokenAddress | undefined {
  const address = normalizeInteropTokenAddress(entry.address)
  if (!address) return undefined

  return {
    chain: entry.chain,
    address,
  }
}

function uniqueTokenAddresses(addresses: TokenAddress[]): TokenAddress[] {
  return Array.from(
    new Map(
      addresses.map((address) => [getTokenKey(address), address]),
    ).values(),
  )
}

function collectTransferNeighbors(
  address: TokenAddress,
  transfers: InteropTransferMatch[],
): TokenAddress[] {
  const seen = new Map<string, TokenAddress>()
  const ownKey = getTokenKey(address)
  for (const transfer of transfers) {
    const otherToken = transfer.otherToken
    if (!otherToken) continue
    const key = getTokenKey(otherToken)
    if (key === ownKey || seen.has(key)) continue
    seen.set(key, otherToken)
  }
  return Array.from(seen.values())
}

function isNonSwappingTransfer(transfer: InteropTransferRecord) {
  const bridgeType =
    transfer.bridgeType ?? InteropTransferClassifier.inferBridgeType(transfer)

  return bridgeType === 'lockAndMint' || bridgeType === 'burnAndMint'
}

function generateAbstractTokenId() {
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += ABSTRACT_TOKEN_ID_CHARS.charAt(
      Math.floor(Math.random() * ABSTRACT_TOKEN_ID_CHARS.length),
    )
  }
  return result
}
