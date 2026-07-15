import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { CustomLinkIcon } from '~/icons/Outlink'
import { cn } from '~/utils/cn'
import { ROADMAP, type RoadmapItem } from '../consts'
import { SectionHeading } from './SectionHeading'

const STATUS_LABEL: Record<RoadmapItem['status'], string> = {
  done: 'Done',
  inProgress: 'In progress',
  research: 'Research',
  planned: 'Planned',
}

export function RoadmapSection() {
  const currentIndex = ROADMAP.findIndex((r) => r.status === 'inProgress')

  return (
    <section id="roadmap" className="mt-8 md:mt-12">
      <SectionHeading
        title="From re-execution to native proof verification"
        description="The research has moved from the original EXECUTE proposal to a program-agnostic proof architecture. Native rollups are not part of any scheduled Ethereum hard fork — future dates are research targets, not fork commitments."
      />
      <PrimaryCard className="md:p-8">
        <ol className="relative ml-3">
          {ROADMAP.map((item, i) => {
            const isLast = i === ROADMAP.length - 1
            const isDone = item.status === 'done'
            const isCurrent = item.status === 'inProgress'
            const flowsIntoCurrent = i + 1 === currentIndex
            return (
              <li
                key={`${item.date}-${item.title}`}
                className="relative pb-8 pl-9 last:pb-0"
              >
                {!isLast &&
                  (flowsIntoCurrent ? (
                    <span className="absolute top-6 left-[11px] h-[calc(100%-24px)] w-px animate-roadmap-line-flow bg-[length:1px_12px] bg-[repeating-linear-gradient(to_bottom,var(--color-purple-100)_0,var(--color-purple-100)_6px,transparent_6px,transparent_12px)] motion-reduce:animate-none dark:bg-[repeating-linear-gradient(to_bottom,var(--color-pink-200)_0,var(--color-pink-200)_6px,transparent_6px,transparent_12px)]" />
                  ) : (
                    <span
                      className={cn(
                        'absolute top-6 left-[11px] h-[calc(100%-24px)] w-px',
                        isDone ? 'bg-positive' : 'bg-divider',
                      )}
                    />
                  ))}
                <span
                  className={cn(
                    'absolute top-2 left-2 size-2 rounded-full ring-4 ring-surface-primary',
                    isDone && 'bg-positive',
                    isCurrent && 'bg-purple-100 dark:bg-pink-200',
                    !isDone &&
                      !isCurrent &&
                      'border border-secondary bg-surface-primary',
                  )}
                />
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-medium text-label-value-14 text-secondary">
                    {item.date}
                  </span>
                  <span
                    aria-hidden
                    className="text-label-value-14 text-secondary"
                  >
                    ·
                  </span>
                  <span
                    className={cn(
                      'font-semibold text-label-value-14',
                      isDone && 'text-positive',
                      isCurrent && 'text-purple-100 dark:text-pink-200',
                      !isDone && !isCurrent && 'text-secondary',
                    )}
                  >
                    {STATUS_LABEL[item.status]}
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
                    className="mt-2 inline-flex items-center gap-1 rounded-sm font-medium text-label-value-15 text-link outline-none ring-brand transition-colors hover:text-purple-100 focus-visible:ring-2 dark:hover:text-pink-200"
                  >
                    Learn more
                    <CustomLinkIcon className="size-3.5 fill-current" />
                  </a>
                )}
              </li>
            )
          })}
        </ol>
      </PrimaryCard>
    </section>
  )
}
