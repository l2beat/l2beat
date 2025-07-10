import { Logger } from '@l2beat/backend-tools'
import type { ChainConfig, OnchainVerifier } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import {
  type BlockscoutInternalTransaction,
  BlockscoutV2Client,
} from '@l2beat/shared'
import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { install } from '@sinonjs/fake-timers'
import { expect, mockFn, mockObject } from 'earl'
import type { Peripherals } from '../../peripherals/Peripherals'
import type { Clock } from '../../tools/Clock'
import {
  VerifiersStatusRefresher,
  type VerifiersStatusRefresherDeps,
} from './VerifiersStatusRefresher'

const zkVerifierAddress = EthereumAddress.random()
const mockVerifiers: OnchainVerifier[] = [
  {
    name: 'Example Verifier',
    description: '',
    verified: 'failed',
    contractAddress: zkVerifierAddress,
    chainId: ChainId.ETHEREUM,
    subVerifiers: [],
    performedBy: { name: 'Joe', link: 'https://example.com' },
  },
]

describe(VerifiersStatusRefresher.name, () => {
  describe(VerifiersStatusRefresher.prototype.getBlockscoutClient.name, () => {
    it('creates correct client', () => {
      const getClientMock = mockFn().returns(mockObject<BlockscoutV2Client>())

      const verifierChainId = ChainId.ETHEREUM

      const chainConfigMock = mockObject<ChainConfig>({
        chainId: verifierChainId.valueOf(),
        apis: [
          {
            type: 'blockscoutV2',
            url: 'https://eth.blockscout.com/api/v2',
          },
        ],
      })

      const refresher = createVerifierStatusRefresher({
        peripherals: mockObject<Peripherals>({
          getClient: getClientMock,
        }),
        chains: [chainConfigMock],
      })

      refresher.getBlockscoutClient(verifierChainId)

      expect(getClientMock).toHaveBeenCalledWith(BlockscoutV2Client, {
        url: 'https://eth.blockscout.com/api/v2',
      })
    })

    it('throws if blockscout url is not configured', () => {
      const refresher = createVerifierStatusRefresher({ chains: [] })
      expect(() => refresher.getBlockscoutClient(ChainId.ETHEREUM)).toThrow(
        'Blockscout API URL is not configured for chain 1',
      )
    })
  })

  describe(VerifiersStatusRefresher.prototype.refresh.name, () => {
    it('correctly fetches verifier statuses', async () => {
      const lastUsed = UnixTime.now() - 2 * UnixTime.HOUR
      const lastUpdated = UnixTime.now() - 1 * UnixTime.HOUR

      const time = install()
      time.setSystemTime(UnixTime.toDate(lastUpdated))

      const verifierStatusRepositoryMock = mockObject<
        Database['verifierStatus']
      >({
        upsert: mockFn().resolvesTo(''),
      })

      const refresher = createVerifierStatusRefresher({
        db: mockDatabase({
          verifierStatus: verifierStatusRepositoryMock,
        }),
        verifiers: mockVerifiers,
      })

      refresher.getBlockscoutClient = mockFn().returns(
        mockObject<BlockscoutV2Client>({
          getInternalTransactions: mockFn().resolvesTo([
            mockObject<BlockscoutInternalTransaction>({
              timestamp: lastUsed - 1 * UnixTime.HOUR,
            }),
            mockObject<BlockscoutInternalTransaction>({
              timestamp: lastUsed,
            }),
          ]),
        }),
      )

      await refresher.refresh()

      expect(verifierStatusRepositoryMock.upsert).toHaveBeenCalledWith({
        address: zkVerifierAddress.toString(),
        chainId: ChainId.ETHEREUM,
        lastUsed,
        lastUpdated,
      })

      time.uninstall()
    })

    it('throws if no verifiers found', async () => {
      const refresher = createVerifierStatusRefresher({
        chains: [],
        verifiers: [],
      })

      await expect(() => refresher.refresh()).toBeRejectedWith(
        'No verifier addresses found',
      )
    })
  })
})

function createVerifierStatusRefresher(
  deps?: Partial<VerifiersStatusRefresherDeps>,
) {
  return new VerifiersStatusRefresher({
    db: mockDatabase(),
    peripherals: mockObject<Peripherals>(),
    clock: mockObject<Clock>(),
    logger: Logger.SILENT,
    verifiers: [],
    chains: [],
    ...deps,
  })
}

function mockDatabase(repos?: Partial<Database>) {
  return mockObject<Database>({
    verifierStatus: mockObject<Database['verifierStatus']>(),
    ...repos,
  })
}
