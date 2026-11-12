import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/core/Dialog'
import { InfoIcon } from '~/icons/Info'

/**
 * The rule as the server runs it (getGasFeesTips), and its replayed record
 * from METHODOLOGY.md: the worst 26 weeks in a row and the worst week
 */
const TIERS = [
  {
    name: 'Slow',
    lands: 'Within 1 minute',
    price: '10th percentile tip',
    beats: '45.2% of the last 300 blocks',
    worstHalfYear: '96.0%',
    worstWeek: '92.1%',
  },
  {
    name: 'Medium',
    lands: 'Within 2 blocks',
    price: '25th percentile tip',
    beats: '85% of the last 300 blocks',
    worstHalfYear: '96.6%',
    worstWeek: '90.7%',
  },
  {
    name: 'Fast',
    lands: 'In the next block',
    price: '25th percentile tip',
    beats: '99% of the last 1,800 blocks',
    worstHalfYear: '95.3%',
    worstWeek: '92.3%',
  },
]

/**
 * The estimator's methodology, kept out of the way behind a quiet link beside
 * the estimate's column heading
 */
export function GasFeesMethodology() {
  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-1 whitespace-nowrap rounded font-medium text-secondary text-xs underline decoration-dotted underline-offset-2 hover:text-primary">
        <InfoIcon className="size-3 fill-current" />
        How we estimate
      </DialogTrigger>
      <DialogContent className="primary-card flex max-h-[90dvh] w-[640px] flex-col gap-0 overflow-hidden bg-surface-primary p-0">
        <DialogClose className="top-5 right-5" />
        <DialogHeader className="border-divider border-b px-6 py-5">
          <DialogTitle className="font-bold text-xl">
            How our estimator works
          </DialogTitle>
          <DialogDescription className="text-secondary text-xs">
            Ethereum L1 only. Replayed against Flashbots mempool data, Aug 2023
            to Nov 2026.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto px-6 py-6">
          <MethodologyBody />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MethodologyBody() {
  return (
    <div className="flex flex-col gap-8 text-sm leading-relaxed">
      <Section title="The promise">
        <p>
          Three tips for three speeds. Of the transactions that pay a tip, 95%
          land in time over any 6 months, and never fewer than 90% in a week.
        </p>
        <Table
          head={['Lands', 'Worst 6 months', 'Worst week']}
          rows={TIERS.map((tier) => [
            tier.lands,
            tier.worstHalfYear,
            tier.worstWeek,
          ])}
          numeric={[1, 2]}
        />
        <Note>
          Replayed week by week. The rules were chosen on Nov 2025 to Apr 2026;
          the other 33 months were never used to choose them.
        </Note>
      </Section>

      <Section title="How it works">
        <p>
          It reads past blocks only, with{' '}
          <code className="text-xs">eth_feeHistory</code>, so anyone with a node
          gets the same tips. Each block’s 10th or 25th percentile tip is the
          price that block asked. Each speed beats that price in a set share of
          recent blocks.
        </p>
        <Table
          head={['Price read', 'Beats it in']}
          rows={TIERS.map((tier) => [tier.price, tier.beats])}
        />
        <Note>
          300 blocks is about an hour, 1,800 about 6 hours. Each speed is at
          least the one below, and all three are recomputed every block.
        </Note>
      </Section>

      <Section title="Why these shares">
        <p>
          If each block takes your tip with chance <i>a</i>, you miss <i>k</i>{' '}
          blocks in a row with chance{' '}
          <span className="whitespace-nowrap">
            (1 − <i>a</i>)<sup>k</sup>
          </span>
          . Even at 2 gwei, 1.7% of transactions miss the next block anyway, so
          at most 98.3% can make the first. Missing 5% of the time means:
        </p>
        <code className="block rounded-md bg-surface-secondary px-3 py-2 text-xs">
          (1 − 0.983<i>a</i>) × (1 − <i>a</i>)<sup>k − 1</sup> = 5%
        </code>
        <p>
          For 5 blocks, a minute, this gives 45.2%, which slow uses. For 2
          blocks and 1 it gives 78.3% and 96.6%, but blocks are not independent
          chances: with 78.3%, medium fell to 89.1% in a week of February 2026.
          So for medium and fast we tried other prices, shares and windows on
          Nov 2025 to Apr 2026, and kept the cheapest rule that kept the
          promise.
        </p>
      </Section>

      <Section title="Where it falls short">
        <p>
          It reads what people already pay, so when everyone tips high, it does
          too. From Aug 2023 to Nov 2025, its fast tip was 1.3 gwei in a typical
          hour.
        </p>
      </Section>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-bold text-base">{title}</h3>
      {children}
    </section>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="text-secondary text-xs">{children}</p>
}

/** One row per speed, named in the first column */
function Table({
  head,
  rows,
  numeric = [],
}: {
  head: string[]
  rows: string[][]
  numeric?: number[]
}) {
  const align = (column: number) =>
    numeric.includes(column) ? 'text-right tabular-nums' : 'text-left'
  return (
    <table className="w-full">
      <thead>
        <tr className="text-secondary text-xs">
          <th className="pb-1.5 text-left font-normal">
            <span className="sr-only">Speed</span>
          </th>
          {head.map((label, column) => (
            <th
              key={label}
              className={`pb-1.5 pl-4 font-normal ${align(column)}`}
            >
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((cells, row) => (
          <tr key={TIERS[row]?.name} className="border-divider border-t">
            <th className="py-2 text-left font-bold">{TIERS[row]?.name}</th>
            {cells.map((cell, column) => (
              <td key={head[column]} className={`py-2 pl-4 ${align(column)}`}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
