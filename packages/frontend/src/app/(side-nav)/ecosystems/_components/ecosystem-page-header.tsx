import Image from 'next/image'
import { DesktopProjectLinks } from '~/components/projects/links/desktop-project-links'
import {
  ProjectBadge,
  type BadgeWithParams,
} from '~/components/projects/project-badge'
import type { EcosystemProjectEntry } from '~/server/features/ecosystems/get-ecosystem-project-entry'

interface Props {
  logo: EcosystemProjectEntry['logo']
  badges: BadgeWithParams[]
  links: EcosystemProjectEntry['links']
}

export function EcosystemPageHeader({ logo, badges, links }: Props) {
  return (
    <header className="flex items-center">
      <div>
        <div className="flex h-20 items-center gap-2">
          <Image
            {...logo}
            alt="Ecosystem logo"
            priority
            className="h-5 w-auto"
          />
        </div>
        <DesktopProjectLinks projectLinks={links} variant="primary" />
      </div>
      <div className="ml-auto flex gap-3">
        {badges.map((badge) => (
          <ProjectBadge key={badge.id} badge={badge} />
        ))}
      </div>
    </header>
  )
}
