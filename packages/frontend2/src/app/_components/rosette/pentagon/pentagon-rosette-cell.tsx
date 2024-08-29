import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { cn } from '~/utils/cn'
import { sentimentToFillColor } from '~/utils/sentiment'
import { UnderReviewBadge } from '../../badge/under-review-badge'
import { SentimentText } from '../../sentiment-text'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../tooltip/tooltip'
import { type RosetteValue } from '../types'
import { PentagonRosetteIcon } from './pentagon-rosette-icon'
import { PentagonRosetteLabels } from './pentagon-rosette-labels'

interface Props {
  values: RosetteValue[]
  isUnderReview?: boolean
}

export function PentagonRosetteCell(props: Props) {
  const isUnderReview =
    !!props.isUnderReview ||
    props.values.some((value) => value.sentiment === 'UnderReview')

  return (
    <Tooltip>
      <TooltipTrigger className="flex size-full items-center justify-center">
        <PentagonRosetteIcon
          values={props.values}
          className="size-6 md:size-8"
          background={false}
        />
      </TooltipTrigger>
      <TooltipContent fitContent>
        <PentagonRosetteTooltip
          values={props.values}
          isUnderReview={isUnderReview}
        />
      </TooltipContent>
    </Tooltip>
  )
}

function PentagonRosetteTooltip({ values, isUnderReview }: Props) {
  if (isUnderReview) {
    return (
      <div className="w-[300px]">
        <div className="mb-4">
          <span className="text-base font-bold">Risk analysis</span> is{' '}
          <UnderReviewBadge />
        </div>

        <p className="text-wrap">
          Projects under review might present uncompleted information & data.
          <br />
          L2BEAT Team is working to research & validate content before
          publishing.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <span className="text-base font-bold">
        <span className="mr-2">Risk analysis</span>
      </span>
      <div className="flex items-center gap-6">
        <div className="relative flex size-[200px] items-center justify-center">
          <PentagonRosetteIcon
            className="scale-75"
            values={values}
            background={false}
          />
          <PentagonRosetteLabels
            values={values}
            containerSize={200}
            textRadius={70}
            size="small"
          />
        </div>
        <div className="flex flex-col gap-4">
          {values.map((value) => (
            <RiskValueComponent key={value.name} {...value} />
          ))}
        </div>
      </div>
    </div>
  )
}

function RiskValueComponent({ name, value, sentiment, warning }: RosetteValue) {
  return (
    <div className="font-medium">
      <span className="mb-1 block text-[10px] uppercase">{name}</span>
      {sentiment === 'UnderReview' ? (
        <UnderReviewBadge />
      ) : (
        <div className="flex items-center gap-1 text-base">
          <SentimentText sentiment={sentiment}>{value}</SentimentText>
          {warning && (
            <RoundedWarningIcon
              className={cn('size-5', sentimentToFillColor(warning.sentiment))}
            />
          )}
        </div>
      )}
    </div>
  )
}
