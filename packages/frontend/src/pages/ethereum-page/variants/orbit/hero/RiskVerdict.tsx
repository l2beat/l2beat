import type { Sentiment } from '@l2beat/config'
import type { RosetteValue } from '~/components/rosette/types'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { cn } from '~/utils/cn'
import { RISK_ANCHOR } from '../sections/anchors'

/** Our DA assessment's own values, as the risk analysis section shows them */
export function getAssessedValues(
  entry: EthereumProjectPageEntry,
): RosetteValue[] {
  const analysis = entry.sections.find(
    (s) => s.type === 'GrissiniRiskAnalysisSection',
  )
  if (analysis?.type !== 'GrissiniRiskAnalysisSection') return []
  return [
    ...(analysis.props.layerGrissiniValues ?? []),
    ...(analysis.props.bridgeGrissiniValues ?? []),
  ]
}

/**
 * "What you trust", one line high: the assessment's values with their
 * sentiment, linking down to where the reasoning is
 */
export function RiskVerdict({ entry }: { entry: EthereumProjectPageEntry }) {
  const values = getAssessedValues(entry)
  if (values.length === 0) return null
  return (
    <div className="mt-5 flex flex-col gap-3 border-divider border-t pt-4 md:flex-row md:items-center md:gap-6">
      <h2 className="shrink-0 font-bold text-heading-16">What you trust</h2>
      <ul className="flex min-w-0 flex-1 flex-wrap gap-x-6 gap-y-2">
        {values.map((value) => (
          <li
            key={value.name}
            className="flex items-center gap-2 text-label-value-14"
          >
            <SentimentDot sentiment={value.sentiment} />
            <span className="text-secondary">{value.name}</span>
            <span className="font-medium">{value.value}</span>
          </li>
        ))}
        {entry.header.durationStorage > 0 && (
          <li className="flex items-center gap-2 text-label-value-14">
            <SentimentDot sentiment="neutral" />
            <span className="text-secondary">Blobs kept for</span>
            <span className="font-medium">
              {Math.round(entry.header.durationStorage / 86_400)} days
            </span>
          </li>
        )}
      </ul>
      <a
        href={`#${RISK_ANCHOR}`}
        className="shrink-0 font-medium text-label-value-14 text-link underline"
      >
        Read the risk summary
      </a>
    </div>
  )
}

export function SentimentDot({
  sentiment,
  className,
}: {
  sentiment: Sentiment | undefined
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'size-2 shrink-0 rounded-full',
        sentiment === 'good' && 'bg-positive',
        sentiment === 'warning' && 'bg-warning',
        sentiment === 'bad' && 'bg-negative',
        (!sentiment ||
          sentiment === 'neutral' ||
          sentiment === 'UnderReview') &&
          'bg-secondary',
        className,
      )}
    />
  )
}
