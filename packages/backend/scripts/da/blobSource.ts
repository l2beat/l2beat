import type { Logger } from '@l2beat/backend-tools'
import type { DaBlob } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import type { DaPreviewLayer } from './clients'

export interface BlobCache {
  get(daLayer: string, from: number, to: number): Promise<DaBlob[]>
  /** Highest block the production blob indexer has cached (IndexerState safeHeight) */
  getSyncedHeight(daLayer: string): Promise<number | undefined>
}

export interface BlobSource {
  getBlobs(from: number, to: number): Promise<DaBlob[]>
}

export function createBlobSource(
  layer: DaPreviewLayer,
  cache: BlobCache | undefined,
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

  if (layer.name === 'ethereum' && cache) {
    return {
      getBlobs: async (from, to) => {
        const synced = await cache.getSyncedHeight(layer.name)
        logger.info('Reading ethereum blobs from the database cache', {
          from,
          to,
          syncedHeight: synced,
        })

        if (synced !== undefined && synced < from) {
          logger.warn('Blob cache has not reached this range', {
            from,
            syncedHeight: synced,
          })
          return layer.provider ? await fromProvider(from, to) : []
        }

        const cachedTo = synced === undefined ? to : Math.min(to, synced)
        const blobs = await cache.get(layer.name, from, cachedTo)

        if (blobs.length === 0) {
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
        }

        if (cachedTo < to) {
          if (layer.provider) {
            logger.warn(
              'Blob cache is behind the requested range - fetching the tail from the live provider',
              { syncedHeight: synced, tailFrom: cachedTo + 1, to },
            )
            blobs.push(...(await fromProvider(cachedTo + 1, to)))
          } else {
            // The hour the cache head falls into may be partially cached and
            // would silently under-report - drop it so gap detection reports
            // it as missing layer data instead
            const syncedTimestamp = (
              await layer.blockClient.getBlockWithTransactions(cachedTo)
            ).timestamp
            const partialHour = UnixTime.toStartOf(syncedTimestamp, 'hour')
            logger.warn(
              'Blob cache is behind the requested range and no beacon API url is set - excluding the partially cached hour',
              {
                syncedHeight: synced,
                excludedFrom: UnixTime.toDate(partialHour).toISOString(),
              },
            )
            return blobs.filter((b) => b.blockTimestamp < partialHour)
          }
        }

        return blobs
      },
    }
  }

  return { getBlobs: fromProvider }
}
