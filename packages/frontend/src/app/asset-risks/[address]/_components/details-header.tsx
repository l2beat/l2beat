"use client"

import { Address, isAddress } from 'viem'
import { formatAddress } from '~/utils/format-address'
import { formatNumberWithCommas } from '~/utils/format-number'
import { Card } from '../../_components/card'
import { Breakdown } from './breakdown'
import { api } from '~/trpc/react'

interface DetailsHeaderProps {
  walletAddress: Address
  vanityAddress: string
}

export function DetailsHeader(props: DetailsHeaderProps) {
  const report = api.assetRisks.report.useQuery({ address: props.walletAddress })


  if (!report.data) return null

  const risksCount = 0

  const averageIssuesPerToken = Math.round(risksCount / report.data.tokens.length)
  const leastIssues = 0

  return (
    <Card className="flex flex-col gap-4 rounded-none sm:rounded-xl">
      <h1 className="text-3xl font-bold">Assets&apos; Risks</h1>
      <p className="text-sm font-medium text-zinc-500 dark:text-gray-50">
        {`A total of ${risksCount} issues were found with an average of ${averageIssuesPerToken} issues per token. Your most valuable token has ${leastIssues} issues.`}
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
          <span className=" text-xl font-extrabold text-pink-900 dark:text-pink-200">
            ${formatNumberWithCommas(report.data.usdValue)}
          </span>
        </div>
        <div className="col-span-2 flex flex-col gap-[5px]">
          <span className="text-xs font-bold text-zinc-500 dark:text-gray-50">
            Wallet
          </span>
          <span className="flex items-center gap-2 text-xl font-semibold">
            {isAddress(props.walletAddress)
              ? formatAddress(props.walletAddress)
              : props.walletAddress}
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
