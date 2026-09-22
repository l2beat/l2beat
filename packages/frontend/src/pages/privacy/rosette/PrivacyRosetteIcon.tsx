import { riskToFillColor } from '../sentimentToRiskDot'
import {
  describePrivacyRosetteSlice,
  getPrivacyRosetteArcs,
  PRIVACY_ROSETTE_SIZE,
  type PrivacyRosetteHalf,
} from './privacyRosetteGeometry'
import type {
  PrivacyRosetteGroup,
  PrivacyRosetteGroups,
} from './privacyRosetteSlices'

interface Props {
  groups: PrivacyRosetteGroups
  isUnderReview?: boolean
  /** Replaces the generic label where the rosette is the only thing in a cell. */
  label?: string
  className?: string
}

/**
 * The whole privacy assessment in one ring: the adversaries on the right half,
 * the protocol risks on the left, one slice each. It replaces the strip of
 * dots, so it has to stay readable at table-cell size - which is why it is a
 * plain graphic, with the per-risk detail left to the tooltip beside it.
 */
export function PrivacyRosetteIcon({
  groups,
  isUnderReview,
  label = 'Rosette showing the privacy risk summary',
  className,
}: Props) {
  const halves: { half: PrivacyRosetteHalf; group: PrivacyRosetteGroup }[] = [
    { half: 'right', group: groups.adversaries },
    { half: 'left', group: groups.risks },
  ]

  return (
    <svg
      width={PRIVACY_ROSETTE_SIZE}
      height={PRIVACY_ROSETTE_SIZE}
      viewBox={`0 0 ${PRIVACY_ROSETTE_SIZE} ${PRIVACY_ROSETTE_SIZE}`}
      role="img"
      aria-label={label}
      className={className}
    >
      {halves.map(({ half, group }) => {
        const arcs = getPrivacyRosetteArcs(group.slices.length, half)
        return group.slices.map((slice, index) => {
          const arc = arcs[index]
          if (!arc) {
            return null
          }

          return (
            <path
              key={slice.id}
              d={describePrivacyRosetteSlice(arc)}
              className={riskToFillColor(isUnderReview ? 'N/A' : slice.risk)}
            />
          )
        })
      })}
    </svg>
  )
}
