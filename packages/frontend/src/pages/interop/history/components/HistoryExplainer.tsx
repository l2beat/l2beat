import type { Milestone } from '@l2beat/config'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { formatDate } from '~/utils/dates'

const PR = (n: number) => `https://github.com/l2beat/l2beat/pull/${n}`
const KNOWN_EVENTS_URL = '/interop/history#known-events'

/**
 * Changes in how the aggregates were made, which a chart would otherwise
 * show as market moves. Stored aggregates are never recomputed, so each one
 * stays in the history.
 */
export const HISTORY_KNOWN_EVENTS: Milestone[] = [
  {
    type: 'general',
    date: '2026-03-19T00:00:00Z',
    title: 'Transfer times recorded',
    description:
      'Before this day no transfer has a duration, so transfer times start here.',
    url: KNOWN_EVENTS_URL,
  },
  {
    type: 'general',
    date: '2026-05-09T00:00:00Z',
    title: 'Hyperliquid and Lighter added',
    description:
      'Part of the growth in May is these two protocols starting to be counted.',
    url: KNOWN_EVENTS_URL,
  },
  {
    type: 'incident',
    date: '2026-05-23T00:00:00Z',
    title: 'Base deposit times drop',
    description:
      'Base deposits go from about 180s to 55s with no market cause, and back to 178s by 4 Sep.',
    url: KNOWN_EVENTS_URL,
  },
  {
    type: 'incident',
    date: '2026-09-20T00:00:00Z',
    title: 'Relay outage',
    description:
      'No Relay transfers on 20–22 Sep. The days are stored, with no rows, so they read as quiet days.',
    url: KNOWN_EVENTS_URL,
  },
  {
    type: 'incident',
    date: '2026-10-09T00:00:00Z',
    title: 'Relay counts fall 98%',
    description:
      'From about 400k to 9k transfers a day, on every lane at once. Not explained yet.',
    url: KNOWN_EVENTS_URL,
  },
  {
    type: 'general',
    date: '2026-11-02T00:00:00Z',
    title: 'Hyperliquid: Arbitrum lanes only',
    description:
      'The hyperevm to HyperCore lane, most of the transfers, is no longer counted.',
    url: PR(13676),
  },
]

export function HistoryIntro() {
  return (
    <PrimaryCard className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-heading-20">
          What the stored aggregates can show
        </h2>
        <span className="rounded-full bg-brand/15 px-2 py-0.5 font-bold text-brand text-label-value-12 uppercase">
          Prototype
        </span>
      </div>
      <p className="max-w-[820px] font-medium text-label-value-15 text-secondary">
        Every hour the backend stores a snapshot of the last 24 hours of
        transfers. After 14 days only each day's first snapshot is kept, and the
        transfers behind it are deleted after 7 days. So this history cannot be
        recomputed: price bugs, removed tokens and plugin changes stay in it.
        Everything is shown, and what looks wrong is marked; exclude a kind on
        the right to leave it out.
      </p>
      <ul className="grid gap-2 text-label-value-14 md:grid-cols-2 xl:grid-cols-4">
        <li>
          <span className="font-bold">Hatched</span>: no snapshot for the point.
          The line breaks there; it is not a zero.
        </li>
        <li>
          <span className="font-bold text-negative">Red dot</span>: a lane over
          $1B in a day.
        </li>
        <li>
          <span className="font-bold text-warning-text">Yellow dot</span>: an
          unusual token day.
        </li>
        <li>
          <span className="font-bold text-secondary">Grey dot</span>: a usually
          active protocol had no transfers.
        </li>
      </ul>
    </PrimaryCard>
  )
}

export function HistoryMethodology() {
  return (
    <PrimaryCard className="flex flex-col gap-4" id="known-events">
      <h2 className="font-bold text-heading-20">How to read it</h2>
      <div className="grid gap-5 text-label-value-14 lg:grid-cols-2">
        <section className="flex flex-col gap-2">
          <h3 className="font-bold text-heading-16">The numbers</h3>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-secondary">
            <li>
              Volume is the token volume the rest of the interop pages sum, for
              lanes from the From chains to the To chains. Same-chain lanes are
              left out.
            </li>
            <li>
              Inflow is volume arriving at a chain, outflow is volume leaving
              it. With every chain selected, each chain's flows cover all its
              routes.
            </li>
            <li>
              A transfer time is an average over timed transfers. To read one
              direction, such as canonical-bridge deposits, select Ethereum as
              From and the L2 as To. A mix of fast and slow routes swings with
              the day's mix.
            </li>
            <li>
              A protocol id no project uses any more is marked as retired.
              Renames show as one series stopping and another starting, e.g.
              across-v3 to across or usdt0 to layerzero.
            </li>
          </ul>
        </section>
        <section className="flex flex-col gap-2">
          <h3 className="font-bold text-heading-16">Known events</h3>
          <ul className="flex flex-col gap-2">
            {HISTORY_KNOWN_EVENTS.map((event) => (
              <li key={event.date + event.title}>
                <span className="font-bold">
                  {formatDate(event.date.slice(0, 10))}
                </span>{' '}
                {event.title}.{' '}
                <span className="text-secondary">{event.description}</span>
              </li>
            ))}
            <li>
              <span className="font-bold">Before 22 Jun 2026</span> no snapshot
              was checked by the promotion rules; all were marked promoted when
              the rules were added.
            </li>
            <li>
              <span className="font-bold">Solana</span> shows about −$14B net
              over the year, mostly CCTP v2 ($14.6B out, $3.2B in). One
              direction is likely under-captured, so treat its net flow with
              care.
            </li>
          </ul>
        </section>
      </div>
    </PrimaryCard>
  )
}
