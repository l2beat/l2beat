import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { SentimentText } from '../SentimentText'
import { sentimentToWarningBarColor, WarningBar } from '../WarningBar'
import type { RosetteValue } from './types'

interface Props {
  risk: RosetteValue
  valueClassName?: string
  regularClassName?: string
  warningClassName?: string
  regularWarningClassName?: string
  descriptionClassName?: string
  ignoreWarningMarkdown?: boolean
  ignoreRegularWarningMarkdown?: boolean
}

export function RosetteTooltipRisk({
  risk,
  valueClassName,
  regularClassName,
  warningClassName,
  regularWarningClassName = warningClassName,
  descriptionClassName,
  ignoreWarningMarkdown,
  ignoreRegularWarningMarkdown = ignoreWarningMarkdown,
}: Props) {
  return (
    <>
      <SentimentText
        sentiment={risk.sentiment ?? 'neutral'}
        vibrant={true}
        className={valueClassName}
      >
        {risk.regular ? `Emergency: ${risk.value}` : risk.value}
      </SentimentText>
      {risk.regular && (
        <SentimentText
          sentiment={risk.regular.sentiment ?? 'neutral'}
          vibrant={true}
          className={regularClassName}
        >
          {`Regular: ${risk.regular.value}`}
        </SentimentText>
      )}
      {risk.warning && (
        <WarningBar
          className={risk.regular ? regularWarningClassName : warningClassName}
          icon={RoundedWarningIcon}
          text={risk.warning.value}
          color={sentimentToWarningBarColor(risk.warning.sentiment)}
          ignoreMarkdown={
            risk.regular ? ignoreRegularWarningMarkdown : ignoreWarningMarkdown
          }
        />
      )}
      <span className={descriptionClassName}>{risk.description}</span>
    </>
  )
}
