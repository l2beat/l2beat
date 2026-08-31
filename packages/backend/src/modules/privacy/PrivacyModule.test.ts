import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type {
  BlockProvider,
  BlockTimestampProvider,
  PriceProvider,
  StarknetClient,
} from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { Config } from '../../config'
import type { BlockProviders } from '../../providers/BlockProviders'
import type { Clients } from '../../providers/Clients'
import type { LogsProviders } from '../../providers/LogsProviders'
import type { Providers } from '../../providers/Providers'
import type { Clock } from '../../tools/Clock'
import { createPrivacyModule } from './PrivacyModule'

describe(createPrivacyModule.name, () => {
  it('does not require an EVM logs provider for a Starknet flow', () => {
    const getLogsProvider = mockFn<LogsProviders['getLogsProvider']>()
    const providers = mockObject<Providers>({
      block: mockObject<BlockProviders>({
        getBlockProvider: mockFn().returnsOnce(mockObject<BlockProvider>()),
      }),
      logs: mockObject<LogsProviders>({ getLogsProvider }),
      clients: mockObject<Clients>({
        getStarknetClient: mockFn().returnsOnce(mockObject<StarknetClient>()),
      }),
      price: mockObject<PriceProvider>(),
      blockTimestamp: mockObject<BlockTimestampProvider>(),
    })

    createPrivacyModule({
      config: mockObject<Config>({
        privacy: {
          projects: [],
          flowConfigs: [],
          starknetFlowConfigs: [
            {
              id: 'starknet-flow',
              projectId: 'strk20',
              bucketId: 'strk20-USDC',
              direction: 'deposit',
              chain: 'starknet',
              address: '0xpool',
              event: '0xevent',
              sinceTimestamp: UnixTime(0),
              priceId: 'usd-coin',
              decimals: 6,
              extractor: 'strk20Deposit',
              params: { tokenAddress: '0xtoken' },
            },
          ],
          relayerConfigs: [],
          relayerSampleConfigs: [],
          priceConfigs: [
            {
              id: 'price',
              priceId: 'usd-coin',
              sinceTimestamp: UnixTime(0),
            },
          ],
          blockTimestampConfigs: [
            {
              id: 'starknet-block-timestamp',
              chain: 'starknet',
              sinceTimestamp: UnixTime(0),
            },
          ],
          chains: ['starknet'],
        },
      }),
      logger: Logger.SILENT,
      db: mockObject<Database>(),
      providers,
      clock: mockObject<Clock>(),
      blockProcessors: [],
    })

    expect(getLogsProvider).not.toHaveBeenCalled()
  })
})
