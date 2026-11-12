import { ProjectDetails } from '~/components/projects/ProjectDetails'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import type { EthereumHead } from '../../../live/types'
import { formatDuration } from '../format'
import { getAssessedValues, SentimentDot } from '../hero/RiskVerdict'
import { SLOT_SECONDS } from '../model'
import { RISK_ANCHOR } from './anchors'
import { SectionShell } from './SectionShell'

const ORDER = 5
const RISK_SECTION_TYPES: ProjectDetailsSection['type'][] = [
  'DaRiskSummarySection',
  'GrissiniRiskAnalysisSection',
  'MarkdownSection',
]

/**
 * What every system in orbit inherits: our assessment's values up front,
 * then the existing risk and technology sections, unchanged, with the
 * reasoning and sources
 */
export function RiskSection({
  entry,
  live,
}: {
  entry: EthereumProjectPageEntry
  live: EthereumHead
}) {
  const items = entry.sections.filter((s) =>
    RISK_SECTION_TYPES.includes(s.type),
  )
  // the summary anchor must exist even when the assessment lists no risks
  const hasRiskSummary = items.some((s) => s.props.id === RISK_ANCHOR)
  const values = getAssessedValues(entry)
  const behind =
    live.head && live.finalizedSlot !== undefined
      ? live.head.slot - live.finalizedSlot
      : undefined
  const storageDays = Math.round(entry.header.durationStorage / 86_400)

  return (
    <>
      <SectionShell
        id={hasRiskSummary ? 'inherited-risk' : RISK_ANCHOR}
        order={ORDER}
        title="What all of them inherit"
        lede="A system that posts its data to Ethereum is only as available, final and censorship resistant as Ethereum is. Our assessment of what that means, with the reasoning and sources below."
      >
        <dl className="grid gap-x-8 gap-y-6 md:grid-cols-2">
          {values.map((value) => (
            <Fact
              key={value.name}
              name={value.name}
              value={value.value}
              sentiment={value.sentiment}
              text={firstSentence(value.description)}
            />
          ))}
          <Fact
            name="Finality"
            value={
              behind !== undefined
                ? `${formatDuration(behind * SLOT_SECONDS)} behind the head`
                : 'About two epochs'
            }
            text="Everything above the finalized slot can still be reorged. Numbers on this page follow the head, so they can rewind."
            cadence="per epoch"
          />
          {storageDays > 0 && (
            <Fact
              name="Blob retention"
              value={`${storageDays} days`}
              text="Nodes prune blobs after this window. Anyone who needs the data later has to have kept it."
            />
          )}
        </dl>
      </SectionShell>
      <ProjectDetails items={items} parentSection={String(ORDER)} />
    </>
  )
}

function Fact({
  name,
  value,
  sentiment,
  text,
  cadence,
}: {
  name: string
  value: string
  sentiment?: Parameters<typeof SentimentDot>[0]['sentiment']
  text: string | undefined
  cadence?: string
}) {
  return (
    <div className="min-w-0 border-divider border-l-2 pl-4">
      <dt className="flex items-center gap-2 text-label-value-13 text-secondary">
        <SentimentDot sentiment={sentiment} />
        {name}
        {cadence && (
          <span className="ml-auto text-[11px] opacity-70">{cadence}</span>
        )}
      </dt>
      <dd>
        <div className="mt-2 font-bold text-heading-20">{value}</div>
        {text && (
          <p className="mt-1.5 text-paragraph-14 text-secondary">{text}</p>
        )}
      </dd>
    </div>
  )
}

function firstSentence(text: string | undefined) {
  if (!text) return undefined
  const clean = text.replace(/\s+/g, ' ').trim()
  const end = clean.search(/\.\s/)
  return end === -1 ? clean : clean.slice(0, end + 1)
}
