import type { TableReadyValue } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { ProjectRiskTooltipContent } from '~/components/projects/ProjectRiskTooltipContent'
import { SentimentText } from '~/components/SentimentText'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { TableLink } from '~/components/table/TableLink'

interface Props {
  value: ExitWindowRisk
  href?: string
}

type ExitWindowRisk = TableReadyValue & {
  regular?: Pick<TableReadyValue, 'value' | 'sentiment'>
}

export function ExitWindowCell({ value, href }: Props) {
  const regular = value.regular

  const trigger = (
    <TableLink href={href}>
      <TwoRowCell>
        <TwoRowCell.First>
          <SentimentText
            sentiment={value.sentiment ?? 'neutral'}
            className="font-medium"
          >
            {regular ? `Emergency: ${value.value}` : value.value}
          </SentimentText>
        </TwoRowCell.First>
        {regular && (
          <TwoRowCell.Second className="mt-0.5">
            <SentimentText
              sentiment={regular.sentiment ?? 'neutral'}
              className="font-medium"
            >
              {`Regular: ${regular.value}`}
            </SentimentText>
          </TwoRowCell.Second>
        )}
      </TwoRowCell>
    </TableLink>
  )

  if (value.description) {
    return (
      <Tooltip>
        <TooltipTrigger disabledOnMobile className="h-[inherit]">
          {trigger}
        </TooltipTrigger>
        <TooltipContent>
          <ProjectRiskTooltipContent risk={value} variant="table" />
        </TooltipContent>
      </Tooltip>
    )
  }

  return trigger
}
