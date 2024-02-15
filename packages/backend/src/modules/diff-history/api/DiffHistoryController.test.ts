import { ConfigReader, DiscoveryConfig } from '@l2beat/discovery'
import { ContractParameters } from '@l2beat/discovery-types'
import {
  ChainId,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { ChainConverter } from '../../../tools/ChainConverter'
import {
  DiscoveryHistoryRecord,
  DiscoveryHistoryRepository,
} from '../../update-monitor/repositories/DiscoveryHistoryRepository'
import { DiffHistoryController } from './DiffHistoryController'

describe(DiffHistoryController.name, () => {
  const chainConverter = new ChainConverter([
    { name: 'ethereum', chainId: ChainId(1) },
  ])

  describe(
    DiffHistoryController.prototype.getDiffHistoryPerProject.name,
    () => {
      it('multiple records produce a diff', async () => {
        const ADDRESS_A = EthereumAddress.random()
        const ADDRESS_B = EthereumAddress.random()
        const ADDRESS_C = EthereumAddress.random()
        const CONTRACTS_AT_1: ContractParameters[] = [
          mockContract('A', ADDRESS_A),
        ]
        const CONTRACTS_AT_2: ContractParameters[] = [
          mockContract('B', ADDRESS_B),
        ]
        const CONTRACTS_AT_3: ContractParameters[] = [
          mockContract('C', ADDRESS_C),
        ]

        const repository = mockObject<DiscoveryHistoryRepository>({
          getProject: mockFn().returns([
            mockRecord(new UnixTime(1), CONTRACTS_AT_1),
            mockRecord(new UnixTime(2), CONTRACTS_AT_2),
            mockRecord(new UnixTime(3), CONTRACTS_AT_2),
            mockRecord(new UnixTime(4), CONTRACTS_AT_2),
            mockRecord(new UnixTime(5), CONTRACTS_AT_2),
            mockRecord(new UnixTime(6), CONTRACTS_AT_2),
            mockRecord(new UnixTime(7), CONTRACTS_AT_2),
            mockRecord(new UnixTime(8), CONTRACTS_AT_2),
            mockRecord(new UnixTime(9), CONTRACTS_AT_2),
            mockRecord(new UnixTime(10), CONTRACTS_AT_3),
          ]),
        })

        const configReader = mockObject<ConfigReader>({
          readConfig: mockFn(mockConfig),
        })

        const controller = new DiffHistoryController(
          repository,
          configReader,
          chainConverter,
        )
        const result = await controller.getDiffHistoryPerProject(
          'ethereum',
          'test',
        )

        expect(result).toEqual([
          {
            project: 'test',
            changes: [
              {
                timestamp: '2',
                diffs: [
                  { name: 'A', address: ADDRESS_A, type: 'deleted' },
                  { name: 'B', address: ADDRESS_B, type: 'created' },
                ],
              },
              {
                timestamp: '10',
                diffs: [
                  { name: 'B', address: ADDRESS_B, type: 'deleted' },
                  { name: 'C', address: ADDRESS_C, type: 'created' },
                ],
              },
            ],
          },
        ])
      })

      it('a single record produces no diff', async () => {
        const repository = mockObject<DiscoveryHistoryRepository>({
          getProject: mockFn().returns([mockRecord(new UnixTime(1))]),
        })

        const configReader = mockObject<ConfigReader>({
          readConfig: mockFn(mockConfig),
        })

        const controller = new DiffHistoryController(
          repository,
          configReader,
          chainConverter,
        )
        const result = await controller.getDiffHistoryPerProject(
          'ethereum',
          'test',
        )

        expect(result).toEqual([
          {
            project: 'test',
            changes: [],
          },
        ])
      })

      it('empty response', async () => {
        const repository = mockObject<DiscoveryHistoryRepository>({
          getProject: mockFn().returns([]),
        })

        const configReader = mockObject<ConfigReader>({
          readConfig: mockFn(mockConfig),
        })

        const controller = new DiffHistoryController(
          repository,
          configReader,
          chainConverter,
        )
        const result = await controller.getDiffHistoryPerProject(
          'ethereum',
          'test',
        )

        expect(result).toEqual([
          {
            project: 'test',
            changes: [],
          },
        ])
      })
    },
  )
})

async function mockConfig(
  name: string,
  chain = 'ethereum',
): Promise<DiscoveryConfig> {
  return new DiscoveryConfig({ name, chain, initialAddresses: [] })
}

function mockContract(
  name: string,
  address: EthereumAddress,
): ContractParameters {
  return {
    name,
    address,
    upgradeability: {
      type: 'immutable',
    },
  }
}

const DEFAULT_CONTRACT: ContractParameters[] = [
  mockContract('A', EthereumAddress.random()),
]

const PROJECT_A = 'PROJECT_A'

function mockRecord(
  timestamp: UnixTime,
  contracts: ContractParameters[] = DEFAULT_CONTRACT,
): DiscoveryHistoryRecord {
  return {
    projectName: PROJECT_A,
    chainId: ChainId.ETHEREUM,
    blockNumber: 123,
    timestamp: timestamp,
    discovery: {
      name: PROJECT_A,
      chain: 'ethereum',
      blockNumber: 123,
      configHash: Hash256.random(),
      contracts,
      eoas: [],
      abis: {},
      version: 0,
    },

    configHash: Hash256.random(),
    version: 3,
  }
}
