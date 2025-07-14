import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import {
  type BadgeWithParams,
  ProjectBadge,
} from '~/components/projects/ProjectBadge'
import type { EcosystemEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import { cn } from '~/utils/cn'

interface Props {
  logo: EcosystemEntry['logo']
  badges: BadgeWithParams[]
  links: EcosystemEntry['links']['header']
}

export function EcosystemPageHeader({ logo, badges, links }: Props) {
  return (
    <header className="flex items-center">
      <div>
        <div className="flex h-20 items-center gap-2">
          <img
            src={logo.light}
            className={cn('h-10 w-auto', logo.dark && 'dark:hidden')}
            alt="Ecosystem logo"
            width={logo.width}
            height={logo.height}
          />
          {logo.dark && (
            <img
              src={logo.dark}
              className="hidden h-10 w-auto dark:block"
              alt="Ecosystem logo"
              width={logo.width}
              height={logo.height}
            />
          )}
        </div>
        <div className="max-md:hidden">
          <DesktopProjectLinks projectLinks={links} />
        </div>
      </div>
      <div className="ml-auto flex gap-3 max-md:hidden">
        {badges.map((badge) => (
          <ProjectBadge key={badge.id} badge={badge} disableTooltip />
        ))}
      </div>
    </header>
  )
}
