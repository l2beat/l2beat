import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { IndexerService } from '../../tools/uif/IndexerService'
import type { DefiLlamaClient } from './DefiLlamaClient'
import { DefiTvlIndexer } from './DefiTvlIndexer'
import type { DefiTvlProjectConfig } from './types'

describe(DefiTvlIndexer.name, () => {
  it('fetches before returning an atomic database save', async () => {
    const target = UnixTime.fromDate(new Date('2026-08-31T12:00:00Z'))
    const config: DefiTvlProjectConfig = {
      configurationId: '123456789abc',
      projectId: ProjectId('uniswapv3'),
      protocolSlug: 'uniswap-v3',
      sinceTimestamp: UnixTime.fromDate(new Date('2021-05-05T00:00:00Z')),
      chains: [{ chain: 'ethereum', providerChain: 'Ethereum' }],
    }
    const client = mockObject<DefiLlamaClient>({
      getProtocol: mockFn().resolvesTo({
        currentChainTvls: { Ethereum: 123 },
        chainTvls: {
          Ethereum: {
            tvl: [{ date: target, totalLiquidityUSD: 120 }],
          },
        },
      }),
    })
    const defiTvl = mockObject<Database['defiTvl']>({
      upsertMany: mockFn().resolvesTo(1),
    })
    const indexer = new DefiTvlIndexer(
      {
        parents: [],
        indexerService: mockObject<IndexerService>(),
        configurations: [
          {
            id: config.configurationId,
            minHeight: config.sinceTimestamp,
            maxHeight: null,
            properties: config,
          },
        ],
        tags: { tag: 'defi-tvl-indexer-test' },
        db: mockObject<Database>({ defiTvl }),
        client,
      },
      Logger.SILENT,
    )

    const save = await indexer.multiUpdate(
      target - UnixTime.HOUR + 1,
      target,
      indexer.options.configurations,
    )

    expect(client.getProtocol).toHaveBeenCalledWith('uniswap-v3')
    expect(defiTvl.upsertMany).not.toHaveBeenCalled()

    expect(await save()).toEqual(target)
    expect(defiTvl.upsertMany).toHaveBeenCalledWith([
      {
        configurationId: config.configurationId,
        projectId: config.projectId,
        chain: 'ethereum',
        timestamp: target,
        sourceTimestamp: target,
        valueUsd: 123,
      },
    ])
  })
})
