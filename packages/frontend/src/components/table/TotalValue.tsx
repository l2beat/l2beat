import React from 'react'

import { ScalingTvlViewEntry } from '../../pages/scaling/tvl/types'
import { ExcludeAssociatedTokensWrapper } from '../ExcludeAssociatedTokensWrapper'
import { RoundedWarningIcon } from '../icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { ValueWithPercentageCell } from './ValueWithPercentageCell'

export interface TotalValueProps {
  project: ScalingTvlViewEntry
}

export function TotalValue({ project }: TotalValueProps) {
  const content = (
    <ExcludeAssociatedTokensWrapper>
      <ExcludeAssociatedTokensWrapper.TokensIncludedView>
        <ValueWithPercentageCell
          value={project.data.tvl.displayValue}
          percentChange={project.data.tvl.change}
        />
      </ExcludeAssociatedTokensWrapper.TokensIncludedView>
      <ExcludeAssociatedTokensWrapper.TokensExcludedView>
        <ValueWithPercentageCell
          value={project.data.excludedAssociatedTokens.tvl.displayValue}
          percentChange={project.data.excludedAssociatedTokens.tvl.change}
        />
      </ExcludeAssociatedTokensWrapper.TokensExcludedView>
    </ExcludeAssociatedTokensWrapper>
  )

  if (project.tvlWarning) {
    return (
      <Tooltip>
        <TooltipTrigger className="relative flex items-center gap-1">
          {content}
          <RoundedWarningIcon
            className="absolute -right-5 size-5 pl-1"
            sentiment={project.tvlWarning.sentiment}
          />
        </TooltipTrigger>
        <TooltipContent>{project.tvlWarning.content}</TooltipContent>
      </Tooltip>
    )
  }

  return content
}
