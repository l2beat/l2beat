import { layer2s } from '@l2beat/config'
import { Fragment } from 'react'
import { formatUnits } from 'viem'

import { BigRosetteIcon } from './Rosette'
import { StageBadge } from './StageBadge'

export interface ChainAssetRiskCardProps {
  id: number
  name: string
  tokens: {
    token: {
      id: string
      name: string
      decimals: number
      symbol: string
    }
    balance: bigint
  }[]
}

export function ChainAssetRiskCard({
  id: chainId,
  name: chainName,
  tokens,
}: ChainAssetRiskCardProps) {
  // This assumes that the project is a L2 and not a L3
  const chain = layer2s.find(
    (project) => project.chainConfig?.chainId === chainId,
  )

  if (!chain) {
    throw new Error('Chain is not defined')
  }

  return (
    <div className="px-4 py-6 md:p-10 dark:bg-zinc-900 bg-gray-100 rounded-lg flex flex-row justify-between gap-8">
      <div className="flex flex-col gap-8 w-full">
        <div>
          <h2 className="text-2xl font-bold">{chainName}</h2>
          <StageBadge stage={chain.stage.stage} />
        </div>
        <div className="flex flex-col gap-4 w-full">
          {tokens.map(({ token, balance }) => (
            <div key={token.id} className="flex flex-row gap-4 flex-grow">
              <div className="flex-1">
                <h3 className="text-xl font-bold">{token.name}</h3>
                <p className="text-gray-500 dark:text-gray-600k">{token.id}</p>
              </div>
              <div className="flex-1">
                {formatUnits(balance, token.decimals)} {token.symbol}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <BigRosetteIcon
          risks={{
            sequencerFailure: chain.riskView.sequencerFailure.sentiment,
            stateValidation: chain.riskView.stateValidation.sentiment,
            dataAvailability: chain.riskView.dataAvailability.sentiment,
            exitWindow: chain.riskView.exitWindow.sentiment,
            proposerFailure: chain.riskView.proposerFailure.sentiment,
          }}
        />
      </div>
    </div>
  )
}
