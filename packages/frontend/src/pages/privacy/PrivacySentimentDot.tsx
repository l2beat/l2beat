import {
  TrustedSetupRiskDot,
  type TrustedSetupRiskDotSize,
} from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import { cn } from '~/utils/cn'
import { sentimentToRiskDot } from './sentimentToRiskDot'

/** A risk dot coloured by a privacy sentiment. */
export function PrivacySentimentDot({
  sentiment,
  size = 'sm',
  className,
}: {
  sentiment: Parameters<typeof sentimentToRiskDot>[0]
  size?: TrustedSetupRiskDotSize
  className?: string
}) {
  return (
    <TrustedSetupRiskDot
      risk={sentimentToRiskDot(sentiment)}
      size={size}
      className={cn('shrink-0', className)}
    />
  )
}
