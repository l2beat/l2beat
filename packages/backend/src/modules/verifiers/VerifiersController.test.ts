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
  VerifiersController,
  VerifiersControllerDeps,
} from './VerifiersController'
import { VerifierStatusRepository } from './repositories/VerifierStatusRepository'

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

describe(VerifiersController.name, () => {
  describe(VerifiersController.prototype.getVerifiers.name, () => {
    it('correctly lists projects with verifiers', () => {
      const controller = createVeririferController()
      const result = controller.getVerifiers(l2sMock, zksMock)

      const expectedResult = [
        ...l2sMock[0].stateValidation?.proofVerification?.verifiers!,
        ...zksMock[0].proofVerification.verifiers,
      ]

      expect(result).toEqualUnsorted(expectedResult)
    })
  })

  describe(VerifiersController.prototype.getBlockscoutClient.name, () => {
    it('creates correct client', () => {
      const getClientMock = mockFn().returns(mockObject<BlockscoutV2Client>())

      const controller = createVeririferController({
        peripherals: mockObject<Peripherals>({
          getClient: getClientMock,
          getRepository: mockFn().returns(
            mockObject<VerifierStatusRepository>(),
          ),
        }),
      })

      const verifierChainId = ChainId.ETHEREUM

      const chainConfigMock = mockObject<ChainConfig>({
        chainId: verifierChainId.valueOf(),
        blockscoutV2ApiUrl: 'https://eth.blockscout.com/api/v2',
      })

      controller.getBlockscoutClient(verifierChainId, [chainConfigMock])

      expect(getClientMock).toHaveBeenCalledWith(BlockscoutV2Client, {
        url: chainConfigMock.blockscoutV2ApiUrl,
      })
    })

    it('throws if blockscout url is not configured', () => {
      const controller = createVeririferController()
      expect(() =>
        controller.getBlockscoutClient(ChainId.ETHEREUM, []),
      ).toThrow('Blockscout API URL is not configured for chain 1')
    })
  })

  describe(VerifiersController.prototype.getVerifierStatuses.name, () => {
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

      const controller = createVeririferController({
        peripherals: mockObject<Peripherals>({
          getRepository: mockFn().returns(verifierStatusRepositoryMock),
        }),
      })

      controller.getBlockscoutClient = mockFn().returns(
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

      controller.getVerifiers = mockFn().returns(
        zksMock[0].proofVerification.verifiers,
      )

      const result = await controller.getVerifierStatuses()

      expect(verifierStatusRepositoryMock.addOrUpdate).toHaveBeenCalledWith({
        address: zkVerfifierAddress.toString(),
        chainId: ChainId.ETHEREUM,
        lastUsed,
        lastUpdated,
      })

      expect(result).toEqual([
        {
          address: zkVerfifierAddress.toString(),
          timestamp: lastUsed,
        },
      ])

      time.uninstall()
    })

    it('returns saved status if fetch fails', async () => {
      const controller = createVeririferController()

      const savedStatus = {
        address: zkVerfifierAddress.toString(),
        timestamp: UnixTime.now(),
      }

      controller.handleError = mockFn().resolvesTo(savedStatus)

      controller.getBlockscoutClient = mockFn().returns(
        mockObject<BlockscoutV2Client>({
          getInternalTransactions: mockFn().throws(
            new Error('Failed to fetch'),
          ),
        }),
      )

      controller.getVerifiers = mockFn().returns(
        zksMock[0].proofVerification.verifiers,
      )

      const result = await controller.getVerifierStatuses()

      expect(result).toEqual([savedStatus])
    })

    it('throws if no verifiers found', async () => {
      const controller = createVeririferController()
      controller.getVerifiers = mockFn().returns([])

      await expect(() => controller.getVerifierStatuses()).toBeRejectedWith(
        'No verifier addresses found',
      )
    })
  })
})

describe(VerifiersController.prototype.handleError.name, () => {
  it('returns saved status if available', async () => {
    const verifier = zksMock[0].proofVerification.verifiers[0]
    const savedStatus = {
      address: verifier.contractAddress.toString(),
      chainId: verifier.chainId,
      lastUsed: UnixTime.now(),
      lastUpdated: UnixTime.now(),
    }

    const verifierStatusRepositoryMock = mockObject<VerifierStatusRepository>({
      findVerifierStatus: mockFn().resolvesTo(savedStatus),
    })

    const controller = createVeririferController({
      peripherals: mockObject<Peripherals>({
        getRepository: mockFn().returns(verifierStatusRepositoryMock),
      }),
    })

    const result = await controller.handleError(verifier, new Error('Failed'))

    expect(result).toEqual({
      address: verifier.contractAddress.toString(),
      timestamp: savedStatus.lastUsed,
    })
  })

  it('returns null if saved status if not available', async () => {
    const verifier = zksMock[0].proofVerification.verifiers[0]

    const verifierStatusRepositoryMock = mockObject<VerifierStatusRepository>({
      findVerifierStatus: mockFn().resolvesTo(undefined),
    })

    const controller = createVeririferController({
      peripherals: mockObject<Peripherals>({
        getRepository: mockFn().returns(verifierStatusRepositoryMock),
      }),
    })

    const result = await controller.handleError(verifier, new Error('Failed'))

    expect(result).toEqual({
      address: verifier.contractAddress.toString(),
      timestamp: null,
    })
  })

  it('returns null if saved status older than a day', async () => {
    const verifier = zksMock[0].proofVerification.verifiers[0]
    const savedStatus = {
      address: verifier.contractAddress.toString(),
      chainId: verifier.chainId,
      lastUsed: UnixTime.now(),
      lastUpdated: UnixTime.now().add(-2, 'days'),
    }

    const verifierStatusRepositoryMock = mockObject<VerifierStatusRepository>({
      findVerifierStatus: mockFn().resolvesTo(savedStatus),
    })

    const controller = createVeririferController({
      peripherals: mockObject<Peripherals>({
        getRepository: mockFn().returns(verifierStatusRepositoryMock),
      }),
    })

    const result = await controller.handleError(verifier, new Error('Failed'))

    expect(result).toEqual({
      address: verifier.contractAddress.toString(),
      timestamp: null,
    })
  })
})

function createVeririferController(deps?: Partial<VerifiersControllerDeps>) {
  return new VerifiersController({
    peripherals: mockObject<Peripherals>({
      getRepository: mockFn().returns(mockObject<VerifierStatusRepository>()),
    }),
    projects: [],
    logger: Logger.SILENT,
    ...deps,
  })
}
