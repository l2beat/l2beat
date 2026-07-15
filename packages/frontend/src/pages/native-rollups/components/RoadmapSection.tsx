import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CheckIcon } from '~/icons/Check'
import { ClockIcon } from '~/icons/Clock'
import { InfoIcon } from '~/icons/Info'
import { CustomLinkIcon } from '~/icons/Outlink'
import { cn } from '~/utils/cn'
import { ROADMAP } from '../consts'
import { SectionHeading } from './SectionHeading'

export function RoadmapSection() {
  return (
    <section id="roadmap" className="mt-8 md:mt-12">
      <SectionHeading
        title="From re-execution to native proof verification"
        description="The research has moved from the original EXECUTE proposal to a program-agnostic proof architecture. Future dates are targets, not Ethereum fork commitments."
      />
      <PrimaryCard className="md:p-8">
        <ol className="relative ml-3">
          {ROADMAP.map((item, i) => {
            const isLast = i === ROADMAP.length - 1
            const isDone = item.status === 'done'
            const isCurrent = item.status === 'inProgress'
            const isResearch = item.status === 'research'
            return (
              <li key={item.title} className="relative pb-8 pl-9 last:pb-0">
                {!isLast && (
                  <span className="absolute top-6 left-[11px] h-full w-px bg-divider" />
                )}
                <span
                  className={cn(
                    'absolute top-0.5 left-0 flex size-6 items-center justify-center rounded-full',
                    isDone || isCurrent
                      ? 'bg-purple-100 text-white'
                      : 'border-2 border-purple-100/60 border-dashed bg-surface-primary text-purple-100 dark:border-pink-200/60 dark:text-pink-200',
                  )}
                >
                  {isDone ? (
                    <CheckIcon className="size-3.5" />
                  ) : (
                    <ClockIcon className="size-3.5 fill-current" />
                  )}
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-medium text-2xs text-secondary">
                    {item.date}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 font-semibold text-2xs uppercase',
                      isDone && 'bg-positive/15 text-positive',
                      isCurrent && 'bg-purple-100 text-white',
                      isResearch &&
                        'bg-purple-100/10 text-purple-100 dark:text-pink-200',
                      item.status === 'planned' &&
                        'bg-surface-secondary text-secondary',
                    )}
                  >
                    {isDone
                      ? 'Done'
                      : isCurrent
                        ? 'In progress'
                        : isResearch
                          ? 'Research'
                          : 'Planned'}
                  </span>
                </div>
                <h3 className="mt-1 font-bold text-label-value-16 md:text-label-value-18">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-paragraph-15 text-secondary md:text-paragraph-16">
                  {item.description}
                </p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-2 inline-flex items-center gap-1 font-medium text-label-value-15 text-link transition-colors hover:text-purple-100 dark:hover:text-pink-200"
                  >
                    Learn more
                    <CustomLinkIcon className="size-3.5 fill-current" />
                  </a>
                )}
              </li>
            )
          })}
        </ol>
        <div className="mt-6 flex items-start gap-2.5 rounded-lg bg-surface-info p-3.5 md:p-4">
          <InfoIcon className="mt-px size-5 shrink-0 fill-link" />
          <p className="text-paragraph-15 leading-relaxed">
            Native rollups are{' '}
            <strong>not part of any scheduled Ethereum hard fork</strong>.
            EIP-8079 remains a draft, the EIP-8025 feature is experimental, and
            proof-carrying transactions are still a research proposal.
          </p>
        </div>
      </PrimaryCard>
    </section>
  )
}
