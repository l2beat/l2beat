import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getFunctions, getProject, updateFunction } from '../../../api/api'
import type { ApiProjectContract } from '../../../api/types'
import {
  useContractTags,
  useUpdateContractTag,
} from '../../../hooks/useContractTags'
import { ControlButton } from '../panel-nodes/controls/ControlButton'
import { useStore } from '../panel-nodes/store/store'
import {
  type AffectedFunction,
  DependencyPropagationDialog,
  type ExternalContract,
} from './DependencyPropagationDialog'

export function ExternalButton() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Missing project!')
  }

  const queryClient = useQueryClient()
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [showPropagationDialog, setShowPropagationDialog] = useState(false)
  const [propagationMode, setPropagationMode] = useState<'add' | 'remove'>(
    'add',
  )
  const [affectedFunctions, setAffectedFunctions] = useState<
    AffectedFunction[]
  >([])
  const [externalContracts, setExternalContracts] = useState<
    ExternalContract[]
  >([])

  const selected = useStore((state) => state.selected)
  const nodes = useStore((state) => state.nodes)
  const updateContractTag = useUpdateContractTag(project)
  const { data: contractTags } = useContractTags(project)
  const { data: projectData } = useQuery({
    queryKey: ['project', project],
    queryFn: () => getProject(project),
  })
  const { data: functionsData } = useQuery({
    queryKey: ['functions', project],
    queryFn: () => getFunctions(project),
  })

  const selectedNodes = nodes.filter((node) => selected.includes(node.id))
  const selectionExists = selected.length > 0

  // Check if any of the selected contracts are external
  const hasExternalContract = selectedNodes.some((node) => {
    const normalizedNodeAddress = node.address.toLowerCase().replace('eth:', '')
    const tag = contractTags?.tags.find(
      (tag) =>
        tag.contractAddress.toLowerCase().replace('eth:', '') ===
        normalizedNodeAddress,
    )
    return tag?.isExternal ?? false
  })

  useEffect(() => {
    if (!open) {
      return
    }
    function onClick(e: MouseEvent) {
      const box = ref.current?.getBoundingClientRect()
      if (
        !box ||
        e.clientX < box.left ||
        e.clientX > box.right ||
        e.clientY < box.top ||
        e.clientY > box.bottom
      ) {
        setOpen(false)
      }
    }

    // We use setTimeout to ignore the click on the button to open
    const timeout = setTimeout(
      () => window.addEventListener('click', onClick),
      0,
    )
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('click', onClick)
    }
  }, [ref, open, setOpen])

  // Helper function to get all contracts from project data
  const getAllContracts = (): ApiProjectContract[] => {
    if (!projectData) return []
    return projectData.entries.flatMap((e) => [
      ...e.initialContracts,
      ...e.discoveredContracts,
    ])
  }

  // Helper function to get contract name from address
  const getContractName = (address: string): string => {
    const allContracts = getAllContracts()
    const normalizedAddress = address.toLowerCase().replace('eth:', '')
    const contract = allContracts.find((c) => {
      const normalizedContractAddress = c.address
        .toLowerCase()
        .replace('eth:', '')
      return normalizedContractAddress === normalizedAddress
    })
    return contract?.name || address.slice(0, 10) + '...'
  }

  // Analyze impact when marking contracts as external
  const analyzeAddDependencyImpact = async (): Promise<{
    externalContracts: ExternalContract[]
    affectedFunctions: AffectedFunction[]
  }> => {
    if (!projectData || !contractTags || !functionsData) {
      return { externalContracts: [], affectedFunctions: [] }
    }

    const allContracts = getAllContracts()

    // Map selected nodes to external contracts, using the actual contract address from project data (with prefix)
    const externalContractsList: ExternalContract[] = selectedNodes.map(
      (node) => {
        const normalizedNodeAddress = node.address
          .toLowerCase()
          .replace('eth:', '')
        const contract = allContracts.find((c) => {
          const normalizedContractAddress = c.address
            .toLowerCase()
            .replace('eth:', '')
          return normalizedContractAddress === normalizedNodeAddress
        })
        // Use the contract's actual address (with prefix) or fallback to node address
        return {
          address: contract?.address || node.address,
          name: node.name || getContractName(node.address),
        }
      },
    )

    const affectedFunctionsList: AffectedFunction[] = []

    // Create a set of selected node addresses for quick lookup (these are all being marked external)
    const selectedNodeAddresses = new Set(
      selectedNodes.map((n) => n.address.toLowerCase().replace('eth:', '')),
    )

    // For each external contract, find referencing contracts
    for (const extNode of selectedNodes) {
      // Normalize addresses for comparison (remove eth: prefix)
      const normalizedNodeAddress = extNode.address
        .toLowerCase()
        .replace('eth:', '')
      const extContract = allContracts.find((c) => {
        const normalizedContractAddress = c.address
          .toLowerCase()
          .replace('eth:', '')
        return normalizedContractAddress === normalizedNodeAddress
      })

      if (!extContract?.referencedBy) continue

      // Filter to only internal contracts
      for (const ref of extContract.referencedBy) {
        // Check if the referencing contract is one of the selected nodes being marked external
        const normalizedRefAddress = ref.address
          .toLowerCase()
          .replace('eth:', '')
        if (selectedNodeAddresses.has(normalizedRefAddress)) {
          continue // Skip contracts being marked external in this batch
        }

        // Check if the referencing contract is already external
        const refTag = contractTags.tags.find(
          (tag) =>
            tag.contractAddress.toLowerCase().replace('eth:', '') ===
            normalizedRefAddress,
        )

        if (refTag?.isExternal) continue // Skip already external contracts

        // Get ALL write functions for this contract from ABIs (same logic as PermissionsDisplay)
        const allFunctionNames = new Set<string>()

        // Find the contract data to get ABIs
        const normalizedRefAddr = ref.address.toLowerCase().replace('eth:', '')
        const refContractData = allContracts.find((c) => {
          const normalizedContractAddr = c.address
            .toLowerCase()
            .replace('eth:', '')
          return normalizedContractAddr === normalizedRefAddr
        })

        if (refContractData?.abis) {
          for (const abi of refContractData.abis) {
            // Filter to only write functions (same as PermissionsDisplay logic)
            const readMarkers = [' view ', ' pure ']
            const writeFunctions = abi.entries.filter((entry) => {
              // Skip errors and events
              if (
                entry.value.startsWith('error') ||
                entry.value.startsWith('event')
              ) {
                return false
              }
              // Skip view and pure functions
              return !readMarkers.some((marker) => entry.value.includes(marker))
            })

            // Extract function names
            for (const entry of writeFunctions) {
              const match = entry.value.match(/function\s+(\w+)\s*\(/)
              if (match && match[1]) {
                allFunctionNames.add(match[1])
              }
            }
          }
        }

        // For each function, add to affected list
        for (const functionName of allFunctionNames) {
          affectedFunctionsList.push({
            contractAddress: ref.address,
            contractName: ref.name || getContractName(ref.address),
            functionName,
          })
        }
      }
    }

    return {
      externalContracts: externalContractsList,
      affectedFunctions: affectedFunctionsList,
    }
  }

  // Analyze impact when marking contracts as internal
  const analyzeRemoveDependencyImpact = async (): Promise<{
    externalContracts: ExternalContract[]
    affectedFunctions: AffectedFunction[]
  }> => {
    if (!functionsData) {
      return { externalContracts: [], affectedFunctions: [] }
    }

    const allContracts = getAllContracts()

    // Map selected nodes to external contracts, using the actual contract address from project data (with prefix)
    const externalContractsList: ExternalContract[] = selectedNodes.map(
      (node) => {
        const normalizedNodeAddress = node.address
          .toLowerCase()
          .replace('eth:', '')
        const contract = allContracts.find((c) => {
          const normalizedContractAddress = c.address
            .toLowerCase()
            .replace('eth:', '')
          return normalizedContractAddress === normalizedNodeAddress
        })
        // Use the contract's actual address (with prefix) or fallback to node address
        return {
          address: contract?.address || node.address,
          name: node.name || getContractName(node.address),
        }
      },
    )

    const affectedFunctionsList: AffectedFunction[] = []
    const nodeAddresses = selectedNodes.map((n) =>
      n.address.toLowerCase().replace('eth:', ''),
    )

    // Scan all contracts in functions.json
    Object.entries(functionsData.contracts).forEach(
      ([contractAddr, contractData]) => {
        contractData.functions.forEach((func) => {
          // Check if this function has any of the nodes as dependencies
          const hasDependency = func.dependencies?.some((dep) => {
            const normalizedDepAddress = dep.contractAddress
              .toLowerCase()
              .replace('eth:', '')
            return nodeAddresses.includes(normalizedDepAddress)
          })

          if (hasDependency) {
            affectedFunctionsList.push({
              contractAddress: contractAddr,
              contractName: getContractName(contractAddr),
              functionName: func.functionName,
            })
          }
        })
      },
    )

    return {
      externalContracts: externalContractsList,
      affectedFunctions: affectedFunctionsList,
    }
  }

  const handleToggleExternal = async () => {
    // If not external, mark as external
    // If external, mark as internal (remove tag)
    const newExternalStatus = !hasExternalContract

    try {
      // CRITICAL: Mark contracts as external FIRST (if marking external)
      if (newExternalStatus) {
        await Promise.all(
          selectedNodes.map((node) => {
            const normalizedNodeAddress = node.address
              .toLowerCase()
              .replace('eth:', '')
            const tag = contractTags?.tags.find(
              (tag) =>
                tag.contractAddress.toLowerCase().replace('eth:', '') ===
                normalizedNodeAddress,
            )
            return updateContractTag.mutateAsync({
              contractAddress: node.address,
              isExternal: true,
              // Preserve existing attributes if any
              centralization: tag?.centralization,
              likelihood: tag?.likelihood,
            })
          }),
        )

        // Refresh contract tags to get updated external status
        await queryClient.invalidateQueries({
          queryKey: ['contract-tags', project],
        })
        await queryClient.refetchQueries({
          queryKey: ['contract-tags', project],
        })
      }

      // Then analyze impact (won't include newly marked external contracts)
      const impact = newExternalStatus
        ? await analyzeAddDependencyImpact()
        : await analyzeRemoveDependencyImpact()

      if (impact.affectedFunctions.length > 0) {
        // Show dialog for user to select functions
        setExternalContracts(impact.externalContracts)
        setAffectedFunctions(impact.affectedFunctions)
        setPropagationMode(newExternalStatus ? 'add' : 'remove')
        setShowPropagationDialog(true)
      } else {
        // No affected functions
        if (!newExternalStatus) {
          // If marking as internal, do it now (external marking already done above)
          await Promise.all(
            selectedNodes.map((node) =>
              updateContractTag.mutateAsync({
                contractAddress: node.address,
                isExternal: false,
              }),
            ),
          )
        }
        setOpen(false)
      }
    } catch (error) {
      console.error('Error toggling external status:', error)
      setOpen(false)
    }
  }

  const handleSetAttributes = async (
    centralization: 'high' | 'medium' | 'low' | 'immutable',
    likelihood: 'high' | 'medium' | 'low' | 'mitigated',
  ) => {
    const promises = selectedNodes.map((node) => {
      const normalizedNodeAddress = node.address
        .toLowerCase()
        .replace('eth:', '')
      const tag = contractTags?.tags.find(
        (tag) =>
          tag.contractAddress.toLowerCase().replace('eth:', '') ===
          normalizedNodeAddress,
      )
      return updateContractTag.mutateAsync({
        contractAddress: node.address, // Backend will normalize to ensure eth: prefix
        isExternal: tag?.isExternal ?? true,
        centralization,
        likelihood,
      })
    })

    await Promise.all(promises)
    setOpen(false)
  }

  // Helper functions for bulk dependency updates
  const addDependencyToFunction = async (func: AffectedFunction) => {
    if (!functionsData) return

    // Get current function data
    const currentFunc = functionsData.contracts[
      func.contractAddress
    ]?.functions.find((f) => f.functionName === func.functionName)

    const currentDependencies = currentFunc?.dependencies || []

    // Check for duplicates and add new dependencies
    const newDependencies = externalContracts
      .filter(
        (ext) =>
          !currentDependencies.some(
            (dep) =>
              dep.contractAddress.toLowerCase() === ext.address.toLowerCase(),
          ),
      )
      .map((ext) => ({ contractAddress: ext.address }))

    if (newDependencies.length === 0) {
      return // No new dependencies to add
    }

    // Update function with new dependencies
    await updateFunction(project, {
      contractAddress: func.contractAddress,
      functionName: func.functionName,
      dependencies: [...currentDependencies, ...newDependencies],
    })
  }

  const removeDependencyFromFunction = async (func: AffectedFunction) => {
    if (!functionsData) return

    // Get current function data
    const currentFunc = functionsData.contracts[
      func.contractAddress
    ]?.functions.find((f) => f.functionName === func.functionName)

    if (!currentFunc?.dependencies) {
      return // No dependencies to remove
    }

    // Remove specified external contracts from dependencies
    const externalAddresses = externalContracts.map((ext) =>
      ext.address.toLowerCase(),
    )
    const newDependencies = currentFunc.dependencies.filter(
      (dep) => !externalAddresses.includes(dep.contractAddress.toLowerCase()),
    )

    // Update function with filtered dependencies
    // Backend will handle cleanup if this becomes an empty entry
    await updateFunction(project, {
      contractAddress: func.contractAddress,
      functionName: func.functionName,
      dependencies: newDependencies.length > 0 ? newDependencies : [],
    })
  }

  // Dialog callback handlers
  const handleConfirmPropagation = async (
    selectedFunctions: AffectedFunction[],
  ) => {
    try {
      // Execute bulk dependency updates for selected functions
      const results = await Promise.allSettled(
        selectedFunctions.map((func) => {
          if (propagationMode === 'add') {
            return addDependencyToFunction(func)
          }
          return removeDependencyFromFunction(func)
        }),
      )

      // Count successes and failures
      const succeeded = results.filter((r) => r.status === 'fulfilled').length
      const failed = results.filter((r) => r.status === 'rejected').length

      // Log results
      if (failed > 0) {
        console.error(`Updated ${succeeded} functions, ${failed} failed`)
      }

      // Invalidate queries to refresh UI
      await queryClient.invalidateQueries({ queryKey: ['functions', project] })
    } finally {
      // Complete the operation
      if (propagationMode === 'remove') {
        // Mark contracts as internal (external marking already done in handleToggleExternal)
        await Promise.all(
          selectedNodes.map((node) =>
            updateContractTag.mutateAsync({
              contractAddress: node.address,
              isExternal: false,
            }),
          ),
        )
      }

      setShowPropagationDialog(false)
      setOpen(false)
    }
  }

  const handleSkipPropagation = async () => {
    // User wants to skip dependency updates
    if (propagationMode === 'remove') {
      // Still need to mark as internal
      await Promise.all(
        selectedNodes.map((node) =>
          updateContractTag.mutateAsync({
            contractAddress: node.address,
            isExternal: false,
          }),
        ),
      )
    }

    setShowPropagationDialog(false)
    setOpen(false)
  }

  const handleCancelPropagation = async () => {
    // User wants to cancel the entire operation
    if (propagationMode === 'add') {
      // Rollback external marking
      await Promise.all(
        selectedNodes.map((node) =>
          updateContractTag.mutateAsync({
            contractAddress: node.address,
            isExternal: false,
          }),
        ),
      )
    }

    setShowPropagationDialog(false)
    setOpen(false)
  }

  return (
    <>
      <ControlButton disabled={!selectionExists} onClick={() => setOpen(true)}>
        External
      </ControlButton>
      {open && (
        <div
          ref={ref}
          className="-translate-x-1/2 absolute bottom-14 left-1/2 w-max"
        >
          <AttributePicker
            onToggleExternal={handleToggleExternal}
            onSetAttributes={handleSetAttributes}
            hasExternalContract={hasExternalContract}
            selectedNodes={selectedNodes}
            contractTags={contractTags}
          />
        </div>
      )}
      {showPropagationDialog && (
        <DependencyPropagationDialog
          mode={propagationMode}
          externalContracts={externalContracts}
          affectedFunctions={affectedFunctions}
          onConfirm={handleConfirmPropagation}
          onCancel={handleCancelPropagation}
          onSkip={handleSkipPropagation}
        />
      )}
    </>
  )
}

