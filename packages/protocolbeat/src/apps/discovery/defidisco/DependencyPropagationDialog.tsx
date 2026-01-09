import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export interface AffectedFunction {
  contractAddress: string
  contractName: string
  functionName: string
}

export interface ExternalContract {
  address: string
  name: string
}

interface DependencyPropagationDialogProps {
  mode: 'add' | 'remove'
  externalContracts: ExternalContract[]
  affectedFunctions: AffectedFunction[]
  onConfirm: (selectedFunctions: AffectedFunction[]) => Promise<void>
  onCancel: () => void
  onSkip: () => void
}

interface GroupedFunctions {
  [contractAddress: string]: {
    contractName: string
    functions: AffectedFunction[]
  }
}

export function DependencyPropagationDialog({
  mode,
  externalContracts,
  affectedFunctions,
  onConfirm,
  onCancel,
  onSkip,
}: DependencyPropagationDialogProps) {
  const [selectedFunctions, setSelectedFunctions] = useState<Set<string>>(
    new Set(),
  )
  const [expandedContracts, setExpandedContracts] = useState<Set<string>>(
    new Set(),
  )
  const [isLoading, setIsLoading] = useState(false)

  // Group functions by contract
  const groupedFunctions: GroupedFunctions = affectedFunctions.reduce(
    (acc, func) => {
      if (!acc[func.contractAddress]) {
        acc[func.contractAddress] = {
          contractName: func.contractName,
          functions: [],
        }
      }
      acc[func.contractAddress].functions.push(func)
      return acc
    },
    {} as GroupedFunctions,
  )

  // Initialize all functions as selected (pre-checked)
  useEffect(() => {
    const allFunctionKeys = affectedFunctions.map(
      (func) => `${func.contractAddress}:${func.functionName}`,
    )
    setSelectedFunctions(new Set(allFunctionKeys))
  }, [affectedFunctions])

  const handleToggleFunction = (func: AffectedFunction) => {
    const key = `${func.contractAddress}:${func.functionName}`
    const newSelected = new Set(selectedFunctions)
    if (newSelected.has(key)) {
      newSelected.delete(key)
    } else {
      newSelected.add(key)
    }
    setSelectedFunctions(newSelected)
  }

  const handleToggleContract = (contractAddress: string) => {
    const contractFunctions = groupedFunctions[contractAddress]?.functions || []
    const allSelected = contractFunctions.every((func) =>
      selectedFunctions.has(`${func.contractAddress}:${func.functionName}`),
    )

    const newSelected = new Set(selectedFunctions)
    contractFunctions.forEach((func) => {
      const key = `${func.contractAddress}:${func.functionName}`
      if (allSelected) {
        newSelected.delete(key)
      } else {
        newSelected.add(key)
      }
    })
    setSelectedFunctions(newSelected)
  }

  const handleSelectAll = () => {
    const allFunctionKeys = affectedFunctions.map(
      (func) => `${func.contractAddress}:${func.functionName}`,
    )
    setSelectedFunctions(new Set(allFunctionKeys))
  }

  const handleDeselectAll = () => {
    setSelectedFunctions(new Set())
  }

  const handleToggleExpanded = (contractAddress: string) => {
    const newExpanded = new Set(expandedContracts)
    if (newExpanded.has(contractAddress)) {
      newExpanded.delete(contractAddress)
    } else {
      newExpanded.add(contractAddress)
    }
    setExpandedContracts(newExpanded)
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      const functionsToUpdate = affectedFunctions.filter((func) =>
        selectedFunctions.has(`${func.contractAddress}:${func.functionName}`),
      )
      await onConfirm(functionsToUpdate)
    } finally {
      setIsLoading(false)
    }
  }

  const isContractFullySelected = (contractAddress: string) => {
    const contractFunctions = groupedFunctions[contractAddress]?.functions || []
    return (
      contractFunctions.length > 0 &&
      contractFunctions.every((func) =>
        selectedFunctions.has(`${func.contractAddress}:${func.functionName}`),
      )
    )
  }

  const isContractPartiallySelected = (contractAddress: string) => {
    const contractFunctions = groupedFunctions[contractAddress]?.functions || []
    const selectedCount = contractFunctions.filter((func) =>
      selectedFunctions.has(`${func.contractAddress}:${func.functionName}`),
    ).length
    return selectedCount > 0 && selectedCount < contractFunctions.length
  }

  const selectedCount = selectedFunctions.size

  const dialogContent = (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center bg-black/50 p-4 pt-24">
      <div className="flex max-h-[calc(100vh-12rem)] w-[600px] flex-col rounded border border-coffee-600 bg-coffee-800 shadow-xl">
        {/* Header */}
        <div className="border-coffee-600 border-b p-4">
          <h2 className="font-semibold text-lg">
            {mode === 'add'
              ? 'Add Dependencies to Connected Functions?'
              : 'Remove Dependencies from Functions?'}
          </h2>
        </div>

        {/* Content */}
        <div className="scrollbar-thin flex-1 overflow-y-auto p-4">
          {/* External contracts list */}
          <div className="mb-4">
            <div className="mb-2 font-medium text-coffee-300 text-sm">
              {mode === 'add' ? 'Marking as external:' : 'Marking as internal:'}
            </div>
            <ul className="space-y-1 text-sm">
              {externalContracts.map((contract) => (
                <li key={contract.address} className="text-coffee-200">
                  • {contract.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Description */}
          <div className="mb-3 text-coffee-300 text-sm">
            {mode === 'add'
              ? `This will add dependencies to ${affectedFunctions.length} function${affectedFunctions.length !== 1 ? 's' : ''}:`
              : `This will remove dependencies from ${affectedFunctions.length} function${affectedFunctions.length !== 1 ? 's' : ''}:`}
          </div>

          {/* Select/Deselect All */}
          <div className="mb-3 flex gap-2">
            <button
              className="rounded border border-coffee-600 bg-coffee-700 px-3 py-1 text-xs hover:bg-coffee-600 disabled:opacity-50"
              onClick={handleSelectAll}
              disabled={isLoading}
            >
              Select All
            </button>
            <button
              className="rounded border border-coffee-600 bg-coffee-700 px-3 py-1 text-xs hover:bg-coffee-600 disabled:opacity-50"
              onClick={handleDeselectAll}
              disabled={isLoading}
            >
              Deselect All
            </button>
          </div>

          {/* Grouped functions list */}
          <div className="space-y-2">
            {Object.entries(groupedFunctions).map(
              ([contractAddress, { contractName, functions }]) => {
                const isExpanded = expandedContracts.has(contractAddress)
                const isFullySelected = isContractFullySelected(contractAddress)
                const isPartiallySelected =
                  isContractPartiallySelected(contractAddress)

                return (
                  <div
                    key={contractAddress}
                    className="rounded border border-coffee-600 bg-coffee-700"
                  >
                    {/* Contract header */}
                    <div className="flex items-center gap-2 p-2">
                      <input
                        type="checkbox"
                        checked={isFullySelected}
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = isPartiallySelected
                          }
                        }}
                        onChange={() => handleToggleContract(contractAddress)}
                        disabled={isLoading}
                        className="cursor-pointer"
                      />
                      <button
                        className="flex flex-1 items-center gap-2 text-left font-medium text-sm hover:text-coffee-200"
                        onClick={() => handleToggleExpanded(contractAddress)}
                        disabled={isLoading}
                      >
                        <span className="text-xs">
                          {isExpanded ? '▼' : '▶'}
                        </span>
                        <span>
                          {contractName} ({functions.length} function
                          {functions.length !== 1 ? 's' : ''})
                        </span>
                      </button>
                    </div>

                    {/* Functions list */}
                    {isExpanded && (
                      <div className="border-coffee-600 border-t p-2">
                        {functions.map((func) => {
                          const key = `${func.contractAddress}:${func.functionName}`
                          const isSelected = selectedFunctions.has(key)

                          return (
                            <label
                              key={key}
                              className="flex cursor-pointer items-center gap-2 py-1 pl-4 hover:bg-coffee-600"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleFunction(func)}
                                disabled={isLoading}
                                className="cursor-pointer"
                              />
                              <span className="font-mono text-sm">
                                {func.functionName}()
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              },
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-coffee-600 border-t p-4">
          <div className="mb-3 text-coffee-300 text-sm">
            {selectedCount > 0
              ? `${selectedCount} function${selectedCount !== 1 ? 's' : ''} selected`
              : 'No functions selected'}
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="rounded border border-coffee-600 bg-coffee-700 px-4 py-2 text-sm hover:bg-coffee-600 disabled:opacity-50"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="rounded border border-coffee-600 bg-coffee-700 px-4 py-2 text-sm hover:bg-coffee-600 disabled:opacity-50"
              onClick={onSkip}
              disabled={isLoading}
            >
              Skip
            </button>
            <button
              className="rounded border border-autumn-600 bg-autumn-700 px-4 py-2 text-sm hover:bg-autumn-600 disabled:opacity-50"
              onClick={handleConfirm}
              disabled={isLoading || selectedCount === 0}
            >
              {isLoading
                ? 'Processing...'
                : mode === 'add'
                  ? 'Add Dependencies'
                  : 'Remove Dependencies'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(dialogContent, document.body)
}
