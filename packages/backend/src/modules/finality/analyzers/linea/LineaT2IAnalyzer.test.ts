import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { readFileSync } from 'fs'
import path from 'path'
import type { Database } from '@l2beat/database'
import type { BlobProvider, RpcClient } from '@l2beat/shared'
import type { L2Block } from '../types/BaseAnalyzer'
import { LineaT2IAnalyzer, blobFnName, lineaIface } from './LineaT2IAnalyzer'

describe(LineaT2IAnalyzer.name, () => {
  const blobData = JSON.parse(
    readFileSync(
      path.join(__dirname, 'testdata/v0blobHexString.json'),
      'utf-8',
    ),
  ) as { data: string; expected: L2Block[] }

  describe(LineaT2IAnalyzer.prototype.analyze.name, () => {
    it('correctly decode and returns correct data for blob example', async () => {
      const blobProvider = mockObject<BlobProvider>({
        getBlobsByVersionedHashesAndBlockNumber: mockFn().resolvesTo({
          blobs: [
            {
              ...blobData,
            },
          ],
        }),
      })
      const provider = mockObject<RpcClient>({
        getTransaction: mockFn().resolvesTo({
          data: lineaIface.getSighash(blobFnName),
          blobVersionedHashes: ['0x0'],
          blockNumber: 1,
        }),
      })

      const calculator = new LineaT2IAnalyzer(
        blobProvider,
        provider,
        mockObject<Database>(),
        ProjectId('linea'),
      )
      const tx = { txHash: '0x121', timestamp: new UnixTime(1708352483) }
      const previousTx = tx // not used
      const results = await calculator.analyze(previousTx, tx)

      expect(results).toEqualUnsorted(blobData.expected)
    })
  })
})
