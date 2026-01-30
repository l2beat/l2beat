import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  detectPermissionsWithAI,
  getAIModels,
  getFunctions,
  getProject,
} from '../../../api/api'
import type { ApiProjectContract } from '../../../api/types'
import { Checkbox } from '../../../components/Checkbox'

interface Props {
  project: string
  onClose: () => void
}

interface ScanResult {
  status: 'pending' | 'scanning' | 'success' | 'error'
  detectedCount?: number
  error?: string
  suggestedAction?: string
}

export function AIPermissionsScanDialog({ project, onClose }: Props) {
  const queryClient = useQueryClient()
  const [selectedContracts, setSelectedContracts] = useState<Set<string>>(
    new Set(),
  )
  const [scanResults, setScanResults] = useState<Map<string, ScanResult>>(
    new Map(),
  )
  const [isScanning, setIsScanning] = useState(false)
  const [currentScanIndex, setCurrentScanIndex] = useState(0)

  // Fetch available AI models from API
  const { data: availableModels } = useQuery({
    queryKey: ['ai-models'],
    queryFn: getAIModels,
  })

  // Model selection with localStorage persistence
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    const saved = localStorage.getItem('ai-model-preference')
    return saved || 'gpt-4o'
  })

  // Save model preference to localStorage
  useEffect(() => {
    localStorage.setItem('ai-model-preference', selectedModel)
  }, [selectedModel])

  const { data: projectData } = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })

  // Load functions data to check which contracts already have permissions
  const { data: functionsData } = useQuery({
    queryKey: ['functions', project],
    queryFn: () => getFunctions(project),
    enabled: !!project,
  })

  // Get all contracts with source code available
  const getScannableContracts = (): ApiProjectContract[] => {
    if (!projectData || !functionsData) return []

    const allContracts = projectData.entries.flatMap((e) => [
      ...e.initialContracts,
      ...e.discoveredContracts,
    ])

    // Filter contracts that have source code AND don't already have permission overrides
    return allContracts.filter((c) => {
      // Check if contract has fields (indicates it has been analyzed)
      if (!c.fields || c.fields.length === 0) return false

      // Check if this contract already has any permission overrides
      const contractFunctions =
        functionsData.contracts?.[c.address]?.functions || []
      const hasPermissions = contractFunctions.length > 0

      // Only include contracts that DON'T have any permission entries yet
      return !hasPermissions
    })
  }

  const scannableContracts = getScannableContracts()

  const handleToggle = (address: string) => {
    const newSelected = new Set(selectedContracts)
    if (newSelected.has(address)) {
      newSelected.delete(address)
    } else {
      newSelected.add(address)
    }
    setSelectedContracts(newSelected)
  }

  const handleSelectAll = () => {
    setSelectedContracts(new Set(scannableContracts.map((c) => c.address)))
  }

  const handleDeselectAll = () => {
    setSelectedContracts(new Set())
  }

  const handleScan = async () => {
    if (selectedContracts.size === 0) return

    setIsScanning(true)
    setCurrentScanIndex(0)

    const contractsToScan = Array.from(selectedContracts)
    const results = new Map<string, ScanResult>()

    // Initialize all as pending
    contractsToScan.forEach((address) => {
      results.set(address, { status: 'pending' })
    })
    setScanResults(new Map(results))

    // Scan each contract sequentially
    for (let i = 0; i < contractsToScan.length; i++) {
      const address = contractsToScan[i]
      setCurrentScanIndex(i + 1)

      // Update status to scanning
      results.set(address, { status: 'scanning' })
      setScanResults(new Map(results))

      try {
        const result = await detectPermissionsWithAI(
          project,
          address,
          selectedModel,
        )
        results.set(address, {
          status: 'success',
          detectedCount: result.detectedFunctions,
        })
      } catch (error: any) {
        results.set(address, {
          status: 'error',
          error: error.userMessage || error.message || 'Unknown error',
          suggestedAction: error.suggestedAction,
        })
        // Log technical details to console
        if (error.technicalDetails) {
          console.error(
            `Technical details for ${address}:`,
            error.technicalDetails,
          )
        }
      }

      setScanResults(new Map(results))
    }

    setIsScanning(false)

    // Invalidate queries to refresh UI
    await queryClient.invalidateQueries({
      queryKey: ['permission-overrides', project],
    })
  }

  const handleClose = () => {
    if (!isScanning) {
      onClose()
    }
  }

  const getStatusIcon = (address: string): string => {
    const result = scanResults.get(address)
    if (!result) return ''

    switch (result.status) {
      case 'scanning':
        return '⏳'
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      default:
        return ''
    }
  }

  const getStatusText = (address: string): string => {
    const result = scanResults.get(address)
    if (!result) return ''

    switch (result.status) {
      case 'scanning':
        return 'Scanning...'
      case 'success':
        return `Found ${result.detectedCount} function${result.detectedCount === 1 ? '' : 's'}`
      case 'error': {
        const errorText = `Error: ${result.error}`
        return result.suggestedAction
          ? `${errorText}. ${result.suggestedAction}`
          : errorText
      }
      default:
        return ''
    }
  }

  const allSelected =
    scannableContracts.length > 0 &&
    selectedContracts.size === scannableContracts.length
  const someSelected = selectedContracts.size > 0 && !allSelected

  const dialogContent = (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center bg-black/50 p-4 pt-24">
      <div className="flex max-h-[calc(100vh-12rem)] w-[700px] flex-col rounded border border-coffee-600 bg-coffee-800 shadow-xl">
        {/* Header */}
        <div className="border-coffee-600 border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg">AI Permissions Scanner</h2>
              <p className="mt-1 text-coffee-400 text-sm">
                Select contracts to scan for permissioned functions using AI
                analysis
              </p>
            </div>
            <div className="ml-4">
              <label className="mb-1 block text-coffee-400 text-xs">
                AI Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isScanning}
                className="rounded border border-coffee-600 bg-coffee-700 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {availableModels?.map((model) => (
                  <option key={model.key} value={model.key}>
                    {model.config.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {isScanning && (
          <div className="border-coffee-600 border-b bg-coffee-700 px-4 py-2">
            <div className="text-sm">
              <span className="font-semibold">
                Scanning {currentScanIndex} of {selectedContracts.size}...
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="scrollbar-thin flex-1 overflow-y-auto p-4">
          {/* Quick Actions */}
          <div className="mb-4 flex items-center justify-between border-coffee-600 border-b pb-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = someSelected
                  }
                }}
                onChange={() => {
                  if (allSelected || someSelected) {
                    handleDeselectAll()
                  } else {
                    handleSelectAll()
                  }
                }}
                disabled={isScanning}
                className="cursor-pointer"
              />
              <span className="font-medium text-sm">
                {selectedContracts.size} of {scannableContracts.length} selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                disabled={isScanning}
                className="text-autumn-400 text-sm hover:text-autumn-300 disabled:opacity-50"
              >
                Select All
              </button>
              <span className="text-coffee-600">|</span>
              <button
                onClick={handleDeselectAll}
                disabled={isScanning}
                className="text-autumn-400 text-sm hover:text-autumn-300 disabled:opacity-50"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Contract List */}
          {scannableContracts.length === 0 ? (
            <div className="py-8 text-center text-coffee-400">
              No scannable contracts found
            </div>
          ) : (
            <div className="space-y-2">
              {scannableContracts.map((contract) => {
                const isSelected = selectedContracts.has(contract.address)
                const statusIcon = getStatusIcon(contract.address)
                const statusText = getStatusText(contract.address)

                return (
                  <div
                    key={contract.address}
                    onClick={() =>
                      !isScanning && handleToggle(contract.address)
                    }
                    className={`flex items-start gap-3 rounded border p-3 transition-colors ${
                      isSelected
                        ? 'border-autumn-600 bg-autumn-900/20'
                        : 'border-coffee-600 bg-coffee-700'
                    } ${!isScanning ? 'cursor-pointer hover:bg-coffee-600' : 'cursor-not-allowed opacity-75'}`}
                  >
                    <div className="pt-1">
                      <Checkbox
                        checked={isSelected}
                        onClick={(e) => {
                          e?.stopPropagation()
                          if (!isScanning) handleToggle(contract.address)
                        }}
                        disabled={isScanning}
                        className="border"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono font-semibold text-sm">
                        {contract.name}
                      </div>
                      <div className="truncate font-mono text-coffee-400 text-xs">
                        {contract.address}
                      </div>
                      {statusText && (
                        <div
                          className={`mt-1 text-xs ${
                            scanResults.get(contract.address)?.status ===
                            'error'
                              ? 'text-red-400'
                              : 'text-coffee-300'
                          }`}
                        >
                          {statusIcon} {statusText}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-coffee-600 border-t p-4">
          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              disabled={isScanning}
              className="rounded border border-coffee-600 bg-coffee-700 px-4 py-2 text-sm hover:bg-coffee-600 disabled:opacity-50"
            >
              {isScanning
                ? 'Scanning...'
                : scanResults.size > 0
                  ? 'Close'
                  : 'Cancel'}
            </button>
            <button
              onClick={handleScan}
              disabled={isScanning || selectedContracts.size === 0}
              className="rounded bg-autumn-300 px-4 py-2 text-black text-sm hover:bg-autumn-400 disabled:opacity-50"
            >
              {isScanning
                ? 'Scanning...'
                : `Scan ${selectedContracts.size} Contract${selectedContracts.size === 1 ? '' : 's'}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(dialogContent, document.body)
}
