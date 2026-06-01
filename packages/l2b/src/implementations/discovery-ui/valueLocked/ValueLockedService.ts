import { Logger } from '@l2beat/backend-tools'
import {
  createDatabase,
  createTokenDatabase,
  type Database,
  type TokenDatabase,
} from '@l2beat/database'
import {
  AllProviders,
  getChainConfigs,
  getDiscoveryPaths,
  type IProvider,
  SQLiteCache,
} from '@l2beat/discovery'
import { HttpClient } from '@l2beat/shared'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { BigNumber, utils } from 'ethers'

const BALANCE_OF_ABI =
  'function balanceOf(address account) view returns (uint256)'

/** A single (token deployment, holder) balance with a non-zero amount. */
export interface DeploymentBalance {
  /** Long chain name the token + holder live on. */
  tokenChain: string
  /** The token contract, as a "chain:address" ChainSpecificAddress. */
  tokenAddress: string
  /** Symbol of the concrete deployment. */
  tokenSymbol: string
  decimals: number
  /** The contract/EOA holding the token, "chain:address" — used for node nav. */
  holderAddress: string
  amount: number
  usd?: number
}

/** Balances grouped by the abstract token they map to. */
export interface AbstractTokenValue {
  abstractTokenId: string
  symbol: string
  iconUrl: string | null
  totalAmount: number
  totalUsd: number
  deployments: DeploymentBalance[]
}

export interface ValueLockedResult {
  fetchedAt: number
  tokens: AbstractTokenValue[]
}

export class ValueLockedNotConfiguredError extends Error {
  constructor() {
    super(
      'Value Locked requires a database connection. Set TOKENS_DATABASE_URL (or DATABASE_URL) to the tokens database.',
    )
    this.name = 'ValueLockedNotConfiguredError'
  }
}

/**
 * Reads the curated token set from the tokens DB and, for each holder on the
 * matching chain, reads its balance over RPC (`balanceOf` for ERC20s,
 * `getBalance` for the native gas token), prices the result via the abstract
 * token's price, and aggregates by abstract token. All heavy resources (DBs,
 * providers) are constructed lazily on first use.
 */
export class ValueLockedService {
  private tokenDb: TokenDatabase | undefined
  private priceDb: Database | undefined
  private allProviders: AllProviders | undefined

  constructor(
    private readonly tokenDbUrl: string | undefined,
    private readonly priceDbUrl: string | undefined,
  ) {}

  isConfigured(): boolean {
    return this.tokenDbUrl !== undefined
  }

  private getTokenDb(): TokenDatabase {
    if (this.tokenDbUrl === undefined) {
      throw new ValueLockedNotConfiguredError()
    }
    if (!this.tokenDb) {
      this.tokenDb = createTokenDatabase({
        connectionString: this.tokenDbUrl,
      })
    }
    return this.tokenDb
  }

  private getPriceDb(): Database | undefined {
    if (this.priceDbUrl === undefined) {
      return undefined
    }
    if (!this.priceDb) {
      this.priceDb = createDatabase({ connectionString: this.priceDbUrl })
    }
    return this.priceDb
  }

  private getProviders(): AllProviders {
    if (!this.allProviders) {
      const paths = getDiscoveryPaths()
      const cache = new SQLiteCache(paths.cache)
      this.allProviders = new AllProviders(
        getChainConfigs(),
        new HttpClient(),
        cache,
        Logger.SILENT,
      )
    }
    return this.allProviders
  }

