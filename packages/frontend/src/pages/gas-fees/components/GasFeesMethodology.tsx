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
import mock from './pageMock.json'

/** The rule as the server runs it (getGasFeesTips), with each tier's measured record from METHODOLOGY.md */
const TIERS = [
  {
    name: 'Slow',
    target: 'Within 1 minute',
    rule: '45.2th percentile of the blocks’ 10th percentile tips',
    test: '96.0%, 92.7%',
    blind: '99.5%, 97.4%',
  },
  {
    name: 'Medium',
    target: 'Within 2 blocks',
    rule: '85th percentile of their 25th percentile tips',
    test: '98.5%, 96.4%',
    blind: '99.3%, 96.0%',
  },
  {
    name: 'Fast',
    target: 'In the next block',
    rule: '99th percentile of the 25th percentile tips of the last 1,800 blocks',
    test: '97.2%, 94.2%',
    blind: '97.0%, 92.3%',
  },
]

/** The estimator's methodology, kept out of the way behind a button */
export function GasFeesMethodology() {
  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-1.5 rounded-lg border border-divider px-2.5 py-1 font-medium text-xs hover:bg-surface-secondary">
        <InfoIcon className="size-3.5 fill-current" />
        How we estimate
      </DialogTrigger>
      <DialogContent className="primary-card flex max-h-[90dvh] w-[768px] flex-col gap-0 overflow-hidden bg-surface-primary p-0 lg:w-[960px]">
        <DialogClose className="top-5 right-5" />
        <DialogHeader className="border-divider border-b px-6 py-5">
          <DialogTitle className="font-bold text-xl">
            How our estimator works
          </DialogTitle>
          <DialogDescription className="text-secondary text-xs">
            Ethereum L1 only. Tested against Flashbots mempool data, Aug 2023 to
            Nov 2026.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto px-6 py-5">
          <MethodologyBody />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MethodologyBody() {
  const { tips } = mock
  return (
    <div className="flex flex-col gap-6">
      <dl className="flex flex-col gap-1.5 text-sm">
        <div>
          <dt className="inline font-bold">
            Slow, medium and fast are our estimates:{' '}
          </dt>
          <dd className="inline">
            from past Ethereum blocks only, the tips that land transactions
            within a minute, within 2 blocks and in the next block. Each
            promises that 95% of the transactions paying it land in time over
            any 6 months, and never fewer than 90% in a week.
          </dd>
        </div>
        <div>
          <dt className="inline font-bold">× ours: </dt>
          <dd className="inline">
            how many times our tip each wallet suggests for the same speed.
          </dd>
        </div>
        <div>
          <dt className="inline font-bold">Overtipped: </dt>
          <dd className="inline">
            what ordinary transactions paid on top of our fast tip.
          </dd>
        </div>
        <div>
          <dt className="inline font-bold">Ordinary: </dt>
          <dd className="inline">
            tips under 2.5 gwei, just above the pile at 2 gwei. That leaves out{' '}
            ${Math.round(tips.positionalUsd / 1e6)}M.
          </dd>
        </div>
      </dl>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="flex flex-col gap-3">
          <h3 className="font-semibold text-base">The rule</h3>
          <p className="text-sm">
            Read each block’s 10th and 25th percentile tips with{' '}
            <code className="text-xs">eth_feeHistory</code>: the last 300
            blocks, about an hour, for slow and medium, and the last 1,800,
            about 6 hours, for fast. Then:
          </p>
          <table className="w-full border-separate border-spacing-y-1 text-sm">
            <thead>
              <tr className="text-secondary text-xs">
                <th className="text-left font-normal">Tier</th>
                <th className="pl-3 text-left font-normal">Tip</th>
                <th className="pl-3 text-right font-normal">Test months</th>
                <th className="pl-3 text-right font-normal">Blind years</th>
              </tr>
            </thead>
            <tbody>
              {TIERS.map((tier) => (
                <tr key={tier.name} className="align-top">
                  <td>
                    <span className="block font-bold">{tier.name}</span>
                    <span className="block text-secondary text-xs">
                      {tier.target}
                    </span>
                  </td>
                  <td className="pl-3">{tier.rule}</td>
                  <td className="pl-3 text-right tabular-nums">{tier.test}</td>
                  <td className="pl-3 text-right tabular-nums">{tier.blind}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-secondary text-xs">
            Each result is the average, then the worst week. Each tier is at
            least as high as the one below. It is recomputed every block and
            needs no mempool, so anyone with a node can run it.
          </p>
          <p className="text-sm">
            The 95% is what to expect over months; the 90% is the worst week to
            plan for. Shorter stretches can fall below 95%: in the worst
            calendar month the tiers landed 91.5% to 93.4%. Both parts are a
            record, not a guarantee: they were set from the data we have.
          </p>
        </section>
        <section className="flex flex-col gap-3">
          <h3 className="font-semibold text-base">How we got it</h3>
          <ol className="flex flex-col gap-3 text-sm">
            <li>
              <b>The target sets the percentile.</b> If each block takes your
              tip with chance <i>a</i>, you miss <i>k</i> blocks in a row with
              chance (1 − <i>a</i>)<sup>k</sup>. One thing no tip fixes: even at
              2 gwei, 1.7% of transactions miss the next block anyway, so at
              most 98.3% can make it. Together:
              <code className="my-2 block rounded-md bg-surface-secondary px-3 py-2 text-xs">
                (1 − 0.983<i>a</i>) × (1 − <i>a</i>)<sup>k − 1</sup> = 5%
              </code>
              Solving for <i>a</i> gives 96.6% for 1 block, 78.3% for 2 and
              45.2% for 5, which is one minute. That is enough for 95% on
              average if blocks were independent chances. Slow keeps 45.2%.
            </li>
            <li>
              <b>The data chose the rest.</b> Blocks are not independent
              chances: with 78.3%, the medium tier fell to 89.1% in a week of
              February 2026. So we tried other block percentiles, windows and
              shares on Nov 2025 to Apr 2026, and for medium and fast kept the
              rule that overpaid least while keeping the promise. Medium beats
              85% of blocks. Fast reads the last 1,800 blocks and beats 99% of
              their 25th percentile tips, which overpays about a quarter less
              than beating 96.6% of the last 300 blocks&apos; median tips.
            </li>
            <li>
              <b>Then it was frozen and tested.</b> First on May to Nov 2026,
              then blind on Aug 2023 to Nov 2025: 813 days nobody had looked at,
              with base fees up to 58 gwei. Every tier kept both parts of the
              promise in all three periods.
            </li>
            <li>
              <b>Its weakness.</b> It reads what people already pay, so when
              everyone tips high, it does too. In a typical hour of the blind
              test its fast tip was 1.3 gwei.
            </li>
          </ol>
        </section>
      </div>
    </div>
  )
}
