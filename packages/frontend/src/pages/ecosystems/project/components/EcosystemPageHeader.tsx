import { DesktopProjectLinks } from '~/components/projects/links/DesktopProjectLinks'
import {
  type BadgeWithParams,
  ProjectBadge,
} from '~/components/projects/ProjectBadge'
import { useEcosystemDisplayControlsContext } from '~/components/table/display/contexts/EcosystemDisplayControlsContext'
import { DisplayControls } from '~/components/table/display/DisplayControls'
import type { EcosystemEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import { cn } from '~/utils/cn'

interface Props {
  logo: EcosystemEntry['logo']
  badges: BadgeWithParams[]
  links: EcosystemEntry['links']['header']
  hasRwaRestrictedTvs: EcosystemEntry['hasRwaRestrictedTvs']
}

export function EcosystemPageHeader({
  logo,
  badges,
  links,
  hasRwaRestrictedTvs,
}: Props) {
  const { display, setDisplay } = useEcosystemDisplayControlsContext()
  return (
    <header>
      <div className="flex items-center justify-between">
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
        <div className="mt-2 ml-auto flex gap-3 max-md:hidden">
          {badges.map((badge) => (
            <ProjectBadge key={badge.id} badge={badge} disableTooltip />
          ))}
        </div>
      </div>
      <div className="mt-1 flex justify-between">
        <div className="max-md:hidden">
          <DesktopProjectLinks projectLinks={links} />
        </div>
        {hasRwaRestrictedTvs && (
          <DisplayControls display={display} setDisplay={setDisplay} />
        )}
      </div>
    </header>
  )
}
