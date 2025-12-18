import { useState, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getFundsData, executeFetchFunds } from '../../../api/api'
import type { ContractFundsData, FundsTokenBalance, FundsPositionProtocol } from '../../../api/types'
import { useContractTags } from '../../../hooks/useContractTags'
import { usePanelStore } from '../store/panel-store'
import { ProxyTypeTag } from './ProxyTypeTag'
import { buildProxyTypeMap } from './proxyTypeUtils'

interface FundsSectionProps {
  project: string
  projectData: any
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

function ContractFundsRow({
  contractAddress,
  fundsData,
  contractName,
  proxyType,
  onSelect,
}: {
  contractAddress: string
  fundsData: ContractFundsData
  contractName?: string
  proxyType?: string
  onSelect?: () => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const totalValue =
    (fundsData.balances?.totalUsdValue ?? 0) +
    (fundsData.positions?.totalUsdValue ?? 0)

  const shortAddress = contractAddress.replace('eth:', '').slice(0, 10) + '...'
  const displayName = contractName || shortAddress

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect?.()
  }

  return (
    <div className="border-b border-coffee-700 last:border-b-0">
      <div
        className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-coffee-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-coffee-400">{isExpanded ? 'v' : '>'}</span>
          <span className="text-coffee-200">{displayName}</span>
          <ProxyTypeTag proxyType={proxyType} />
          <span className="text-coffee-500 text-xs">({shortAddress})</span>
          {onSelect && (
            <button
              onClick={handleSelectClick}
              className="text-blue-400 hover:text-blue-300 px-1"
              title="Select contract in graph"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          {fundsData.error && (
            <span className="text-red-400 text-xs">Error</span>
          )}
          <span className="text-green-400 font-medium">
            {formatUsdValue(totalValue)}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 py-2 bg-coffee-800 text-xs">
          {fundsData.error && (
            <div className="text-red-400 mb-2">Error: {fundsData.error}</div>
          )}

          <div className="text-coffee-500 mb-2">
            Last fetched: {formatTimestamp(fundsData.lastFetched)}
          </div>

          {/* Balances Section */}
          {fundsData.balances && fundsData.balances.tokens.length > 0 && (
            <div className="mb-3">
              <div className="text-orange-400 font-semibold mb-1">
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
              <div className="text-orange-400 font-semibold mb-1">
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
      <span className="text-green-400">{formatUsdValue(token.usdValue)}</span>
    </div>
  )
}

function ProtocolRow({ protocol }: { protocol: FundsPositionProtocol }) {
  const [isExpanded, setIsExpanded] = useState(false)

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
        <span className="text-green-400">{formatUsdValue(protocol.totalUsdValue)}</span>
      </div>

      {isExpanded && (
        <div className="ml-4 mt-1 flex flex-col gap-1">
          {protocol.items.map((item, idx) => (
            <div key={idx} className="text-coffee-400">
              <div className="flex justify-between">
                <span>{item.name || 'Position'}</span>
                <span className="text-green-400">
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

export function FundsSection({ project, projectData }: FundsSectionProps) {
  const queryClient = useQueryClient()
  const [isFetching, setIsFetching] = useState(false)
  const [fetchProgress, setFetchProgress] = useState<string[]>([])
  const [forceRefresh, setForceRefresh] = useState(false)

  const { data: fundsData, isLoading, error } = useQuery({
    queryKey: ['funds-data', project],
    queryFn: () => getFundsData(project),
  })

  const { data: contractTags } = useContractTags(project)

  // Build contract name lookup map from projectData
  const contractNameMap = useMemo(() => {
    if (!projectData?.entries) return new Map<string, string>()
    const map = new Map<string, string>()
    projectData.entries.forEach((entry: any) => {
      [...entry.initialContracts, ...entry.discoveredContracts].forEach((c: any) => {
        map.set(c.address.toLowerCase(), c.name)
      })
    })
    return map
  }, [projectData])

  // Build proxy type lookup map from projectData
  const proxyTypeMap = useMemo(() => buildProxyTypeMap(projectData), [projectData])

  // Count contracts with funds fetching enabled
  const contractsWithFundsEnabled = contractTags?.tags.filter(
    (t) => t.fetchBalances || t.fetchPositions
  ).length ?? 0

  const handleFetchFunds = () => {
    if (isFetching) return

    setIsFetching(true)
    setFetchProgress([])

    const eventSource = executeFetchFunds(project, undefined, forceRefresh)

    eventSource.onmessage = (event) => {
      const message = event.data.replace(/\\n/g, '\n')

      if (message === 'DONE') {
        setIsFetching(false)
        eventSource.close()
        // Refresh funds data
        queryClient.invalidateQueries({ queryKey: ['funds-data', project] })
      } else {
        setFetchProgress((prev) => [...prev.slice(-10), message])
      }
    }

    eventSource.onerror = () => {
      setIsFetching(false)
      eventSource.close()
    }
  }

  // Calculate totals
  let totalBalancesValue = 0
  let totalPositionsValue = 0
  const contractCount = fundsData ? Object.keys(fundsData.contracts).length : 0

  if (fundsData) {
    Object.values(fundsData.contracts).forEach((data) => {
      totalBalancesValue += data.balances?.totalUsdValue ?? 0
      totalPositionsValue += data.positions?.totalUsdValue ?? 0
    })
  }

  const totalValue = totalBalancesValue + totalPositionsValue

  if (isLoading) {
    return (
      <div className="border-b border-b-coffee-600 pb-2">
        <h2 className="p-2 font-bold text-2xl text-blue-600">Funds Data:</h2>
        <div className="mb-1 flex flex-col gap-2 border-l-4 border-transparent p-2 pl-1">
          <p className="text-coffee-400">Loading funds data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-b border-b-coffee-600 pb-2">
        <h2 className="p-2 font-bold text-2xl text-blue-600">Funds Data:</h2>
        <div className="mb-1 flex flex-col gap-2 border-l-4 border-transparent p-2 pl-1">
          <p className="text-red-400">Error loading funds data: {String(error)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-b border-b-coffee-600 pb-2">
      <div className="flex items-center justify-between p-2">
        <h2 className="font-bold text-2xl text-blue-600">Funds Data:</h2>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 text-xs text-coffee-400 cursor-pointer">
            <input
              type="checkbox"
              checked={forceRefresh}
              onChange={(e) => setForceRefresh(e.target.checked)}
              disabled={isFetching}
              className="w-3 h-3"
            />
            Force refresh
          </label>
          <button
            className={`px-3 py-1 rounded text-sm ${
              isFetching
                ? 'bg-coffee-600 text-coffee-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-500'
            }`}
            onClick={handleFetchFunds}
            disabled={isFetching || contractsWithFundsEnabled === 0}
            title={
              contractsWithFundsEnabled === 0
                ? 'No contracts marked for funds fetching'
                : forceRefresh
                  ? 'Force fetch funds data for all marked contracts (ignores 24h cache)'
                  : 'Fetch funds data for all marked contracts (skips if fetched within 24h)'
            }
          >
            {isFetching ? 'Fetching...' : `Fetch Funds (${contractsWithFundsEnabled})`}
          </button>
        </div>
      </div>

      <div className="mb-1 flex flex-col gap-2 border-l-4 border-transparent p-2 pl-1">
        {/* Fetch Progress */}
        {isFetching && fetchProgress.length > 0 && (
          <div className="bg-coffee-800 p-2 rounded text-xs font-mono text-coffee-300 max-h-32 overflow-auto">
            {fetchProgress.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        )}

        {/* Summary */}
        {contractCount > 0 ? (
          <>
            <div className="ml-2 text-sm">
              <div className="flex gap-8 mb-2">
                <span className="text-coffee-300">
                  Last updated:{' '}
                  <span className="text-coffee-400">
                    {fundsData?.lastModified
                      ? formatTimestamp(fundsData.lastModified)
                      : 'Never'}
                  </span>
                </span>
              </div>
              <div className="flex gap-8 mb-2">
                <span className="font-semibold">
                  Total Value:{' '}
                  <span className="text-green-400 text-lg">
                    {formatUsdValue(totalValue)}
                  </span>
                </span>
              </div>
              <div className="flex gap-6 text-xs text-coffee-400 mb-3">
                <span>Balances: {formatUsdValue(totalBalancesValue)}</span>
                <span>Positions: {formatUsdValue(totalPositionsValue)}</span>
                <span>Contracts: {contractCount}</span>
              </div>
            </div>

            {/* Contract List */}
            <div className="ml-2 border border-coffee-700 rounded">
              {Object.entries(fundsData?.contracts ?? {}).map(
                ([address, data]) => (
                  <ContractFundsRow
                    key={address}
                    contractAddress={address}
                    fundsData={data}
                    contractName={contractNameMap.get(address.toLowerCase())}
                    proxyType={proxyTypeMap.get(address.toLowerCase())}
                    onSelect={() => usePanelStore.getState().select(address)}
                  />
                )
              )}
            </div>
          </>
        ) : (
          <div className="ml-2 text-sm text-coffee-400">
            <p>No funds data available.</p>
            <p className="mt-1 text-coffee-500">
              Mark contracts with "Fetch Balances" or "Fetch Positions" in contract tags,
              then click "Fetch Funds" to retrieve data.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
