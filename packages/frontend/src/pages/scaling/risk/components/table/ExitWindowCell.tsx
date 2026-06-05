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

interface Props {
  value: ExitWindowRisk
  href?: string
}

type ExitWindowRisk = TableReadyValue & {
  regular?: Pick<TableReadyValue, 'value' | 'sentiment'>
}

export function ExitWindowCell({ value, href }: Props) {
  const regular = value.regular
  const regularDescription = regular ? value.warning?.value : undefined

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
        <TooltipContent className="font-normal">
          {regular ? (
            <div className="flex flex-col gap-3">
              <ExitWindowTooltipSection
                label="Emergency"
                value={value.value}
                sentiment={value.sentiment ?? 'neutral'}
                description={value.description}
              />
              <ExitWindowTooltipSection
                label="Regular"
                value={regular.value}
                sentiment={regular.sentiment ?? 'neutral'}
                description={regularDescription}
              />
            </div>
          ) : (
            <ExitWindowTooltipSection
              value={value.value}
              sentiment={value.sentiment ?? 'neutral'}
              warning={value.warning}
              description={value.description}
            />
          )}
        </TooltipContent>
      </Tooltip>
    )
  }

  return trigger
}

function ExitWindowTooltipSection({
  label,
  value,
  sentiment,
  warning,
  description,
}: {
  label?: string
  value: string
  sentiment: NonNullable<TableReadyValue['sentiment']>
  warning?: NonNullable<TableReadyValue['warning']>
  description?: string
}) {
  return (
    <div>
      <SentimentText sentiment={sentiment} className="font-medium">
        {label ? `${label}: ${value}` : value}
      </SentimentText>
      {warning && (
        <WarningBar
          className="mt-2 px-3 py-2"
          icon={RoundedWarningIcon}
          text={warning.value}
          color={sentimentToWarningBarColor(warning.sentiment)}
        />
      )}
      {description && <p className="mt-1 text-primary">{description}</p>}
    </div>
  )
}
