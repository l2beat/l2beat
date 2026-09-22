import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'
import { getPrivacyAdversariesSentence } from '../adversaries/privacyAdversaryUi'
import { PrivacyRosetteIcon } from './PrivacyRosetteIcon'
import type {
  PrivacyRosetteGroup,
  PrivacyRosetteGroups,
} from './privacyRosetteSlices'

interface Props {
  groups: PrivacyRosetteGroups
  adversaries: PrivacyAdversariesSummary
  isUnderReview?: boolean
}

/**
 * The rosette blown up, with one legend column per half placed on the side of
 * the rosette that half occupies - so the columns say which slices are which
 * without needing a leader line or a label ring.
 */
export function PrivacyRosetteTooltip({
  groups,
  adversaries,
  isUnderReview,
}: Props) {
  const { subject, held, total } = getPrivacyAdversariesSentence(adversaries)

  return (
    // The tooltip inherits `white-space: pre` from the table, so the wrapping
    // has to be asked for explicitly or every line runs past the panel.
    <div className="flex max-w-[560px] flex-col gap-3 text-wrap">
      <div>
        <span className="text-heading-16">Privacy risk analysis</span>
        <p className="mt-1 text-secondary text-xs leading-normal">
          {adversaries.promise.text}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Legend group={groups.risks} align="right" />
        <PrivacyRosetteIcon
          groups={groups}
          isUnderReview={isUnderReview}
          className="size-24 shrink-0"
        />
        <Legend group={groups.adversaries} align="left" />
      </div>
      <p className="text-secondary text-xs leading-normal">
        <span className="font-medium text-primary">
          {subject} is private against {held}/{total} adversaries.
        </span>{' '}
        Click for the full assessment.
      </p>
    </div>
  )
}

function Legend({
  group,
  align,
}: {
  group: PrivacyRosetteGroup
  align: 'left' | 'right'
}) {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-1.5',
        align === 'right' && 'items-end text-right',
      )}
    >
      <div className="font-medium text-[11px] text-secondary uppercase tracking-wide">
        {group.title}
      </div>
      <ul className="flex flex-col gap-1">
        {group.slices.map((slice) => (
          <li
            key={slice.id}
            className={cn(
              'flex items-start gap-1.5 text-xs leading-[16px]',
              align === 'right' && 'flex-row-reverse',
            )}
          >
            <TrustedSetupRiskDot
              risk={slice.risk}
              size="xs"
              className="mt-0.5 shrink-0"
            />
            <span className="min-w-0">
              <span className="font-medium">{slice.label}:</span>{' '}
              <span className="text-secondary">{slice.value}</span>
              {slice.detail && (
                <span className="block text-[11px] text-secondary">
                  {slice.detail}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