  async fetch(
    holderAddresses: ChainSpecificAddress[],
  ): Promise<ValueLockedResult> {
    const tokenDb = this.getTokenDb()
    const priceDb = this.getPriceDb()

    // Group holders by their long chain name (matches DeployedToken.chain).
    const holdersByChain = new Map<string, ChainSpecificAddress[]>()
    for (const holder of holderAddresses) {
      const longChain = ChainSpecificAddress.longChain(holder)
      const list = holdersByChain.get(longChain) ?? []
      list.push(holder)
      holdersByChain.set(longChain, list)
    }

    // Only chains with a configured RPC provider can be queried.
    const configuredChains = new Set(getChainConfigs().map((c) => c.name))

    // Curated set: deployments linked to an abstract token (price + icon source).
    const allDeployed = await tokenDb.deployedToken.getAll()
    const curated = allDeployed.filter((d) => d.abstractTokenId !== null)

    const abstractTokens = await tokenDb.abstractToken.getAll()
    const abstractById = new Map(abstractTokens.map((a) => [a.id, a]))

    // Latest USD price per coingecko id. TvsPrice (keyed by coingeckoId via
    // priceId) is the broad source — it covers the TVS-tracked tokens; we fall
    // back to CurrentPrice for any coingecko id it doesn't have.
    const priceByCoingeckoId = new Map<string, number>()
    if (priceDb) {
      const coingeckoIds = unique(
        abstractTokens
          .map((a) => a.coingeckoId)
          .filter((id): id is string => id !== null),
      )
      // Look back a week so tokens with a stale-but-recent price still resolve.
      const since = UnixTime(Math.floor(Date.now() / 1000) - 7 * UnixTime.DAY)
      const tvsPrices = await priceDb.tvsPrice.getLatestPricesByPriceIds(
        coingeckoIds,
        since,
      )
      for (const price of tvsPrices) {
        priceByCoingeckoId.set(price.priceId, price.priceUsd)
      }

      const missing = coingeckoIds.filter((id) => !priceByCoingeckoId.has(id))
      const currentPrices =
        await priceDb.currentPrice.getByCoingeckoIds(missing)
      for (const price of currentPrices) {
        priceByCoingeckoId.set(price.coingeckoId, price.priceUsd)
      }
    }

    const aggregate = new Map<string, AbstractTokenValue>()

    for (const [longChain, holders] of holdersByChain) {
      if (!configuredChains.has(longChain)) {
        continue
      }
      const deployedOnChain = curated.filter((d) => d.chain === longChain)
      if (deployedOnChain.length === 0) {
        continue
      }

      const providers = this.getProviders()
      const blockNumber = await providers.getLatestBlockNumber(longChain)
      const provider: IProvider = await providers.getByBlockNumber(
        longChain,
        blockNumber,
      )

      // Issue all balance calls concurrently; ERC20 balanceOf calls batch into
      // Multicall3 under the hood, native getBalance calls go through directly.
      const tasks: Promise<void>[] = []
      for (const holder of holders) {
        const holderEth = ChainSpecificAddress.address(holder).toString()
        for (const deployed of deployedOnChain) {
          const abstractTokenId = deployed.abstractTokenId
          if (abstractTokenId === null) {
            continue
          }

          // The gas token uses the sentinel "native" address; it has no ERC20
          // balanceOf, so query the account's native balance via getBalance.
          const isNative = deployed.address === 'native'
          let tokenAddress: ChainSpecificAddress | undefined
          let tokenAddressId: string
          if (isNative) {
            tokenAddressId = `${longChain}:native`
          } else {
            try {
              tokenAddress = ChainSpecificAddress.fromLong(
                longChain,
                deployed.address,
              )
            } catch {
              // Skip any other malformed address so one bad row can't fail the
              // whole request.
              continue
            }
            tokenAddressId = tokenAddress.toString()
          }

          const balance: Promise<BigNumber | undefined> = isNative
            ? provider
                .raw(
                  `valueLocked.nativeBalance.${longChain}.${holderEth}.${blockNumber}`,
                  // Return value must survive JSON serialization, so stringify.
                  async ({ baseProvider }) =>
                    (
                      await baseProvider.getBalance(holderEth, blockNumber)
                    ).toString(),
                )
                .then((value) => BigNumber.from(value))
            : provider.callMethod<BigNumber>(
                // biome-ignore lint/style/noNonNullAssertion: set when !isNative
                tokenAddress!,
                BALANCE_OF_ABI,
                [holderEth],
              )

          tasks.push(
            balance
              .then((raw) => {
                if (raw === undefined || raw.isZero()) {
                  return
                }
                const amount = Number(utils.formatUnits(raw, deployed.decimals))
                if (amount === 0) {
                  return
                }
                const abstract = abstractById.get(abstractTokenId)
                const price = abstract?.coingeckoId
                  ? priceByCoingeckoId.get(abstract.coingeckoId)
                  : undefined
                const usd = price !== undefined ? amount * price : undefined

                let agg = aggregate.get(abstractTokenId)
                if (!agg) {
                  agg = {
                    abstractTokenId,
                    symbol: abstract?.symbol ?? deployed.symbol,
                    iconUrl: abstract?.iconUrl ?? null,
                    totalAmount: 0,
                    totalUsd: 0,
                    deployments: [],
                  }
                  aggregate.set(abstractTokenId, agg)
                }
                agg.deployments.push({
                  tokenChain: longChain,
                  tokenAddress: tokenAddressId,
                  tokenSymbol: deployed.symbol,
                  decimals: deployed.decimals,
                  holderAddress: holder.toString(),
                  amount,
                  usd,
                })
                agg.totalAmount += amount
                agg.totalUsd += usd ?? 0
              })
              .catch(() => {
                // Revert / decode / RPC failure — treat as no balance.
              }),
          )
        }
      }
      await Promise.all(tasks)
    }

    const tokens = [...aggregate.values()].sort(
      (a, b) => b.totalUsd - a.totalUsd,
    )
    for (const token of tokens) {
      token.deployments.sort((a, b) => (b.usd ?? 0) - (a.usd ?? 0))
    }

    return { fetchedAt: Date.now(), tokens }
  }
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}

