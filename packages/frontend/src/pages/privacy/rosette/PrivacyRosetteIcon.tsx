import { cn } from '~/utils/cn'
import { riskToFillColor } from '../sentimentToRiskDot'
import {
  describePrivacyRosetteSlice,
  getPrivacyRosetteArcs,
  PRIVACY_ROSETTE_SIZE,
  type PrivacyRosetteArc,
} from './privacyRosetteGeometry'
import type {
  PrivacyRosetteGroups,
  PrivacyRosetteSlice,
} from './privacyRosetteSlices'

interface Props {
  groups: PrivacyRosetteGroups
  isUnderReview?: boolean
  /** Replaces the generic label where the rosette is the only thing in a cell. */
  label?: string
  /** Slice to keep at full strength while the rest fade back. */
  selectedId?: string
  /** Makes the slices hoverable; called with undefined when none is. */
  onSelect?: (id: string | undefined) => void
  className?: string
}

/**
 * The privacy assessment in one ring, one slice per graded item: the
 * adversaries on the left half, the protocol risks on the right. It replaces a
 * strip of dots, so it has to stay readable at table-cell size - which is why
 * it is a plain graphic, with the per-item detail left to its tooltip.
 */
export function PrivacyRosetteIcon({
  groups,
  isUnderReview,
  label = 'Rosette showing the privacy risk summary',
  selectedId,
  onSelect,
  className,
}: Props) {
  const placed = placeSlices(groups)

  return (
    <svg
      width={PRIVACY_ROSETTE_SIZE}
      height={PRIVACY_ROSETTE_SIZE}
      viewBox={`0 0 ${PRIVACY_ROSETTE_SIZE} ${PRIVACY_ROSETTE_SIZE}`}
      role="img"
      aria-label={label}
      className={className}
      onMouseLeave={onSelect && (() => onSelect(undefined))}
    >
      {placed.map(({ slice, arc }) => (
        <path
          key={slice.id}
          d={describePrivacyRosetteSlice(arc)}
          className={cn(
            'transition-opacity',
            riskToFillColor(isUnderReview ? 'N/A' : slice.risk),
            selectedId !== undefined && selectedId !== slice.id && 'opacity-20',
          )}
          onMouseEnter={onSelect && (() => onSelect(slice.id))}
        />
      ))}
    </svg>
  )
}

function placeSlices(
  groups: PrivacyRosetteGroups,
): { slice: PrivacyRosetteSlice; arc: PrivacyRosetteArc }[] {
  const pair = (slices: PrivacyRosetteSlice[], arcs: PrivacyRosetteArc[]) =>
    slices.flatMap((slice, index) => {
      const arc = arcs[index]
      return arc ? [{ slice, arc }] : []
    })

  const { adversaries, risks } = groups

  return [
    ...pair(
      adversaries.slices,
      getPrivacyRosetteArcs(adversaries.slices.length, 'left'),
    ),
    ...pair(risks.slices, getPrivacyRosetteArcs(risks.slices.length, 'right')),
  ]
}
