import type { ExitWindowRisk } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { SentimentText } from '~/components/SentimentText'
import { TwoRowCell } from '~/components/table/cells/TwoRowCell'
import { TableLink } from '~/components/table/TableLink'
import { sentimentToWarningBarColor, WarningBar } from '~/components/WarningBar'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'

interface Props {
  value: ExitWindowRisk
  href?: string
}

export function ExitWindowCell({ value, href }: Props) {
  const trigger = (
    <TableLink href={href}>
      <TwoRowCell>
        <TwoRowCell.First className="flex items-center gap-1">
          <SentimentText
            sentiment={value.sentiment ?? 'neutral'}
            className="font-medium"
          >
            {value.value}
          </SentimentText>
          {value.warning && (
            <RoundedWarningIcon
              className={cn(
                'size-3.5 md:size-4',
                sentimentToFillColor(value.warning.sentiment),
              )}
            />
          )}
        </TwoRowCell.First>
        {value.secondLine && (
          <TwoRowCell.Second>{value.secondLine}</TwoRowCell.Second>
        )}
        {value.emergency && (
          <TwoRowCell.Second className="mt-0.5">
            <SentimentText
              sentiment={value.emergency.sentiment ?? 'neutral'}
              className="font-medium"
            >
              {`Emergency: ${value.emergency.value}`}
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
          {value.warning && (
            <WarningBar
              className="mb-2"
              text={value.warning.value}
              icon={RoundedWarningIcon}
              color={sentimentToWarningBarColor(value.warning.sentiment)}
              ignoreMarkdown
            />
          )}
          {value.description}
        </TooltipContent>
      </Tooltip>
    )
  }

  return trigger
}