/**
 * Merges a freshly fetched result into a previously persisted one without
 * dropping balances for holders/tokens that were not part of this fetch.
 * Deployments are keyed by (token address, holder); a fresh deployment replaces
 * an existing one with the same key, and any new keys are added.
 */
export function mergeValueLockedResults(
  existing: ValueLockedResult,
  fresh: ValueLockedResult,
): ValueLockedResult {
  interface Group {
    symbol: string
    iconUrl: string | null
    byKey: Map<string, DeploymentBalance>
  }
  const deploymentKey = (d: DeploymentBalance) =>
    `${d.tokenAddress}|${d.holderAddress}`

  const groups = new Map<string, Group>()
  const apply = (result: ValueLockedResult) => {
    for (const token of result.tokens) {
      let group = groups.get(token.abstractTokenId)
      if (!group) {
        group = {
          symbol: token.symbol,
          iconUrl: token.iconUrl,
          byKey: new Map(),
        }
        groups.set(token.abstractTokenId, group)
      } else {
        // Refresh metadata from the most recent source.
        group.symbol = token.symbol
        group.iconUrl = token.iconUrl
      }
      for (const deployment of token.deployments) {
        group.byKey.set(deploymentKey(deployment), deployment)
      }
    }
  }
  apply(existing)
  apply(fresh) // fresh wins for matching (token, holder) keys

  const tokens: AbstractTokenValue[] = []
  for (const [abstractTokenId, group] of groups) {
    const deployments = [...group.byKey.values()]
    if (deployments.length === 0) {
      continue
    }
    tokens.push({
      abstractTokenId,
      symbol: group.symbol,
      iconUrl: group.iconUrl,
      totalAmount: deployments.reduce((sum, d) => sum + d.amount, 0),
      totalUsd: deployments.reduce((sum, d) => sum + (d.usd ?? 0), 0),
      deployments: deployments.sort((a, b) => (b.usd ?? 0) - (a.usd ?? 0)),
    })
  }
  tokens.sort((a, b) => b.totalUsd - a.totalUsd)
  return { fetchedAt: fresh.fetchedAt, tokens }
}
