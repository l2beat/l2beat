import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { BadgesSection } from '~/components/projects/sections/BadgesSection'
import type { ProjectDefiEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import { ProjectIntro } from '../../project/ProjectIntro'
import {
  ProjectPage,
  type ProjectPageCommonProps,
} from '../../project/ProjectPage'

interface Props extends ProjectPageCommonProps {
  entry: ProjectDefiEntry
}

export function DefiProjectPage({ entry, ...props }: Props) {
  const badges = entry.badges.length > 0 ? entry.badges : undefined
  return (
    <ProjectPage
      {...props}
      project={entry}
      intro={
        <ProjectIntro
          status={{
            underReviewStatus: entry.isUnderReview ? 'config' : undefined,
            header: {
              warning: entry.warnings.yellow,
              redWarning: entry.warnings.red,
              emergencyWarning: entry.warnings.emergency,
            },
          }}
          versions={props.versionLinks}
          badges={badges}
          description={entry.description}
          links={entry.projectLinks}
          discoUiHref={entry.discoveryHref}
        />
      }
      summary={
        <PrimaryCard
          id="summary"
          data-role="nav-section"
          className="scroll-mt-[100vh] border-divider max-md:rounded-none max-md:border-b max-md:pt-0"
        >
          <div className="max-md:hidden">
            <div className="flex flex-col gap-4 px-4 max-md:mt-2 md:px-0 lg:flex-row lg:gap-8">
              {badges && <BadgesSection badges={badges} withDialog />}
              {entry.description && (
                <AboutSection description={entry.description} />
              )}
            </div>
          </div>
        </PrimaryCard>
      }
      sections={entry.sections}
    />
  )
}
