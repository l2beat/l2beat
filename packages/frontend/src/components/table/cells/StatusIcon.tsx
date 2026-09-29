import { LiveIndicator } from '~/components/LiveIndicator'
import { ClockIcon } from '~/icons/Clock'
import { Layer3Icon } from '~/icons/Layer3'
import { SuperchainIcon } from '~/icons/providers/SuperchainIcon'
import { QuantumResistanceIcon } from '~/icons/QuantumResistance'
import { ShieldIcon } from '~/icons/Shield'
import { UnderReviewIcon } from '~/icons/UnderReview'
import { UnverifiedIcon } from '~/icons/Unverified'
import { cn } from '~/utils/cn'

export type ProjectStatus =
  | 'layer3'
  | 'superchain'
  | 'quantumResistance'
  | 'unverified'
  | 'redWarning'
  | 'underReview'
  | 'yellowWarning'
  | 'syncWarning'
  | 'ongoingAnomaly'

/**
 * Labelled by meaning because the tooltips that explain these icons are not
 * server-rendered, and the red and yellow shields differ only by colour.
 */
export function StatusIcon({
  status,
  className = 'size-4',
}: {
  status: ProjectStatus
  className?: string
}) {
  switch (status) {
    case 'layer3':
      return <Layer3Icon className={className} aria-label="Layer 3" />
    case 'superchain':
      return <SuperchainIcon aria-label="Part of the Superchain" />
    case 'quantumResistance':
      return (
        <QuantumResistanceIcon
          className={className}
          aria-label="Plausibly quantum resistant"
        />
      )
    case 'unverified':
      return (
        <UnverifiedIcon
          className={cn(className, 'fill-red-300')}
          aria-label="Unverified code"
        />
      )
    case 'redWarning':
      return (
        <ShieldIcon
          className={cn(className, 'fill-red-300')}
          aria-label="Critical warning"
        />
      )
    case 'underReview':
      return <UnderReviewIcon className={className} aria-label="Under review" />
    case 'yellowWarning':
      return (
        <ShieldIcon
          className={cn(className, 'fill-yellow-700 dark:fill-yellow-300')}
          aria-label="Warning"
        />
      )
    case 'syncWarning':
      return <ClockIcon className={className} aria-label="Data not synced" />
    case 'ongoingAnomaly':
      return <LiveIndicator label="Ongoing anomaly" />
  }
}
