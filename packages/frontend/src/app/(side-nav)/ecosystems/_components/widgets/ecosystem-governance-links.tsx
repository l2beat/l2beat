import { cn } from '~/utils/cn'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

export interface EcosystemGovernanceLinks {
  review: string | undefined
  topDelegates: string
  proposals: string
}

interface Props {
  links: EcosystemGovernanceLinks
  className?: string
}

export function EcosystemGovernanceLinks({ links, className }: Props) {
  return (
    <div
      className={cn('grid grid-cols-2 grid-rows-2 gap-[--spacing]', className)}
    >
      <EcosystemWidget className="row-span-2">x</EcosystemWidget>
      <EcosystemWidget asChild>
        <a target="_blank" href={links.topDelegates}>
          <EcosystemWidgetTitle>Top Delegates</EcosystemWidgetTitle>
        </a>
      </EcosystemWidget>
      <EcosystemWidget asChild>
        <a target="_blank" href={links.proposals}>
          <EcosystemWidgetTitle>Proposals</EcosystemWidgetTitle>
        </a>
      </EcosystemWidget>
    </div>
  )
}
