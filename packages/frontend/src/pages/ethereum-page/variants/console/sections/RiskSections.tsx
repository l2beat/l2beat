import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { cn } from '~/utils/cn'
import { ExistingSections } from '../ui/ExistingSections'
import { Instrument, Panel, SectionHead } from '../ui/Panel'
import { sentimentDotClass, type VerdictItem } from '../verdict'

/**
 * What users have to trust, from the published assessment. The summary
 * restates the risk analysis' verdicts; the analysis and the technology
 * sections below are the existing ones, unchanged, so the page cannot drift
 * from the assessment
 */
export function RiskSections({
  entry,
  verdict,
}: {
  entry: EthereumProjectPageEntry
  verdict: { items: VerdictItem[]; isUnderReview: boolean }
}) {
  const existingSummary = entry.sections.filter(
    (s) => s.type === 'DaRiskSummarySection',
  )
  const details = entry.sections.filter(
    (s) =>
      s.type === 'GrissiniRiskAnalysisSection' || s.type === 'MarkdownSection',
  )
  return (
    <>
      <section
        id={existingSummary.length === 0 ? 'risk-summary' : undefined}
        className="scroll-mt-20"
      >
        <SectionHead
          title="What you trust"
          lede="What a system that posts its data to Ethereum has to trust, as our risk analysis below assesses it. It changes only when the evidence does."
        />
        <Instrument>
          <Panel
            title="Risk summary"
            cadence="static"
            accessory={
              verdict.isUnderReview ? (
                <span className="text-[11px] text-warning">Under review</span>
              ) : (
                <a
                  href="#da-layer-risk-analysis"
                  className="text-[11px] text-secondary underline decoration-divider underline-offset-2 hover:text-primary"
                >
                  Full risk analysis
                </a>
              )
            }
          >
            <ul className="grid gap-px bg-divider/50 md:grid-cols-2">
              {verdict.items.map((item) => (
                <li
                  key={item.name}
                  className="flex gap-3 bg-surface-primary px-3 py-3"
                >
                  <span
                    className={cn(
                      'mt-1.5 inline-flex size-2 shrink-0 rounded-full',
                      sentimentDotClass(item.sentiment),
                    )}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[12px] text-secondary">
                        {item.name}
                      </span>
                      <span className="font-semibold text-[15px] text-primary">
                        {item.value}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-1 line-clamp-3 max-w-[70ch] text-paragraph-13 text-secondary">
                        {item.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <p className="border-divider/60 border-t px-3 py-2 text-[11px] text-secondary leading-snug">
              Live values on this page are read at the head of the chain, which
              a reorg can still change. Values finalize about two epochs later;
              the finality panel above shows where that line is.
            </p>
          </Panel>
        </Instrument>
      </section>
      <ExistingSections
        items={[...existingSummary, ...details]}
        className="mt-4"
      />
    </>
  )
}
