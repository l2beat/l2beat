import {
  ChainId,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect } from 'earl'

import { describeDatabase } from '../../test/database'
import { DailyDiscoveryRecord } from './entity'
import { DailyDiscoveryRepository } from './repository'

const CONFIG_HASH = Hash256.random()

describeDatabase(DailyDiscoveryRepository.name, (db) => {
  const repository = db.dailyDiscovery

  beforeEach(async () => {
    await repository.deleteAll()
  })

  it(DailyDiscoveryRepository.prototype.findLatest.name, async () => {
    const projectName = 'project'

    const expectedEth: DailyDiscoveryRecord = {
      projectName,
      chainId: ChainId.ETHEREUM,
      blockNumber: 1,
      timestamp: new UnixTime(1),
      discovery: {
        name: projectName,
        chain: 'ethereum',
        blockNumber: -1,
        configHash: Hash256.random(),
        contracts: [],
        eoas: [],
        abis: {},
        version: 0,
        usedTemplates: {},
        shapeFilesHash: Hash256.random(),
      },
      configHash: CONFIG_HASH,
      version: 0,
    }

    const secondEth: DailyDiscoveryRecord = {
      projectName,
      chainId: ChainId.ETHEREUM,
      blockNumber: 0,
      timestamp: new UnixTime(0),
      discovery: {
        name: projectName,
        chain: 'ethereum',
        blockNumber: -1,
        configHash: Hash256.random(),
        contracts: [],
        eoas: [],
        abis: {},
        version: 0,
        usedTemplates: {},
        shapeFilesHash: Hash256.random(),
      },
      configHash: CONFIG_HASH,
      version: 0,
    }

    const expectedArb: DailyDiscoveryRecord = {
      projectName,
      chainId: ChainId.ARBITRUM,
      blockNumber: -1,
      timestamp: new UnixTime(0),
      discovery: {
        name: projectName,
        chain: 'ethereum',
        blockNumber: -1,
        configHash: Hash256.random(),
        contracts: [],
        eoas: [],
        abis: {},
        version: 0,
        usedTemplates: {},
        shapeFilesHash: Hash256.random(),
      },
      configHash: CONFIG_HASH,
      version: 0,
    }

    await repository.upsert(expectedEth)
    await repository.upsert(secondEth)
    await repository.upsert(expectedArb)

    const resultEth = await repository.findLatest(projectName, ChainId.ETHEREUM)
    const resultArb = await repository.findLatest(projectName, ChainId.ARBITRUM)

    expect(resultEth).toEqual(expectedEth)
    expect(resultArb).toEqual(expectedArb)
  })

  it(DailyDiscoveryRepository.prototype.getTimestamps.name, async () => {
    const projectName = 'project'

    const discovery: DailyDiscoveryRecord = {
      projectName,
      chainId: ChainId.ETHEREUM,
      blockNumber: -1,
      timestamp: new UnixTime(0),
      discovery: {
        name: projectName,
        chain: 'ethereum',
        blockNumber: -1,
        configHash: Hash256.random(),
        contracts: [],
        eoas: [],
        abis: {},
        version: 0,
        usedTemplates: {},
        shapeFilesHash: Hash256.random(),
      },
      configHash: CONFIG_HASH,
      version: 0,
    }
    const discovery2 = {
      ...discovery,
      timestamp: new UnixTime(2),
    }
    await repository.upsert(discovery)
    await repository.upsert(discovery2)
    const timestamps = await repository.getTimestamps(
      projectName,
      ChainId.ETHEREUM,
    )

    expect(timestamps).toEqual([discovery.timestamp, discovery2.timestamp])
  })

  describe(DailyDiscoveryRepository.prototype.getByProjectAndChain.name, () => {
    it('sanitizes errors', async () => {
      const projectName = 'project'

      const mockContractWithoutError: DailyDiscoveryRecord['discovery']['contracts'][0] =
        {
          name: 'MockContract1',
          address: EthereumAddress.random(),
          values: { $immutable: true },
        }
      const mockContractWithError: DailyDiscoveryRecord['discovery']['contracts'][0] =
        {
          name: 'MockContract2',
          address: EthereumAddress.random(),
          values: { $immutable: true },
          errors: {
            nonce: 'https://endpoint.com/potential-api-key',
            totalLiquidity: 'https://endpoint.com/potential-api-key2',
          },
        }

      const discovery: DailyDiscoveryRecord = {
        projectName,
        chainId: ChainId.ETHEREUM,
        blockNumber: -1,
        timestamp: new UnixTime(0),
        discovery: {
          name: projectName,
          chain: 'ethereum',
          blockNumber: -1,
          configHash: Hash256.random(),
          contracts: [mockContractWithoutError, mockContractWithError],
          eoas: [],
          abis: {},
          version: 0,
          usedTemplates: {},
          shapeFilesHash: Hash256.random(),
        },
        configHash: CONFIG_HASH,
        version: 0,
      }

      await repository.upsert(discovery)

      const result = await repository.getByProjectAndChain(
        projectName,
        ChainId.ETHEREUM,
      )
      expect(result.length).toEqual(1)
      expect(result[0]!.discovery.contracts).toEqual([
        mockContractWithoutError,
        {
          ...mockContractWithError,
          errors: {
            nonce: 'Processing error occurred.',
            totalLiquidity: 'Processing error occurred.',
          },
        },
      ])
    })
  })

  describe(
    DailyDiscoveryRepository.prototype.deleteStaleProjectDiscoveries.name,
    () => {
      it('removes stale discoveries', async () => {
        const projectName = 'project'
        const hash = Hash256.random()

        const contract: DailyDiscoveryRecord['discovery']['contracts'][0] = {
          name: 'MockContract1',
          address: EthereumAddress.random(),
          values: { $immutable: true },
        }

        const discovery: DailyDiscoveryRecord = {
          projectName,
          chainId: ChainId.ETHEREUM,
          blockNumber: -1,
          timestamp: new UnixTime(0),
          discovery: {
            name: projectName,
            chain: 'ethereum',
            blockNumber: -1,
            configHash: hash,
            contracts: [contract],
            eoas: [],
            abis: {},
            version: 0,
            usedTemplates: {},
            shapeFilesHash: Hash256.random(),
          },
          configHash: CONFIG_HASH,
          version: 0,
        }

        await repository.upsert(discovery)
        const stale = await repository.getByProjectAndChain(
          projectName,
          ChainId.ETHEREUM,
        )
        expect(stale).toEqual([discovery])

        await repository.deleteStaleProjectDiscoveries(
          projectName,
          ChainId.ETHEREUM,
          hash,
        )
        const fresh = await repository.getByProjectAndChain(
          projectName,
          ChainId.ETHEREUM,
        )
        expect(fresh).toEqual([])
      })
    },
  )
})
