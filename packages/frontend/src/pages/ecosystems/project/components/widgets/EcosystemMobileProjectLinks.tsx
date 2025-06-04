import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import type { ProjectLink } from '~/components/projects/links/types'
import { cn } from '~/utils/cn'
import { EcosystemWidget } from './EcosystemWidget'

interface Props {
  links: ProjectLink[]
  className?: string
}

export function EcosystemMobileProjectLinks({ links, className }: Props) {
  return (
    <EcosystemWidget className={cn('py-0 md:hidden', className)}>
      <MobileProjectLinks projectLinks={links} triggerClassName="py-2" />
    </EcosystemWidget>
  )
}
