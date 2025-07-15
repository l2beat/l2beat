import { NoDataBadge } from '~/components/badge/NoDataBadge'
import {
  TokenBreakdown,
  TokenBreakdownTooltipContent,
} from '~/components/breakdown/TokenBreakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProjectSummaryStat } from '~/components/projects/ProjectSummaryStat'
import { SentimentText } from '~/components/SentimentText'
import { ValueWithPercentageChange } from '~/components/table/cells/ValueWithPercentageChange'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import type { BridgesProjectEntry } from '~/server/features/bridges/project/getBridgesProjectEntry'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

interface Props {
  project: BridgesProjectEntry
}

export function BridgesProjectStats({ project }: Props) {
  const isAnyTokenWarningBad = project.header.tvs?.tokenBreakdown.warnings.some(
    (warning) => warning.sentiment === 'bad',
  )

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-4">
      <ProjectSummaryStat
        key="tvs"
        title="Total Value Secured"
        valueClassName="md:w-full"
        tooltip="Total value secured in escrow contracts on Ethereum displayed together with a percentage change compared to 7D ago."
        value={
          !project.isUpcoming && project.header.tvs ? (
            <Tooltip>
              <TooltipTrigger className="w-full">
                <span className="mb-0.5 flex items-center gap-2">
                  {project.header.tvs.tokenBreakdown.warnings.length > 0 && (
                    <RoundedWarningIcon
                      sentiment={isAnyTokenWarningBad ? 'bad' : 'warning'}
                      className="size-4"
                    />
                  )}
                  <ValueWithPercentageChange
                    className="!text-base !font-medium !leading-[100%] text-nowrap"
                    changeClassName="text-label-value-14 font-bold"
                    change={project.header.tvs.tvsBreakdown.totalChange}
                  >
                    {formatCurrency(
                      project.header.tvs.tvsBreakdown.total,
                      'usd',
                    )}
                  </ValueWithPercentageChange>
                </span>
                <TokenBreakdown
                  {...project.header.tvs.tokenBreakdown}
                  className="h-[3px] w-full"
                />
              </TooltipTrigger>
              <TooltipContent>
                <TokenBreakdownTooltipContent
                  {...project.header.tvs.tokenBreakdown}
                  associatedTokenSymbols={
                    project.header.tvs.tokenBreakdown.associatedTokens
                  }
                  tvsWarnings={project.header.tvs.tokenBreakdown.warnings}
                />
              </TooltipContent>
            </Tooltip>
          ) : (
            <NoDataBadge />
          )
        }
      />
      <ProjectSummaryStat
        key="destination"
        title="Destination"
        value={
          <Tooltip>
            <TooltipTrigger disabled={!project.header.destination.description}>
              <SentimentText
                sentiment={project.header.destination.sentiment ?? 'neutral'}
              >
                {project.header.destination.value}
              </SentimentText>
            </TooltipTrigger>
            <TooltipContent>
              {project.header.destination.description}
            </TooltipContent>
          </Tooltip>
        }
      />
      <ProjectSummaryStat
        key="validated-by"
        title="Validated by"
        tooltip="How are the messages sent via this bridge checked?"
        value={
          project.header.validatedBy ? (
            <SentimentText
              sentiment={project.header.validatedBy.sentiment ?? 'neutral'}
            >
              {project.header.validatedBy.value}
            </SentimentText>
          ) : (
            <NoDataBadge />
          )
        }
      />
      <ProjectSummaryStat
        key="type"
        title="Type"
        value={project.header.category}
      />
    </div>
  )
}
