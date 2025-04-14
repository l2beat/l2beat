import { Env, type Logger, RateLimiter } from '@l2beat/backend-tools'
import type { ChainConfig, ProjectService } from '@l2beat/config'
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
  TotalSupplyProvider,
} from '@l2beat/shared'
import { ProjectId, type UnixTime } from '@l2beat/shared-pure'
import { ValueService } from '../services/ValueService'
import type { AmountConfig, ProjectTvsConfig, TokenValue } from '../types'
import { DBStorage } from './DBStorage'
import { DataFormulaExecutor } from './DataFormulaExecutor'
import { LocalStorage } from './LocalStorage'
import { extractPricesAndAmounts } from './extractPricesAndAmounts'

export class LocalExecutor {
  private readonly localStorage: LocalStorage
  private readonly dbStorage: DBStorage | undefined
  private readonly valueService: ValueService

  constructor(
    private readonly ps: ProjectService,
    private readonly env: Env,
    private readonly logger: Logger,
  ) {
    this.localStorage = new LocalStorage('./scripts/tvs/local-data.json')
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

  private async initDataFormulaExecutor(
    amounts: AmountConfig[],
    logger: Logger,
  ) {
    const http = new HttpClient()
    const coingeckoQueryService = this.initCoingecko(http)
    const { rpcs, blockProviders, blockTimestampProvider } =
      await this.initChains(http, amounts)

    const priceProvider = new PriceProvider(coingeckoQueryService)
    const circulatingSupplyProvider = new CirculatingSupplyProvider(
      coingeckoQueryService,
    )

    const totalSupplyProvider = new TotalSupplyProvider(rpcs, logger)
    const balanceProvider = new BalanceProvider(rpcs, logger)

    return new DataFormulaExecutor(
      this.localStorage,
      this.dbStorage,
      priceProvider,
      circulatingSupplyProvider,
      blockProviders,
      blockTimestampProvider,
      totalSupplyProvider,
      balanceProvider,
      this.logger,
    )
  }

  private initCoingecko(http: HttpClient) {
    const coingeckoApiKey = this.env.optionalString('COINGECKO_API_KEY')
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
      if (amount.type === 'balanceOfEscrow' || amount.type === 'totalSupply') {
        chainProjects.add(amount.chain)
      }
    }

    const chainConfigs: ChainConfig[] = []

    for (const chainProject of chainProjects) {
      const project = await this.ps.getProject({
        id: ProjectId(chainProject),
        select: ['chainConfig'],
      })

      if (project) {
        chainConfigs.push(project.chainConfig)
      }
    }

    const rpcs: RpcClient[] = []
    const blockProviders = new Map<string, BlockProvider>()
    const indexerClients: BlockIndexerClient[] = []

    for (const chainConfig of chainConfigs) {
      const rpcApi = chainConfig.apis.find((api) => api.type === 'rpc')
      const url = this.env.string(
        `${chainConfig.name.toUpperCase()}_RPC_URL`,
        rpcApi?.url,
      )
      const callsPerMinute = this.env.integer(
        `${chainConfig.name.toUpperCase()}_RPC_CALLS_PER_MINUTE`,
        rpcApi?.callsPerMinute,
      )

      const rpc = new RpcClient({
        url,
        http,
        logger: this.logger,
        retryStrategy: 'RELIABLE',
        sourceName: chainConfig.name,
        callsPerMinute: callsPerMinute,
      })

      const multicallV3 = chainConfig.multicallContracts?.find(
        (contract) => contract.version === '3',
      )

      const multicallClient = multicallV3
        ? new MulticallV3Client(
            multicallV3.address,
            multicallV3.sinceBlock,
            150,
          )
        : undefined

      rpcs.push(
        new RpcClient({
          url,
          http,
          logger: this.logger,
          retryStrategy: 'RELIABLE',
          sourceName: chainConfig.name,
          callsPerMinute: callsPerMinute,
          multicallClient,
        }),
      )
      blockProviders.set(
        chainConfig.name,
        new BlockProvider(chainConfig.name, [rpc]),
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
              url: etherscanApi.url,
              apiKey: this.env.string(
                Env.key(chainConfig.name, 'ETHERSCAN_API_KEY'),
              ),
              chain: chainConfig.name,
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
    return { rpcs, blockProviders, blockTimestampProvider }
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
