import type { Sentiment } from '@l2beat/config'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import { RollingNumber } from '~/pages/blobs/components/live-blobs/liveMotion'
import { cn } from '~/utils/cn'
import { sentimentToOpaqueBgColor } from '~/utils/sentiment'
import type { EthereumHead } from '../../../live/types'
import { Chapter, Para, TYPE, ValueSlot } from '../Article'
import { formatInteger } from '../format'

const RISK_SUMMARY_ID = 'risk-summary'

export interface Assessment {
  values: RosetteValue[]
  /** Risk groups from the risk summary, when the assessment lists any */
  riskGroups: { name: string; count: number }[]
  /**
   * The chapter takes the risk summary's anchor when the assessment has no
   * summary section, so `#risk-summary` links always land somewhere
   */
  chapterId: string
}

/** The verdict is read from the assessment sections, never written here */
export function toAssessment(sections: ProjectDetailsSection[]): Assessment {
  const values: RosetteValue[] = []
  const riskGroups: Assessment['riskGroups'] = []
  let hasSummary = false
  for (const section of sections) {
    if (section.type === 'GrissiniRiskAnalysisSection') {
      values.push(
        ...(section.props.layerGrissiniValues ?? []),
        ...(section.props.bridgeGrissiniValues ?? []),
      )
    }
    if (section.type === 'DaRiskSummarySection') {
      hasSummary = true
      for (const group of [
        ...section.props.layer.risks,
        ...section.props.bridge.risks,
      ]) {
        riskGroups.push({ name: group.name, count: group.items.length })
      }
    }
  }
  return {
    values,
    riskGroups,
    chapterId: hasSummary ? 'trust' : RISK_SUMMARY_ID,
  }
}

/**
 * The short verdict near the top: our ratings as pills, each with the first
 * sentence of its own reasoning, and what is left to trust once they're
 * accounted for. It links down to the full assessment.
 */
export function Verdict({
  assessment,
  head,
}: {
  assessment: Assessment
  head: EthereumHead
}) {
  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,37rem)_15rem] lg:gap-x-14">
      <div>
        <h2 className="font-semibold text-[19px] tracking-[-0.01em] md:text-[21px]">
          What you're trusting when you use Ethereum
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {assessment.values.map((v) => (
            <Pill key={v.name} value={v} href="#da-layer-risk-analysis" />
          ))}
          {assessment.riskGroups.map((g) => (
            <a
              key={g.name}
              href={`#${RISK_SUMMARY_ID}`}
              className="rounded-full border border-divider px-3 py-1 text-[13px] hover:bg-surface-secondary"
            >
              {g.name}… ({g.count})
            </a>
          ))}
        </div>
        <p className={cn(TYPE.body, 'mt-4')}>
          {assessment.values.map((v) => firstSentence(v.description)).join(' ')}{' '}
          What remains is Ethereum's own consensus:{' '}
          <span className="font-semibold">
            {head.activeValidators !== undefined ? (
              <RollingNumber
                value={head.activeValidators}
                format={formatInteger}
              />
            ) : (
              <ValueSlot chars={9} />
            )}{' '}
            validators
          </span>{' '}
          staking{' '}
          <span className="font-semibold">
            {head.stakedEth !== undefined ? (
              <RollingNumber value={head.stakedEth} format={formatInteger} />
            ) : (
              <ValueSlot chars={10} />
            )}{' '}
            ETH
          </span>
          , and the client software they run.{' '}
          <a
            href={`#${RISK_SUMMARY_ID}`}
            className="font-medium text-link hover:underline"
          >
            Read our assessment
          </a>
        </p>
      </div>
    </div>
  )
}

/** Chapter 5 opens the assessment the verdict summarised; its sections follow as their own cards */
export function TrustChapter({ assessment }: { assessment: Assessment }) {
  return (
    <Chapter
      id={assessment.chapterId}
      order={5}
      claim={ratingsClaim(assessment.values)}
      standfirst="Our assessment of Ethereum as the data layer the systems above rely on: how it is built, what can go wrong, and the evidence for each rating."
    >
      <div className="flex flex-wrap gap-2">
        {assessment.values.map((v) => (
          <Pill key={v.name} value={v} href="#da-layer-risk-analysis" large />
        ))}
      </div>
      <Para className="mt-6">
        Each rating below links to its reasoning and sources. The sections that
        follow are the same ones on every project we assess, so Ethereum can be
        compared with any other data layer.
      </Para>
    </Chapter>
  )
}

function Pill({
  value,
  href,
  large,
}: {
  value: RosetteValue
  href: string
  large?: boolean
}) {
  return (
    <a
      href={href}
      title={value.description}
      className={cn(
        'flex items-center gap-2 rounded-full border border-divider bg-surface-primary text-[13px] hover:bg-surface-secondary',
        large ? 'py-1.5 pr-4 pl-3 text-[15px]' : 'py-1 pr-3 pl-2.5',
      )}
    >
      <SentimentDot sentiment={value.sentiment} />
      <span className="text-secondary">{value.name}</span>
      <span className="font-semibold">{value.value}</span>
    </a>
  )
}

function SentimentDot({ sentiment }: { sentiment: Sentiment | undefined }) {
  return (
    <span
      aria-hidden
      className={cn(
        'size-2 rounded-full',
        sentimentToOpaqueBgColor(sentiment ?? 'neutral'),
      )}
    />
  )
}

/** "We rate its DA layer Self-verify and its DA bridge Enshrined", from the ratings themselves */
function ratingsClaim(values: RosetteValue[]) {
  if (values.length === 0) return 'Our assessment of Ethereum'
  const parts = values.map(
    (v, i) =>
      `${i === 0 ? "Ethereum's" : 'its'} ${v.name.replace(/ (\w)/g, (m) => m.toLowerCase())} “${v.value}”`,
  )
  const last = parts.pop()
  return `We rate ${parts.length > 0 ? `${parts.join(', ')} and ${last}` : last}`
}

function firstSentence(text: string | undefined) {
  if (!text) return ''
  const clean = text.replace(/\s+/g, ' ').trim()
  const end = clean.search(/\.\s/)
  return end === -1 ? clean : clean.slice(0, end + 1)
}
