import { isAddress } from 'viem'
import { Card } from '~/components/Card'
import { ChangeWalletButton } from '~/components/ChangeWalletButton'
import { formatAddress } from '~/utils/formatAddress'
import { formatNumberWithCommas } from '~/utils/formatNumber'
import { Breakdown } from './Breakdown'
import { Token } from './table/TokensTable'

interface DetailsHeaderProps {
  dolarValue: number
  walletAddress: string
  tokens: Token[]
}

export function DetailsHeader(props: DetailsHeaderProps) {
  const risksCount = props.tokens.reduce(
    (acc, token) => token.chain.risks.length + acc,
    0,
  )

  const averageIssuesPerToken = Math.round(risksCount / props.tokens.length)
  const leastIssues = Math.min(
    ...props.tokens.map((token) => token.chain.risks.length),
  )

  return (
    <Card className="flex flex-col gap-4 rounded-none sm:rounded-xl">
      <h1 className="font-bold text-3xl">Assets&apos; Risks</h1>
      <p className="text-zinc-500 dark:text-gray-50 font-medium text-sm">
        {`A total of ${risksCount} issues were found with an average of ${averageIssuesPerToken} issues per token. Your most valuable token has ${leastIssues} issues.`}
      </p>
      <p className="text-zinc-500 dark:text-gray-50 font-medium text-sm">
        You can check the the risks associated with specific tokens by expanding
        the rows.
      </p>
      <div className="grid grid-cols-1 md:gap-2 gap-3 md:grid-cols-4">
        <div className="flex flex-col gap-[5px] col-span-2">
          <span className="text-zinc-500 font-bold text-xs dark:text-gray-50">
            Value
          </span>
          <span className=" text-pink-900 dark:text-pink-200 font-extrabold text-xl">
            ${formatNumberWithCommas(props.dolarValue)}
          </span>
        </div>
        <div className="flex flex-col gap-[5px] col-span-2">
          <span className="text-zinc-500 font-bold text-xs dark:text-gray-50">
            Wallet
          </span>
          <span className="flex items-center gap-2 font-semibold text-xl">
            {isAddress(props.walletAddress)
              ? formatAddress(props.walletAddress)
              : props.walletAddress}
            <ChangeWalletButton wallet={props.walletAddress} />
          </span>
        </div>
      </div>
      <div>
        <span className="text-zinc-500 text-xs font-bold">
          Breakdown of assets by stages
        </span>
        <Breakdown />
      </div>
    </Card>
  )
}
