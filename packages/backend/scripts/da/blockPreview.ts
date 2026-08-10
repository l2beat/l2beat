import type { Logger } from '@l2beat/backend-tools'
import type { DataAvailabilityRecord } from '@l2beat/database'
import { getBlockNumberAtOrBefore } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { BlockDaIndexedConfig } from '../../src/config/Config'
import { DaService } from '../../src/modules/data-availability/services/DaService'
import type { BlobSource } from './blobSource'
import type { DaPreviewLayer } from './clients'
import type { ExpectedCoverage, LayerPreviewResult } from './gaps'
import {
  ceilToHour,
  clampBlockRange,
  hoursInWindow,
  type PreviewWindow,
} from './range'

export async function previewBlockLayer(
  layer: DaPreviewLayer,
  configs: BlockDaIndexedConfig[],
  window: PreviewWindow,
  source: BlobSource,
  logger: Logger,
): Promise<LayerPreviewResult> {
  logger.info(`Resolving ${layer.name} block range for the window`)
  const latest = await layer.blockClient.getLatestBlockNumber()
  const getBlock = (n: number) => layer.blockClient.getBlockWithTransactions(n)
  const fromBlock = await getBlockNumberAtOrBefore(
    window.from,
    layer.startingBlock,
    latest,
    getBlock,
  )
  const toBlock = await getBlockNumberAtOrBefore(
    window.to - 1,
    fromBlock,
    latest,
    getBlock,
  )
  logger.info(`Using ${layer.name} blocks`, { fromBlock, toBlock })

  const blobs = (await source.getBlobs(fromBlock, toBlock)).filter(
    (b) => b.blockTimestamp >= window.from && b.blockTimestamp < window.to,
  )
  logger.info(`Fetched ${blobs.length} ${layer.name} blobs`)

  // Hours where the layer produced any data at all - hours outside this
  // set are a source problem (e.g. lagging blob cache), not a config gap
  const layerHours = new Set(
    blobs.map((b) => UnixTime.toStartOf(b.blockTimestamp, 'hour')),
  )
  const hoursWithoutLayerData = hoursInWindow(window).filter(
    (h) => !layerHours.has(h),
  )
  if (hoursWithoutLayerData.length > 0) {
    logger.warn(
      `No ${layer.name} blobs at all in ${hoursWithoutLayerData.length} hour(s) of the window - the blob source may be lagging; these hours are excluded from gap detection`,
      {
        hours: hoursWithoutLayerData.map((h) =>
          UnixTime.toDate(h).toISOString(),
        ),
      },
    )
  }

  const daService = new DaService()
  const records: DataAvailabilityRecord[] = []
  const expected: ExpectedCoverage[] = []

  for (const config of configs) {
    const range = clampBlockRange(config, fromBlock, toBlock)
    if (!range) {
      logger.warn('Configuration inactive in window - skipping', {
        projectId: config.projectId,
        configurationId: config.configurationId,
      })
      continue
    }

    // Active time bounds within the window: only resolve boundary block
    // timestamps when the config starts or ends inside the fetched range
    const activeFrom =
      range.from > fromBlock
        ? ceilToHour((await getBlock(range.from)).timestamp)
        : window.from
    const activeTo =
      range.to < toBlock
        ? UnixTime.toStartOf((await getBlock(range.to)).timestamp, 'hour')
        : window.to
    expected.push({
      projectId: config.projectId,
      daLayer: config.daLayer,
      configurationId: config.configurationId,
      hours: hoursInWindow({ from: activeFrom, to: activeTo }).filter((h) =>
        layerHours.has(h),
      ),
    })

    const blobsInRange = blobs.filter(
      (b) => b.blockNumber >= range.from && b.blockNumber <= range.to,
    )
    if (blobsInRange.length === 0) {
      continue
    }
    const result = daService.generateRecords(blobsInRange, [], [config])
    records.push(...result.records)
  }

  return { records, expected }
}
