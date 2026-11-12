import { useMemo } from 'react'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import type { RosetteValue } from '~/components/rosette/types'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { cn } from '~/utils/cn'
import { sentimentToOpaqueBgColor } from '~/utils/sentiment'
import { findSection } from '../risk'
import { Section } from '../ui/Section'

/**
 * The assessment, last: what a user of Ethereum has to trust. The verdicts
 * and texts are the existing DA sections, rendered as they are elsewhere.
 */
export function Risk({
  order,
  entry,
  verdicts,
}: {
  order: number
  entry: EthereumProjectPageEntry
  verdicts: RosetteValue[]
}) {
  const summary = findSection(entry, 'DaRiskSummarySection')
  const items = useMemo(
    () =>
      entry.sections.filter(
        (s) =>
          s.type === 'DaRiskSummarySection' ||
          s.type === 'GrissiniRiskAnalysisSection' ||
          s.props.id === 'da-layer-technology',
      ),
    [entry.sections],
  )

  return (
    <Section
      id={summary ? 'what-you-trust' : 'risk-summary'}
      order={order}
      title="What you trust"
      lede="Our assessment of Ethereum as a data availability layer: whom its users rely on, and for what. It changes when we review it, not block to block."
    >
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {verdicts.map((v) => (
          <li
            key={v.name}
            className="flex gap-3 rounded-lg bg-surface-secondary/60 p-4"
          >
            <span
              className={cn(
                'w-1 shrink-0 self-stretch rounded-full',
                sentimentToOpaqueBgColor(v.sentiment ?? 'neutral'),
              )}
            />
            <div className="min-w-0">
              <div className="text-label-value-12 text-secondary">{v.name}</div>
              <div className="mt-1 font-bold text-label-value-16">
                {v.value}
              </div>
              {v.secondLine && (
                <div className="mt-1 text-label-value-13 text-secondary">
                  {v.secondLine}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-label-value-13 text-secondary">
        The reasoning behind each verdict is in the risk analysis below, with
        the technology it rests on after it.
      </p>
      <div className="[&_section]:scroll-mt-4">
        <ProjectDetails items={items} nested parentSection={String(order)} />
      </div>
    </Section>
  )
}
