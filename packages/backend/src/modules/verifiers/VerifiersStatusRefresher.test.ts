import { Logger } from '@l2beat/backend-tools'
import {
  ChainConfig,
  Layer2,
  Layer2Config,
  Layer2Display,
  PERFORMED_BY,
  ProofVerification,
  ScalingProjectContracts,
  ScalingProjectRiskView,
  ScalingProjectStateValidation,
  ScalingProjectTechnology,
  StageConfig,
  ZkCatalogProject,
} from '@l2beat/config'
import {
  BlockscoutInternalTransaction,
  BlockscoutV2Client,
} from '@l2beat/shared'
import {
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { install } from '@sinonjs/fake-timers'
import { expect, mockFn, mockObject } from 'earl'
import { Peripherals } from '../../peripherals/Peripherals'

import {
  VerifiersStatusRefresher,
  VerifiersStatusRefresherDeps,
} from './VerifiersStatusRefresher'
import { Database, VerifierStatusRepository } from '@l2beat/database'
import { Clock } from '../../tools/Clock'

const zkVerfifierAddress = EthereumAddress.random()
const zksMock: ZkCatalogProject[] = [
  {
    type: 'zk-catalog',
    display: mockObject<Layer2Display>({
      name: 'zk-mock',
    }),
    proofVerification: mockObject<ProofVerification>({
      verifiers: [
        {
          name: 'Example Verifier',
          description: '',
          verified: 'failed',
          contractAddress: zkVerfifierAddress,
          chainId: ChainId.ETHEREUM,
          subVerifiers: [],
          performedBy: PERFORMED_BY.l2beat,
        },
      ],
    }),
  },
]

const l2VerfifierAddress = EthereumAddress.random()
const l2sMock: Layer2[] = [
  {
    type: 'layer2',
    id: ProjectId('project-id'),
    display: mockObject<Layer2Display>({
      name: 'l2-mock',
    }),
    technology: mockObject<ScalingProjectTechnology>(),
    contracts: mockObject<ScalingProjectContracts>(),
    riskView: mockObject<ScalingProjectRiskView>(),
    config: mockObject<Layer2Config>(),
    stage: mockObject<StageConfig>(),
    stateValidation: mockObject<ScalingProjectStateValidation>({
      proofVerification: mockObject<ProofVerification>({
        verifiers: [
          {
            name: 'Example Verifier',
            description: '',
            verified: 'failed',
            contractAddress: l2VerfifierAddress,
            chainId: ChainId.ETHEREUM,
            subVerifiers: [],
            performedBy: PERFORMED_BY.l2beat,
          },
        ],
      }),
    }),
  },
]

describe.only(VerifiersStatusRefresher.name, () => {
  describe(VerifiersStatusRefresher.prototype.getVerifiers.name, () => {
    it('correctly lists projects with verifiers', () => {
      const refresher = createVerifierStatusRefresher({
        layer2s: l2sMock,
        zkCatalogProjects: zksMock,
      })
      const result = refresher.getVerifiers()

      const expectedResult = [
        ...l2sMock[0].stateValidation?.proofVerification?.verifiers!,
        ...zksMock[0].proofVerification.verifiers,
      ]

      expect(result).toEqualUnsorted(expectedResult)
    })
  })

  describe(VerifiersStatusRefresher.prototype.getBlockscoutClient.name, () => {
    it('creates correct client', () => {
      const getClientMock = mockFn().returns(mockObject<BlockscoutV2Client>())

      const verifierChainId = ChainId.ETHEREUM

      const chainConfigMock = mockObject<ChainConfig>({
        chainId: verifierChainId.valueOf(),
        blockscoutV2ApiUrl: 'https://eth.blockscout.com/api/v2',
      })

      const controller = createVerifierStatusRefresher({
        peripherals: mockObject<Peripherals>({
          getClient: getClientMock,
        }),
        chains: [chainConfigMock],
      })

      controller.getBlockscoutClient(verifierChainId)

      expect(getClientMock).toHaveBeenCalledWith(BlockscoutV2Client, {
        url: chainConfigMock.blockscoutV2ApiUrl,
      })
    })

    it('throws if blockscout url is not configured', () => {
      const controller = createVerifierStatusRefresher({ chains: [] })
      expect(() => controller.getBlockscoutClient(ChainId.ETHEREUM)).toThrow(
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

      const verifierStatusRepositoryMock = mockObject<VerifierStatusRepository>(
        {
          addOrUpdate: mockFn().resolvesTo(''),
        },
      )

      const refresher = createVerifierStatusRefresher({
        database: mockDatabase({
          verifierStatus: verifierStatusRepositoryMock,
        }),
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

      refresher.getVerifiers = mockFn().returns(
        zksMock[0].proofVerification.verifiers,
      )

      await refresher.refresh()

      expect(verifierStatusRepositoryMock.addOrUpdate).toHaveBeenCalledWith({
        address: zkVerfifierAddress.toString(),
        chainId: ChainId.ETHEREUM,
        lastUsed,
        lastUpdated,
      })

      time.uninstall()
    })

    it('throws if no verifiers found', async () => {
      const refresher = createVerifierStatusRefresher({
        chains: [],
        layer2s: [],
        zkCatalogProjects: [],
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
    database: mockDatabase(),
    peripherals: mockObject<Peripherals>(),
    clock: mockObject<Clock>(),
    logger: Logger.SILENT,
    zkCatalogProjects: [],
    layer2s: [],
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
