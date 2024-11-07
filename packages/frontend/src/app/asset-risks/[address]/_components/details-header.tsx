'use client'

import { formatNumberWithCommas } from '~/utils/number-format/format-number'
import { Card } from '../../_components/card'
import { useReport } from './report-context'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'

interface DetailsHeaderProps {
  vanityAddress: string
}

export function DetailsHeader(props: DetailsHeaderProps) {
  const report = useReport()

  const counts = report.tokens.map(
    ({ token }) => report.chains[token.networkId]?.risks.length ?? 0,
  )

  const sum = counts.reduce((acc, risk) => acc + risk, 0)

  const averageIssuesPerToken = Math.round(sum / report.tokens.length)
  const leastIssues = Math.min(...counts)

  return (
    <Card className="flex flex-col gap-4 rounded-none sm:rounded-xl">
      <h1 className="font-oswald text-3xl font-bold">Wallet insights</h1>
      <p className="text-sm  text-white/80">
        {`A total of ${sum} issues were found with an average of ${averageIssuesPerToken} issues per token. Your most valuable token has ${leastIssues} issues.`}
      </p>
      <p className="text-sm  text-white/80">
        You can check the risks associated with specific tokens by expanding the
        rows.
      </p>
      <HorizontalSeparator className="!border-[#5656C759]" />
      <div className="grid grid-cols-1 gap-3 font-oswald md:grid-cols-4 md:gap-2">
        <div className="col-span-2 flex flex-col gap-[5px]">
          <span className="text-xs font-bold text-[#74749F]">Value</span>
          <span className="text-2xl font-bold leading-none text-[#D1FF1A]">
            ${formatNumberWithCommas(report.usdValue)}
          </span>
        </div>
        <div className="col-span-2 flex flex-col gap-[5px]">
          <span className="text-xs font-bold text-[#74749F]">Address</span>
          <span className="text-2xl font-semibold leading-none">
            {props.vanityAddress ?? report.address}
          </span>
        </div>
      </div>
    </Card>
  )
}
