import { bridges, layer2s } from '@l2beat/config'
import { groupBy } from 'lodash'
import Image from 'next/image'
import { formatUnits } from 'viem'

import { BigRosette } from './Rosette'
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
      iconUrl?: string
      bridge?: string
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

  const risks = [
    chain.technology.stateCorrectness,
    chain.technology.newCryptography,
    chain.technology.dataAvailability,
    chain.technology.operator,
    chain.technology.forceTransactions,
    ...chain.technology.exitMechanisms,
    chain.technology.massExit,
    ...(chain.technology.otherConsiderations ?? []),
  ].flatMap((choice) => choice?.risks ?? [])

  const groupedRisks = groupBy(risks, (risk) => risk.category)

  return (
    <div className="px-4 py-6 md:p-10 dark:bg-zinc-900 bg-gray-100 rounded-lg flex flex-row justify-between gap-8">
      <div className="flex flex-col gap-8 w-full">
        <div>
          <h2 className="text-2xl font-bold">{chainName}</h2>
          <StageBadge stage={chain.stage.stage} />
        </div>
        <div className="flex flex-col gap-4 w-full">
          {tokens.map(({ token, balance }) => {
            const bridge = bridges.find((bridge) => bridge.id === token.bridge)

            const bridgeRisks =
              bridge &&
              (
                Object.keys(
                  bridge.technology,
                ) as (keyof typeof bridge.technology)[]
              ).flatMap((key) => {
                if (
                  key === 'destination' ||
                  key === 'canonical' ||
                  key === 'isUnderReview'
                )
                  return []
                const choice = bridge.technology[key]
                if (!choice) return []
                return choice.risks
              })

            const groupedBridgeRisks =
              bridgeRisks && groupBy(bridgeRisks, (risk) => risk.category)

            return (
              <div key={token.id} className="flex flex-row gap-4 flex-grow">
                <div className="flex-1">
                  <div className="flex flex-row gap-2 items-center">
                    {token.iconUrl && (
                      <div>
                        <Image
                          src={token.iconUrl}
                          alt={token.name}
                          width={24}
                          height={24}
                        />
                      </div>
                    )}
                    <h3 className="text-lg font-bold">{token.name}</h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-600k">
                    {formatUnits(balance, token.decimals)} {token.symbol}
                  </p>
                </div>
                {groupedBridgeRisks ? (
                  <div className="flex-1 flex flex-col gap-4">
                    <h3 className="font-bold">Bridge: {bridge.display.name}</h3>
                    <div>
                      {Object.entries(groupedBridgeRisks)
                        .sort(([categoryA], [categoryB]) =>
                          categoryA.localeCompare(categoryB),
                        )
                        .map(([category, risks]) => (
                          <div key={category} className="text-sm">
                            <h4 className="font-bold">{category}</h4>
                            <ul className="text-xs list-disc list-inside">
                              {risks.map((risk) => (
                                <li
                                  key={risk.text}
                                  className="text-gray-500 dark:text-gray-600k"
                                >
                                  {risk.text}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 text-xs">Unknown bridge</div>
                )}
              </div>
            )
          })}
        </div>
        <hr className="w-full border-gray-200 dark:border-zinc-700 md:border-t" />
        <div className="flex flex-col gap-4">
          {Object.entries(groupedRisks)
            .sort(([categoryA], [categoryB]) =>
              categoryA.localeCompare(categoryB),
            )
            .map(([category, risks]) => (
              <div key={category} className="flex flex-col">
                <h3 className="font-bold">{category}</h3>
                <ul className="text-sm list-disc list-inside">
                  {risks.map((risk) => (
                    <li
                      key={risk.text}
                      className="text-gray-500 dark:text-gray-600k"
                    >
                      {risk.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
      <div>
        <BigRosette risks={chain.riskView} />
      </div>
    </div>
  )
}
