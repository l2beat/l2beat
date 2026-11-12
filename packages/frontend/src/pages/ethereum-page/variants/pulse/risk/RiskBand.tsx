import type { RosetteValue } from '~/components/rosette/types'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { cn } from '~/utils/cn'
import { sentimentToOpaqueBgColor } from '~/utils/sentiment'
import { ExistingSections } from '../ExistingSections'
import { formatCompact, formatInteger } from '../format'
import { Band, BigNumber, Stat } from '../ui/Band'
import { CadenceTag, Explain } from '../ui/Explain'
import { findSection, plainReading, type Verdict } from './verdict'

const DAY = 86_400

/**
 * Our assessment last, as the story's conclusion: the verdict again, each
 * value it rests on with its reasoning, then the full analysis and the
 * technology write-up as the project page has them.
 */
export function RiskBand({
  entry,
  verdict,
}: {
  entry: EthereumProjectPageEntry
  verdict: Verdict
}) {
  const summary = findSection(entry.sections, 'DaRiskSummarySection')
  const analysis = findSection(entry.sections, 'GrissiniRiskAnalysisSection')
  const technology = entry.sections.find(
    (s) => s.props.id === 'da-layer-technology',
  )
  const { economicSecurity, numberOfValidators, durationStorage } = entry.header

  return (
    <>
      <Band
        id={summary ? 'what-you-trust' : 'risk-summary'}
        title="What you have to trust"
        lead={verdict.sentence}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {verdict.values.map((value) => (
            <ValueCard key={value.name} value={value} />
          ))}
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-8">
          {economicSecurity !== undefined && (
            <Stat
              label={
                <Explain explainer="What it would cost to attack Ethereum's consensus: the value of the stake an attacker would need, which they would lose to slashing.">
                  Economic security
                </Explain>
              }
              cadence={<CadenceTag cadence="daily" />}
              className="col-span-2 md:col-span-1"
            >
              <BigNumber value={`$${formatCompact(economicSecurity)}`} />
            </Stat>
          )}
          {numberOfValidators !== undefined && (
            <Stat
              label="Validators checking it"
              cadence={<CadenceTag cadence="daily" />}
            >
              <BigNumber value={formatInteger(numberOfValidators)} />
            </Stat>
          )}
          {durationStorage > 0 && (
            <Stat
              label={
                <Explain explainer="Nodes keep blob data this long, then may delete it. Rollups and anyone who needs it later must store their own copy before then.">
                  Blobs are kept for
                </Explain>
              }
            >
              <BigNumber
                value={formatInteger(durationStorage / DAY)}
                unit="days"
              />
            </Stat>
          )}
        </div>
      </Band>
      <ExistingSections
        items={[summary, analysis, technology].filter((s) => s !== undefined)}
      />
    </>
  )
}

function ValueCard({ value }: { value: RosetteValue }) {
  const sentiment = value.sentiment ?? 'neutral'
  return (
    <div className="rounded-2xl border border-divider p-5 md:p-6">
      <div className="flex items-center gap-2 text-label-value-14 text-secondary">
        <span
          className={cn(
            'size-2.5 rounded-full',
            sentimentToOpaqueBgColor(sentiment),
          )}
        />
        {value.name}
      </div>
      <div className="mt-3 font-light text-[32px] text-primary leading-none tracking-[-0.02em] md:text-[40px]">
        {value.value}
      </div>
      <p className="mt-4 text-paragraph-16 text-secondary">
        {capitalize(plainReading(value))}.{' '}
        <a
          href="#da-layer-risk-analysis"
          className="text-link underline decoration-link-stroke underline-offset-4 hover:decoration-link"
        >
          Why we say so
        </a>
      </p>
    </div>
  )
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
