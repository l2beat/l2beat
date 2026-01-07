import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Folder } from '../panel-values/Folder'
import { PermissionsDisplay } from './PermissionsDisplay'
import { getFundsData } from '../../../api/api'
import type { ContractFundsData, FundsTokenBalance, FundsPositionProtocol } from '../../../api/types'

interface Props {
  selected: any
  abis: any[]
}

function formatUsdValue(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`
  }
  return `$${value.toFixed(2)}`
}

function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp)
    return date.toLocaleString()
  } catch {
    return timestamp
  }
}

function ContractFundsDisplay({ fundsData }: { fundsData: ContractFundsData }) {
  const totalValue =
    (fundsData.balances?.totalUsdValue ?? 0) +
    (fundsData.positions?.totalUsdValue ?? 0)

  return (
    <div className="px-2 py-2 text-xs">
      {fundsData.error && (
        <div className="text-aux-red mb-2">Error: {fundsData.error}</div>
      )}

      <div className="text-coffee-500 mb-2">
        Last fetched: {formatTimestamp(fundsData.lastFetched)}
      </div>

      <div className="mb-2">
        <span className="font-semibold">Total Value: </span>
        <span className="text-aux-green">{formatUsdValue(totalValue)}</span>
      </div>

      {/* Balances Section */}
      {fundsData.balances && fundsData.balances.tokens.length > 0 && (
        <div className="mb-3">
          <div className="text-aux-orange font-semibold mb-1">
            Token Balances ({formatUsdValue(fundsData.balances.totalUsdValue)})
          </div>
          <div className="ml-2 flex flex-col gap-1">
            {fundsData.balances.tokens
              .filter((t) => t.usdValue > 0)
              .sort((a, b) => b.usdValue - a.usdValue)
              .slice(0, 10)
              .map((token, idx) => (
                <TokenRow key={idx} token={token} />
              ))}
            {fundsData.balances.tokens.filter((t) => t.usdValue > 0).length > 10 && (
              <div className="text-coffee-500">
                +{fundsData.balances.tokens.filter((t) => t.usdValue > 0).length - 10} more tokens
              </div>
            )}
          </div>
        </div>
      )}

      {/* Positions Section */}
      {fundsData.positions && fundsData.positions.protocols.length > 0 && (
        <div>
          <div className="text-aux-orange font-semibold mb-1">
            DeFi Positions ({formatUsdValue(fundsData.positions.totalUsdValue)})
          </div>
          <div className="ml-2 flex flex-col gap-2">
            {fundsData.positions.protocols.map((protocol, idx) => (
              <ProtocolRow key={idx} protocol={protocol} />
            ))}
          </div>
        </div>
      )}

      {!fundsData.balances && !fundsData.positions && !fundsData.error && (
        <div className="text-coffee-500">No funds data available</div>
      )}
    </div>
  )
}

function TokenRow({ token }: { token: FundsTokenBalance }) {
  const formattedBalance = parseFloat(token.balance) / Math.pow(10, token.decimals)
  const displayBalance = formattedBalance.toLocaleString(undefined, {
    maximumFractionDigits: 4,
  })

  return (
    <div className="flex items-center justify-between text-coffee-300">
      <span>
        {displayBalance} {token.symbol}
      </span>
      <span className="text-aux-green">{formatUsdValue(token.usdValue)}</span>
    </div>
  )
}

function ProtocolRow({ protocol }: { protocol: FundsPositionProtocol }) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer hover:text-coffee-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-coffee-400">{isExpanded ? 'v' : '>'}</span>
          <span className="text-coffee-300">{protocol.name}</span>
        </div>
        <span className="text-aux-green">{formatUsdValue(protocol.totalUsdValue)}</span>
      </div>

      {isExpanded && (
        <div className="ml-4 mt-1 flex flex-col gap-1">
          {protocol.items.map((item, idx) => (
            <div key={idx} className="text-coffee-400">
              <div className="flex justify-between">
                <span>{item.name || 'Position'}</span>
                <span className="text-aux-green">
                  {formatUsdValue(item.stats.netUsdValue)}
                </span>
              </div>
              {item.tokens.length > 0 && (
                <div className="ml-2 text-coffee-500">
                  {item.tokens.map((t, tidx) => (
                    <span key={tidx}>
                      {t.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {t.symbol}
                      {tidx < item.tokens.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ContractFundsSection({ address }: { address: string }) {
  const { project } = useParams()

  const { data: fundsData } = useQuery({
    queryKey: ['funds-data', project],
    queryFn: () => project ? getFundsData(project) : null,
    enabled: !!project,
  })

  const contractFunds = fundsData?.contracts[address]
  if (!contractFunds) return null

  return (
    <Folder title="Funds" collapsed={false}>
      <ContractFundsDisplay fundsData={contractFunds} />
    </Folder>
  )
}

export function ValuesPanelExtensions({ selected, abis }: Props) {
  const hasAbis = 'abis' in selected && selected.abis.length > 0

  return (
    <>
      {hasAbis && (
        <Folder title="Permissions" collapsed={false}>
          <PermissionsDisplay abis={selected.abis} />
        </Folder>
      )}
      <ContractFundsSection address={selected.address} />
    </>
  )
}
