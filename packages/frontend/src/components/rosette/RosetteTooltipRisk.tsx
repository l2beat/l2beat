import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { SentimentText } from '../SentimentText'
import { sentimentToWarningBarColor, WarningBar } from '../WarningBar'
import type { RosetteValue } from './types'

interface Props {
  risk: RosetteValue
}

export function RosetteTooltipRisk({ risk }: Props) {
  const regular = risk.regular

  if (regular) {
    return (
      <div className="flex flex-col gap-3">
        <RosetteTooltipRiskSection
          label="Emergency"
          value={risk.value}
          sentiment={risk.sentiment ?? 'neutral'}
          description={risk.description}
        />
        <RosetteTooltipRiskSection
          label="Regular"
          value={regular.value}
          sentiment={regular.sentiment ?? 'neutral'}
          description={risk.warning?.value}
        />
      </div>
    )
  }

  return (
    <>
      <SentimentText
        sentiment={risk.sentiment ?? 'neutral'}
        vibrant={true}
        className="mb-2 flex items-center gap-1 font-medium text-heading-18"
      >
        {risk.value}
      </SentimentText>
      {risk.warning && (
        <WarningBar
          className="mb-2 px-3 py-2"
          icon={RoundedWarningIcon}
          text={risk.warning.value}
          color={sentimentToWarningBarColor(risk.warning.sentiment)}
        />
      )}
      {risk.description && (
        <span className="text-paragraph-13 text-primary">
          {risk.description}
        </span>
      )}
    </>
  )
}

function RosetteTooltipRiskSection({
  label,
  value,
  sentiment,
  description,
}: {
  label: string
  value: string
  sentiment: NonNullable<RosetteValue['sentiment']>
  description?: string
}) {
  return (
    <div>
      <SentimentText
        sentiment={sentiment}
        vibrant={true}
        className="font-medium text-heading-18"
      >
        {`${label}: ${value}`}
      </SentimentText>
      {description && (
        <p className="mt-1 text-paragraph-13 text-primary">{description}</p>
      )}
    </div>
  )
}
