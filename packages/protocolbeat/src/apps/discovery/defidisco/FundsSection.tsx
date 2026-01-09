import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { executeFetchFunds, getFundsData } from '../../../api/api'
import type {
  ContractFundsData,
  FundsPositionProtocol,
  FundsTokenBalance,
} from '../../../api/types'
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
    <div className="border-coffee-700 border-b last:border-b-0">
      <div
        className="flex cursor-pointer items-center justify-between px-2 py-1 hover:bg-coffee-700"
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
              className="px-1 text-aux-blue hover:opacity-80"
              title="Select contract in graph"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          {fundsData.error && (
            <span className="text-aux-red text-xs">Error</span>
          )}
          <span className="font-medium text-aux-green">
            {formatUsdValue(totalValue)}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-coffee-800 px-4 py-2 text-xs">
          {fundsData.error && (
            <div className="mb-2 text-aux-red">Error: {fundsData.error}</div>
          )}

          <div className="mb-2 text-coffee-500">
            Last fetched: {formatTimestamp(fundsData.lastFetched)}
          </div>

          {/* Balances Section */}
          {fundsData.balances && fundsData.balances.tokens.length > 0 && (
            <div className="mb-3">
              <div className="mb-1 font-semibold text-aux-orange">
                Token Balances (
                {formatUsdValue(fundsData.balances.totalUsdValue)})
              </div>
              <div className="ml-2 flex flex-col gap-1">
                {fundsData.balances.tokens
                  .filter((t) => t.usdValue > 0)
                  .sort((a, b) => b.usdValue - a.usdValue)
                  .slice(0, 10)
                  .map((token, idx) => (
                    <TokenRow key={idx} token={token} />
                  ))}
                {fundsData.balances.tokens.filter((t) => t.usdValue > 0)
                  .length > 10 && (
                  <div className="text-coffee-500">
                    +
                    {fundsData.balances.tokens.filter((t) => t.usdValue > 0)
                      .length - 10}{' '}
                    more tokens
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Positions Section */}
          {fundsData.positions && fundsData.positions.protocols.length > 0 && (
            <div>
              <div className="mb-1 font-semibold text-aux-orange">
                DeFi Positions (
                {formatUsdValue(fundsData.positions.totalUsdValue)})
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
  const formattedBalance =
    Number.parseFloat(token.balance) / Math.pow(10, token.decimals)
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
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div>
      <div
        className="flex cursor-pointer items-center justify-between hover:text-coffee-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-coffee-400">{isExpanded ? 'v' : '>'}</span>
          <span className="text-coffee-300">{protocol.name}</span>
        </div>
        <span className="text-aux-green">
          {formatUsdValue(protocol.totalUsdValue)}
        </span>
      </div>

      {isExpanded && (
        <div className="mt-1 ml-4 flex flex-col gap-1">
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
                      {t.amount.toLocaleString(undefined, {
                        maximumFractionDigits: 4,
                      })}{' '}
                      {t.symbol}
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

  const {
    data: fundsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['funds-data', project],
    queryFn: () => getFundsData(project),
  })

  const { data: contractTags } = useContractTags(project)

  // Build contract name lookup map from projectData
  const contractNameMap = useMemo(() => {
    if (!projectData?.entries) return new Map<string, string>()
    const map = new Map<string, string>()
    projectData.entries.forEach((entry: any) => {
      ;[...entry.initialContracts, ...entry.discoveredContracts].forEach(
        (c: any) => {
          map.set(c.address.toLowerCase(), c.name)
        },
      )
    })
    return map
  }, [projectData])

  // Build proxy type lookup map from projectData
  const proxyTypeMap = useMemo(
    () => buildProxyTypeMap(projectData),
    [projectData],
  )

  // Count contracts with funds fetching enabled
  const contractsWithFundsEnabled =
    contractTags?.tags.filter((t) => t.fetchBalances || t.fetchPositions)
      .length ?? 0

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
        <h2 className="p-2 font-bold text-2xl text-aux-blue">Funds Data:</h2>
        <div className="mb-1 flex flex-col gap-2 border-transparent border-l-4 p-2 pl-1">
          <p className="text-coffee-400">Loading funds data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-b border-b-coffee-600 pb-2">
        <h2 className="p-2 font-bold text-2xl text-aux-blue">Funds Data:</h2>
        <div className="mb-1 flex flex-col gap-2 border-transparent border-l-4 p-2 pl-1">
          <p className="text-aux-red">
            Error loading funds data: {String(error)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-b border-b-coffee-600 pb-2">
      <div className="flex items-center justify-between p-2">
        <h2 className="font-bold text-2xl text-aux-blue">Funds Data:</h2>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-1 text-coffee-400 text-xs">
            <input
              type="checkbox"
              checked={forceRefresh}
              onChange={(e) => setForceRefresh(e.target.checked)}
              disabled={isFetching}
              className="h-3 w-3"
            />
            Force refresh
          </label>
          <button
            className={`rounded px-3 py-1 text-sm ${
              isFetching
                ? 'cursor-not-allowed bg-coffee-600 text-coffee-400'
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
            {isFetching
              ? 'Fetching...'
              : `Fetch Funds (${contractsWithFundsEnabled})`}
          </button>
        </div>
      </div>

      <div className="mb-1 flex flex-col gap-2 border-transparent border-l-4 p-2 pl-1">
        {/* Fetch Progress */}
        {isFetching && fetchProgress.length > 0 && (
          <div className="max-h-32 overflow-auto rounded bg-coffee-800 p-2 font-mono text-coffee-300 text-xs">
            {fetchProgress.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        )}

        {/* Summary */}
        {contractCount > 0 ? (
          <>
            <div className="ml-2 text-sm">
              <div className="mb-2 flex gap-8">
                <span className="text-coffee-300">
                  Last updated:{' '}
                  <span className="text-coffee-400">
                    {fundsData?.lastModified
                      ? formatTimestamp(fundsData.lastModified)
                      : 'Never'}
                  </span>
                </span>
              </div>
              <div className="mb-2 flex gap-8">
                <span className="font-semibold">
                  Total Value:{' '}
                  <span className="text-aux-green text-lg">
                    {formatUsdValue(totalValue)}
                  </span>
                </span>
              </div>
              <div className="mb-3 flex gap-6 text-coffee-400 text-xs">
                <span>Balances: {formatUsdValue(totalBalancesValue)}</span>
                <span>Positions: {formatUsdValue(totalPositionsValue)}</span>
                <span>Contracts: {contractCount}</span>
              </div>
            </div>

            {/* Contract List */}
            <div className="ml-2 rounded border border-coffee-700">
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
                ),
              )}
            </div>
          </>
        ) : (
          <div className="ml-2 text-coffee-400 text-sm">
            <p>No funds data available.</p>
            <p className="mt-1 text-coffee-500">
              Mark contracts with "Fetch Balances" or "Fetch Positions" in
              contract tags, then click "Fetch Funds" to retrieve data.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
