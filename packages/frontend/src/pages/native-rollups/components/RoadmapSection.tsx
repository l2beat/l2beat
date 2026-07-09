import { Callout } from '~/components/Callout'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CheckIcon } from '~/icons/Check'
import { ClockIcon } from '~/icons/Clock'
import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'
import { ROADMAP } from '../consts'
import { SectionHeading } from './WhyNativeSection'

export function RoadmapSection() {
  // The first planned milestone is the "frontier" we animate as up next.
  const firstPlannedIndex = ROADMAP.findIndex((r) => r.status === 'planned')

  return (
    <section className="mt-8 md:mt-12">
      <SectionHeading
        eyebrow="Roadmap"
        title="From research to a working spec"
        description="Native rollups have moved from concept to a formal EIP and a working proof-of-concept. Upcoming grant milestones are shown with their target dates."
      />
      <PrimaryCard className="md:p-8">
        <ol className="relative ml-3">
          {ROADMAP.map((item, i) => {
            const isLast = i === ROADMAP.length - 1
            const isDone = item.status === 'done'
            const isNextUp = i === firstPlannedIndex
            // The connector drawn by this item leads into the next one; if the
            // next one is the frontier, make it "flow".
            const flowsIntoNextUp = i + 1 === firstPlannedIndex
            return (
              <li key={item.title} className="relative pb-8 pl-9 last:pb-0">
                {/* Connector line */}
                {!isLast &&
                  (flowsIntoNextUp ? (
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
                    isNextUp &&
                      'bg-linear-to-br from-purple-100 to-pink-100 text-white',
                    !isDone &&
                      !isNextUp &&
                      'border-2 border-purple-100/60 border-dashed bg-surface-primary text-purple-100 dark:border-pink-200/60 dark:text-pink-200',
                  )}
                >
                  {isNextUp && (
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-purple-100/60 motion-reduce:hidden dark:bg-pink-200/60" />
                  )}
                  {isDone ? (
                    <CheckIcon className="relative size-3.5 fill-current" />
                  ) : (
                    <ClockIcon className="relative size-3.5 fill-current" />
                  )}
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-medium text-2xs text-secondary uppercase tracking-[0.14px]">
                    {item.date}
                  </span>
                  {isNextUp ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-purple-100 to-pink-100 px-2 py-0.5 font-semibold text-2xs text-white uppercase">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-white motion-reduce:hidden" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                      </span>
                      Up next
                    </span>
                  ) : (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 font-semibold text-2xs uppercase',
                        isDone
                          ? 'bg-positive/15 text-positive'
                          : 'bg-purple-100/10 text-purple-100 dark:text-pink-200',
                      )}
                    >
                      {isDone ? 'Done' : 'Planned'}
                    </span>
                  )}
                </div>
                <h3
                  className={cn(
                    'mt-1 font-bold text-label-value-16 md:text-label-value-18',
                    isNextUp &&
                      'bg-linear-to-r from-purple-100 to-pink-100 bg-clip-text text-transparent',
                  )}
                >
                  {item.title}
                </h3>
                <p className="mt-1.5 text-paragraph-15 text-secondary md:text-paragraph-16">
                  {item.description}
                </p>
              </li>
            )
          })}
        </ol>
        <Callout
          className="mt-6"
          color="blue"
          icon={<InfoIcon className="size-5 fill-blue-700" />}
          body={
            <span className="text-paragraph-15">
              Native rollups are{' '}
              <strong>not part of any scheduled Ethereum hard fork</strong>.
              Glamsterdam&apos;s headliners are ePBS (EIP-7732) and Block-Level
              Access Lists (EIP-7928); inclusion of the EXECUTE precompile is
              targeted for a later fork.
            </span>
          }
        />
      </PrimaryCard>
    </section>
  )
}
