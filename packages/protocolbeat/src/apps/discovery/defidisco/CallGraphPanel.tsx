import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCallGraphData } from '../../../api/api'
import type { ContractCallGraph, ExternalCall } from '../../../api/types'
import { usePanelStore } from '../store/panel-store'

export function CallGraphPanel() {
  const { project } = useParams()
  const [expandedContracts, setExpandedContracts] = useState<Set<string>>(new Set())

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['call-graph', project],
    queryFn: () => getCallGraphData(project),
  })

  if (isLoading) {
    return <div className="flex h-full w-full items-center justify-center">Loading...</div>
  }

  if (error) {
    return <div className="flex h-full w-full items-center justify-center text-aux-red">Error loading call graph data</div>
  }

  if (!data || Object.keys(data.contracts).length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-coffee-400">
        <div>No call graph data available</div>
        <div className="text-sm">Use the "Generate Call Graph" button in the Terminal panel</div>
      </div>
    )
  }

  const contracts = Object.values(data.contracts)

  // Calculate statistics
  const totalCalls = contracts.reduce((sum, c) => sum + c.externalCalls.length, 0)
  const resolvedCalls = contracts.reduce(
    (sum, c) => sum + c.externalCalls.filter(call => call.resolvedAddress).length,
    0
  )
  const viewCalls = contracts.reduce(
    (sum, c) => sum + c.externalCalls.filter(call => call.isViewCall === true).length,
    0
  )
  const writeCalls = contracts.reduce(
    (sum, c) => sum + c.externalCalls.filter(call => call.isViewCall === false).length,
    0
  )
  const errorCount = contracts.filter(c => c.error).length
  const skippedCount = contracts.filter(c => c.skipped).length
  const successCount = contracts.length - errorCount - skippedCount

  const toggleContract = (address: string) => {
    setExpandedContracts(prev => {
      const next = new Set(prev)
      if (next.has(address)) {
        next.delete(address)
      } else {
        next.add(address)
      }
      return next
    })
  }

  return (
    <div className="flex h-full w-full flex-col text-sm">
      <div className="sticky top-0 z-10 bg-coffee-600 p-2 border-b border-coffee-500">
        <div className="font-bold text-lg mb-2">Call Graph Analysis</div>
        <div className="flex gap-4 text-xs">
          <span>Contracts: <span className="text-aux-green">{successCount}</span></span>
          <span>Skipped: <span className="text-aux-yellow">{skippedCount}</span></span>
          <span>Errors: <span className="text-aux-red">{errorCount}</span></span>
          <span>Calls: <span className="text-aux-blue">{resolvedCalls}/{totalCalls}</span></span>
          <span>Reads: <span className="text-aux-cyan">{viewCalls}</span></span>
          <span>Writes: <span className="text-aux-orange">{writeCalls}</span></span>
        </div>
        <div className="text-xs text-coffee-400 mt-1">
          Last updated: {new Date(data.lastModified).toLocaleString()}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {contracts.map(contract => (
          <ContractSection
            key={contract.address}
            contract={contract}
            isExpanded={expandedContracts.has(contract.address)}
            onToggle={() => toggleContract(contract.address)}
          />
        ))}
      </div>
    </div>
  )
}

interface ContractSectionProps {
  contract: ContractCallGraph
  isExpanded: boolean
  onToggle: () => void
}

function ContractSection({ contract, isExpanded, onToggle }: ContractSectionProps) {
  const selectGlobal = usePanelStore((state) => state.select)

  const callCount = contract.externalCalls.length
  const resolvedCount = contract.externalCalls.filter(c => c.resolvedAddress).length

  const getStatusColor = () => {
    if (contract.error) return 'text-aux-red'
    if (contract.skipped) return 'text-aux-yellow'
    return 'text-aux-green'
  }

  const getStatusText = () => {
    if (contract.error) return `Error: ${contract.error.slice(0, 50)}...`
    if (contract.skipped) return `Skipped: ${contract.skipReason}`
    return `${callCount} calls (${resolvedCount} resolved)`
  }

  const handleContractClick = (e: React.MouseEvent, address: string) => {
    e.stopPropagation()
    selectGlobal(address)
  }

  return (
    <div className="border-b border-coffee-500">
      <div
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-coffee-500"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <span className="text-coffee-400">{isExpanded ? '▼' : '▶'}</span>
          <span
            className="font-semibold text-aux-blue hover:underline cursor-pointer"
            onClick={(e) => handleContractClick(e, contract.address)}
          >
            {contract.name}
          </span>
          <span className="text-xs text-coffee-400">
            {contract.address.replace('eth:', '').slice(0, 10)}...
          </span>
        </div>
        <span className={`text-xs ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>
      {isExpanded && !contract.skipped && !contract.error && contract.externalCalls.length > 0 && (
        <div className="bg-coffee-700 p-2">
          <ExternalCallsList calls={contract.externalCalls} />
        </div>
      )}
    </div>
  )
}

interface ExternalCallsListProps {
  calls: ExternalCall[]
}

function ExternalCallsList({ calls }: ExternalCallsListProps) {
  const selectGlobal = usePanelStore((state) => state.select)

  // Group calls by caller function using Map to avoid prototype pollution issues
  const callsByFunctionMap = new Map<string, ExternalCall[]>()
  for (const call of calls) {
    const existing = callsByFunctionMap.get(call.callerFunction)
    if (existing) {
      existing.push(call)
    } else {
      callsByFunctionMap.set(call.callerFunction, [call])
    }
  }
  const callsByFunction = Object.fromEntries(callsByFunctionMap)

  const handleAddressClick = (address: string) => {
    selectGlobal(address)
  }

  return (
    <div className="space-y-2">
      {Object.entries(callsByFunction).map(([funcName, funcCalls]) => (
        <div key={funcName} className="text-xs">
          <div className="font-semibold text-coffee-200 mb-1">{funcName}()</div>
          <div className="ml-4 space-y-1">
            {funcCalls.map((call, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {/* Read/Write indicator */}
                {call.isViewCall === true && (
                  <span className="text-aux-cyan" title="Read (view/pure)">R</span>
                )}
                {call.isViewCall === false && (
                  <span className="text-aux-orange" title="Write (state-changing)">W</span>
                )}
                {call.isViewCall === undefined && (
                  <span className="text-coffee-400" title="Unknown">?</span>
                )}
                <span className="text-coffee-200">{call.storageVariable}</span>
                <span className="text-coffee-400">→</span>
                <span className="text-aux-teal">{call.calledFunction}()</span>
                {call.resolvedAddress ? (
                  <span
                    className="text-aux-green hover:underline cursor-pointer"
                    onClick={() => handleAddressClick(call.resolvedAddress!)}
                  >
                    [{call.resolvedContractName || call.resolvedAddress.slice(0, 14)}]
                  </span>
                ) : (
                  <span className="text-aux-yellow">[unresolved: {call.interfaceType}]</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
