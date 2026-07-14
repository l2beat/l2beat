import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { ClockIcon } from '~/icons/Clock'
import { InfoIcon } from '~/icons/Info'
import { CustomLinkIcon } from '~/icons/Outlink'
import { cn } from '~/utils/cn'
import { ROADMAP } from '../consts'
import { SectionHeading } from './WhyNativeSection'

export function RoadmapSection() {
  const currentIndex = ROADMAP.findIndex((r) => r.status === 'inProgress')

  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading
        eyebrow="Roadmap"
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
            const flowsIntoCurrent = i + 1 === currentIndex
            return (
              <li key={item.title} className="relative pb-8 pl-9 last:pb-0">
                {/* Connector line */}
                {!isLast &&
                  (flowsIntoCurrent ? (
                    <span className="absolute top-6 left-[11px] h-full w-0.5 animate-roadmap-line-flow bg-[length:2px_12px] bg-[repeating-linear-gradient(to_bottom,var(--color-purple-100)_0,var(--color-purple-100)_6px,transparent_6px,transparent_12px)] motion-reduce:animate-none dark:bg-[repeating-linear-gradient(to_bottom,var(--color-pink-200)_0,var(--color-pink-200)_6px,transparent_6px,transparent_12px)]" />
                  ) : (
                    <span
                      className={cn(
                        'absolute top-6 left-[11px] h-full w-px',
                        isDone
                          ? 'bg-linear-to-b from-purple-100 to-pink-100'
                          : 'bg-divider',
                      )}
                    />
                  ))}
                {/* Node */}
                <span
                  className={cn(
                    'absolute top-0.5 left-0 flex size-6 items-center justify-center rounded-full',
                    isDone &&
                      'bg-linear-to-br from-purple-100 to-pink-100 text-white',
                    isCurrent &&
                      'bg-linear-to-br from-purple-100 to-pink-100 text-white',
                    !isDone &&
                      !isCurrent &&
                      'border-2 border-purple-100/60 border-dashed bg-surface-primary text-purple-100 dark:border-pink-200/60 dark:text-pink-200',
                  )}
                >
                  {isCurrent && (
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-purple-100/60 motion-reduce:hidden dark:bg-pink-200/60" />
                  )}
                  {isDone ? (
                    <ArrowRightIcon className="relative size-3 fill-current" />
                  ) : (
                    <ClockIcon className="relative size-3.5 fill-current" />
                  )}
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-medium text-2xs text-secondary uppercase tracking-[0.14px]">
                    {item.date}
                  </span>
                  {isCurrent ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-purple-100 to-pink-100 px-2 py-0.5 font-semibold text-2xs text-white uppercase">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-white motion-reduce:hidden" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                      </span>
                      In progress
                    </span>
                  ) : (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 font-semibold text-2xs uppercase',
                        isDone && 'bg-positive/15 text-positive',
                        isResearch &&
                          'bg-purple-100/10 text-purple-100 dark:text-pink-200',
                        item.status === 'planned' &&
                          'bg-surface-secondary text-secondary',
                      )}
                    >
                      {isDone ? 'Done' : isResearch ? 'Research' : 'Planned'}
                    </span>
                  )}
                </div>
                <h3
                  className={cn(
                    'mt-1 font-bold text-label-value-16 md:text-label-value-18',
                    isCurrent &&
                      'bg-linear-to-r from-purple-100 to-pink-100 bg-clip-text text-transparent',
                  )}
                >
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
        {/* Disclaimer */}
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
