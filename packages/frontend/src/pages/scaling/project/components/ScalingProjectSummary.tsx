import type { HTMLAttributes } from 'react'
import {
  TokenBreakdown,
  TokenBreakdownTooltipContent,
} from '~/components/breakdown/TokenBreakdown'
import {
  ValueSecuredBreakdown,
  ValueSecuredBreakdownTooltipContent,
} from '~/components/breakdown/ValueSecuredBreakdown'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { VerticalSeparator } from '~/components/core/VerticalSeparator'
import { CustomLink } from '~/components/link/CustomLink'
import { DiscoUiLink } from '~/components/projects/links/DiscoUiLink'
import { MobileProjectLinks } from '~/components/projects/links/MobileProjectLinks'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { BadgesSection } from '~/components/projects/sections/BadgesSection'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import type { ProjectScalingEntry } from '~/server/features/scaling/project/getScalingProjectEntry'
import { cn } from '~/utils/cn'
import { ProjectScalingRosette } from './ScalingProjectRosette'
import { ProjectScalingStats } from './ScalingProjectStats'

interface Props {
  project: ProjectScalingEntry
}

export function ProjectScalingSummary({ project }: Props) {
  const hasTokenWarnings =
    project.header.tvs && project.header.tvs?.tokens.warnings?.length > 0

  const anyBadWarnings = project.header.tvs?.tokens.warnings?.some(
    (w) => w.sentiment === 'bad',
  )
  const anyWarningWarnings = project.header.tvs?.tokens.warnings?.some(
    (w) => w.sentiment === 'warning',
  )
  const warningSentiment = anyBadWarnings
    ? 'bad'
    : anyWarningWarnings
      ? 'warning'
      : 'neutral'
  return (
    <section
      id="summary"
      data-role="nav-section"
      className="w-full border-divider px-4 max-md:border-b md:rounded-lg md:bg-surface-primary md:p-6"
    >
      <div className="flex">
        <div className="w-full">
          <ProjectScalingStats project={project} />
          <HorizontalSeparator className="mt-5 mb-4" />
          <div
            className={cn(
              'grid gap-x-10 gap-y-4',
              project.type === 'layer2' && 'md:grid-cols-2',
            )}
          >
            <div>
              <p
                className={cn(
                  'font-medium text-label-value-12 text-secondary',
                  !hasTokenWarnings && 'mb-2',
                )}
              >
                Tokens breakdown
              </p>
              <Tooltip>
                <TooltipTrigger className="w-full cursor-pointer" asChild>
                  <ConditionalLink
                    className="flex items-center gap-1"
                    href={
                      project.header.tvs
                        ? `/scaling/projects/${project.slug}/tvs-breakdown`
                        : undefined
                    }
                  >
                    <TokenBreakdown
                      total={project.header.tvs?.tokens.breakdown?.total ?? 0}
                      ether={project.header.tvs?.tokens.breakdown?.ether ?? 0}
                      stablecoin={
                        project.header.tvs?.tokens.breakdown?.stablecoin ?? 0
                      }
                      btc={project.header.tvs?.tokens.breakdown?.btc ?? 0}
                      other={project.header.tvs?.tokens.breakdown?.other ?? 0}
                      rwaPublic={
                        project.header.tvs?.tokens.breakdown?.rwaPublic ?? 0
                      }
                      rwaRestricted={
                        project.header.tvs?.tokens.breakdown?.rwaRestricted ?? 0
                      }
                      className="h-1.5 w-full"
                    />
                    {hasTokenWarnings && (
                      <RoundedWarningIcon
                        sentiment={warningSentiment}
                        className="size-[22px]"
                      />
                    )}
                  </ConditionalLink>
                </TooltipTrigger>
                <TooltipContent>
                  <TokenBreakdownTooltipContent
                    total={project.header.tvs?.tokens.breakdown?.total ?? 0}
                    associated={
                      project.header.tvs?.tokens.breakdown?.associated ?? 0
                    }
                    ether={project.header.tvs?.tokens.breakdown?.ether ?? 0}
                    stablecoin={
                      project.header.tvs?.tokens.breakdown?.stablecoin ?? 0
                    }
                    btc={project.header.tvs?.tokens.breakdown?.btc ?? 0}
                    other={project.header.tvs?.tokens.breakdown?.other ?? 0}
                    rwaPublic={
                      project.header.tvs?.tokens.breakdown?.rwaPublic ?? 0
                    }
                    rwaRestricted={
                      project.header.tvs?.tokens.breakdown?.rwaRestricted ?? 0
                    }
                    associatedTokens={
                      project.header.tvs?.tokens.associatedTokens ?? []
                    }
                    tvsWarnings={project.header.tvs?.tokens.warnings ?? []}
                  />
                  {project.header.tvs && (
                    <p className="mt-2 text-label-value-13 text-secondary max-md:hidden">
                      Click to view TVS breakdown
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
            </div>
            <div>
              <p className="mb-2 font-medium text-label-value-12 text-secondary">
                Value secured breakdown
              </p>
              <Tooltip>
                <TooltipTrigger className="block w-full cursor-pointer" asChild>
                  <ConditionalLink
                    href={
                      project.header.tvs
                        ? `/scaling/projects/${project.slug}/tvs-breakdown`
                        : undefined
                    }
                  >
                    <ValueSecuredBreakdown
                      canonical={project.header.tvs?.breakdown?.canonical ?? 0}
                      external={project.header.tvs?.breakdown?.external ?? 0}
                      native={project.header.tvs?.breakdown?.native ?? 0}
                      className="h-1.5 w-full"
                    />
                  </ConditionalLink>
                </TooltipTrigger>
                <TooltipContent>
                  <ValueSecuredBreakdownTooltipContent
                    canonical={project.header.tvs?.breakdown?.canonical ?? 0}
                    external={project.header.tvs?.breakdown?.external ?? 0}
                    native={project.header.tvs?.breakdown?.native ?? 0}
                    change={project.header.tvs?.breakdown?.totalChange ?? 0}
                    tvsWarnings={[]}
                  />
                  {project.header.tvs && (
                    <p className="mt-2 text-label-value-13 text-secondary max-md:hidden">
                      Click to view TVS breakdown
                    </p>
                  )}
                </TooltipContent>
              </Tooltip>
              <CustomLink
                href={`/scaling/projects/${project.slug}/tvs-breakdown`}
                className="mt-2 font-medium text-label-value-13 md:hidden"
              >
                View TVS breakdown
              </CustomLink>
            </div>
          </div>
        </div>
        <VerticalSeparator className="mr-8 ml-12 h-[unset] self-stretch max-lg:hidden" />

        <ProjectScalingRosette project={project} size="small" />
      </div>

      {project.discoUiHref && (
        <div className="md:hidden">
          <HorizontalSeparator className="max-md:-mx-4 mt-4 mb-2 max-md:w-[calc(100%+2rem)] md:hidden" />
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
      )}

      <HorizontalSeparator className="max-md:-mx-4 mt-2 max-md:w-[calc(100%+2rem)] md:my-4" />
      <div className="md:hidden">
        <MobileProjectLinks projectLinks={project.header.links} />
      </div>
      <div className="max-md:hidden">
        <div className="mt-6 flex flex-col gap-4 px-4 max-md:mt-2 md:px-0 lg:flex-row lg:gap-8">
          {project.header.badges && project.header.badges.length > 0 && (
            <BadgesSection badges={project.header.badges} />
          )}
          {project.header.description && (
            <AboutSection description={project.header.description} />
          )}
        </div>
      </div>
    </section>
  )
}

function ConditionalLink({
  children,
  href,
  ...props
}: HTMLAttributes<HTMLAnchorElement | HTMLDivElement> & {
  href: string | undefined
}) {
  return href ? (
    <a href={href} {...props}>
      {children}
    </a>
  ) : (
    <div {...props}>{children}</div>
  )
}
