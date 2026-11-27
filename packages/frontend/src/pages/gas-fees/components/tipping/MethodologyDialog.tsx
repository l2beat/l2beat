import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '~/components/core/Dialog'
import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'

const REPLAY = [
  ['Slow', 'Within 1 minute', '96.0%', '92.1%'],
  ['Medium', 'Within 2 blocks', '96.6%', '90.7%'],
  ['Fast', 'In the next block', '95.3%', '92.3%'],
]
const RULES = [
  ['Slow', '10th percentile tip', '45.2% of the last 300 blocks'],
  ['Medium', '25th percentile tip', '85% of the last 300 blocks'],
  ['Fast', '25th percentile tip', '99% of the last 1,800 blocks'],
]

export function MethodologyDialog({ className }: { className?: string }) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          'flex items-center gap-1 font-medium text-label-value-14 text-link underline',
          className,
        )}
      >
        <InfoIcon className="size-3.5 fill-link" />
        How we estimate
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto text-paragraph-15">
        <DialogTitle className="font-bold text-xl">
          How our estimator works
        </DialogTitle>
        <DialogDescription className="text-secondary">
          Ethereum L1 only. Replayed against Flashbots mempool data, Aug 2023 to
          Nov 2026.
        </DialogDescription>
        <Section title="The promise">
          <p>
            Three tips for three speeds. Of the transactions that pay a tip, 95%
            land in time over any 6 months, and never fewer than 90% in a week.
          </p>
          <SimpleTable
            head={['Speed', 'Lands', 'Worst 6 months', 'Worst week']}
            rows={REPLAY}
          />
          <p className="text-secondary text-sm">
            Replayed week by week. The rules were chosen on Nov 2025 to Apr
            2026; the other 33 months were never used to choose them.
          </p>
        </Section>
        <Section title="How it works">
          <p>
            It reads past blocks only, with <code>eth_feeHistory</code>, so
            anyone with a node gets the same tips. Each block’s 10th or 25th
            percentile tip is the price that block asked. Each speed beats that
            price in a set share of recent blocks.
          </p>
          <SimpleTable
            head={['Speed', 'Price read', 'Beats it in']}
            rows={RULES}
          />
          <p className="text-secondary text-sm">
            300 blocks is about an hour, 1,800 about 6 hours. Each speed is at
            least the one below, and all three are recomputed every block.
          </p>
        </Section>
        <Section title="Why these shares">
          <p>
            If each block takes your tip with chance a, you miss k blocks in a
            row with chance (1 − a)<sup>k</sup>. Even at 2 gwei, 1.7% of
            transactions miss the next block anyway, so at most 98.3% can make
            the first. Missing 5% of the time means:
          </p>
          <p className="text-center font-medium">
            (1 − 0.983a) × (1 − a)<sup>k − 1</sup> = 5%
          </p>
          <p>
            For 5 blocks, a minute, this gives 45.2%, which slow uses. For 2
            blocks and 1 it gives 78.3% and 96.6%, but blocks are not
            independent chances: with 78.3%, medium fell to 89.1% in a week of
            February 2026. So for medium and fast we tried other prices, shares
            and windows on Nov 2025 to Apr 2026, and kept the cheapest rule that
            kept the promise.
          </p>
        </Section>
        <Section title="Where it falls short">
          <p>
            It reads what people already pay, so when everyone tips high, it
            does too. From Aug 2023 to Nov 2025, its fast tip was 1.3 gwei in a
            typical hour.
          </p>
        </Section>
      </DialogContent>
    </Dialog>
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
    <section className="flex flex-col gap-2">
      <h3 className="font-bold text-lg">{title}</h3>
      {children}
    </section>
  )
}

function SimpleTable({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-divider border-b text-2xs uppercase">
          {head.map((h) => (
            <th key={h} className="py-1 pr-3 font-semibold">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[0]} className="border-divider border-b last:border-0">
            {row.map((cell, i) => (
              <td
                key={i}
                className={cn('py-1 pr-3', i === 0 && 'font-semibold')}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
