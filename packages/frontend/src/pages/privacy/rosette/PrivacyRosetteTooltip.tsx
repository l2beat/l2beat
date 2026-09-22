import { useState } from 'react'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'
import { PrivacyAdversaryTooltipContent } from '../adversaries/PrivacyAdversaryTooltipContent'
import { getPrivacyAdversariesSentence } from '../adversaries/privacyAdversaryUi'
import { PrivacyWalkawayTestTooltipContent } from '../PrivacyWalkawayTestIcon'
import { PrivacyRosetteIcon } from './PrivacyRosetteIcon'
import type {
  PrivacyRosetteGroup,
  PrivacyRosetteGroups,
  PrivacyRosetteSlice,
} from './privacyRosetteSlices'

interface Props {
  groups: PrivacyRosetteGroups
  adversaries: PrivacyAdversariesSummary
  isUnderReview?: boolean
}

/**
 * The rosette blown up beside a legend of both halves. Hovering a row or a
 * slice fades the rest of the rosette and opens that item's full assessment
 * underneath - the same detail each adversary dot used to show on its own.
 *
 * The detail only ever grows the tooltip downward: the cell opens it to the
 * right, aligned to its top, so the rows under the pointer stay put.
 */
export function PrivacyRosetteTooltip({
  groups,
  adversaries,
  isUnderReview,
}: Props) {
  const [selectedId, setSelectedId] = useState<string>()
  const { subject, held, total } = getPrivacyAdversariesSentence(adversaries)
  const slices = [...groups.adversaries.slices, ...groups.risks.slices]
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
        <PrivacyRosetteIcon
          groups={groups}
          isUnderReview={isUnderReview}
          selectedId={selectedId}
          onSelect={setSelectedId}
          className="size-[104px] shrink-0"
        />
        <div
          className="flex min-w-0 flex-1 flex-col gap-3"
          onMouseLeave={() => setSelectedId(undefined)}
        >
          <LegendSection
            group={groups.adversaries}
            half="left"
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
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
          <LegendSection
            group={groups.risks}
            half="right"
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      </div>
      {selected && (
        <div className="mt-2.5">
          <PrivacyRosetteSliceDetail slice={selected} />
        </div>
      )}
    </div>
  )
}

function LegendSection({
  group,
  half,
  selectedId,
  onSelect,
}: {
  group: PrivacyRosetteGroup
  /** Which half of the rosette the section fills. */
  half: 'left' | 'right'
  selectedId: string | undefined
  onSelect: (id: string) => void
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 font-medium text-[11px] text-secondary uppercase tracking-wide">
        <HalfGlyph half={half} />
        {group.title}
      </div>
      <ul className="-mx-1.5 grid grid-cols-[auto_minmax(0,1fr)_auto] text-xs">
        {group.slices.map((slice) => (
          <li
            key={slice.id}
            className={cn(
              'col-span-3 grid grid-cols-subgrid items-center gap-x-2 rounded px-1.5 py-0.5',
              slice.id === selectedId && 'bg-surface-secondary',
            )}
            onMouseEnter={() => onSelect(slice.id)}
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
            {slice.detail && (
              <span
                className={cn(
                  'col-start-3 whitespace-nowrap text-right text-[11px]',
                  slice.detail.negative ? 'text-negative' : 'text-secondary',
                )}
              >
                {slice.detail.text}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** The full assessment behind one slice. */
export function PrivacyRosetteSliceDetail({
  slice,
}: {
  slice: PrivacyRosetteSlice
}) {
  if (slice.source.type === 'adversary') {
    return <PrivacyAdversaryTooltipContent cell={slice.source.cell} />
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-bold text-label-value-14">{slice.label}</span>
        <TrustedSetupRiskDot risk={slice.risk} size="xs" />
        <span className="font-medium text-sm">{slice.value}</span>
      </div>
      <p className="text-xs leading-normal">{slice.source.description}</p>
      {slice.source.walkawayTest && (
        <PrivacyWalkawayTestTooltipContent
          walkawayTest={slice.source.walkawayTest}
        />
      )}
    </div>
  )
}

/** A ring with one half filled: which half of the rosette a section covers. */
function HalfGlyph({ half }: { half: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 12 12" className="size-3 shrink-0" aria-hidden>
      <circle
        cx="6"
        cy="6"
        r="5"
        className="fill-none stroke-current"
        strokeWidth="1.2"
      />
      <path
        d={
          half === 'left' ? 'M6 1 A5 5 0 0 0 6 11 Z' : 'M6 1 A5 5 0 0 1 6 11 Z'
        }
        className="fill-current"
      />
    </svg>
  )
}
