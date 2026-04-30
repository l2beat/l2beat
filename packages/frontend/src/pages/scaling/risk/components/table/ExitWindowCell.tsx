import type { TableReadyValue } from '@l2beat/config'
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

type ExitWindowRisk = TableReadyValue & {
  emergency?: Pick<TableReadyValue, 'value' | 'sentiment'>
}

export function ExitWindowCell({ value, href }: Props) {
  const emergency = value.emergency

  const trigger = (
    <TableLink href={href}>
      <TwoRowCell>
        <TwoRowCell.First className="flex items-center gap-1">
          <SentimentText
            sentiment={
              emergency
                ? (emergency.sentiment ?? 'neutral')
                : (value.sentiment ?? 'neutral')
            }
            className="font-medium"
          >
            {emergency ? `Emergency: ${emergency.value}` : value.value}
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
        {emergency ? (
          <TwoRowCell.Second className="mt-0.5">
            <SentimentText
              sentiment={value.sentiment ?? 'neutral'}
              className="font-medium"
            >
              {`Regular: ${value.value}`}
            </SentimentText>
          </TwoRowCell.Second>
        ) : (
          value.secondLine && (
            <TwoRowCell.Second>{value.secondLine}</TwoRowCell.Second>
          )
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
