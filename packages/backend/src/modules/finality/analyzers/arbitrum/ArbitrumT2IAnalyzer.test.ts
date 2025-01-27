import { readFileSync } from 'fs'
import path from 'path'
import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { type BlobClient, BlobProvider, type RpcClient } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { ArbitrumT2IAnalyzer } from './ArbitrumT2IAnalyzer'

describe(ArbitrumT2IAnalyzer.name, () => {
  it('should decode type 2 tx', async () => {
    const data = JSON.parse(
      readFileSync(path.join(__dirname, './testdata/type2.json'), 'utf-8'),
    ) as { data: string }
    const analyzer = mockAnalyzer({
      rpcClient: mockObject<RpcClient>({
        getTransaction: mockFn().resolvesTo({
          data: data.data,
          type: '0x2',
        }),
      }),
    })
    const tx = {
      txHash: '0x123',
      timestamp: new UnixTime(1700001000),
    }
    const previousTx = tx
    const result = await analyzer.analyze(previousTx, tx)

    expect(result.length).toEqual(136)
    expect(result[0]).toEqual({
      blockNumber: 57005,
      timestamp: 1736273149,
    })
    expect(result.at(-1)).toEqual({
      blockNumber: 57005,
      timestamp: 1736273183,
    })
  })

  it('should decode type 3 tx', async () => {
    const blobsData = JSON.parse(
      readFileSync(path.join(__dirname, './testdata/blobs.json'), 'utf-8'),
    ) as { 1: string; 2: string; 3: string }

    const analyzer = mockAnalyzer({
      blobClient: mockObject<BlobClient>({
        getBlobsByVersionedHashesAndBlockNumber: mockFn().resolvesTo({
          blobs: [
            {
              kzg_commitment: '0x123',
              data: blobsData[1],
            },
            {
              kzg_commitment: '0x123',
              data: blobsData[2],
            },
            {
              kzg_commitment: '0x123',
              data: blobsData[3],
            },
          ],
          blockNumber: 1,
        }),
      }),
      rpcClient: mockObject<RpcClient>({
        getTransaction: mockFn().resolvesTo({
          type: '0x3',
          blobVersionedHashes: ['0x0'],
          blockNumber: 1,
        }),
      }),
    })
    const tx = {
      txHash: '0x123',
      timestamp: new UnixTime(1700001000),
    }
    const previousTx = tx
    const result = await analyzer.analyze(previousTx, tx)

    expect(result.length).toEqual(302)
    expect(result[0]).toEqual({
      blockNumber: 57005,
      timestamp: 1736347455,
    })
    expect(result.at(-1)).toEqual({
      blockNumber: 57005,
      timestamp: 1736347531,
    })
  })
})

function mockAnalyzer({
  blobClient,
  rpcClient,
}: { blobClient?: BlobClient; rpcClient?: RpcClient }) {
  return new ArbitrumT2IAnalyzer(
    new BlobProvider(blobClient ?? mockObject<BlobClient>({})),
    Logger.SILENT,
    rpcClient ?? mockObject<RpcClient>({}),
    mockObject<Database>({}),
    ProjectId('arbitrum'),
  )
}
