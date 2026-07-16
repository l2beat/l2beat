import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { InfoIcon } from '~/icons/Info'
import { CustomLinkIcon } from '~/icons/Outlink'
import { cn } from '~/utils/cn'
import { ROADMAP_YEARS, type RoadmapItem } from '../roadmap'
import { SectionHeading } from './SectionHeading'

const STATUS: Record<
  RoadmapItem['status'],
  { label: string; dot: string; text: string }
> = {
  done: { label: 'Done', dot: 'bg-positive', text: 'text-positive' },
  inProgress: {
    label: 'In progress',
    dot: 'bg-(--accent)',
    text: 'text-(--accent)',
  },
  planned: {
    label: 'Planned',
    dot: 'border border-secondary bg-surface-primary',
    text: 'text-secondary',
  },
}

export function RoadmapSection() {
  return (
    <section id="roadmap" className="mt-8 md:mt-12">
      <SectionHeading
        title="From re-execution to native proof verification"
        description="The research has moved from the original EXECUTE proposal to a program-agnostic proof architecture. Future dates are targets, not Ethereum fork commitments."
      />
      <PrimaryCard className="overflow-hidden p-0 md:p-0">
        {ROADMAP_YEARS.map((group, groupIndex) => {
          const isCurrentYear = group.items.some(
            (item) => item.status === 'inProgress',
          )
          return (
            <div
              key={group.year}
              className={cn(
                'grid md:grid-cols-[140px_1fr] lg:grid-cols-[180px_1fr]',
                groupIndex < ROADMAP_YEARS.length - 1 &&
                  'border-divider border-b',
              )}
            >
              <div className="p-5 pb-0 md:border-divider md:border-r md:p-6 md:pb-6">
                <span
                  className={cn(
                    'font-bold text-heading-32 leading-none md:text-heading-40 lg:text-[56px]',
                    isCurrentYear ? 'text-(--accent)' : 'text-secondary/25',
                  )}
                >
                  {group.year}
                </span>
              </div>
              <ol className="relative m-5 ml-8 md:m-6 md:ml-9">
                {group.items.map((item, i) => {
                  const connector = connectorClassName(item, group.items[i + 1])
                  return (
                    <li
                      key={`${item.date}-${item.title}`}
                      className="relative pb-8 pl-9 last:pb-0"
                    >
                      {connector && (
                        <span
                          className={cn(
                            'absolute top-6 left-[11px] h-[calc(100%-24px)]',
                            connector,
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          'absolute top-2 left-2 size-2 rounded-full ring-4 ring-surface-primary',
                          STATUS[item.status].dot,
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
                            STATUS[item.status].text,
                          )}
                        >
                          {STATUS[item.status].label}
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
                          className="mt-2 inline-flex items-center gap-1 rounded-sm font-medium text-label-value-15 text-link outline-none ring-brand transition-colors hover:text-(--accent) focus-visible:ring-2"
                        >
                          Learn more
                          <CustomLinkIcon className="size-3.5 fill-current" />
                        </a>
                      )}
                    </li>
                  )
                })}
              </ol>
            </div>
          )
        })}
        <div className="border-divider border-t p-5 md:p-6">
          <div className="flex items-start gap-2.5 rounded-lg bg-surface-info p-3.5 md:p-4">
            <InfoIcon className="mt-px size-5 shrink-0 fill-link" />
            <p className="text-paragraph-15 leading-relaxed">
              Native rollups are{' '}
              <strong>not part of any scheduled Ethereum hard fork</strong>.
              EIP-8079 remains a draft, the EIP-8025 feature is experimental,
              and proof-carrying transactions are still a research proposal.
            </p>
          </div>
        </div>
      </PrimaryCard>
    </section>
  )
}

/** Line connecting an item's dot to the next item, if any. */
function connectorClassName(item: RoadmapItem, next: RoadmapItem | undefined) {
  if (!next) {
    return undefined
  }
  if (next.status === 'inProgress') {
    return 'border-(--accent) border-l border-dashed'
  }
  return cn('w-px', item.status === 'done' ? 'bg-positive' : 'bg-divider')
}
