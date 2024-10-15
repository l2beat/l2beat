'use client'

import { formatNumberWithCommas } from '~/utils/format-number'
import { Card } from '../../_components/card'
import { Breakdown } from './breakdown'
import { useReport } from './report-context'

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
      <h1 className="text-3xl font-bold">Assets&apos; Risks</h1>
      <p className="text-sm font-medium text-zinc-500 dark:text-gray-50">
        {`A total of ${sum} issues were found with an average of ${averageIssuesPerToken} issues per token. Your most valuable token has ${leastIssues} issues.`}
      </p>
      <p className="text-sm font-medium text-zinc-500 dark:text-gray-50">
        You can check the risks associated with specific tokens by expanding the
        rows.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-2">
        <div className="col-span-2 flex flex-col gap-[5px]">
          <span className="text-xs font-bold text-zinc-500 dark:text-gray-50">
            Value
          </span>
          <span className="text-xl font-bold text-pink-900 dark:text-pink-200">
            ${formatNumberWithCommas(report.usdValue)}
          </span>
        </div>
        <div className="col-span-2 flex flex-col gap-[5px]">
          <span className="text-xs font-bold text-zinc-500 dark:text-gray-50">
            Wallet
          </span>
          <span className="flex items-center gap-2 text-xl font-medium">
            {props.vanityAddress ?? report.address}
          </span>
        </div>
      </div>
      <div>
        <span className="text-xs font-bold text-zinc-500">
          Breakdown of assets by stages
        </span>
        <Breakdown />
      </div>
    </Card>
  )
}
