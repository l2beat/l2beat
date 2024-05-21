import {
  Layer2,
  Layer2Config,
  Layer2Display,
  ProofVerification,
  ScalingProjectContracts,
  ScalingProjectRiskView,
  ScalingProjectStateValidation,
  ScalingProjectTechnology,
  StageConfig,
  ZkCatalogProject,
} from '@l2beat/config'
import {
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { BlockscoutClient } from '../../peripherals/blockscout/BlockscoutClient'
import { BlockscoutInternalTransaction } from '../../peripherals/blockscout/schemas'
import {
  VerifiersController,
  VerifiersControllerDeps,
  testAddresses,
} from './VerifiersController'

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
    display: mockObject<Layer2Display>(),
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
          },
        ],
      }),
    }),
  },
]

describe(VerifiersController.name, () => {
  describe(VerifiersController.prototype.getVerifierAddresses.name, () => {
    it('correctly lists projects with verifiers', () => {
      const controller = createVeririferController()
      const result = controller.getVerifierAddresses(l2sMock, zksMock)

      const expectedResult = [
        ...testAddresses,
        zkVerfifierAddress,
        l2VerfifierAddress,
      ]

      expect(result).toEqualUnsorted(expectedResult)
    })
  })

  describe(VerifiersController.prototype.getVerifierStatuses.name, () => {
    it('correctly fetches verifier statuses', async () => {
      const timestamp = UnixTime.now()
      const controller = createVeririferController({
        blockscoutClient: mockObject<BlockscoutClient>({
          getInternalTransactions: mockFn().resolvesTo([
            mockObject<BlockscoutInternalTransaction>({
              timestamp: timestamp.add(-1, 'hours'),
            }),
            mockObject<BlockscoutInternalTransaction>({
              timestamp,
            }),
          ]),
        }),
      })

      controller.getVerifierAddresses = mockFn().returns([zkVerfifierAddress])

      const result = await controller.getVerifierStatuses()

      expect(result).toEqual([
        {
          address: zkVerfifierAddress.toString(),
          timestamp,
        },
      ])
    })

    it('return null if status fetch fails', async () => {
      const controller = createVeririferController({
        blockscoutClient: mockObject<BlockscoutClient>({
          getInternalTransactions: mockFn().throws(
            new Error('Failed to fetch'),
          ),
        }),
      })

      controller.getVerifierAddresses = mockFn().returns([zkVerfifierAddress])

      const result = await controller.getVerifierStatuses()

      expect(result).toEqual([
        {
          address: zkVerfifierAddress.toString(),
          timestamp: null,
        },
      ])
    })

    it('throws if no verifiers found', async () => {
      const controller = createVeririferController()
      controller.getVerifierAddresses = mockFn().returns([])

      await expect(() => controller.getVerifierStatuses()).toBeRejectedWith(
        'No verifier addresses found',
      )
    })
  })
})

function createVeririferController(deps?: Partial<VerifiersControllerDeps>) {
  return new VerifiersController({
    blockscoutClient: mockObject<BlockscoutClient>(),
    projects: [],
    ...deps,
  })
}
