import type { EthSupplyDay } from '~/server/features/eth-supply/types'
import { formatTimestamp } from '~/utils/dates'
import { getRecordDays, type RecordDay, rangeLabel } from './economics'
import { formatEth } from './format'
import { Figure, Tile, TileTitle } from './ui'

/** The largest single-day burn and issuance in the data. */
export function RecordsTile({ days }: { days: EthSupplyDay[] }) {
  const { mostBurned, mostIssued } = getRecordDays(days)
  return (
    <Tile area="records" label="Record days">
      <TileTitle meta={rangeLabel('all', days)}>Record days</TileTitle>
      <div className="grid @lg:grid-cols-2 grid-cols-1 gap-x-6 gap-y-5">
        <Record label="Most burned" record={mostBurned} />
        <Record label="Most issued" record={mostIssued} />
      </div>
    </Tile>
  )
}

function Record({
  label,
  record,
}: {
  label: string
  record: RecordDay | undefined
}) {
  if (!record) return null
  return (
    <Figure
      label={label}
      value={formatEth(record.value)}
      unit="ETH"
      sub={formatTimestamp(record.timestamp)}
    />
  )
}
