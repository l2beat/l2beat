import { formatInteger, pluralize } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatPosted } from '../../../formatPosted'
import { type LabData, SLOTS_PER_DAY } from '../../model'

/**
 * What the sun of the drawing stands for: everything the posters sent it in
 * the day, and how full that kept its blocks. Laid out as the posters'
 * tooltips are, so the two read as one family.
 */
export function EthereumTooltipContent({ data }: { data: LabData }) {
  const blobsPerBlock = data.totalBlobs / SLOTS_PER_DAY
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 font-bold text-label-value-14">
        <img src={data.daLayer.iconUrl} alt="" className="size-4" />
        {data.daLayer.name}
      </div>
      <Row label="Posted in the day">{formatPosted(data.totalPosted)}</Row>
      <Row label="By">
        {formatInteger(data.posters.length)}{' '}
        {pluralize(data.posters.length, 'project')}
      </Row>
      <Row label="Blobs per block">
        {blobsPerBlock.toFixed(1)}{' '}
        <span className="text-secondary">on average</span>
      </Row>
      <div className="border-divider border-t pt-1.5 text-label-value-13 text-secondary">
        {formatPercent(blobsPerBlock / data.targetBlobsPerBlock)} of the{' '}
        {data.targetBlobsPerBlock} blobs a block aims for
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-label-value-13">
      <span className="text-secondary">{label}</span>
      <span className="tabular-nums">{children}</span>
    </div>
  )
}
