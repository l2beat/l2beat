import type { Env, Logger } from '@l2beat/backend-tools'
import type { ChainConfig, ProjectService } from '@l2beat/config'
import {
  BlockProvider,
  CoingeckoClient,
  CoingeckoQueryService,
  HttpClient,
  RpcClient,
} from '@l2beat/shared'
import { ProjectId, type UnixTime } from '@l2beat/shared-pure'
import { BalanceProvider } from '../providers/BalanceProvider'
import { CirculatingSupplyProvider } from '../providers/CirculatingSupplyProvider'
import { PriceProvider } from '../providers/PriceProvider'
import { RpcClientPOC } from '../providers/RpcClientPOC'
import { TotalSupplyProvider } from '../providers/TotalSupplyProvider'
import { ValueService } from '../services/ValueService'
import type { AmountConfig, ProjectTvsConfig, TokenValue } from '../types'
import { DataFormulaExecutor } from './DataFormulaExecutor'
import { LocalStorage } from './LocalStorage'
import { extractPricesAndAmounts } from './extractPricesAndAmounts'

export class LocalExecutor {
  private readonly storage: LocalStorage
  private readonly valueService: ValueService

  constructor(
    private readonly ps: ProjectService,
    private readonly env: Env,
    private readonly logger: Logger,
  ) {
    this.storage = new LocalStorage('./scripts/tvs/local-data.json')
    this.valueService = new ValueService(this.storage)
  }

  async run(
    config: ProjectTvsConfig,
    timestamps: UnixTime[],
    latestMode: boolean,
  ): Promise<Map<number, TokenValue[]>> {
    const { prices, amounts } = extractPricesAndAmounts(config)

    const dataFormulaExecutor = await this.initDataFormulaExecutor(amounts)

    await dataFormulaExecutor.execute(prices, amounts, timestamps, latestMode)

    return await this.valueService.calculate(config, timestamps)
  }

  private async initDataFormulaExecutor(amounts: AmountConfig[]) {
    const http = new HttpClient()
    const coingeckoQueryService = this.initCoingecko(http)
    const { rpcs, blockProviders } = await this.initChains(http, amounts)

    const priceProvider = new PriceProvider(coingeckoQueryService)
    const circulatingSupplyProvider = new CirculatingSupplyProvider(
      coingeckoQueryService,
    )

    const totalSupplyProvider = new TotalSupplyProvider(rpcs)
    const balanceProvider = new BalanceProvider(rpcs)

    return new DataFormulaExecutor(
      this.storage,
      priceProvider,
      circulatingSupplyProvider,
      blockProviders,
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

    const rpcs = new Map<string, RpcClientPOC>()
    const blockProviders = new Map<string, BlockProvider>()

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

      rpcs.set(
        chainConfig.name,
        new RpcClientPOC(rpc, chainConfig.name, this.logger, {
          ...(multicallV3?.address ? { multicallV3: multicallV3.address } : {}),
          batchingEnabled:
            multicallV3 ||
            chainConfig.name === 'swell' ||
            chainConfig.name === 'silicon'
              ? false
              : true,
        }),
      )
      blockProviders.set(
        chainConfig.name,
        new BlockProvider(chainConfig.name, [rpc]),
      )
    }
    return { rpcs, blockProviders }
  }
}
