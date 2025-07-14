import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { DiscoUiLink } from '~/components/projects/links/DiscoUiLink'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { UnderReviewBar } from '~/components/projects/UnderReviewBar'
import { WarningBar } from '~/components/WarningBar'dges/project/getBridgesProjectEntry'

import { BridgesProjectStats } from './BridgesProjectStats'

interface Props {
  project: BridgesProjectEntry
}

export function BridgesProjectSummary({ project }: Props) {
  return (
    <section
      id="summary"
      data-role="project-section"
      className="w-full border-divider bg-surface-primary px-4 pt-4 max-md:border-b md:rounded-lg md:p-6"
    >
      <BridgesProjectStats project={project} />

      <div className="md:hidden">
        <HorizontalSeparator className="max-md:-mx-4 mt-4 mb-2 w-[calc(100%+2rem)] md:hidden" />
        <div className="flex items-center justify-between">
          <a className="text-link text-xs underline" href={project.discoUiHref}>
            Explore more in Discovery UI
          </a>
          <DiscoUiLink href={project.discoUiHref} />
        </div>
      </div>

      <HorizontalSeparator className="max-md:-mx-4 mt-2 max-md:w-[calc(100%+2rem)] md:my-6" />
      <div className="md:hidden">
        <MobileProjectLinks projectLinks={project.header.links} />
      </div>
      <div className="mt-6 flex flex-col gap-4 px-4 max-md:mt-2 max-md:hidden md:px-0 lg:flex-row lg:gap-8">
        {project.header.description && (
          <AboutSection description={project.header.description} />
        )}
      </div>
    </section>
  )
}
