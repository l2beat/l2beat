/** The rule as the server runs it (getGasFeesTips), with each tier's measured record from METHODOLOGY.md */
const TIERS = [
  {
    name: 'Slow',
    target: '95% within 1 minute',
    rule: '45.2th percentile of the blocks’ 10th percentile tips',
    test: '96.0%',
    blind: '99.5%',
  },
  {
    name: 'Medium',
    target: '95% within 2 blocks',
    rule: '78.3th percentile of their 25th percentile tips',
    test: '98.2%',
    blind: '99.1%',
  },
  {
    name: 'Fast',
    target: '95% in the next block',
    rule: '96.6th percentile of their median tips',
    test: '97.6%',
    blind: '97.2%',
  },
]

export function GasFeesHowItWorks() {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-bold text-xl md:text-2xl">How our estimator works</h2>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="flex flex-col gap-3">
          <h3 className="font-semibold text-base">The rule</h3>
          <p className="text-sm">
            Read the last 300 blocks, about an hour, with one{' '}
            <code className="text-xs">eth_feeHistory</code> call for each
            block’s 10th, 25th and 50th percentile tips. Then:
          </p>
          <table className="w-full border-separate border-spacing-y-1 text-sm">
            <thead>
              <tr className="text-secondary text-xs">
                <th className="text-left font-normal">Tier</th>
                <th className="pl-3 text-left font-normal">Tip</th>
                <th className="pl-3 text-right font-normal">On target, test</th>
                <th className="pl-3 text-right font-normal">Blind test</th>
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
            Each tier is at least as high as the one below. It is recomputed
            every block and needs no mempool, so anyone with a node can run it.
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
              45.2% for 5, which is one minute.
            </li>
            <li>
              <b>The data chose which tips to read.</b> We tried other block
              percentiles and windows on Nov 2025 to Apr 2026 and kept the best.
              For every hour, each candidate&apos;s tip was compared with the
              lowest tip that would have hit the target, in hindsight, as a
              ratio. Too low counted 19 times as much as too high, which is the
              weighting that rewards landing exactly on 95%. The smallest total
              won.
            </li>
            <li>
              <b>Then it was frozen and tested.</b> First on May to Nov 2026,
              then blind on Aug 2023 to Nov 2025: 813 days nobody had looked at,
              with base fees up to 58 gwei.
            </li>
            <li>
              <b>Its weakness.</b> It reads what people already pay, so when
              everyone tips high, it does too. In the blind test its fast tip
              averaged 1.7 gwei.
            </li>
          </ol>
        </section>
      </div>
    </div>
  )
}
