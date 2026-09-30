import type { ReactNode } from 'react'
import { useState } from 'react'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'
import { PrivacyAdversaryTooltipContent } from '../adversaries/PrivacyAdversaryTooltipContent'
import { getPrivacyAdversariesSentence } from '../adversaries/privacyAdversaryUi'
import { getPrivacyRosetteSlices } from './privacyRosetteSlices'

interface Props {
  adversaries: PrivacyAdversariesSummary
  /** The rosette, blown up beside the legend. */
  rosette: ReactNode
}

/**
 * The rosette blown up beside a legend of the adversaries. Hovering a row
 * opens that adversary's full assessment underneath - the same detail each
 * adversary dot used to show on its own.
 *
 * The detail only ever grows the tooltip downward: the cell opens it to the
 * right, aligned to its top, so the rows under the pointer stay put.
 */
export function PrivacyRosetteTooltip({ adversaries, rosette }: Props) {
  const [selectedId, setSelectedId] = useState<string>()
  const { subject, held, total } = getPrivacyAdversariesSentence(adversaries)
  const slices = getPrivacyRosetteSlices(adversaries)
  const selected = slices.find((slice) => slice.id === selectedId)

  return (
    // The tooltip inherits `white-space: pre` from the table, so the wrapping
    // has to be asked for explicitly or every line runs past the panel.
    <div className="flex w-[460px] max-w-full flex-col text-wrap">
      <div className="font-bold text-label-value-15">Privacy risk analysis</div>
      <div
        className={cn(
          'mt-3 flex items-center gap-5 border-divider border-t pt-3',
          selected && 'border-b pb-3',
        )}
      >
        {rosette}
        <div
          className="flex min-w-0 flex-1 flex-col gap-3"
          onMouseLeave={() => setSelectedId(undefined)}
        >
          <div>
            <div className="mb-1 font-medium text-[11px] text-secondary uppercase tracking-wide">
              {adversaries.promiseLabel}
            </div>
            <ul className="-mx-1.5 grid grid-cols-[auto_minmax(0,1fr)_auto] text-xs">
              {slices.map((slice) => (
                <li
                  key={slice.id}
                  className={cn(
                    'col-span-3 grid grid-cols-subgrid items-center gap-x-2 rounded px-1.5 py-0.5',
                    slice.id === selectedId && 'bg-surface-secondary',
                  )}
                  onMouseEnter={() => setSelectedId(slice.id)}
                >
                  <TrustedSetupRiskDot
                    risk={slice.risk}
                    size="xs"
                    className="shrink-0"
                  />
                  <span className="truncate font-medium">{slice.label}</span>
                  <span className="whitespace-nowrap text-right text-secondary">
                    {slice.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-1.5 text-xs leading-normal">
            <p className="text-secondary">{adversaries.promise.text}</p>
            <p>
              <span className="font-bold">{subject}</span> is private against{' '}
              <span className="font-bold tabular-nums">
                {held}/{total}
              </span>{' '}
              adversaries.
            </p>
            <p className="text-secondary">
              Hover a row or slice for the full assessment, click for the
              project page.
            </p>
          </div>
        </div>
      </div>
      {selected && (
        <div className="mt-2.5">
          <PrivacyAdversaryTooltipContent cell={selected.cell} />
        </div>
      )}
    </div>
  )
}
