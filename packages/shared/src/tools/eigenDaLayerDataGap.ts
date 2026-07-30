import { UnixTime } from '@l2beat/shared-pure'

/**
 * The EigenDA layer metrics API (EIGEN_DA_API_URL) returns 500 for every hour
 * in this window. The backend skips syncing it (EigenDaLayerIndexer) and the
 * frontend renders it as "Data not available" instead of zeros. The range is
 * end-exclusive; only the layer aggregate data is affected, per-project data
 * comes from a different source.
 */
export const EIGENDA_LAYER_DATA_GAP = {
  from: UnixTime.fromDate(new Date('2026-06-22T21:00:00.000Z')),
  until: UnixTime.fromDate(new Date('2026-06-29T23:00:00.000Z')),
}
