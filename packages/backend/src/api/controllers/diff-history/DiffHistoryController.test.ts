import { ConfigReader, DiscoveryConfig } from '@l2beat/discovery'
import { ContractParameters } from '@l2beat/discovery-types'
import {
  ChainId,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import {
  DiscoveryHistoryRecord,
  DiscoveryHistoryRepository,
} from '../../../peripherals/database/discovery/DiscoveryHistoryRepository'
import { DiffHistoryController } from './DiffHistoryController'

describe(DiffHistoryController.name, () => {
  describe(DiffHistoryController.prototype.getDiff.name, () => {
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
        readConfig: mockFn((name: string, chainId: ChainId) =>
          mockConfig(name, chainId),
        ),
      })

      const controller = new DiffHistoryController(repository, configReader)
      const result = await controller.getDiff(ChainId.ETHEREUM, 'test')

      expect(result).toEqual(
        JSON.stringify({
          '2': [
            { name: 'A', address: ADDRESS_A.toString(), type: 'deleted' },
            { name: 'B', address: ADDRESS_B.toString(), type: 'created' },
          ],
          '10': [
            { name: 'B', address: ADDRESS_B.toString(), type: 'deleted' },
            { name: 'C', address: ADDRESS_C.toString(), type: 'created' },
          ],
        }),
      )
    })

    it('a single record produces no diff', async () => {
      const repository = mockObject<DiscoveryHistoryRepository>({
        getProject: mockFn().returns([mockRecord(new UnixTime(1))]),
      })

      const configReader = mockObject<ConfigReader>({
        readConfig: mockFn((name: string, chainId: ChainId) =>
          mockConfig(name, chainId),
        ),
      })

      const controller = new DiffHistoryController(repository, configReader)
      const result = await controller.getDiff(ChainId.ETHEREUM, 'test')

      expect(result).toEqual(JSON.stringify({}))
    })

    it('empty response', async () => {
      const repository = mockObject<DiscoveryHistoryRepository>({
        getProject: mockFn().returns([]),
      })

      const configReader = mockObject<ConfigReader>({
        readConfig: mockFn((name: string, chainId: ChainId) =>
          mockConfig(name, chainId),
        ),
      })

      const controller = new DiffHistoryController(repository, configReader)
      const result = await controller.getDiff(ChainId.ETHEREUM, 'test')

      expect(result).toEqual(JSON.stringify({}))
    })
  })
})

async function mockConfig(
  name: string,
  chainId = ChainId.ETHEREUM,
): Promise<DiscoveryConfig> {
  return new DiscoveryConfig({
    name,
    chain: chainId,
    initialAddresses: [],
  })
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
      chain: ChainId.getName(ChainId.ETHEREUM),
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
