import type { Logger } from '@l2beat/backend-tools'
import type { DaBlob } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import type { BlobService } from '../../src/modules/data-availability/services/BlobService'
import type { DaPreviewLayer } from './clients'

export interface BlobSource {
  getBlobs(from: number, to: number): Promise<DaBlob[]>
}

export function createBlobSource(
  layer: DaPreviewLayer,
  blobService: BlobService | undefined,
  logger: Logger,
): BlobSource {
  const fromProvider = async (from: number, to: number): Promise<DaBlob[]> => {
    const provider = layer.provider
    assert(
      provider,
      `No live provider for ${layer.name} - set the layer API url`,
    )
    const blobs: DaBlob[] = []
    for (let chunkFrom = from; chunkFrom <= to; chunkFrom += layer.batchSize) {
      const chunkTo = Math.min(chunkFrom + layer.batchSize - 1, to)
      logger.info(`Fetching ${layer.name} blobs`, {
        from: chunkFrom,
        to: chunkTo,
        progress: `${(((chunkFrom - from) / (to - from + 1)) * 100).toFixed(0)}%`,
      })
      blobs.push(...(await provider.getBlobs(chunkFrom, chunkTo)))
    }
    return blobs
  }

  if (layer.name === 'ethereum' && blobService) {
    return {
      getBlobs: async (from, to) => {
        logger.info('Reading ethereum blobs from the database cache', {
          from,
          to,
        })
        const blobs = await blobService.get(layer.name, from, to)
        if (blobs.length > 0) {
          return blobs
        }
        if (layer.provider) {
          logger.warn(
            'Database blob cache is empty for this range, falling back to the live provider',
            { from, to },
          )
          return await fromProvider(from, to)
        }
        logger.warn(
          'Database blob cache is empty for this range and no beacon API url is set',
          { from, to },
        )
        return []
      },
    }
  }

  return { getBlobs: fromProvider }
}
