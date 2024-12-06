import { Logger } from '@l2beat/backend-tools'
import {
  ChainConfig,
  Layer2Display,
  PERFORMED_BY,
  ProofVerification,
  ZkCatalogProject,
} from '@l2beat/config'
import {
  BlockscoutInternalTransaction,
  BlockscoutV2Client,
} from '@l2beat/shared'
import { ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { install } from '@sinonjs/fake-timers'
import { expect, mockFn, mockObject } from 'earl'
import { Peripherals } from '../../peripherals/Peripherals'

import { Database } from '@l2beat/database'
import { Clock } from '../../tools/Clock'
import {
  VerifiersStatusRefresher,
  VerifiersStatusRefresherDeps,
} from './VerifiersStatusRefresher'

const zkVerifierAddress = EthereumAddress.random()
const zksMock: ZkCatalogProject[] = [
  {
    type: 'zk-catalog',
    createdAt: UnixTime.now(),
    display: mockObject<Layer2Display>({
      name: 'zk-mock',
    }),
    proofVerification: mockObject<ProofVerification>({
      verifiers: [
        {
          name: 'Example Verifier',
          description: '',
          verified: 'failed',
          contractAddress: zkVerifierAddress,
          chainId: ChainId.ETHEREUM,
          subVerifiers: [],
          performedBy: PERFORMED_BY.l2beat,
        },
      ],
    }),
  },
]

describe(VerifiersStatusRefresher.name, () => {
  describe(VerifiersStatusRefresher.prototype.getBlockscoutClient.name, () => {
    it('creates correct client', () => {
      const getClientMock = mockFn().returns(mockObject<BlockscoutV2Client>())

      const verifierChainId = ChainId.ETHEREUM

      const chainConfigMock = mockObject<ChainConfig>({
        chainId: verifierChainId.valueOf(),
        blockscoutV2ApiUrl: 'https://eth.blockscout.com/api/v2',
      })

      const refresher = createVerifierStatusRefresher({
        peripherals: mockObject<Peripherals>({
          getClient: getClientMock,
        }),
        chains: [chainConfigMock],
      })

      refresher.getBlockscoutClient(verifierChainId)

      expect(getClientMock).toHaveBeenCalledWith(BlockscoutV2Client, {
        url: chainConfigMock.blockscoutV2ApiUrl,
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
      const lastUsed = UnixTime.now().add(-2, 'hours')
      const lastUpdated = UnixTime.now().add(-1, 'hours')

      const time = install()
      time.setSystemTime(lastUpdated.toDate())

      const verifierStatusRepositoryMock = mockObject<
        Database['verifierStatus']
      >({
        upsert: mockFn().resolvesTo(''),
      })

      const refresher = createVerifierStatusRefresher({
        db: mockDatabase({
          verifierStatus: verifierStatusRepositoryMock,
        }),
        verifiersListProvider: mockFn(
          async () => zksMock[0].proofVerification.verifiers,
        ),
      })

      refresher.getBlockscoutClient = mockFn().returns(
        mockObject<BlockscoutV2Client>({
          getInternalTransactions: mockFn().resolvesTo([
            mockObject<BlockscoutInternalTransaction>({
              timestamp: lastUsed.add(-1, 'hours'),
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
        verifiersListProvider: () => Promise.resolve([]),
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
    verifiersListProvider: () => Promise.resolve([]),
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
