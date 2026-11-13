import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { BadgesSection } from '~/components/projects/sections/BadgesSection'
import { LiquidStakingYieldAndExitSection } from '~/components/projects/sections/defi/LiquidStakingYieldAndExitSection'
import type { ProjectDefiEntry } from '~/server/features/defi/project/getDefiProjectEntry'
import { cn } from '~/utils/cn'
import { ProjectIntro } from '../../project/ProjectIntro'
import {
  ProjectPage,
  type ProjectPageCommonProps,
} from '../../project/ProjectPage'
import { LiquidStakingProjectSummary } from './components/LiquidStakingProjectSummary'

const PAGE_SECTIONS = { LiquidStakingYieldAndExitSection }

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
          withMobileSeparator={false}
        />
      }
      summary={
        <PrimaryCard
          id="summary"
          data-role="nav-section"
          className={cn(
            'scroll-mt-[100vh] border-divider max-md:rounded-none max-md:border-b max-md:pt-0',
            // On phones the badges and About sit above the card, so without
            // the staking summary it shrinks to the rule below them.
            !entry.liquidStaking && 'max-md:border-b-0 max-md:pb-0',
          )}
        >
          {/* Inside the card so the Summary tab, which needs a visible
              height, stays lit while About is on screen. */}
          <HorizontalSeparator
            className={cn('my-4 md:hidden', !entry.liquidStaking && 'mb-0')}
          />
          {entry.liquidStaking && (
            <>
              <LiquidStakingProjectSummary summary={entry.liquidStaking} />
              <HorizontalSeparator className="my-4 max-md:hidden" />
            </>
          )}
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
      pageSections={PAGE_SECTIONS}
    />
  )
}
