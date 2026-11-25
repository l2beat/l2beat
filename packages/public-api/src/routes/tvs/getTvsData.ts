import type {
  Database,
  SummedByTimestampTokenValueRecord,
} from '@l2beat/database'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import keyBy from 'lodash/keyBy'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getTimestampedValuesRange } from '../../utils/getTimestampedValuesRange'
import { rangeToResolution } from '../../utils/range'
import type { TokenExclusions, TvsRange, TvsResultItem } from './types'

/** The same price the website uses to show TVS in ETH */
const ETH_PRICE_ID = 'ethereum'

export async function getTvsData(
  db: Database,
  range: TvsRange,
  projectIds: ProjectId[],
  exclusions: TokenExclusions,
): Promise<TvsResultItem[]> {
  const resolution = rangeToResolution(range)
  const [from, to] = getTimestampedValuesRange(range, resolution, {
    offset: -UnixTime.HOUR - 15 * UnixTime.MINUTE,
  })

  const forSummary = projectIds.length !== 1

  const [records, ethPrices] = await Promise.all([
    db.tvsTokenValue.getSummedByTimestampByProjects(projectIds, from, to, {
      forSummary,
      ...exclusions,
    }),
    db.tvsPrice.getPricesInRangeByPriceId(ETH_PRICE_ID, from, to),
  ])

  if (records.length === 0) {
    return []
  }

  const timestamps = records.map((r) => r.timestamp)
  const fromTimestamp = Math.min(...timestamps)
  const maxTimestamp = Math.max(...timestamps)
  const groupedByTimestamp = keyBy(records, (r) => r.timestamp)
  const ethPriceByTimestamp = new Map(
    ethPrices.map((p) => [p.timestamp, p.priceUsd]),
  )

  return generateTimestamps([fromTimestamp, maxTimestamp], resolution).map(
    (timestamp: UnixTime) => {
      const record = groupedByTimestamp[timestamp]
      // A timestamp without a record is missing data, not a TVS of zero
      if (!record) {
        return createMissingRecord(timestamp)
      }
      return mapRecord(record, ethPriceByTimestamp.get(timestamp) ?? null)
    },
  )
}

function createMissingRecord(timestamp: UnixTime): TvsResultItem {
  return {
    timestamp,
    totalTvs: null,
    bySource: {
      native: null,
      canonical: null,
      external: null,
    },
    byCategory: {
      stablecoins: null,
      eth: null,
      btc: null,
      other: null,
      publicRwa: null,
      restrictedRwa: null,
    },
    ethPrice: null,
  }
}

function mapRecord(
  {
    timestamp,
    value,
    canonical,
    customCanonical,
    external,
    native,
    ether,
    stablecoin,
    btc,
    rwaRestricted,
    rwaPublic,
    other,
  }: SummedByTimestampTokenValueRecord,
  ethPrice: number | null,
): TvsResultItem {
  return {
    timestamp,
    totalTvs: value,
    bySource: {
      native,
      canonical: canonical + customCanonical,
      external,
    },
    byCategory: {
      stablecoins: stablecoin,
      eth: ether,
      btc,
      other,
      publicRwa: rwaPublic,
      restrictedRwa: rwaRestricted,
    },
    ethPrice,
  }
}
