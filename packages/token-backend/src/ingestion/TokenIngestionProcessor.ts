import type {
  AbstractTokenRecord,
  ChainRecord,
  Database,
  DeployedTokenRecord,
  InteropTransferRecord,
  TokenDatabase,
  TokenIngestionQueueRecord,
  TokenIngestionQueueState,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { randomUUID } from 'crypto'
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
import type { Command } from '../commands'
import {
  type AbstractTokenAssignmentProof,
  commitTokenChanges,
  nonSwappingTransferProof,
} from '../commitTokenChanges'
import {
  buildAliasToChainMap,
  platformsToChainAddressPairs,
} from '../trpc/routers/deployedTokens/chainAliases'
import { formatError } from '../utils/formatError'
import { formatIngestionTrace } from './formatIngestionTrace'
import type {
  AbstractTokenRef,
  IngestionOutcome,
  IngestionStep,
  IngestionTrace,
} from './IngestionTrace'
import {
  buildInteropTransferIndex,
  getTokenKey,
  type InteropTransferIndex,
  type InteropTransferMatch,
  normalizeInteropTokenAddress,
  type TokenAddress,
} from './tokenIngestionUtils'

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
      abstractToken: AbstractTokenRef
      symbolFallback: string | undefined
      proof: AbstractTokenAssignmentProof
    }
  | { type: 'existing-noop'; abstractToken: AbstractTokenRef }
  | {
      type: 'pending-new-coingecko'
      coingeckoId: string
      coinSymbol: string
      proof: AbstractTokenAssignmentProof
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
  private interopTransferIndex: InteropTransferIndex | undefined

  constructor(private readonly deps: TokenIngestionProcessorDeps) {}

  getInteropTransferIndex(): Promise<InteropTransferIndex> {
    return this.interopTransferIndex
      ? Promise.resolve(this.interopTransferIndex)
      : this.refreshInteropTransferIndex()
  }

  async refreshInteropTransferIndex(): Promise<InteropTransferIndex> {
    const transfers = await this.deps.db.interopTransfer.getAll()
    const index = buildInteropTransferIndex(transfers)
    this.interopTransferIndex = index
    return index
  }

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
    const id = generateIngestionTraceId()
    const steps: IngestionStep[] = []
    const address = normalizeQueuedAddress(entry)
    if (!address) {
      steps.push({ kind: 'invalid-address', rawAddress: entry.address })
      return {
        id,
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
        id,
        address,
        steps,
        outcome: { kind: 'conflict', message: resolution.message },
      }
    }
    if (resolution.type === 'missing') {
      return {
        id,
        address,
        steps,
        outcome: {
          kind: 'skip',
          reason: 'No abstract token could be resolved',
        },
      }
    }

    return {
      id,
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
      abstractTokenId = pending.abstract.token.id
      newAbstractToken = undefined
    } else {
      const result = await this.buildAbstractToken(pending.abstract.coingeckoId)
      if (result.type === 'error') {
        return {
          ...trace,
          steps,
          outcome: { kind: 'error', message: result.message },
        }
      }
      newAbstractToken = result.record
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
      const conflict = getNewCoingeckoSymbolConflict(
        newAbstractToken,
        pending.existing.symbol,
      )
      if (conflict) {
        return {
          ...trace,
          steps,
          outcome: { kind: 'conflict', message: conflict },
        }
      }
      const finalAbstract = adoptDeployedTokenSymbolCasing(
        newAbstractToken,
        pending.existing.symbol,
        steps,
      )
      return {
        ...trace,
        steps,
        outcome: {
          kind: 'write',
          newAbstractToken: finalAbstract,
          deployedToken: {
            type: 'update',
            pk: { chain: trace.address.chain, address: trace.address.address },
            existing: pending.existing,
            update: {
              abstractTokenId,
              abstractTokenAssignmentProof: pending.proof,
            },
          },
          neighborsToEnqueue: pending.neighborsToEnqueue,
        },
      }
    }

    const built = await this.buildDeployedToken(
      trace.address,
      abstractTokenId,
      newAbstractToken ? undefined : pending.symbolFallback,
      steps,
    )

    if (built.type === 'error') {
      return {
        ...trace,
        steps,
        outcome: { kind: 'error', message: built.message },
      }
    }

    const conflict =
      getNewCoingeckoSymbolConflict(newAbstractToken, built.record.symbol) ??
      getTransferAbstractSymbolConflict(
        pending.proof,
        pending.abstract.kind === 'existing'
          ? pending.abstract.token
          : undefined,
        built.record.symbol,
      )
    if (conflict) {
      return {
        ...trace,
        steps,
        outcome: { kind: 'conflict', message: conflict },
      }
    }

    const finalAbstract = adoptDeployedTokenSymbolCasing(
      newAbstractToken,
      built.record.symbol,
      steps,
    )

    return {
      ...trace,
      steps,
      outcome: {
        kind: 'write',
        newAbstractToken: finalAbstract,
        deployedToken: {
          type: 'insert',
          record: {
            ...built.record,
            abstractTokenAssignmentProof: pending.proof,
          },
        },
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
        await queue.remove(entry)
        return
      case 'pending':
        throw new Error(
          'apply() called with a pending outcome; call fetch() first',
        )
      case 'write': {
        const commands = buildWriteCommands(outcome)
        const log = formatIngestionTrace(trace)
        await this.deps.tokenDb.transaction(async () => {
          await commitTokenChanges(this.deps.tokenDb, commands, {
            kind: 'ingestion',
            log,
          })
        }, 'serializable')

        for (const neighbor of outcome.neighborsToEnqueue) {
          await this.deps.tokenDb.tokenIngestionQueue.enqueue(
            neighbor,
            this.deps.newQueueState ?? 'pending',
          )
        }
        await queue.remove(entry)
        return
      }
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
      existing,
      steps,
    )

    if (fromTransfers.type === 'conflict') {
      return fromTransfers
    }

    if (fromTransfers.abstractToken && fromTransfers.supportingTransfer) {
      steps.push({
        kind: 'resolved-from-transfers',
        abstractToken: fromTransfers.abstractToken,
      })
      return {
        type: 'resolved',
        abstractToken: fromTransfers.abstractToken,
        symbolFallback: undefined,
        proof: nonSwappingTransferProof(fromTransfers.supportingTransfer),
      }
    }

    if (existing?.abstractTokenId) {
      // Falling back to the deployed token's existing abstract always produces
      // a noop (the assignment is unchanged), so no proof is needed — the new
      // proof would never be persisted.
      const existingAbstract = await this.deps.tokenDb.abstractToken.findById(
        existing.abstractTokenId,
      )
      const ref: AbstractTokenRef = {
        id: existing.abstractTokenId,
        symbol: existingAbstract?.symbol ?? '?',
      }
      steps.push({ kind: 'resolved-from-existing', abstractToken: ref })
      return { type: 'existing-noop', abstractToken: ref }
    }

    return await this.resolveAbstractFromCoingecko(address, steps)
  }

  private async resolveAbstractFromNonSwappingTransfers(
    transfers: InteropTransferMatch[],
    existing: DeployedTokenRecord | undefined,
    steps: IngestionStep[],
  ): Promise<
    | {
        type: 'resolved'
        abstractToken: AbstractTokenRef | undefined
        supportingTransfer: InteropTransferRecord | undefined
      }
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

    const lookupIds = new Set(abstractTokenIds)
    if (existing?.abstractTokenId) lookupIds.add(existing.abstractTokenId)
    const abstractRecords =
      lookupIds.size > 0
        ? await this.deps.tokenDb.abstractToken.getByIds(Array.from(lookupIds))
        : []
    const symbolById = new Map(
      abstractRecords.map((record) => [record.id, record.symbol]),
    )
    const toRef = (id: string): AbstractTokenRef => ({
      id,
      symbol: symbolById.get(id) ?? '?',
    })

    const transferRefs = Array.from(abstractTokenIds).map(toRef)

    steps.push({
      kind: 'transfer-evidence',
      total: transfers.length,
      nonSwapping: usableNonSwapping.length,
      abstractTokens: transferRefs,
    })

    if (transferRefs.length > 1) {
      return {
        type: 'conflict',
        message: `Non-swapping transfers point to multiple abstract tokens: ${transferRefs.map(formatRef).join(', ')}.`,
      }
    }

    const transferAbstract = transferRefs[0]
    if (
      existing?.abstractTokenId &&
      transferAbstract &&
      existing.abstractTokenId !== transferAbstract.id
    ) {
      const existingRef = toRef(existing.abstractTokenId)
      return {
        type: 'conflict',
        message: `Non-swapping transfers point to abstract token ${formatRef(transferAbstract)}, but the deployed token already has ${formatRef(existingRef)}.`,
      }
    }

    const supportingTransfer = transferAbstract
      ? supportingTransferFor(
          transferAbstract.id,
          usableNonSwapping,
          otherDeployedTokenMap,
        )
      : undefined

    return {
      type: 'resolved',
      abstractToken: transferAbstract,
      supportingTransfer,
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

    const proof: AbstractTokenAssignmentProof = { kind: 'coingecko' }

    const abstractToken =
      await this.deps.tokenDb.abstractToken.findByCoingeckoId(coin.id)
    if (abstractToken) {
      const ref: AbstractTokenRef = {
        id: abstractToken.id,
        symbol: abstractToken.symbol,
      }
      steps.push({
        kind: 'resolved-from-coingecko-existing-abstract',
        abstractToken: ref,
        coinId: coin.id,
      })
      return {
        type: 'resolved',
        abstractToken: ref,
        symbolFallback: coin.symbol.toUpperCase(),
        proof,
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
      proof,
    }
  }

  private buildPlanOutcome(
    existing: DeployedTokenRecord | undefined,
    resolution: Extract<
      AbstractTokenResolution,
      { type: 'resolved' | 'existing-noop' | 'pending-new-coingecko' }
    >,
    transfers: InteropTransferMatch[],
    address: TokenAddress,
  ): IngestionOutcome {
    const neighborsToEnqueue = collectTransferNeighbors(address, transfers)

    if (resolution.type === 'existing-noop') {
      if (!existing) {
        throw new Error('existing-noop resolution without an existing token')
      }
      return { kind: 'noop', deployedToken: existing }
    }

    if (resolution.type === 'resolved') {
      if (existing) {
        if (existing.abstractTokenId === resolution.abstractToken.id) {
          return { kind: 'noop', deployedToken: existing }
        }
        const conflict = getTransferAbstractSymbolConflict(
          resolution.proof,
          resolution.abstractToken,
          existing.symbol,
        )
        if (conflict) {
          return { kind: 'conflict', message: conflict }
        }
        return {
          kind: 'write',
          newAbstractToken: undefined,
          deployedToken: {
            type: 'update',
            pk: { chain: address.chain, address: address.address },
            existing,
            update: {
              abstractTokenId: resolution.abstractToken.id,
              abstractTokenAssignmentProof: resolution.proof,
            },
          },
          neighborsToEnqueue,
        }
      }
      return {
        kind: 'pending',
        operation: 'insert',
        existing: undefined,
        abstract: { kind: 'existing', token: resolution.abstractToken },
        symbolFallback: resolution.symbolFallback,
        neighborsToEnqueue,
        proof: resolution.proof,
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
      proof: resolution.proof,
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
  ): Promise<
    | { type: 'ready'; record: AbstractTokenRecord }
    | { type: 'error'; message: string }
  > {
    let coin: Coin
    try {
      coin = await this.deps.coingeckoClient.getCoinDataById(coingeckoId)
    } catch (error) {
      return {
        type: 'error',
        message: `Failed to fetch CoinGecko data for ${coingeckoId}: ${formatError(error)}.`,
      }
    }

    return {
      type: 'ready',
      record: {
        id: await this.generateUniqueAbstractTokenId(),
        issuer: null,
        symbol: coin.symbol.toUpperCase(),
        category: null,
        iconUrl: coin.image.large,
        coingeckoId: coin.id,
        coingeckoListingTimestamp: await this.findCoingeckoListingTimestamp(
          coin.id,
        ),
        comment: null,
        reviewed: false,
        isPriceUnreliable: false,
      },
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

  private async findCoingeckoListingTimestamp(coingeckoId: string) {
    try {
      const marketChart =
        await this.deps.coingeckoClient.getCoinMarketChartRange(
          coingeckoId,
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

function buildWriteCommands(
  outcome: Extract<IngestionOutcome, { kind: 'write' }>,
): Command[] {
  const commands: Command[] = []
  if (outcome.newAbstractToken) {
    commands.push({
      type: 'AddAbstractTokenCommand',
      record: outcome.newAbstractToken,
    })
  }
  if (outcome.deployedToken.type === 'insert') {
    commands.push({
      type: 'AddDeployedTokenCommand',
      record: outcome.deployedToken.record,
    })
  } else {
    commands.push({
      type: 'UpdateDeployedTokenCommand',
      pk: outcome.deployedToken.pk,
      existing: outcome.deployedToken.existing,
      update: outcome.deployedToken.update,
    })
  }
  return commands
}

function supportingTransferFor(
  abstractTokenId: string,
  usableNonSwapping: (InteropTransferMatch & { otherToken: TokenAddress })[],
  otherDeployedTokenMap: Map<string, DeployedTokenRecord>,
): InteropTransferRecord | undefined {
  for (const match of usableNonSwapping) {
    const other = otherDeployedTokenMap.get(getTokenKey(match.otherToken))
    if (other?.abstractTokenId === abstractTokenId) {
      return match.transfer
    }
  }
  return undefined
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

function formatRef(ref: AbstractTokenRef) {
  return `${ref.id}:${ref.symbol}`
}

function getNewCoingeckoSymbolConflict(
  newAbstractToken: AbstractTokenRecord | undefined,
  deployedTokenSymbol: string,
): string | undefined {
  if (!newAbstractToken) return undefined
  // CoinGecko's /coins/list and /coins/{platform}/contract/{addr} endpoints
  // return symbols lower-cased (e.g. "susde", "wsteth"), so a casing-only
  // difference vs. the RPC symbol never reflects a real mismatch. Compare
  // case-insensitively here; the canonical casing is restored from the
  // deployed-token symbol in `adoptDeployedTokenSymbolCasing`.
  if (
    newAbstractToken.symbol.toLowerCase() === deployedTokenSymbol.toLowerCase()
  ) {
    return undefined
  }

  return `CoinGecko would create abstract token ${newAbstractToken.id}:${newAbstractToken.symbol}, but the deployed token symbol is ${deployedTokenSymbol}.`
}

/**
 * Counterpart of `getNewCoingeckoSymbolConflict` for abstract tokens resolved
 * from non-swapping transfers. Called from two places: `buildPlanOutcome()`
 * for updates of existing deployed tokens (their symbol is already in the DB)
 * and `fetch()` for inserts (the symbol only arrives with the RPC facts).
 * Case-insensitive because deployments of the same asset routinely differ in
 * casing only; unlike the CoinGecko path no casing is adopted — the abstract
 * token already exists and its symbol stays as-is.
 */
function getTransferAbstractSymbolConflict(
  proof: AbstractTokenAssignmentProof,
  abstractToken: AbstractTokenRef | undefined,
  deployedTokenSymbol: string,
): string | undefined {
  if (proof.kind !== 'non-swapping-transfer') return undefined
  if (!abstractToken) return undefined
  if (
    abstractToken.symbol.toLowerCase() === deployedTokenSymbol.toLowerCase()
  ) {
    return undefined
  }

  return `Non-swapping transfers point to abstract token ${formatRef(abstractToken)}, but the deployed token symbol is ${deployedTokenSymbol}.`
}

/**
 * CoinGecko returns symbols lower-cased, so a brand-new abstract built from a
 * CoinGecko coin can't carry the correct casing on its own. The deployed
 * token's symbol — read from RPC for inserts, or already canonical on the
 * existing record for updates — is the source of truth, so we copy its
 * casing onto the abstract before the write. The conflict check above has
 * already proven the two symbols match case-insensitively. No-op when the
 * casings already agree, so we don't pollute the trace with empty steps.
 */
function adoptDeployedTokenSymbolCasing(
  newAbstractToken: AbstractTokenRecord | undefined,
  deployedTokenSymbol: string,
  steps: IngestionStep[],
): AbstractTokenRecord | undefined {
  if (!newAbstractToken) return undefined
  if (newAbstractToken.symbol === deployedTokenSymbol) return newAbstractToken
  steps.push({
    kind: 'corrected-coingecko-symbol-casing',
    from: newAbstractToken.symbol,
    to: deployedTokenSymbol,
  })
  return { ...newAbstractToken, symbol: deployedTokenSymbol }
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

function generateIngestionTraceId() {
  return `ing_${randomUUID()}`
}
