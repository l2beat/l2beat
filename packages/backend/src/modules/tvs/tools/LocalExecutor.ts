import { type Env, type Logger, RateLimiter } from '@l2beat/backend-tools'
import type { ChainBasicApi, ChainConfig, ProjectService } from '@l2beat/config'
import { createDatabase } from '@l2beat/database'
import {
  BalanceProvider,
  BlockIndexerClient,
  BlockProvider,
  BlockTimestampProvider,
  CirculatingSupplyProvider,
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
  MulticallV3Client,
  PriceProvider,
  RpcClient,
  StarknetClient,
  StarknetTotalSupplyProvider,
  TotalSupplyProvider,
} from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import { chainToProjectId } from '../../../config/chainMap'
import { ValueService } from '../services/ValueService'
import {
  type AmountConfig,
  isOnchainAmountConfig,
  type ProjectTvsConfig,
  type TokenValue,
} from '../types'
import { DataFormulaExecutor } from './DataFormulaExecutor'
import { DBStorage } from './DBStorage'
import { extractPricesAndAmounts } from './extractPricesAndAmounts'
import type { LocalStorage } from './LocalStorage'

export class LocalExecutor {
  private readonly dbStorage: DBStorage | undefined
  private readonly valueService: ValueService

  constructor(
    private readonly ps: ProjectService,
    private readonly env: Env,
    private readonly logger: Logger,
    private readonly localStorage: LocalStorage,
  ) {
    this.valueService = new ValueService(this.localStorage, logger)
    this.dbStorage = this.createDbStorage(env, logger)
  }

  async getTvs(
    projects: ProjectTvsConfig[],
    timestamp: UnixTime,
    latestMode: boolean,
  ): Promise<Map<string, TokenValue[]>> {
    const { prices, amounts } = extractPricesAndAmounts(
      projects.flatMap((c) => c.tokens),
    )

    const dataFormulaExecutor = await this.initDataFormulaExecutor(
      amounts,
      this.logger,
    )

    await dataFormulaExecutor.execute(prices, amounts, timestamp, latestMode)

    const result = new Map<string, TokenValue[]>()

    for (const project of projects) {
      const tvs = await this.valueService.calculate(project, [timestamp])
      result.set(project.projectId, tvs)
    }

    return result
  }

  async getLastNonZeroValues(
    timestamp: number,
    projectId: string | undefined,
  ): Promise<TokenValue[]> {
    if (!this.dbStorage) {
      return []
    }
    this.logger.info(
      `Fetching last non-zero values from DB for timestamp ${timestamp}`,
    )
    return await this.dbStorage.getLastNonZeroValues(timestamp, projectId)
  }

  private async initDataFormulaExecutor(
    amounts: AmountConfig[],
    logger: Logger,
  ) {
    const http = new HttpClient()
    const coingeckoQueryService = this.initCoingecko(http)
    const { rpcs, starknetClients, blockProviders, blockTimestampProvider } =
      await this.initChains(http, amounts)

    const priceProvider = new PriceProvider(coingeckoQueryService)
    const circulatingSupplyProvider = new CirculatingSupplyProvider(
      coingeckoQueryService,
    )

    const totalSupplyProvider = new TotalSupplyProvider(rpcs, logger)
    const starknetTotalSupplyProvider = new StarknetTotalSupplyProvider(
      starknetClients,
      logger,
    )
    const balanceProvider = new BalanceProvider(rpcs, logger)

    return new DataFormulaExecutor(
      this.localStorage,
      this.dbStorage,
      priceProvider,
      circulatingSupplyProvider,
      blockProviders,
      blockTimestampProvider,
      totalSupplyProvider,
      starknetTotalSupplyProvider,
      balanceProvider,
      this.logger,
    )
  }

  private initCoingecko(http: HttpClient) {
    const coingeckoApiKey = this.env.string('COINGECKO_API_KEY')
    const coingeckoClient = new CoingeckoClient({
      apiKey: coingeckoApiKey,
      retryStrategy: 'RELIABLE',
      logger: this.logger,
      callsPerMinute: coingeckoApiKey ? 400 : 10,
      http,
      sourceName: 'coingecko',
    })
    const coingeckoQueryService = new CoingeckoQueryService(coingeckoClient)
    return coingeckoQueryService
  }

