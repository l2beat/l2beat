import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../test/database'
import type { IndexerService } from '../../tools/uif/IndexerService'
import { _TEST_ONLY_resetUniqueIds } from '../../tools/uif/ids'
import type { DefiLlamaClient } from './DefiLlamaClient'
import { DefiTvlIndexer } from './DefiTvlIndexer'
import type { DefiTvlProjectConfig } from './types'

describe(DefiTvlIndexer.name, () => {
  beforeEach(() => {
    _TEST_ONLY_resetUniqueIds()
  })

  const target = UnixTime.fromDate(new Date('2026-08-31T12:00:00Z'))
  const config: DefiTvlProjectConfig = {
    configurationId: '123456789abc',
    projectId: ProjectId('uniswapv3'),
    protocolSlug: 'uniswap-v3',
    sinceTimestamp: UnixTime.fromDate(new Date('2021-05-05T00:00:00Z')),
    chains: [{ chain: 'ethereum', providerChain: 'Ethereum' }],
  }

  it('fetches before returning an atomic database save', async () => {
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
      replaceMany: mockFn().resolvesTo(1),
    })
    const indexer = createIndexer(defiTvl, client)

    const save = await indexer.multiUpdate(
      target - UnixTime.HOUR + 1,
      target,
      indexer.options.configurations,
    )

    expect(client.getProtocol).toHaveBeenCalledWith('uniswap-v3')
    expect(defiTvl.replaceMany).not.toHaveBeenCalled()

    expect(await save()).toEqual(target)
    expect(defiTvl.replaceMany).toHaveBeenCalledWith([
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

  it('wipes data for removed configurations', async () => {
    const defiTvl = mockObject<Database['defiTvl']>({
      deleteByConfigIds: mockFn().resolvesTo(2),
    })
    const indexer = createIndexer(defiTvl)

    await indexer.wipeData([{ id: 'first' }, { id: 'second' }])

    expect(defiTvl.deleteByConfigIds).toHaveBeenOnlyCalledWith([
      'first',
      'second',
    ])
  })

  it('trims data outside a changed configuration range', async () => {
    const defiTvl = mockObject<Database['defiTvl']>({
      deleteByConfigInTimeRange: mockFn().resolvesTo(2),
    })
    const indexer = createIndexer(defiTvl)

    await indexer.trimData([{ id: config.configurationId, range: [100, 200] }])

    expect(defiTvl.deleteByConfigInTimeRange).toHaveBeenOnlyCalledWith(
      config.configurationId,
      UnixTime(100),
      UnixTime(200),
    )
  })

  function createIndexer(
    defiTvl: Database['defiTvl'],
    client = mockObject<DefiLlamaClient>(),
  ) {
    return new DefiTvlIndexer(
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
        db: mockDatabase({ defiTvl }),
        client,
      },
      Logger.SILENT,
    )
  }
})
