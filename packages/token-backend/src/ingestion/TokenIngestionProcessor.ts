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
      newAbstractToken: AbstractTokenRecord | undefined
      symbolFallback: string | undefined
    }
  | { type: 'missing' }
  | { type: 'conflict'; message: string }

type NewDeployedTokenResult =
  | { type: 'ready'; record: DeployedTokenRecord }
  | { type: 'error'; message: string }
type WriteResolvedTokenResult =
  | { type: 'success'; didWrite: boolean }
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
  ) {
    const address = normalizeQueuedAddress(entry)
    if (!address) {
      await this.deps.tokenDb.tokenIngestionQueue.remove(entry)
      return
    }

    const existing =
      await this.deps.tokenDb.deployedToken.findByChainAndAddress(address)
    const transfers = transferIndex.findInvolving(address)
    const resolution = await this.resolveAbstractToken(
      address,
      existing,
      transfers,
    )

    if (resolution.type === 'conflict') {
      await this.deps.tokenDb.tokenIngestionQueue.markConflict(
        entry,
        resolution.message,
      )
      return
    }
    if (resolution.type === 'missing') {
      await this.deps.tokenDb.tokenIngestionQueue.remove(entry)
      return
    }

    const writeResult = await this.writeResolvedToken(
      address,
      existing,
      resolution,
    )
    if (writeResult.type === 'error') {
      await this.deps.tokenDb.tokenIngestionQueue.markError(
        entry,
        writeResult.message,
      )
      return
    }

    if (writeResult.didWrite) {
      await this.enqueueTransferNeighbors(address, transfers)
    }

    await this.deps.db.interopTransfer.markAsUnprocessedByTokens([
      { chain: address.chain, tokenAddress: address.address },
    ])

    await this.deps.tokenDb.tokenIngestionQueue.remove(entry)
  }

  private async resolveAbstractToken(
    address: TokenAddress,
    existing: DeployedTokenRecord | undefined,
    transfers: InteropTransferMatch[],
  ): Promise<AbstractTokenResolution> {
    const fromTransfers =
      await this.resolveAbstractFromNonSwappingTransfers(transfers)

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

    const abstractTokenId =
      fromTransfers.abstractTokenId ?? existing?.abstractTokenId
    if (abstractTokenId) {
      return {
        type: 'resolved',
        abstractTokenId,
        newAbstractToken: undefined,
        symbolFallback: undefined,
      }
    }

    return await this.resolveAbstractFromCoingecko(address)
  }

  private async resolveAbstractFromNonSwappingTransfers(
    transfers: InteropTransferMatch[],
  ): Promise<
    | { type: 'resolved'; abstractTokenId: string | undefined }
    | { type: 'conflict'; message: string }
  > {
    const otherTokens = uniqueTokenAddresses(
      transfers
        .filter((match) => isNonSwappingTransfer(match.transfer))
        .map((match) => match.otherToken)
        .filter((address): address is TokenAddress => address !== undefined),
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
  ): Promise<AbstractTokenResolution> {
    const coin = await this.findCoingeckoCoin(address)
    if (!coin) {
      return { type: 'missing' }
    }

    const abstractToken =
      await this.deps.tokenDb.abstractToken.findByCoingeckoId(coin.id)
    if (abstractToken) {
      return {
        type: 'resolved',
        abstractTokenId: abstractToken.id,
        newAbstractToken: undefined,
        symbolFallback: coin.symbol.toUpperCase(),
      }
    }

    const newAbstractToken = await this.buildAbstractToken(coin.id)
    return {
      type: 'resolved',
      abstractTokenId: newAbstractToken.id,
      newAbstractToken,
      symbolFallback: newAbstractToken.symbol,
    }
  }

  private async writeResolvedToken(
    address: TokenAddress,
    existing: DeployedTokenRecord | undefined,
    resolution: Extract<AbstractTokenResolution, { type: 'resolved' }>,
  ): Promise<WriteResolvedTokenResult> {
    if (existing) {
      if (existing.abstractTokenId === resolution.abstractTokenId) {
        return { type: 'success', didWrite: false }
      }

      await this.deps.tokenDb.transaction(async () => {
        if (resolution.newAbstractToken) {
          await this.deps.tokenDb.abstractToken.insert(
            resolution.newAbstractToken,
          )
        }
        await this.deps.tokenDb.deployedToken.updateByChainAndAddress(address, {
          abstractTokenId: resolution.abstractTokenId,
        })
      }, 'serializable')

      return { type: 'success', didWrite: true }
    }

    const newDeployedToken = await this.buildDeployedToken(address, resolution)
    if (newDeployedToken.type === 'error') {
      return newDeployedToken
    }

    await this.deps.tokenDb.transaction(async () => {
      if (resolution.newAbstractToken) {
        await this.deps.tokenDb.abstractToken.insert(
          resolution.newAbstractToken,
        )
      }
      await this.deps.tokenDb.deployedToken.insert(newDeployedToken.record)
    }, 'serializable')

    return { type: 'success', didWrite: true }
  }

  private async buildDeployedToken(
    address: TokenAddress,
    resolution: Extract<AbstractTokenResolution, { type: 'resolved' }>,
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
    if (facts.isContract === false) {
      return {
        type: 'error',
        message: `${address.chain}:${address.address} is not a deployed contract.`,
      }
    }

    const symbol = facts.symbol ?? resolution.symbolFallback
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
        abstractTokenId: resolution.abstractTokenId,
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

  private async enqueueTransferNeighbors(
    address: TokenAddress,
    transfers: InteropTransferMatch[],
  ) {
    for (const transfer of transfers) {
      const otherToken = transfer.otherToken
      if (!otherToken || getTokenKey(otherToken) === getTokenKey(address)) {
        continue
      }
      await this.deps.tokenDb.tokenIngestionQueue.enqueue(
        otherToken,
        this.deps.newQueueState ?? 'pending',
      )
    }
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
