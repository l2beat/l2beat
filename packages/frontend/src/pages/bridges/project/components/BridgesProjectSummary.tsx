import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { DiscoUiLink } from '~/components/projects/links/DiscoUiLink'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import type { BridgesProjectEntry } from '~/server/features/bridges/project/getBridgesProjectEntry'
import { BridgesProjectStats } from './BridgesProjectStats'

interface Props {
  project: BridgesProjectEntry
}

export function BridgesProjectSummary({ project }: Props) {
  return (
    <PrimaryCard className="!rounded-lg !p-6">
      <section
        id="summary"
        data-role="project-section"
        className="w-full max-md:bg-header-primary"
      >
        <BridgesProjectStats project={project} />

        <div className="md:hidden">
          <HorizontalSeparator className="max-md:-mx-4 mt-4 mb-2 max-md:w-screen md:hidden" />
          <div className="flex items-center justify-between">
            <a
              className="text-link text-xs underline"
              href={project.discoUiHref}
            >
              Explore more in Discovery UI
            </a>
            <DiscoUiLink href={project.discoUiHref} />
          </div>
        </div>

        <HorizontalSeparator className="max-md:-mx-4 mt-2 max-md:w-screen md:my-6" />
        <div className="md:hidden">
          <MobileProjectLinks projectLinks={project.header.links} />
        </div>
        <div className="mt-6 flex flex-col gap-4 px-4 max-md:mt-2 max-md:hidden md:px-0 lg:flex-row lg:gap-8">
          {project.header.description && (
            <AboutSection description={project.header.description} />
          )}
        </div>
      </section>
    </PrimaryCard>
  )
}