interface AttributePickerProps {
  onToggleExternal: () => void | Promise<void>
  onSetAttributes: (
    centralization: 'high' | 'medium' | 'low' | 'immutable',
    likelihood: 'high' | 'medium' | 'low' | 'mitigated',
  ) => Promise<void>
  hasExternalContract: boolean
  selectedNodes: Array<{ id: string; address: string }>
  contractTags:
    | {
        tags: Array<{
          contractAddress: string
          centralization?: 'high' | 'medium' | 'low' | 'immutable'
          likelihood?: 'high' | 'medium' | 'low' | 'mitigated'
        }>
      }
    | undefined
}

function AttributePicker({
  onToggleExternal,
  onSetAttributes,
  hasExternalContract,
  selectedNodes,
  contractTags,
}: AttributePickerProps) {
  const centralizationOptions: Array<'high' | 'medium' | 'low' | 'immutable'> =
    ['high', 'medium', 'low', 'immutable']
  const likelihoodOptions: Array<'high' | 'medium' | 'low' | 'mitigated'> = [
    'high',
    'medium',
    'low',
    'mitigated',
  ]

  // Get current attributes from first selected node
  const getCurrentAttributes = () => {
    if (selectedNodes.length > 0 && selectedNodes[0]) {
      const normalizedNodeAddress = selectedNodes[0].address
        .toLowerCase()
        .replace('eth:', '')
      const tag = contractTags?.tags.find(
        (tag) =>
          tag.contractAddress.toLowerCase().replace('eth:', '') ===
          normalizedNodeAddress,
      )
      return {
        centralization: tag?.centralization || 'high',
        likelihood: tag?.likelihood || 'high',
      }
    }
    return { centralization: 'high' as const, likelihood: 'high' as const }
  }

  const currentAttrs = getCurrentAttributes()
  const [selectedCentralization, setSelectedCentralization] = useState<
    'high' | 'medium' | 'low' | 'immutable'
  >(currentAttrs.centralization)
  const [selectedLikelihood, setSelectedLikelihood] = useState<
    'high' | 'medium' | 'low' | 'mitigated'
  >(currentAttrs.likelihood)

  return (
    <div className="flex flex-col gap-3 rounded border border-coffee-600 bg-coffee-800 p-3 shadow-xl">
      {/* Toggle External button */}
      <button
        className="w-full rounded border border-coffee-600 bg-coffee-700 px-3 py-2 text-xs hover:bg-coffee-600"
        onClick={onToggleExternal}
      >
        {hasExternalContract ? 'Mark Internal' : 'Mark External'}
      </button>

      {/* Centralization + Likelihood Columns */}
      {hasExternalContract && (
        <>
          <div className="flex gap-3">
            {/* Centralization Column */}
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-coffee-300 text-xs">
                Centralization
              </div>
              {centralizationOptions.map((cent) => (
                <button
                  key={cent}
                  className={`rounded border border-coffee-600 px-3 py-2 text-xs capitalize ${
                    selectedCentralization === cent
                      ? 'bg-coffee-600'
                      : 'bg-coffee-700 hover:bg-coffee-600'
                  }`}
                  onClick={() => setSelectedCentralization(cent)}
                >
                  {cent}
                </button>
              ))}
            </div>

            {/* Likelihood Column */}
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-coffee-300 text-xs">
                Likelihood
              </div>
              {likelihoodOptions.map((lik) => (
                <button
                  key={lik}
                  className={`rounded border border-coffee-600 px-3 py-2 text-xs capitalize ${
                    selectedLikelihood === lik
                      ? 'bg-coffee-600'
                      : 'bg-coffee-700 hover:bg-coffee-600'
                  }`}
                  onClick={() => setSelectedLikelihood(lik)}
                >
                  {lik}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <button
            className="w-full rounded border border-coffee-600 bg-coffee-700 px-3 py-2 text-xs hover:bg-coffee-600"
            onClick={() =>
              onSetAttributes(selectedCentralization, selectedLikelihood)
            }
          >
            Apply
          </button>
        </>
      )}
    </div>
  )
}