  private async initChains(http: HttpClient, amounts: AmountConfig[]) {
    const chainProjects = new Set<string>()

    for (const amount of amounts) {
      if (isOnchainAmountConfig(amount)) {
        chainProjects.add(amount.chain)
      }
    }

    const chainConfigs: ChainConfig[] = []

    for (const chainProject of chainProjects) {
      const project = await this.ps.getProject({
        id: chainToProjectId(chainProject),
        select: ['chainConfig'],
      })

      if (project) {
        chainConfigs.push(project.chainConfig)
      }
    }

    const rpcs: RpcClient[] = []
    const starknetClients: StarknetClient[] = []
    const blockProviders = new Map<string, BlockProvider>()
    const indexerClients: BlockIndexerClient[] = []

    for (const chainConfig of chainConfigs) {
      let blockClient: StarknetClient | RpcClient

      const starknetApi = chainConfig.apis.find(
        (api) => api.type === 'starknet',
      )
      if (starknetApi) {
        blockClient = this.createForStarknet(http, chainConfig, starknetApi)
        starknetClients.push(blockClient)
      } else {
        const rpcApi = chainConfig.apis.find((api) => api.type === 'rpc')
        blockClient = this.createForRpc(http, chainConfig, rpcApi)
        rpcs.push(blockClient)
      }

      blockProviders.set(
        chainConfig.name,
        new BlockProvider(chainConfig.name, [blockClient]),
      )

      const etherscanApi = chainConfig.apis.find(
        (api) => api.type === 'etherscan',
      )

      if (etherscanApi) {
        indexerClients.push(
          new BlockIndexerClient(
            http,
            new RateLimiter({ callsPerMinute: 120 }),
            {
              type: etherscanApi.type,
              url: this.env.string('ETHERSCAN_API_URL'),
              apiKey: this.env.string('ETHERSCAN_API_KEY'),
              chain: chainConfig.name,
              chainId: etherscanApi.chainId,
            },
          ),
        )
      }

      const blockscoutApi = chainConfig.apis.find(
        (api) => api.type === 'blockscout',
      )
      if (blockscoutApi) {
        indexerClients.push(
          new BlockIndexerClient(
            http,
            new RateLimiter({ callsPerMinute: 120 }),
            {
              type: blockscoutApi.type,
              url: blockscoutApi.url,
              chain: chainConfig.name,
            },
          ),
        )
      }
    }

    const blockTimestampProvider = new BlockTimestampProvider({
      indexerClients,
      blockProviders: Array.from(blockProviders.values()),
    })

    return { rpcs, starknetClients, blockProviders, blockTimestampProvider }
  }

  private createForStarknet(
    http: HttpClient,
    chainConfig: ChainConfig,
    starknetApi: ChainBasicApi<'starknet'>,
  ) {
    return new StarknetClient({
      url: this.env.string(
        `${chainConfig.name.toUpperCase()}__RPC_URL`,
        starknetApi.url,
      ),
      http,
      logger: this.logger,
      retryStrategy: 'RELIABLE',
      sourceName: chainConfig.name,
      callsPerMinute: this.env.integer(
        `${chainConfig.name.toUpperCase()}_RPC_CALLS_PER_MINUTE`,
        starknetApi?.callsPerMinute ?? 120,
      ),
    })
  }

  private createForRpc(
    http: HttpClient,
    chainConfig: ChainConfig,
    rpcApi?: ChainBasicApi<'rpc'>,
  ) {
    const url = this.env.string(
      `${chainConfig.name.toUpperCase()}_RPC_URL`,
      rpcApi?.url,
    )
    const callsPerMinute = this.env.integer(
      `${chainConfig.name.toUpperCase()}_RPC_CALLS_PER_MINUTE`,
      rpcApi?.callsPerMinute ?? 120,
    )

    const multicallV3 = chainConfig.multicallContracts?.find(
      (contract) => contract.version === '3',
    )

    const multicallClient = multicallV3
      ? new MulticallV3Client(multicallV3.address, multicallV3.sinceBlock, 150)
      : undefined

    return new RpcClient({
      url,
      http,
      logger: this.logger,
      retryStrategy: 'RELIABLE',
      chain: chainConfig.name,
      callsPerMinute: callsPerMinute,
      multicallClient,
    })
  }

  private createDbStorage(env: Env, logger: Logger): DBStorage | undefined {
    const tvsDbUrl = env.optionalString('TVS_DB_URL')

    if (!tvsDbUrl) {
      logger.warn('TVS_DB_URL is not set. All data will be fetched from APIs')
      return undefined
    }

    const db = createDatabase({
      connectionString: tvsDbUrl,
      application_name: 'TVS-LOCAL-EXECUTOR',
      ssl: { rejectUnauthorized: false },
      min: 2,
      max: 10,
      keepAlive: false,
    })

    return new DBStorage(db, logger, true)
  }
}
