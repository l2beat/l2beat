import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { getFunctions, getProject, updateFunction } from '../../../../api/api'
import type { ApiProjectContract } from '../../../../api/types'
import type {
  AffectedFunction,
  ExternalContract,
} from '../DependencyPropagationDialog'
import { useContractTags, useUpdateContractTag } from './useContractTags'

export interface ExternalToggleTarget {
  address: string
  name?: string
}

export interface PropagationDialogProps {
  show: boolean
  mode: 'add' | 'remove'
  externalContracts: ExternalContract[]
  affectedFunctions: AffectedFunction[]
  onConfirm: (selected: AffectedFunction[]) => Promise<void>
  onCancel: () => Promise<void>
  onSkip: () => Promise<void>
}

export function useExternalToggle(
  project: string,
  targets: ExternalToggleTarget[],
  onComplete?: () => void,
) {
  const queryClient = useQueryClient()
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

  // Check if any of the targets are external
  const hasExternalContract = targets.some((target) => {
    const normalizedAddress = target.address.toLowerCase().replace('eth:', '')
    const tag = contractTags?.tags.find(
      (tag) =>
        tag.contractAddress.toLowerCase().replace('eth:', '') ===
        normalizedAddress,
    )
    return tag?.isExternal ?? false
  })

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
  const analyzeAddDependencyImpact = (): {
    externalContracts: ExternalContract[]
    affectedFunctions: AffectedFunction[]
  } => {
    if (!projectData || !contractTags || !functionsData) {
      return { externalContracts: [], affectedFunctions: [] }
    }

    const allContracts = getAllContracts()

    // Map targets to external contracts, using the actual contract address from project data (with prefix)
    const externalContractsList: ExternalContract[] = targets.map((target) => {
      const normalizedAddress = target.address.toLowerCase().replace('eth:', '')
      const contract = allContracts.find((c) => {
        const normalizedContractAddress = c.address
          .toLowerCase()
          .replace('eth:', '')
        return normalizedContractAddress === normalizedAddress
      })
      // Use the contract's actual address (with prefix) or fallback to target address
      return {
        address: contract?.address || target.address,
        name: target.name || getContractName(target.address),
      }
    })

    const affectedFunctionsList: AffectedFunction[] = []

    // Create a set of target addresses for quick lookup (these are all being marked external)
    const targetAddresses = new Set(
      targets.map((t) => t.address.toLowerCase().replace('eth:', '')),
    )

    // For each external contract, find referencing contracts
    for (const target of targets) {
      const normalizedAddress = target.address.toLowerCase().replace('eth:', '')
      const extContract = allContracts.find((c) => {
        const normalizedContractAddress = c.address
          .toLowerCase()
          .replace('eth:', '')
        return normalizedContractAddress === normalizedAddress
      })

      if (!extContract?.referencedBy) continue

      // Filter to only internal contracts
      for (const ref of extContract.referencedBy) {
        // Check if the referencing contract is one of the targets being marked external
        const normalizedRefAddress = ref.address
          .toLowerCase()
          .replace('eth:', '')
        if (targetAddresses.has(normalizedRefAddress)) {
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
        const refContractData = allContracts.find((c) => {
          const normalizedContractAddr = c.address
            .toLowerCase()
            .replace('eth:', '')
          return normalizedContractAddr === normalizedRefAddress
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

  // Analyze impact when marking contracts as internal (uses referencedBy, same as add analysis)
  const analyzeRemoveDependencyImpact = (): {
    externalContracts: ExternalContract[]
    affectedFunctions: AffectedFunction[]
  } => {
    if (!projectData || !contractTags) {
      return { externalContracts: [], affectedFunctions: [] }
    }

    const allContracts = getAllContracts()

    // Map targets to external contracts, using the actual contract address from project data (with prefix)
    const externalContractsList: ExternalContract[] = targets.map((target) => {
      const normalizedAddress = target.address.toLowerCase().replace('eth:', '')
      const contract = allContracts.find((c) => {
        const normalizedContractAddress = c.address
          .toLowerCase()
          .replace('eth:', '')
        return normalizedContractAddress === normalizedAddress
      })
      return {
        address: contract?.address || target.address,
        name: target.name || getContractName(target.address),
      }
    })

    const affectedFunctionsList: AffectedFunction[] = []

    // Create a set of target addresses for quick lookup
    const targetAddresses = new Set(
      targets.map((t) => t.address.toLowerCase().replace('eth:', '')),
    )

    // Use referencedBy from project data to find referencing contracts (same as add analysis)
    for (const target of targets) {
      const normalizedAddress = target.address.toLowerCase().replace('eth:', '')
      const extContract = allContracts.find((c) => {
        const normalizedContractAddress = c.address
          .toLowerCase()
          .replace('eth:', '')
        return normalizedContractAddress === normalizedAddress
      })

      if (!extContract?.referencedBy) continue

      for (const ref of extContract.referencedBy) {
        // Skip contracts being marked internal in this batch
        const normalizedRefAddress = ref.address
          .toLowerCase()
          .replace('eth:', '')
        if (targetAddresses.has(normalizedRefAddress)) {
          continue
        }

        // Skip already-external contracts (they wouldn't have dependencies on this one)
        const refTag = contractTags.tags.find(
          (tag) =>
            tag.contractAddress.toLowerCase().replace('eth:', '') ===
            normalizedRefAddress,
        )
        if (refTag?.isExternal) continue

        // Get ALL write functions for this contract from ABIs
        const allFunctionNames = new Set<string>()
        const refContractData = allContracts.find((c) => {
          const normalizedContractAddr = c.address
            .toLowerCase()
            .replace('eth:', '')
          return normalizedContractAddr === normalizedRefAddress
        })

        if (refContractData?.abis) {
          for (const abi of refContractData.abis) {
            const readMarkers = [' view ', ' pure ']
            const writeFunctions = abi.entries.filter((entry) => {
              if (
                entry.value.startsWith('error') ||
                entry.value.startsWith('event')
              ) {
                return false
              }
              return !readMarkers.some((marker) => entry.value.includes(marker))
            })

            for (const entry of writeFunctions) {
              const match = entry.value.match(/function\s+(\w+)\s*\(/)
              if (match && match[1]) {
                allFunctionNames.add(match[1])
              }
            }
          }
        }

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

  // Helper to mark targets as external or internal
  const markTargets = async (isExternal: boolean) => {
    await Promise.all(
      targets.map((target) => {
        const normalizedAddress = target.address
          .toLowerCase()
          .replace('eth:', '')
        const tag = contractTags?.tags.find(
          (tag) =>
            tag.contractAddress.toLowerCase().replace('eth:', '') ===
            normalizedAddress,
        )
        return updateContractTag.mutateAsync({
          contractAddress: target.address,
          isExternal,
          // Preserve existing attributes if any
          ...(isExternal && tag
            ? {
                centralization: tag.centralization,
                likelihood: tag.likelihood,
              }
            : {}),
        })
      }),
    )
  }

  const handleToggleExternal = async () => {
    const newExternalStatus = !hasExternalContract

    try {
      // CRITICAL: Mark contracts as external FIRST (if marking external)
      if (newExternalStatus) {
        await markTargets(true)

        // Refresh contract tags to get updated external status
        await queryClient.invalidateQueries({
          queryKey: ['contractTags', project],
        })
        await queryClient.refetchQueries({
          queryKey: ['contractTags', project],
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
          await markTargets(false)
        }
        onComplete?.()
      }
    } catch (error) {
      console.error('Error toggling external status:', error)
      onComplete?.()
    }
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
        await markTargets(false)
      }

      setShowPropagationDialog(false)
      onComplete?.()
    }
  }

  const handleSkipPropagation = async () => {
    // User wants to skip dependency updates
    if (propagationMode === 'remove') {
      // Still need to mark as internal
      await markTargets(false)
    }

    setShowPropagationDialog(false)
    onComplete?.()
  }

  const handleCancelPropagation = async () => {
    // User wants to cancel the entire operation
    if (propagationMode === 'add') {
      // Rollback external marking
      await markTargets(false)
    }

    setShowPropagationDialog(false)
    onComplete?.()
  }

  const propagationDialogProps: PropagationDialogProps = {
    show: showPropagationDialog,
    mode: propagationMode,
    externalContracts,
    affectedFunctions,
    onConfirm: handleConfirmPropagation,
    onCancel: handleCancelPropagation,
    onSkip: handleSkipPropagation,
  }

  return {
    hasExternalContract,
    handleToggleExternal,
    propagationDialogProps,
  }
}
