import Image from 'next/image'
import { DesktopProjectLinks } from '~/components/projects/links/desktop-project-links'
import {
  type BadgeWithParams,
  ProjectBadge,
} from '~/components/projects/project-badge'
import type { EcosystemEntry } from '~/server/features/ecosystems/get-ecosystem-entry'

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
          <Image {...logo} alt="Ecosystem logo" priority />
        </div>
        <div className="max-md:hidden">
          <DesktopProjectLinks projectLinks={links} variant="primary" />
        </div>
      </div>
      <div className="ml-auto flex gap-3 max-md:hidden">
        {badges.map((badge) => (
          <ProjectBadge key={badge.id} badge={badge} />
        ))}
      </div>
    </header>
  )
}
