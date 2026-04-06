import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getAdmins,
  getDependencies,
  getFundsData,
  getProject,
  getEnhancedTraversal,
} from '../../../api/api'
import type {
  AdminEntry,
  AdminFunctionEntry,
  ApiAbiEntry,
  ApiAddressType,
  ContractFundsData,
  FunctionEntry,
  FunctionTraversalResult,
  ImpactCapUnit,
  Mitigation,
  MitigationType,
  MitigationValue,
  OwnerDefinition,
} from '../../../api/types'
import { normalizeMitigationValue } from '../../../api/types'
import * as solidity from '../../../components/editor/languages/solidity'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { IconChevronRight } from '../../../icons/IconChevronRight'
import { usePanelStore } from '../store/panel-store'
import {
  formatDelay,
  formatUsdValue,
  getAdminTypeColor,
  isZeroAddress,
  MIN_TOKEN_USD_VALUE,
} from '../../../defidisco/scoringShared'
import { addressesEqual, normalizeForLookup } from './addressUtils'
import { useContractTags } from './hooks/useContractTags'
import { IconCheckFalse } from './IconCheckFalse'
import { IconCheckTrue } from './IconCheckTrue'
import { IconClock } from './IconClock'
import { IconDependency } from './IconDependency'
import { IconKey } from './IconKey'
import { IconLockClosed } from './IconLockClosed'
import { IconLockOpen } from './IconLockOpen'
import { IconOpen } from './IconOpen'
import { IconVoltage } from './IconVoltage'
import { IconVoltageSlash } from './IconVoltageSlash'
import {
  resolveFieldValue,
  resolvePathExpression,
  UIContractDataAccess,
} from './ownerResolution'

// ============================================================================
// Enhanced Traversal Helpers
// ============================================================================

/** Normalize type for display — 'Untemplatized' → 'Contract' */
function displayType(type: ApiAddressType): string {
  if (type === 'Untemplatized') return 'Contract'
  return type
}

function formatFunctionNames(names: string[]): string {
  if (names.length <= 3) {
    return '.' + names.map((fn) => `${fn}()`).join(', .')
  }
  return (
    '.' +
    names
      .slice(0, 2)
      .map((fn) => `${fn}()`)
      .join(', .') +
    ` +${names.length - 2} more`
  )
}

function getAdminIconColor(admins: AdminEntry[]): string {
  if (admins.length === 0) return '#9ca3af' // gray - unresolved
  const hasEOA = admins.some(
    (a) => a.type === 'EOA' || a.type === 'EOAPermissioned',
  )
  const hasMultisig = admins.some((a) => a.type === 'Multisig')
  if (hasEOA) return '#f87171' // red
  if (hasMultisig) return '#fbbf24' // amber
  return '#10b981' // green - only contracts/timelocks
}

function getAdminIconTitle(admins: AdminEntry[]): string {
  if (admins.length === 0) return 'Admin (not yet resolved)'
  const types = [...new Set(admins.map((a) => a.type))]
  return `Terminals: ${types.join(', ')} (${admins.length} total)`
}

// Extended type for local display with contractAddress
interface FunctionEntryWithContract extends FunctionEntry {
  contractAddress: string
}

interface FunctionFolderProps {
  entry: ApiAbiEntry
  contractAddress: string
  functionName: string
  functions: FunctionEntryWithContract[]
  onPermissionToggle: (
    contractAddress: string,
    functionName: string,
    currentIsPermissioned: boolean,
  ) => void
  onCheckedToggle: (
    contractAddress: string,
    functionName: string,
    currentChecked: boolean,
  ) => void
  onScoreToggle: (
    contractAddress: string,
    functionName: string,
    currentScore: 'unscored' | 'critical' | 'no-impact',
  ) => void
  onDescriptionUpdate: (
    contractAddress: string,
    functionName: string,
    description: string,
  ) => void
  onOpenInCode: (contractAddress: string, functionName: string) => void
  onOwnerDefinitionsUpdate: (
    contractAddress: string,
    functionName: string,
    ownerDefinitions: OwnerDefinition[],
  ) => void
  onDelayUpdate: (
    contractAddress: string,
    functionName: string,
    delay: { contractAddress: string; fieldName: string } | null,
  ) => void
  onDependenciesUpdate: (
    contractAddress: string,
    functionName: string,
    dependencies?: { contractAddress: string }[],
  ) => void
  onMitigationsUpdate: (
    contractAddress: string,
    functionName: string,
    mitigations: Mitigation[] | null,
  ) => void
  onAddComment: (
    contractAddress: string,
    functionName: string,
    commentText: string,
  ) => void
  researcherGithub: string | null
}

export function FunctionFolder({
  entry,
  contractAddress,
  functionName,
  functions,
  onPermissionToggle,
  onCheckedToggle,
  onScoreToggle,
  onDescriptionUpdate,
  onOpenInCode,
  onOwnerDefinitionsUpdate,
  onDelayUpdate,
  onDependenciesUpdate,
  onMitigationsUpdate,
  onAddComment,
  researcherGithub,
}: FunctionFolderProps) {
  const { project } = useParams()
  const [isOpen, setIsOpen] = useState(false)

  // Get current function data for this function
  const currentFunction = functions.find(
    (o) =>
      addressesEqual(o.contractAddress, contractAddress) &&
      o.functionName === functionName,
  )

  // Fetch project data to get available contracts and fields
  const { data: projectData } = useQuery({
    queryKey: ['project', project],
    queryFn: () => (project ? getProject(project) : null),
    enabled: !!project,
  })

  // Fetch contract tags to get external contracts and their attributes
  const { data: contractTags } = useContractTags(project || '')

  // Fetch funds data for impact section
  const { data: fundsData } = useQuery({
    queryKey: ['funds-data', project],
    queryFn: () => (project ? getFundsData(project) : null),
    enabled: !!project,
  })

  const contractFunds: ContractFundsData | null = React.useMemo(() => {
    if (!fundsData?.contracts) return null
    const normalizedAddr = normalizeForLookup(contractAddress)
    const entry = Object.entries(fundsData.contracts).find(
      ([key]) => normalizeForLookup(key) === normalizedAddr,
    )
    return entry?.[1] ?? null
  }, [fundsData, contractAddress])

  // Fetch enhanced traversal data (React Query caches by key — shared across all FunctionFolder instances)
  const { data: traversalData } = useQuery({
    queryKey: ['enhanced-traversal', project],
    queryFn: () => (project ? getEnhancedTraversal(project) : null),
    enabled: !!project,
  })

  const functionTraversal: FunctionTraversalResult | null =
    React.useMemo(() => {
      if (!traversalData?.contracts) return null
      // Case-insensitive lookup — functions.json keys may differ in case from project data
      const normalizedAddr = normalizeForLookup(contractAddress)
      const contractEntry = Object.entries(traversalData.contracts).find(
        ([key]) => normalizeForLookup(key) === normalizedAddr,
      )
      return contractEntry?.[1]?.[functionName] ?? null
    }, [traversalData, contractAddress, functionName])

  // Fetch pre-computed admin data for this contract
  const { data: adminsData } = useQuery({
    queryKey: ['admins', project, contractAddress],
    queryFn: () => (project ? getAdmins(project, contractAddress) : null),
    enabled: !!project,
  })

  // Fetch pre-computed dependency data for this contract
  const { data: depsData } = useQuery({
    queryKey: ['dependencies', project, contractAddress],
    queryFn: () => (project ? getDependencies(project, contractAddress) : null),
    enabled: !!project,
  })

  // Admins that own this specific function
  const functionAdmins = React.useMemo(() => {
    if (!adminsData) return []
    return adminsData.admins.filter((admin) =>
      admin.functions.some(
        (f) =>
          addressesEqual(f.contractAddress, contractAddress) &&
          f.functionName === functionName,
      ),
    )
  }, [adminsData, contractAddress, functionName])

  // Capital data for this function (same across admins)
  const functionCapital: AdminFunctionEntry | null = React.useMemo(() => {
    for (const admin of functionAdmins) {
      const func = admin.functions.find(
        (f) =>
          addressesEqual(f.contractAddress, contractAddress) &&
          f.functionName === functionName,
      )
      if (func) return func
    }
    return null
  }, [functionAdmins, contractAddress, functionName])

  // Dependencies for this function
  const functionDeps = React.useMemo(() => {
    if (!depsData) return []
    return depsData.dependencies.filter((dep) =>
      dep.functions.some(
        (f) =>
          addressesEqual(f.contractAddress, contractAddress) &&
          f.functionName === functionName,
      ),
    )
  }, [depsData, contractAddress, functionName])

  // All contracts from project data (used by owner resolution and mitigation display)
  const allContracts = React.useMemo(() => {
    if (!projectData?.entries) return []
    return projectData.entries.flatMap((e) => [
      ...e.initialContracts,
      ...e.discoveredContracts,
    ])
  }, [projectData?.entries])

  // Owner resolution using unified path expressions with shared utility
  const resolvedOwners = React.useMemo(() => {
    if (!currentFunction?.ownerDefinitions || !projectData?.entries) {
      return []
    }

    const dataAccess = new UIContractDataAccess(allContracts)

    return currentFunction.ownerDefinitions.map((definition) => {
      const result = resolvePathExpression(
        dataAccess,
        contractAddress,
        definition.path,
      )

      if (result.error) {
        return {
          address: 'RESOLUTION_FAILED',
          source: definition,
          isResolved: false,
          error: result.error,
        }
      }

      return {
        address: result.addresses[0] || 'NO_ADDRESSES',
        source: definition,
        isResolved: true,
        allAddresses: result.addresses, // Keep all resolved addresses for display
        structuredValue: result.structuredValue, // Keep the structured value to preserve object structure
      }
    })
  }, [currentFunction?.ownerDefinitions, projectData, contractAddress])

  const ownersLoading = false
  const ownersError = null

  // Helper to get contract name from address
  const getContractName = (address: string): string => {
    if (!projectData?.entries) return address

    const contract = projectData.entries
      .flatMap((e) => [...e.initialContracts, ...e.discoveredContracts])
      .find((c) => addressesEqual(c.address, address))

    return contract?.name || address.slice(0, 10) + '...'
  }

  // Resolve delay value from projectData
  const resolvedDelay = React.useMemo(() => {
    if (!currentFunction?.delay || !projectData?.entries) {
      return null
    }

    const delayRef = currentFunction.delay

    try {
      for (const entry of projectData.entries) {
        const allContracts = [
          ...entry.initialContracts,
          ...entry.discoveredContracts,
        ]
        const contract = allContracts.find((c) =>
          addressesEqual(c.address, delayRef.contractAddress),
        )

        if (contract?.fields) {
          const field = contract.fields.find(
            (f) => f.name === delayRef.fieldName,
          )
          if (field?.value?.type === 'number') {
            const seconds = Number.parseInt(field.value.value, 10)
            if (!isNaN(seconds)) {
              return {
                seconds,
                isResolved: true,
              }
            }
          }
        }
      }

      return {
        seconds: 0,
        isResolved: false,
        error: 'Could not resolve delay field',
      }
    } catch (error) {
      return {
        seconds: 0,
        isResolved: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }, [currentFunction?.delay, projectData])

  // State for managing owner definitions (unified path approach)
  const [isAddingOwner, setIsAddingOwner] = useState(false)
  const [newOwnerPath, setNewOwnerPath] = useState('')

  // Get available contracts for delay selection
  const availableContracts = React.useMemo(() => {
    if (!projectData?.entries) return []

    const contracts: Array<{ address: string; name: string; source: string }> =
      []

    projectData.entries.forEach((entry) => {
      // Add initial contracts (all types — Untemplatized, Diamond, etc.)
      entry.initialContracts.forEach((contract) => {
        contracts.push({
          address: contract.address,
          name: contract.name || 'Unknown Contract',
          source: 'initial',
        })
      })

      // Add discovered contracts
      entry.discoveredContracts.forEach((contract) => {
        // Avoid duplicates
        if (
          !contracts.some((c) => addressesEqual(c.address, contract.address))
        ) {
          contracts.push({
            address: contract.address,
            name: contract.name || 'Unknown Contract',
            source: 'discovered',
          })
        }
      })
    })

    return contracts
  }, [projectData])

  // Resolve contractAddress prop to the exact string in availableContracts.
  // contractAddress may be an implementation address — find the parent proxy.
  const defaultContractAddress = React.useMemo(() => {
    // Direct match first
    const direct = availableContracts.find((c) =>
      addressesEqual(c.address, contractAddress),
    )
    if (direct) return direct.address

    // Implementation address — find the proxy that has this in its abis
    if (projectData?.entries) {
      for (const entry of projectData.entries) {
        const allContracts = [
          ...entry.initialContracts,
          ...entry.discoveredContracts,
        ]
        const proxy = allContracts.find((c) =>
          c.abis?.some((abi: any) =>
            addressesEqual(abi.address, contractAddress),
          ),
        )
        if (proxy) return proxy.address
      }
    }

    return contractAddress
  }, [availableContracts, contractAddress, projectData])

  // Get available numeric fields for delay (fields that contain time/delay or are numeric)
  const getAvailableDelayFields = (contractAddr: string) => {
    if (!projectData?.entries) return []

    for (const entry of projectData.entries) {
      // Check both initial and discovered contracts
      const allContracts = [
        ...entry.initialContracts,
        ...entry.discoveredContracts,
      ]
      const contract = allContracts.find((c) =>
        addressesEqual(c.address, contractAddr),
      )

      if (contract?.fields) {
        return contract.fields
          .filter((field) => {
            const isNumeric = field.value?.type === 'number'
            return isNumeric
          })
          .map((field) => ({
            name: field.name,
            description: field.description || '',
            value: field.value?.type === 'number' ? field.value.value : '',
          }))
      }
    }
    return []
  }

  // Get all fields for a contract (for mitigated field dropdown)
  const getAvailableFields = (contractAddr: string) => {
    if (!projectData?.entries) return []

    for (const entry of projectData.entries) {
      const contracts = [
        ...entry.initialContracts,
        ...entry.discoveredContracts,
      ]
      const contract = contracts.find((c) =>
        addressesEqual(c.address, contractAddr),
      )

      if (contract?.fields) {
        return contract.fields.map((field) => ({
          name: field.name,
          description: field.description || '',
          valuePreview:
            field.value?.type === 'number' || field.value?.type === 'string'
              ? String(field.value.value)
              : field.value?.type === 'boolean'
                ? String(field.value.value)
                : field.value?.type === 'address'
                  ? field.value.address?.slice(0, 12) + '...'
                  : '',
        }))
      }
    }
    return []
  }

  // Resolve an impactCap to a USD number from project data
  const IMPACT_CAP_DENOMINATORS: Record<string, number> = {
    raw: 1,
    '1e6': 1e6,
    '1e8': 1e8,
    '1e18': 1e18,
    bps: 10_000,
    percent: 100,
  }
  const resolveCapUsd = (cap: {
    contractAddress: string
    fieldName: string
    unit: string
  }): number | undefined => {
    if (!projectData?.entries) return undefined
    for (const entry of projectData.entries) {
      const contracts = [
        ...entry.initialContracts,
        ...entry.discoveredContracts,
      ]
      const contract = contracts.find((c) =>
        addressesEqual(c.address, cap.contractAddress),
      )
      const field = contract?.fields?.find((f) => f.name === cap.fieldName)
      if (field?.value?.type === 'number') {
        const raw = Number(field.value.value)
        if (!isFinite(raw)) return undefined
        return raw / (IMPACT_CAP_DENOMINATORS[cap.unit] ?? 1)
      }
    }
    return undefined
  }

  // Get external contracts with their entity attributes
  const getExternalContracts = React.useMemo(() => {
    if (!projectData?.entries || !contractTags?.tags) return []

    const externalTags = contractTags.tags.filter((tag) => tag.isExternal)
    const contracts: Array<{
      address: string
      name: string
      entity?: string
    }> = []

    externalTags.forEach((tag) => {
      // Find contract name from project data
      // Address normalization is now handled in the backend when saving
      const contract = projectData.entries
        .flatMap((e) => [...e.initialContracts, ...e.discoveredContracts])
        .find((c) => addressesEqual(c.address, tag.contractAddress))

      if (contract) {
        contracts.push({
          address: tag.contractAddress,
          name: contract.name || 'Unknown Contract',
          entity: tag.entity,
        })
      }
    })

    return contracts
  }, [projectData, contractTags])

  // Helper to get dependency info (name, entity)
  const getDependencyInfo = (address: string) => {
    return getExternalContracts.find((c) => addressesEqual(c.address, address))
  }

  // Helper functions for dependency management
  const handleAddDependency = (dependencyAddress: string) => {
    const currentDependencies = currentFunction?.dependencies || []
    const newDependencies = [
      ...currentDependencies,
      { contractAddress: dependencyAddress },
    ]
    onDependenciesUpdate(contractAddress, functionName, newDependencies)
    setIsAddingDependency(false)
  }

  const handleRemoveDependency = (index: number) => {
    const currentDependencies = currentFunction?.dependencies || []
    const newDependencies = currentDependencies.filter((_, i) => i !== index)
    // Always pass the array, even if empty - backend will handle it
    // Empty array will be omitted from JSON when serialized
    onDependenciesUpdate(contractAddress, functionName, newDependencies)
  }

  const isPermissioned = currentFunction?.isPermissioned || false
  const checkedStatus = currentFunction?.checked || false
  const scoreStatus = currentFunction?.score || 'unscored'
  const description = currentFunction?.description || ''

  // Local state for description input with debouncing
  const [localDescription, setLocalDescription] = useState(description)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Local state for owner path editing with debouncing
  const [editedOwnerPaths, setEditedOwnerPaths] = useState<
    Record<number, string>
  >({})
  const ownerPathTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // State for managing delay field
  const [isSettingDelay, setIsSettingDelay] = useState(false)
  const [newDelayData, setNewDelayData] = useState({
    contractAddress: contractAddress,
    fieldName: '',
  })

  // State for managing mitigations
  const [isAddingMitigation, setIsAddingMitigation] = useState(false)
  const [editingMitigationIndex, setEditingMitigationIndex] = useState<
    number | null
  >(null)

  interface MitigationValueFormState {
    mode: 'hardcoded' | 'fieldRef'
    value: string
    fieldPath: string
  }
  const emptyMitVal: MitigationValueFormState = {
    mode: 'hardcoded',
    value: '',
    fieldPath: '',
  }

  const [newMitigation, setNewMitigation] = useState<{
    type: MitigationType
    description: string
    label: string
    valueRange: {
      min: MitigationValueFormState
      max: MitigationValueFormState
      unit: string
    }
    relativeValue: { maxChangePercent: MitigationValueFormState }
    impactCap: {
      mode: 'field' | 'hardcoded'
      hardcodedUsd: string
      contractAddress: string
      fieldName: string
      unit: ImpactCapUnit
    }
    mitigatedField: {
      contractAddress: string
      fieldName: string
    }
    scopedTo: { address: string; type: '' | 'admin' | 'dependency' }
  }>({
    type: 'valueRange',
    description: '',
    label: '',
    valueRange: { min: { ...emptyMitVal }, max: { ...emptyMitVal }, unit: '' },
    relativeValue: { maxChangePercent: { ...emptyMitVal } },
    impactCap: {
      mode: 'field' as const,
      hardcodedUsd: '',
      contractAddress: defaultContractAddress,
      fieldName: '',
      unit: 'raw' as ImpactCapUnit,
    },
    mitigatedField: {
      contractAddress: defaultContractAddress,
      fieldName: '',
    },
    scopedTo: { address: '', type: '' },
  })

  // Sync mitigated field and impact cap default contract when availableContracts loads
  React.useEffect(() => {
    setNewMitigation((prev) => {
      const needsMitigatedFieldSync =
        prev.mitigatedField.contractAddress === contractAddress ||
        prev.mitigatedField.contractAddress === ''
      const needsImpactCapSync =
        prev.impactCap.contractAddress === contractAddress ||
        prev.impactCap.contractAddress === ''
      if (!needsMitigatedFieldSync && !needsImpactCapSync) return prev
      return {
        ...prev,
        ...(needsMitigatedFieldSync
          ? {
              mitigatedField: {
                ...prev.mitigatedField,
                contractAddress: defaultContractAddress,
              },
            }
          : {}),
        ...(needsImpactCapSync
          ? {
              impactCap: {
                ...prev.impactCap,
                contractAddress: defaultContractAddress,
              },
            }
          : {}),
      }
    })
  }, [defaultContractAddress])

  // State for managing dependencies
  const [isAddingDependency, setIsAddingDependency] = useState(false)

  // State for expanded call paths (impact + dependency cards)
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const togglePath = (key: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // State for audit trail
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [newCommentText, setNewCommentText] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [showAllContracts, setShowAllContracts] = useState(false)

  // Update local description when external data changes
  useEffect(() => {
    setLocalDescription(description)
  }, [description])

  // Update edited owner paths when external data changes
  useEffect(() => {
    if (currentFunction?.ownerDefinitions) {
      const initialPaths: Record<number, string> = {}
      currentFunction.ownerDefinitions.forEach((def, index) => {
        initialPaths[index] = def.path
      })
      setEditedOwnerPaths(initialPaths)
    } else {
      setEditedOwnerPaths({})
    }
  }, [currentFunction?.ownerDefinitions])

  const isChecked = checkedStatus

  // Validation for checking functionality
  const isCheckingAllowed = () => {
    // Non-permissioned functions can always be checked
    if (!isPermissioned) {
      return true
    }

    // Check if all admins are zero address (revoked)
    const allOwnersRevoked =
      functionAdmins.length > 0 &&
      functionAdmins.every((a) => isZeroAddress(a.address))

    // If ownership is revoked, only require description
    if (allOwnersRevoked) {
      return description.trim().length > 0
    }

    // Has non-zero owner → require owner definitions
    const hasOwnerDefinitions =
      (currentFunction?.ownerDefinitions || []).length > 0

    // Has funds at risk → require score
    const hasFundsAtRisk =
      (functionCapital?.totalReachableFundsUsd ?? 0) > 0 ||
      (functionCapital?.totalReachableTokenValueUsd ?? 0) > 0 ||
      contractFunds !== null
    const hasValidScore = !hasFundsAtRisk || scoreStatus !== 'unscored'

    // Always require description for permissioned functions
    const hasDescription = description.trim().length > 0

    return hasValidScore && hasDescription && hasOwnerDefinitions
  }

  const canCheck = isCheckingAllowed()

  // Score colors: gray for unscored, red for critical, green for no-impact
  const getScoreColor = (score: string, isHover = false) => {
    if (score === 'no-impact') {
      return isHover ? '#6ee7b7' : '#10b981' // green-300 : green-500
    }
    if (score === 'critical') {
      return isHover ? '#fca5a5' : '#f87171' // red-300 : red-400
    }
    return isHover ? '#d1d5db' : '#9ca3af' // gray-300 : gray-400
  }

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newDescription = event.target.value
    setLocalDescription(newDescription)

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout to save after user stops typing (500ms delay)
    timeoutRef.current = setTimeout(() => {
      if (newDescription !== description) {
        onDescriptionUpdate(contractAddress, functionName, newDescription)
      }
    }, 500)
  }

  const handleOwnerPathChange = (index: number, newPath: string) => {
    // Update local state immediately for responsive UI
    setEditedOwnerPaths((prev) => ({
      ...prev,
      [index]: newPath,
    }))

    // Clear existing timeout
    if (ownerPathTimeoutRef.current) {
      clearTimeout(ownerPathTimeoutRef.current)
    }

    // Set new timeout to save after user stops typing (500ms delay)
    ownerPathTimeoutRef.current = setTimeout(() => {
      const currentDefinitions = currentFunction?.ownerDefinitions || []
      const originalPath = currentDefinitions[index]?.path

      if (newPath !== originalPath && newPath.trim().length > 0) {
        // Create updated definitions array with the new path
        const updatedDefinitions = currentDefinitions.map((def, i) =>
          i === index ? { path: newPath } : def,
        )
        onOwnerDefinitionsUpdate(
          contractAddress,
          functionName,
          updatedDefinitions,
        )
      }
    }, 500)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (ownerPathTimeoutRef.current) {
        clearTimeout(ownerPathTimeoutRef.current)
      }
    }
  }, [])

  // Owner definition management handlers
  const handleAddOwnerDefinition = () => {
    const currentDefinitions = currentFunction?.ownerDefinitions || []

    const newDefinition: OwnerDefinition = {
      path: newOwnerPath,
    }

    const updatedDefinitions = [...currentDefinitions, newDefinition]
    onOwnerDefinitionsUpdate(contractAddress, functionName, updatedDefinitions)

    // Reset form
    setIsAddingOwner(false)
    setNewOwnerPath('')
  }

  const handleRemoveOwnerDefinition = (index: number) => {
    const currentDefinitions = currentFunction?.ownerDefinitions || []
    const updatedDefinitions = currentDefinitions.filter((_, i) => i !== index)
    onOwnerDefinitionsUpdate(contractAddress, functionName, updatedDefinitions)
  }

  // Delay management handlers
  const handleSetDelay = () => {
    if (newDelayData.contractAddress && newDelayData.fieldName) {
      onDelayUpdate(contractAddress, functionName, {
        contractAddress: newDelayData.contractAddress,
        fieldName: newDelayData.fieldName,
      })
      setIsSettingDelay(false)
      setNewDelayData({
        contractAddress: contractAddress,
        fieldName: '',
      })
    }
  }

  const handleClearDelay = () => {
    onDelayUpdate(contractAddress, functionName, null)
  }

  // Mitigation management handlers
  const resetMitigationForm = () => {
    setNewMitigation({
      type: 'valueRange',
      description: '',
      label: '',
      valueRange: {
        min: { ...emptyMitVal },
        max: { ...emptyMitVal },
        unit: '',
      },
      relativeValue: { maxChangePercent: { ...emptyMitVal } },
      impactCap: {
        mode: 'field' as const,
        hardcodedUsd: '',
        contractAddress: defaultContractAddress,
        fieldName: '',
        unit: 'raw' as ImpactCapUnit,
      },
      mitigatedField: {
        contractAddress: defaultContractAddress,
        fieldName: '',
      },
      scopedTo: { address: '', type: '' },
    })
    setIsAddingMitigation(false)
    setEditingMitigationIndex(null)
  }

  // Convert form state to MitigationValue for persistence
  const formToMitVal = (
    s: MitigationValueFormState,
  ): MitigationValue | undefined => {
    if (s.mode === 'fieldRef') {
      return s.fieldPath.trim()
        ? { mode: 'fieldRef', fieldPath: s.fieldPath.trim() }
        : undefined
    }
    return s.value.trim()
      ? { mode: 'hardcoded', value: s.value.trim() }
      : undefined
  }

  const handleAddMitigation = () => {
    const currentMitigations = currentFunction?.mitigations || []
    const mitigation: Mitigation = {
      type: newMitigation.type,
      description: newMitigation.description,
    }
    if (newMitigation.type === 'other' && newMitigation.label.trim()) {
      mitigation.label = newMitigation.label.trim()
    }
    if (newMitigation.type === 'valueRange') {
      const min = formToMitVal(newMitigation.valueRange.min)
      const max = formToMitVal(newMitigation.valueRange.max)
      mitigation.valueRange = {
        ...(min ? { min } : {}),
        ...(max ? { max } : {}),
        ...(newMitigation.valueRange.unit
          ? { unit: newMitigation.valueRange.unit }
          : {}),
      }
    } else if (newMitigation.type === 'relativeValue') {
      const maxChange = formToMitVal(
        newMitigation.relativeValue.maxChangePercent,
      )
      mitigation.relativeValue = {
        ...(maxChange ? { maxChangePercent: maxChange } : {}),
      }
    }

    // Add impact cap if filled (applies to any mitigation type)
    if (
      newMitigation.impactCap.mode === 'hardcoded' &&
      newMitigation.impactCap.hardcodedUsd.trim()
    ) {
      const parsed = parseFloat(newMitigation.impactCap.hardcodedUsd.trim())
      if (isFinite(parsed)) {
        mitigation.impactCap = { hardcodedUsd: parsed }
      }
    } else if (
      newMitigation.impactCap.mode === 'field' &&
      newMitigation.impactCap.contractAddress &&
      newMitigation.impactCap.fieldName.trim()
    ) {
      mitigation.impactCap = {
        contractAddress: newMitigation.impactCap.contractAddress,
        fieldName: newMitigation.impactCap.fieldName.trim(),
        unit: newMitigation.impactCap.unit,
      }
    }

    // Add mitigated field if a field is selected
    if (newMitigation.mitigatedField.fieldName.trim()) {
      mitigation.mitigatedField = {
        contractAddress: newMitigation.mitigatedField.contractAddress,
        fieldName: newMitigation.mitigatedField.fieldName.trim(),
      }
    }

    // Add scope if a specific admin or dependency is selected
    if (
      newMitigation.scopedTo.address &&
      (newMitigation.scopedTo.type === 'admin' ||
        newMitigation.scopedTo.type === 'dependency')
    ) {
      mitigation.scopedTo = {
        address: newMitigation.scopedTo.address,
        type: newMitigation.scopedTo.type,
      }
    }

    let updatedMitigations: Mitigation[]
    if (editingMitigationIndex !== null) {
      updatedMitigations = currentMitigations.map((m, i) =>
        i === editingMitigationIndex ? mitigation : m,
      )
    } else {
      updatedMitigations = [...currentMitigations, mitigation]
    }
    onMitigationsUpdate(contractAddress, functionName, updatedMitigations)
    resetMitigationForm()
  }

  const handleRemoveMitigation = (index: number) => {
    const currentMitigations = currentFunction?.mitigations || []
    const updatedMitigations = currentMitigations.filter((_, i) => i !== index)
    onMitigationsUpdate(
      contractAddress,
      functionName,
      updatedMitigations.length > 0 ? updatedMitigations : null,
    )
  }

  // Convert persisted MitigationValue (or legacy string) to form state
  const mitValToForm = (
    val: MitigationValue | string | undefined,
  ): MitigationValueFormState => {
    const normalized = normalizeMitigationValue(val as any)
    if (!normalized) return { ...emptyMitVal }
    if (normalized.mode === 'fieldRef') {
      return {
        mode: 'fieldRef',
        value: '',
        fieldPath: normalized.fieldPath || '',
      }
    }
    return { mode: 'hardcoded', value: normalized.value || '', fieldPath: '' }
  }

  const handleEditMitigation = (index: number) => {
    const currentMitigations = currentFunction?.mitigations || []
    const m = currentMitigations[index]
    if (!m) return
    setNewMitigation({
      type: m.type,
      description: m.description,
      label: m.label ?? '',
      valueRange: {
        min: mitValToForm(m.valueRange?.min),
        max: mitValToForm(m.valueRange?.max),
        unit: m.valueRange?.unit || '',
      },
      relativeValue: {
        maxChangePercent: mitValToForm(m.relativeValue?.maxChangePercent),
      },
      impactCap: m.impactCap
        ? {
            mode: (m.impactCap.hardcodedUsd !== undefined
              ? 'hardcoded'
              : 'field') as 'field' | 'hardcoded',
            hardcodedUsd:
              m.impactCap.hardcodedUsd !== undefined
                ? String(m.impactCap.hardcodedUsd)
                : '',
            contractAddress:
              m.impactCap.contractAddress ?? defaultContractAddress,
            fieldName: m.impactCap.fieldName ?? '',
            unit: (m.impactCap.unit ?? 'raw') as ImpactCapUnit,
          }
        : {
            mode: 'field' as const,
            hardcodedUsd: '',
            contractAddress: defaultContractAddress,
            fieldName: '',
            unit: 'raw' as ImpactCapUnit,
          },
      mitigatedField: m.mitigatedField
        ? {
            contractAddress: m.mitigatedField.contractAddress,
            fieldName: m.mitigatedField.fieldName,
          }
        : {
            contractAddress: defaultContractAddress,
            fieldName: '',
          },
      scopedTo: m.scopedTo
        ? { address: m.scopedTo.address, type: m.scopedTo.type }
        : { address: '', type: '' },
    })
    setEditingMitigationIndex(index)
    setIsAddingMitigation(true)
  }

  // Check if a MitigationValueFormState has a valid value
  const isMitValFilled = (s: MitigationValueFormState): boolean => {
    return s.mode === 'fieldRef' ? !!s.fieldPath.trim() : !!s.value.trim()
  }

  const isMitigationFormValid = () => {
    if (!newMitigation.description.trim()) return false
    if (newMitigation.type === 'valueRange') {
      return (
        isMitValFilled(newMitigation.valueRange.min) ||
        isMitValFilled(newMitigation.valueRange.max)
      )
    }
    if (newMitigation.type === 'relativeValue') {
      return isMitValFilled(newMitigation.relativeValue.maxChangePercent)
    }
    // 'other' type just needs description
    return true
  }

  const isAddFormValid = () => {
    return newOwnerPath.trim().length > 0
  }

  return (
    <div className="overflow-x-auto border-coffee-600 border-t">
      {/* Function header with icons and signature */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-[22px] w-full cursor-pointer select-none items-center gap-1 bg-coffee-900 px-2 py-1 font-mono text-xs hover:bg-coffee-800"
      >
        {/* Expand/collapse chevron */}
        {isOpen ? <IconChevronDown /> : <IconChevronRight />}

        {/* Interactive icons */}
        <div
          className="mr-2 flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Checked Icon */}
          <button
            onClick={() => {
              if (canCheck || isChecked) {
                onCheckedToggle(contractAddress, functionName, isChecked)
              }
            }}
            disabled={!canCheck && !isChecked}
            className={`inline-block transition-colors ${
              canCheck || isChecked
                ? 'cursor-pointer'
                : 'cursor-not-allowed opacity-50'
            }`}
            style={{
              color: isChecked ? '#10b981' : canCheck ? '#9ca3af' : '#6b7280', // green-500 : gray-400 : gray-500 (disabled)
            }}
            title={
              canCheck || isChecked
                ? `Click to mark as ${isChecked ? 'unchecked' : 'checked'}`
                : 'Complete required fields before checking (description, owners, score if funds at risk)'
            }
            onMouseEnter={(e) => {
              if (canCheck || isChecked) {
                e.currentTarget.style.color = isChecked ? '#6ee7b7' : '#d1d5db' // green-300 : gray-300
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isChecked
                ? '#10b981'
                : canCheck
                  ? '#9ca3af'
                  : '#6b7280' // green-500 : gray-400 : gray-500 (disabled)
            }}
          >
            {isChecked ? <IconCheckTrue /> : <IconCheckFalse />}
          </button>

          {/* Permission Icon */}
          <button
            onClick={() =>
              onPermissionToggle(contractAddress, functionName, isPermissioned)
            }
            className="inline-block cursor-pointer transition-colors"
            style={{
              color: isPermissioned ? '#f87171' : '#9ca3af', // red-400 : gray-400
            }}
            title={`Click to mark as ${isPermissioned ? 'non-permissioned' : 'permissioned'}`}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = isPermissioned
                ? '#fca5a5'
                : '#d1d5db' // red-300 : gray-300
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isPermissioned
                ? '#f87171'
                : '#9ca3af' // red-400 : gray-400
            }}
          >
            {isPermissioned ? <IconLockClosed /> : <IconLockOpen />}
          </button>

          {/* Admin Key Icon */}
          <span
            className="inline-block"
            style={{ color: getAdminIconColor(functionAdmins) }}
            title={getAdminIconTitle(functionAdmins)}
          >
            <IconKey />
          </span>

          {/* Score / Impact Icon */}
          {(() => {
            const hasImpactData =
              (functionCapital?.totalReachableFundsUsd ?? 0) > 0 ||
              (functionCapital?.totalReachableTokenValueUsd ?? 0) > 0
            const impactColor =
              scoreStatus !== 'unscored'
                ? getScoreColor(scoreStatus)
                : hasImpactData
                  ? '#fbbf24' // amber-400 — has funds at risk but unscored
                  : '#9ca3af' // gray-400
            const impactHoverColor =
              scoreStatus !== 'unscored'
                ? getScoreColor(scoreStatus, true)
                : hasImpactData
                  ? '#fcd34d' // amber-300
                  : '#d1d5db' // gray-300
            const impactTitle = hasImpactData
              ? `Score: ${scoreStatus}. Funds at risk: ${formatUsdValue((functionCapital?.totalReachableFundsUsd ?? 0) + (functionCapital?.totalReachableTokenValueUsd ?? 0))}. Click to toggle: unscored → critical → no-impact`
              : `Current score: ${scoreStatus}. Click to toggle: unscored → critical → no-impact`
            return (
              <button
                onClick={() =>
                  onScoreToggle(contractAddress, functionName, scoreStatus)
                }
                className="inline-block cursor-pointer transition-colors"
                style={{ color: impactColor }}
                title={impactTitle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = impactHoverColor
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = impactColor
                }}
              >
                {scoreStatus === 'no-impact' ? (
                  <IconVoltageSlash />
                ) : (
                  <IconVoltage />
                )}
              </button>
            )
          })()}

          {/* Dependency Indicator Icon */}
          <span
            className="inline-block"
            style={{
              color:
                (currentFunction?.dependencies?.length ?? 0) > 0 ||
                functionDeps.length > 0
                  ? '#f97316' // orange-500 (has dependencies)
                  : '#9ca3af', // gray-400 (no dependencies)
            }}
            title={
              (currentFunction?.dependencies?.length ?? 0) > 0 ||
              functionDeps.length > 0
                ? `Has ${(currentFunction?.dependencies?.length ?? 0) + functionDeps.filter((d) => d.isAutoDetected).length} external dependency/dependencies`
                : 'No external dependencies'
            }
          >
            <IconDependency />
          </span>

          {/* Open in Code Icon */}
          <button
            onClick={() => onOpenInCode(contractAddress, functionName)}
            className="inline-block cursor-pointer transition-colors"
            style={{
              color: '#9ca3af', // gray-400
            }}
            title={'Open function in Code panel'}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#d1d5db' // gray-300
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9ca3af' // gray-400
            }}
          >
            <IconOpen />
          </button>

          {/* Delay Indicator Icon */}
          {(() => {
            const hasDelay = currentFunction?.delay && resolvedDelay?.isResolved
            const seconds = resolvedDelay?.seconds ?? 0
            const hasSuggestion = !hasDelay && functionTraversal?.suggestedDelay
            const delayColor = hasDelay
              ? seconds >= 7 * 86400
                ? '#22c55e' // green-500 (>= 7 days)
                : seconds >= 86400
                  ? '#eab308' // yellow-500 (>= 1 day)
                  : '#ef4444' // red-500 (< 1 day)
              : hasSuggestion
                ? '#06b6d4' // cyan-500 (detected but not confirmed)
                : '#9ca3af' // gray-400 (no delay)
            const delayTitle = hasDelay
              ? `Delay: ${formatDelay(seconds)}`
              : hasSuggestion
                ? `Detected: ${formatDelay(functionTraversal!.suggestedDelay!.seconds)} via ${functionTraversal!.suggestedDelay!.contractName}`
                : 'No delay set'
            return (
              <span
                className="inline-block"
                style={{ color: delayColor }}
                title={delayTitle}
              >
                <IconClock />
              </span>
            )
          })()}

          {/* Mitigations Indicator Icon */}
          {(() => {
            const mitigationCount = currentFunction?.mitigations?.length ?? 0
            const hasMitigations = mitigationCount > 0
            return (
              <span
                className="inline-block text-xs font-bold"
                style={{
                  color: hasMitigations ? '#06b6d4' : '#9ca3af', // cyan-500 or gray-400
                }}
                title={
                  hasMitigations
                    ? `${mitigationCount} mitigation${mitigationCount !== 1 ? 's' : ''}`
                    : 'No mitigations'
                }
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
            )
          })()}
        </div>

        {/* Function signature */}
        <code className="flex-1 text-left">
          {entry.value.split(/\b/).map((word, wordIndex) => (
            <span key={wordIndex} className={getClassName(word)}>
              {word}
            </span>
          ))}
          {entry.signature && (
            <span className="text-coffee-400"> // {entry.signature}</span>
          )}
        </code>
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="border-coffee-700 border-t bg-coffee-900">
          {/* 1. Last Change Section */}
          <div className="border-coffee-700 border-b p-3">
            <label className="mb-1 flex items-center gap-1 text-coffee-300 text-xs">
              <span
                style={{
                  color: isChecked ? '#10b981' : '#9ca3af',
                }}
              >
                {isChecked ? <IconCheckTrue /> : <IconCheckFalse />}
              </span>
              Last Change
            </label>
            {currentFunction?.checked && currentFunction?.completedBy ? (
              <div className="text-coffee-400 text-xs">
                Completed by{' '}
                <a
                  href={`https://github.com/${currentFunction.completedBy.author}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-aux-cyan hover:underline"
                >
                  {currentFunction.completedBy.author}
                </a>{' '}
                on {currentFunction.completedBy.date.split('T')[0]}
              </div>
            ) : currentFunction?.lastChangedBy ? (
              <div className="text-coffee-400 text-xs">
                Last change by{' '}
                <a
                  href={`https://github.com/${currentFunction.lastChangedBy.author}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-aux-cyan hover:underline"
                >
                  {currentFunction.lastChangedBy.author}
                </a>{' '}
                on {currentFunction.lastChangedBy.date.split('T')[0]}
              </div>
            ) : (
              <div className="text-coffee-500 text-xs">No changes recorded</div>
            )}
          </div>

          {/* 2. Function Description Section */}
          <div className="border-coffee-700 border-b p-3">
            <label className="mb-2 block text-coffee-300 text-xs">
              Function Description
            </label>
            <textarea
              value={localDescription}
              onChange={handleDescriptionChange}
              placeholder="Add a description for this function..."
              className="h-20 w-full resize-none rounded border border-coffee-600 bg-coffee-800 px-2 py-1 font-mono text-coffee-100 text-xs focus:border-coffee-500 focus:outline-none"
            />
          </div>

          {/* 3. Manage Function Owners Section */}
          <div className="border-coffee-700 border-b p-3">
            <div className="mb-2 flex items-center justify-between">
              <label className="flex items-center gap-1 text-coffee-300 text-xs">
                <span
                  style={{
                    color: isPermissioned ? '#f87171' : '#9ca3af',
                  }}
                >
                  {isPermissioned ? <IconLockClosed /> : <IconLockOpen />}
                </span>
                Manage Function Owners
              </label>
              <button
                onClick={() => setIsAddingOwner(!isAddingOwner)}
                className="rounded bg-coffee-700 px-2 py-1 text-coffee-100 text-xs hover:bg-coffee-600"
              >
                {isAddingOwner ? 'Cancel' : '+ Add Owner'}
              </button>
            </div>
            <div className="mb-2 text-coffee-500 text-xs">
              Permissioned function only callable by the addresses listed here
            </div>

            {/* Current owner definitions with resolved addresses and delete buttons */}
            {currentFunction?.ownerDefinitions &&
              currentFunction.ownerDefinitions.length > 0 && (
                <div className="mb-3">
                  <div className="mb-1 text-coffee-400 text-xs">
                    Current Definitions (
                    {currentFunction.ownerDefinitions.length}):
                  </div>

                  {ownersLoading && (
                    <div className="mb-2 text-coffee-400 text-xs">
                      Resolving owners...
                    </div>
                  )}

                  {ownersError && (
                    <div className="mb-2 text-aux-red text-xs">
                      Error: {ownersError}
                    </div>
                  )}

                  <div className="space-y-2">
                    {currentFunction.ownerDefinitions.map(
                      (definition, index) => {
                        const correspondingResolved = resolvedOwners[index]

                        return (
                          <div
                            key={index}
                            className="rounded bg-coffee-800 p-2"
                          >
                            <div className="mb-1 flex items-center gap-2">
                              <input
                                type="text"
                                value={
                                  editedOwnerPaths[index] || definition.path
                                }
                                onChange={(e) =>
                                  handleOwnerPathChange(index, e.target.value)
                                }
                                className="flex-1 rounded border border-coffee-600 bg-coffee-700 px-2 py-1 font-mono text-coffee-100 text-xs focus:border-coffee-500 focus:outline-none"
                                placeholder="e.g., $self.owner"
                              />
                              <button
                                onClick={() =>
                                  handleRemoveOwnerDefinition(index)
                                }
                                className="flex-shrink-0 text-aux-red hover:opacity-80"
                                title="Remove this owner definition"
                              >
                                ✕
                              </button>
                            </div>
                            {correspondingResolved?.isResolved && (
                              <div className="mb-1 px-2 text-coffee-400 text-xs">
                                {(() => {
                                  const isStructured =
                                    correspondingResolved.structuredValue &&
                                    typeof correspondingResolved.structuredValue ===
                                      'object' &&
                                    !Array.isArray(
                                      correspondingResolved.structuredValue,
                                    ) &&
                                    !correspondingResolved.structuredValue.startsWith?.(
                                      'eth:',
                                    )
                                  if (isStructured) {
                                    return `→ [structured value with ${correspondingResolved.allAddresses?.length || 0} address(es)]`
                                  }
                                  if (
                                    correspondingResolved.allAddresses
                                      ?.length === 1
                                  ) {
                                    return `→ ${correspondingResolved.allAddresses[0]?.slice(0, 10)}...`
                                  }
                                  return `→ ${correspondingResolved.allAddresses?.length || 0} addresses`
                                })()}
                              </div>
                            )}

                            {/* Show resolved owners */}
                            {!ownersLoading &&
                              correspondingResolved &&
                              correspondingResolved.isResolved && (
                                <div className="mt-1 ml-2">
                                  {/* Check if we have a structured value (object with properties, not array) */}
                                  {(correspondingResolved as any)
                                    .structuredValue &&
                                  typeof (correspondingResolved as any)
                                    .structuredValue === 'object' &&
                                  !Array.isArray(
                                    (correspondingResolved as any)
                                      .structuredValue,
                                  ) &&
                                  !(
                                    correspondingResolved as any
                                  ).structuredValue.startsWith?.('eth:') ? (
                                    <>
                                      <div className="mb-1 text-coffee-400 text-xs">
                                        Structured Value:
                                      </div>
                                      <div className="rounded bg-coffee-700 p-2 font-mono text-xs">
                                        <pre className="overflow-x-auto text-coffee-200">
                                          {JSON.stringify(
                                            (correspondingResolved as any)
                                              .structuredValue,
                                            null,
                                            2,
                                          )}
                                        </pre>
                                      </div>
                                      <div className="mt-2 mb-1 text-coffee-400 text-xs">
                                        Contains{' '}
                                        {(correspondingResolved as any)
                                          .allAddresses?.length || 0}{' '}
                                        address(es):
                                      </div>
                                      {(
                                        correspondingResolved as any
                                      ).allAddresses?.map(
                                        (addr: string, idx: number) => (
                                          <div
                                            key={idx}
                                            className="mb-1 flex items-center gap-2"
                                          >
                                            <button
                                              onClick={() =>
                                                usePanelStore
                                                  .getState()
                                                  .select(addr)
                                              }
                                              className="text-aux-cyan text-xs hover:text-aux-cyan-light"
                                              title={`Select ${addr}`}
                                            >
                                              {getContractName(addr)}
                                            </button>
                                            <button
                                              onClick={() =>
                                                usePanelStore
                                                  .getState()
                                                  .select(addr)
                                              }
                                              className="text-coffee-400 hover:text-coffee-300"
                                              title="Select this contract"
                                            >
                                              <IconOpen />
                                            </button>
                                          </div>
                                        ),
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <div className="mb-1 text-coffee-400 text-xs">
                                        Resolves to:
                                      </div>
                                      {/* Show all resolved addresses */}
                                      {(
                                        correspondingResolved as any
                                      ).allAddresses?.map(
                                        (addr: string, idx: number) => (
                                          <div
                                            key={idx}
                                            className="mb-1 flex items-center gap-2"
                                          >
                                            <button
                                              onClick={() =>
                                                usePanelStore
                                                  .getState()
                                                  .select(addr)
                                              }
                                              className="text-aux-cyan text-xs hover:text-aux-cyan-light"
                                              title={`Select ${addr}`}
                                            >
                                              {getContractName(addr)}
                                            </button>
                                            <button
                                              onClick={() =>
                                                usePanelStore
                                                  .getState()
                                                  .select(addr)
                                              }
                                              className="text-coffee-400 hover:text-coffee-300"
                                              title="Select this contract"
                                            >
                                              <IconOpen />
                                            </button>
                                          </div>
                                        ),
                                      )}
                                    </>
                                  )}
                                </div>
                              )}

                            {/* Show resolution error */}
                            {!ownersLoading &&
                              correspondingResolved &&
                              !correspondingResolved.isResolved && (
                                <div className="mt-1 ml-2 text-aux-red text-xs">
                                  Error: {correspondingResolved.error}
                                </div>
                              )}
                          </div>
                        )
                      },
                    )}
                  </div>
                </div>
              )}

            {/* Add new owner definition form - UNIFIED PATH APPROACH */}
            {isAddingOwner && (
              <div className="rounded bg-coffee-800 p-3">
                <div className="mb-3 text-coffee-400 text-xs">
                  Enter a path expression to define permission owners
                </div>

                <div className="mb-3">
                  <label className="mb-1 block text-coffee-300 text-xs">
                    Path Expression
                  </label>
                  <input
                    type="text"
                    value={newOwnerPath}
                    onChange={(e) => setNewOwnerPath(e.target.value)}
                    placeholder="e.g., $self.owner or @governor.signers[0]"
                    className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 font-mono text-coffee-100 text-xs"
                  />
                  <div className="mt-2 space-y-1 text-coffee-400 text-xs">
                    <div>
                      <strong>Examples:</strong>
                    </div>
                    <div>
                      • <code className="text-aux-cyan">$self.owner</code> -
                      owner field in current contract
                    </div>
                    <div>
                      •{' '}
                      <code className="text-aux-cyan">
                        @governor.signers[0]
                      </code>{' '}
                      - follow governor field, get first signer
                    </div>
                    <div>
                      •{' '}
                      <code className="text-aux-cyan">
                        $self.accessControl.ADMIN_ROLE.members
                      </code>{' '}
                      - get role members
                    </div>
                    <div>
                      • <code className="text-aux-cyan">$self</code> - current
                      contract itself
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddOwnerDefinition}
                  disabled={!isAddFormValid()}
                  className="w-full rounded bg-green-600 px-3 py-1 text-white text-xs hover:bg-green-500 disabled:bg-coffee-600 disabled:text-coffee-400"
                >
                  Add Owner Definition
                </button>
              </div>
            )}
          </div>

          {/* 4. Admin Section — Enhanced Traversal */}
          <div className="border-coffee-700 border-b p-3">
            <div className="mb-2 flex items-center justify-between">
              <label className="flex items-center gap-1 text-coffee-300 text-xs">
                <span
                  style={{
                    color: getAdminIconColor(functionAdmins),
                  }}
                >
                  <IconKey />
                </span>
                Admin
              </label>
              {traversalData && (
                <span
                  className="rounded px-1.5 py-0.5 text-xs"
                  style={
                    traversalData.callGraphStale
                      ? {
                          color: '#facc15',
                          backgroundColor: 'rgba(161, 98, 7, 0.3)',
                        }
                      : {
                          color: '#78716c',
                          backgroundColor: '#292524',
                        }
                  }
                  title={
                    traversalData.callGraphStale
                      ? 'Functions were modified after the call graph was generated. Consider re-generating the call graph.'
                      : 'Call graph is up to date'
                  }
                >
                  {traversalData.callGraphStale
                    ? 'Stale call graph'
                    : 'Call graph synced'}
                </span>
              )}
            </div>
            <div className="mb-2 text-coffee-500 text-xs">
              Terminal entities that can trigger this permissioned function
            </div>

            {!adminsData ? (
              <div className="text-coffee-500 text-xs">Loading...</div>
            ) : functionAdmins.length > 0 ? (
              (() => {
                const isKeyOwner = (admin: AdminEntry) =>
                  admin.type === 'EOA' ||
                  admin.type === 'EOAPermissioned' ||
                  admin.type === 'Multisig' ||
                  admin.isGovernance
                const filteredAdmins = showAllContracts
                  ? functionAdmins
                  : functionAdmins.filter(isKeyOwner)
                const hasHiddenOwners = functionAdmins.some(
                  (a) => !isKeyOwner(a),
                )
                return (
                  <div className="space-y-2">
                    {hasHiddenOwners && (
                      <label className="flex cursor-pointer items-center gap-1.5 text-coffee-400 text-xs">
                        <input
                          type="checkbox"
                          checked={showAllContracts}
                          onChange={(e) =>
                            setShowAllContracts(e.target.checked)
                          }
                          className="h-3 w-3 cursor-pointer accent-coffee-500"
                        />
                        Show all contracts (
                        {functionAdmins.length - filteredAdmins.length} hidden)
                      </label>
                    )}
                    {filteredAdmins.map((admin, idx) => {
                      const revoked = isZeroAddress(admin.address)
                      const adminKey = `admin-${idx}`
                      const isAdminExpanded = expandedPaths.has(adminKey)
                      const adminFunc = admin.functions.find(
                        (f) =>
                          addressesEqual(f.contractAddress, contractAddress) &&
                          f.functionName === functionName,
                      )
                      const chains = adminFunc?.chains ?? []
                      const hasChains = chains.some((c) => c.steps.length > 0)
                      const hasPublicFunction = chains.some(
                        (c) => c.hasPublicFunction,
                      )
                      return (
                        <div
                          key={idx}
                          className={`rounded bg-coffee-800 p-2 ${hasChains ? 'cursor-pointer' : ''}`}
                          onClick={
                            hasChains ? () => togglePath(adminKey) : undefined
                          }
                        >
                          {/* Owner header: chevron + type badge + name */}
                          <div className="flex items-center gap-2">
                            {hasChains && (
                              <span className="text-coffee-500 text-[10px]">
                                {isAdminExpanded ? (
                                  <IconChevronDown />
                                ) : (
                                  <IconChevronRight />
                                )}
                              </span>
                            )}
                            {revoked ? (
                              <span
                                className="rounded border px-1 text-xs font-semibold"
                                style={{
                                  color: '#10b981',
                                  borderColor: '#10b98140',
                                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                }}
                              >
                                Revoked
                              </span>
                            ) : (
                              <span
                                className="rounded border px-1 text-xs font-semibold"
                                style={{
                                  color: getAdminTypeColor(admin.type),
                                  borderColor:
                                    getAdminTypeColor(admin.type) + '40',
                                }}
                              >
                                {displayType(admin.type)}
                              </span>
                            )}
                            {admin.isGovernance && (
                              <span
                                className="rounded border px-1 text-xs font-semibold"
                                style={{
                                  color: '#10b981',
                                  borderColor: '#10b98140',
                                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                }}
                              >
                                Governance
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                if (!revoked)
                                  usePanelStore.getState().select(admin.address)
                              }}
                              className={`font-mono text-xs ${revoked ? 'cursor-default text-coffee-400' : 'hover:underline'}`}
                              style={revoked ? undefined : { color: '#67e8f9' }}
                            >
                              {revoked ? '0x0000...0000' : admin.name}
                            </button>
                            {hasPublicFunction && (
                              <span className="rounded bg-orange-900/30 px-1 text-orange-400 text-xs">
                                public fn in path
                              </span>
                            )}
                          </div>

                          {/* Chain tree: each collapsed chain = a branch (shown when expanded) */}
                          {isAdminExpanded &&
                            chains.map((chain, chainIdx) => {
                              if (chain.steps.length === 0) return null
                              // Reverse to owner→target order
                              const reversed = [...chain.steps].reverse()
                              // Step 0 = owner (already in header), grab its functions
                              const ownerFns = reversed[0]?.functionNames ?? []
                              const viaSteps = reversed.slice(1)
                              const isLast = chainIdx === chains.length - 1

                              return (
                                <div
                                  key={chainIdx}
                                  className="mt-1 border-coffee-700 border-t pt-1 text-xs"
                                >
                                  {/* Owner's functions (root of this branch) */}
                                  <div className="flex items-center gap-1">
                                    <span className="text-coffee-600">
                                      {isLast ? '\u2514' : '\u251C'}
                                    </span>
                                    {ownerFns.length > 0 ? (
                                      <span className="text-coffee-400">
                                        {formatFunctionNames(ownerFns)}
                                      </span>
                                    ) : (
                                      <span className="text-coffee-600 italic">
                                        (permission)
                                      </span>
                                    )}
                                  </div>
                                  {/* Via steps — indented under the branch */}
                                  {viaSteps.map((step, stepIdx) => (
                                    <div
                                      key={stepIdx}
                                      className="flex items-center gap-1"
                                      style={{
                                        paddingLeft: `${(stepIdx + 1) * 16}px`,
                                      }}
                                    >
                                      <span className="text-coffee-600">
                                        {stepIdx === viaSteps.length - 1
                                          ? '\u2514'
                                          : '\u251C'}
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          usePanelStore
                                            .getState()
                                            .select(step.contractAddress)
                                        }}
                                        className="hover:underline shrink-0"
                                        style={{ color: '#67e8f9' }}
                                      >
                                        {step.contractName}
                                      </button>
                                      {step.functionNames.length > 0 && (
                                        <span className="text-coffee-500">
                                          {formatFunctionNames(
                                            step.functionNames,
                                          )}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )
                            })}
                        </div>
                      )
                    })}

                    {/* Errors from traversal metadata */}
                    {functionTraversal &&
                      functionTraversal.errors.length > 0 && (
                        <div className="mt-1 text-red-400/70 text-xs">
                          {functionTraversal.errors.length} resolution error
                          {functionTraversal.errors.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    {functionTraversal?.depthLimitReached && (
                      <div className="mt-1 text-yellow-400 text-xs">
                        Depth limit reached — chain may be incomplete
                      </div>
                    )}
                  </div>
                )
              })()
            ) : (
              <div className="text-coffee-500 text-xs">
                No terminals found (no owner definitions or empty resolution)
              </div>
            )}
          </div>

          {/* 5. Impact Section */}
          <div className="border-coffee-700 border-b p-3">
            <label className="mb-1 flex items-center gap-1 text-coffee-300 text-xs">
              <span style={{ color: getScoreColor(scoreStatus) }}>
                {scoreStatus === 'no-impact' ? (
                  <IconVoltageSlash />
                ) : (
                  <IconVoltage />
                )}
              </span>
              Impact
            </label>
            <div className="mb-2 text-coffee-500 text-xs">
              Funds that are at risk by malicious calls into this function
            </div>

            {/* Direct contract funds */}
            {contractFunds ? (
              <div className="space-y-2">
                <div className="mb-1 text-coffee-400 text-xs font-semibold">
                  Direct Contract Funds
                </div>
                {contractFunds.balances &&
                  contractFunds.balances.tokens.filter(
                    (t) => t.usdValue >= MIN_TOKEN_USD_VALUE,
                  ).length > 0 && (
                    <div>
                      <div className="mb-1 text-coffee-400 text-xs">
                        Token Balances
                      </div>
                      <div className="space-y-1">
                        {contractFunds.balances.tokens
                          .filter((t) => t.usdValue >= MIN_TOKEN_USD_VALUE)
                          .sort((a, b) => b.usdValue - a.usdValue)
                          .map((token, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="text-coffee-200">
                                {token.symbol}
                              </span>
                              <span className="text-green-400">
                                {formatUsdValue(token.usdValue)}
                              </span>
                            </div>
                          ))}
                      </div>
                      {contractFunds.balances.tokens.some(
                        (t) =>
                          t.usdValue > 0 && t.usdValue < MIN_TOKEN_USD_VALUE,
                      ) && (
                        <div className="mt-1 text-[10px] text-coffee-600">
                          Showing tokens {'>'}={' '}
                          {formatUsdValue(MIN_TOKEN_USD_VALUE)}
                        </div>
                      )}
                    </div>
                  )}

                {contractFunds.positions &&
                  contractFunds.positions.protocols.length > 0 && (
                    <div>
                      <div className="mb-1 text-coffee-400 text-xs">
                        DeFi Positions
                      </div>
                      <div className="space-y-1">
                        {contractFunds.positions.protocols.map(
                          (protocol, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="text-coffee-200">
                                {protocol.name}
                              </span>
                              <span className="text-green-400">
                                {formatUsdValue(protocol.totalUsdValue)}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {contractFunds.tokenInfo && (
                  <div>
                    <div className="mb-1 text-coffee-400 text-xs">
                      Token Info
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-coffee-200">
                        {contractFunds.tokenInfo.symbol} Market Cap
                      </span>
                      <span className="text-aux-yellow">
                        {formatUsdValue(contractFunds.tokenInfo.tokenValue)}
                      </span>
                    </div>
                  </div>
                )}

                {!contractFunds.balances?.tokens.some(
                  (t) => t.usdValue >= MIN_TOKEN_USD_VALUE,
                ) &&
                  !contractFunds.positions?.protocols.length &&
                  !contractFunds.tokenInfo && (
                    <div className="text-coffee-500 text-xs">
                      No funds detected for this contract
                    </div>
                  )}
              </div>
            ) : (
              <div className="text-coffee-500 text-xs">
                No funds data available
              </div>
            )}

            {/* Reachable contracts with funds (from call graph) */}
            {functionCapital &&
              (functionCapital.reachableContracts ?? []).length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-coffee-400 text-xs font-semibold">
                    Reachable Contracts with Funds
                  </div>
                  <div className="space-y-1">
                    {functionCapital.reachableContracts.map((entry, idx) => {
                      return (
                        <div key={idx} className="rounded bg-coffee-800 p-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  usePanelStore
                                    .getState()
                                    .select(entry.contractAddress)
                                }}
                                className="font-mono text-aux-cyan text-xs hover:text-aux-cyan-light"
                              >
                                {entry.contractName}
                              </button>
                              {entry.viewOnlyPath && (
                                <span className="rounded bg-coffee-600 px-1 py-0.5 text-coffee-300 text-[10px]">
                                  view only
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {entry.fundsUsd > 0 && (
                                <span className="text-green-400 text-xs">
                                  {formatUsdValue(entry.fundsUsd)}
                                </span>
                              )}
                              {entry.tokenValueUsd > 0 && (
                                <span className="text-aux-yellow text-xs">
                                  {formatUsdValue(entry.tokenValueUsd)}
                                </span>
                              )}
                            </div>
                          </div>
                          {entry.calledFunctions.length > 0 && (
                            <div className="mt-1 text-coffee-500 text-[10px]">
                              calls: {entry.calledFunctions.join(', ')}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  {(functionCapital.unresolvedCallsCount ?? 0) > 0 && (
                    <div className="text-yellow-400 text-xs">
                      {functionCapital.unresolvedCallsCount} unresolved external
                      call
                      {functionCapital.unresolvedCallsCount > 1 ? 's' : ''}
                    </div>
                  )}
                  <div className="flex items-center justify-between border-coffee-600 border-t pt-1 text-xs">
                    <span className="text-coffee-400">Total at risk</span>
                    <div className="flex items-center gap-2">
                      {functionCapital.totalReachableFundsUsd > 0 && (
                        <span className="text-green-400">
                          {formatUsdValue(
                            functionCapital.totalReachableFundsUsd,
                          )}
                        </span>
                      )}
                      {functionCapital.totalReachableTokenValueUsd > 0 && (
                        <span className="text-aux-yellow">
                          {formatUsdValue(
                            functionCapital.totalReachableTokenValueUsd,
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* 6. External Dependencies Section */}
          <div className="border-coffee-700 border-b p-3">
            <div className="mb-2 flex items-center justify-between">
              <label className="flex items-center gap-1 text-coffee-300 text-xs">
                <span
                  style={{
                    color:
                      (currentFunction?.dependencies?.length ?? 0) > 0 ||
                      functionDeps.length > 0
                        ? '#f97316'
                        : '#9ca3af',
                  }}
                >
                  <IconDependency />
                </span>
                External Dependencies
              </label>
              <button
                onClick={() => setIsAddingDependency(!isAddingDependency)}
                className="rounded bg-coffee-700 px-2 py-1 text-coffee-100 text-xs hover:bg-coffee-600"
              >
                {isAddingDependency ? 'Cancel' : '+ Add Dependency'}
              </button>
            </div>
            <div className="mb-2 text-coffee-500 text-xs">
              From this function, calls to these external contracts outside of
              the analysed protocol are made
            </div>

            {/* Auto-detected dependencies from call graph */}
            {functionDeps.filter((d) => d.isAutoDetected).length > 0 && (
              <div className="mb-3">
                <div className="mb-1 text-coffee-400 text-xs">
                  Auto-detected (
                  {functionDeps.filter((d) => d.isAutoDetected).length}
                  ):
                </div>
                <div className="space-y-2">
                  {functionDeps
                    .filter((d) => d.isAutoDetected)
                    .map((dep, idx) => {
                      return (
                        <div key={idx} className="rounded bg-coffee-800 p-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  usePanelStore.getState().select(dep.address)
                                }}
                                className="font-mono text-aux-cyan text-xs hover:text-aux-cyan-light"
                                title={`Select ${dep.address}`}
                              >
                                {dep.name}
                              </button>
                              <span
                                className={`rounded px-1 py-0.5 text-[10px] ${dep.dependencyType === 'write' ? 'bg-aux-orange/20 text-aux-orange' : 'bg-coffee-600 text-coffee-300'}`}
                              >
                                {dep.dependencyType === 'write'
                                  ? 'write'
                                  : 'auto'}
                              </span>
                              {dep.viewOnlyPath && (
                                <span className="rounded bg-coffee-600 px-1 py-0.5 text-coffee-300 text-[10px]">
                                  view only
                                </span>
                              )}
                            </div>
                          </div>
                          {dep.calledFunctions.length > 0 && (
                            <div className="mt-1 text-coffee-500 text-[10px]">
                              {dep.dependencyType === 'write'
                                ? 'owns'
                                : 'calls'}
                              : {dep.calledFunctions.join(', ')}
                            </div>
                          )}
                          {dep.entity && (
                            <div className="mt-1 flex items-center gap-1 text-xs">
                              <span className="text-coffee-400">Entity:</span>
                              <span className="font-semibold text-coffee-200">
                                {dep.entity}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Manual dependencies */}
            {currentFunction?.dependencies &&
              currentFunction.dependencies.length > 0 && (
                <div className="mb-3">
                  <div className="mb-1 text-coffee-400 text-xs">
                    Manual ({currentFunction.dependencies.length}):
                  </div>

                  <div className="space-y-2">
                    {currentFunction.dependencies.map((dependency, index) => {
                      const depInfo = getDependencyInfo(
                        dependency.contractAddress,
                      )

                      return (
                        <div key={index} className="rounded bg-coffee-800 p-2">
                          <div className="mb-1 flex items-center justify-between">
                            <div className="flex flex-1 items-center gap-2">
                              <button
                                onClick={() =>
                                  usePanelStore
                                    .getState()
                                    .select(dependency.contractAddress)
                                }
                                className="font-mono text-aux-cyan text-xs hover:text-aux-cyan-light"
                                title={`Select ${dependency.contractAddress}`}
                              >
                                {depInfo?.name ||
                                  dependency.contractAddress.slice(0, 10) +
                                    '...'}
                              </button>
                              <button
                                onClick={() =>
                                  usePanelStore
                                    .getState()
                                    .select(dependency.contractAddress)
                                }
                                className="text-coffee-400 hover:text-coffee-300"
                                title="Select this contract"
                              >
                                <IconOpen />
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveDependency(index)}
                              className="ml-2 flex-shrink-0 text-aux-red hover:opacity-80"
                              title="Remove this dependency"
                            >
                              ✕
                            </button>
                          </div>

                          {depInfo?.entity && (
                            <div className="mt-1 flex items-center gap-1 text-xs">
                              <span className="text-coffee-400">Entity:</span>
                              <span className="font-semibold text-coffee-200">
                                {depInfo.entity}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

            {/* No dependencies message */}
            {(!currentFunction?.dependencies ||
              currentFunction.dependencies.length === 0) &&
              functionDeps.filter((d) => d.isAutoDetected).length === 0 && (
                <div className="mb-3 text-coffee-500 text-xs">
                  No dependencies detected
                </div>
              )}

            {/* Add dependency form */}
            {isAddingDependency && (
              <div className="rounded bg-coffee-800 p-3">
                <div className="mb-3 text-coffee-400 text-xs">
                  Select an external contract to add as a dependency
                </div>

                {getExternalContracts.length === 0 ? (
                  <div className="text-coffee-400 text-xs">
                    No external contracts found. Mark contracts as external in
                    the Values panel to add them as dependencies.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {getExternalContracts.map((contract) => (
                      <button
                        key={contract.address}
                        onClick={() => handleAddDependency(contract.address)}
                        disabled={currentFunction?.dependencies?.some((d) =>
                          addressesEqual(d.contractAddress, contract.address),
                        )}
                        className="w-full rounded bg-coffee-700 p-2 text-left hover:bg-coffee-600 disabled:cursor-not-allowed disabled:bg-coffee-600 disabled:opacity-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-mono text-coffee-100 text-xs">
                              {contract.name}
                            </div>
                            <div className="mt-1 text-coffee-400 text-xs">
                              {contract.address.slice(0, 10)}...
                            </div>
                          </div>
                          <div className="ml-2 flex items-center gap-2">
                            {contract.entity && (
                              <span className="rounded bg-coffee-600 px-1.5 py-0.5 text-coffee-300 text-xs">
                                {contract.entity}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 7. Function Delay Section */}
          <div className="border-coffee-700 border-b p-3">
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-coffee-300 text-xs">
                Function Delay
              </label>
              {currentFunction?.delay ? (
                <button
                  onClick={handleClearDelay}
                  className="rounded bg-coffee-700 px-2 py-1 text-coffee-100 text-xs hover:bg-coffee-600"
                >
                  Clear Delay
                </button>
              ) : (
                <button
                  onClick={() => setIsSettingDelay(!isSettingDelay)}
                  className="rounded bg-coffee-700 px-2 py-1 text-coffee-100 text-xs hover:bg-coffee-600"
                >
                  {isSettingDelay ? 'Cancel' : '+ Set Delay'}
                </button>
              )}
            </div>

            {/* Display current delay */}
            {currentFunction?.delay && (
              <div className="mb-3">
                <div className="flex items-center gap-2 rounded border border-green-900 bg-green-950/30 p-2">
                  <span className="text-aux-green" style={{ flexShrink: 0 }}>
                    <IconClock />
                  </span>
                  <div className="min-w-0 flex-1">
                    {resolvedDelay?.isResolved && (
                      <div className="text-coffee-200 text-xs">
                        Delay:{' '}
                        <span className="font-bold text-aux-green">
                          {formatDelay(resolvedDelay.seconds)}
                        </span>
                      </div>
                    )}
                    {resolvedDelay && !resolvedDelay.isResolved && (
                      <div className="text-aux-red text-xs">
                        Error: {resolvedDelay.error}
                      </div>
                    )}
                    <div className="font-mono text-coffee-400 text-xs">
                      {currentFunction.delay.fieldName} on{' '}
                      {getContractName(currentFunction.delay.contractAddress)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Auto-detected delay suggestion */}
            {!currentFunction?.delay && functionTraversal?.suggestedDelay && (
              <div className="mb-3">
                <div className="flex items-center gap-2 rounded border border-cyan-800 bg-cyan-950/30 p-2">
                  <span className="text-aux-cyan" style={{ flexShrink: 0 }}>
                    <IconClock />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-coffee-200 text-xs">
                      Detected:{' '}
                      <span className="font-bold text-aux-cyan">
                        {formatDelay(functionTraversal.suggestedDelay.seconds)}
                      </span>{' '}
                      via {functionTraversal.suggestedDelay.contractName}
                    </div>
                    <div className="font-mono text-coffee-400 text-xs">
                      {functionTraversal.suggestedDelay.fieldName} on{' '}
                      {getContractName(
                        functionTraversal.suggestedDelay.contractAddress,
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const s = functionTraversal.suggestedDelay!
                      onDelayUpdate(contractAddress, functionName, {
                        contractAddress: s.contractAddress,
                        fieldName: s.fieldName,
                      })
                    }}
                    className="shrink-0 rounded bg-cyan-700 px-2 py-1 text-white text-xs hover:bg-cyan-600"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Set delay form */}
            {isSettingDelay && !currentFunction?.delay && (
              <div className="rounded bg-coffee-800 p-3">
                <div className="mb-2">
                  <label className="mb-1 block text-coffee-300 text-xs">
                    Contract:
                  </label>
                  <select
                    value={newDelayData.contractAddress}
                    onChange={(e) =>
                      setNewDelayData((prev) => ({
                        ...prev,
                        contractAddress: e.target.value,
                        fieldName: '',
                      }))
                    }
                    className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs"
                  >
                    <option value="">Select a contract...</option>
                    {availableContracts.map((contract) => (
                      <option key={contract.address} value={contract.address}>
                        {contract.name} ({contract.address.slice(0, 10)}...) [
                        {contract.source}]
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-coffee-300 text-xs">
                    Delay Field:
                  </label>
                  <select
                    value={newDelayData.fieldName}
                    onChange={(e) =>
                      setNewDelayData((prev) => ({
                        ...prev,
                        fieldName: e.target.value,
                      }))
                    }
                    disabled={!newDelayData.contractAddress}
                    className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs disabled:opacity-50"
                  >
                    <option value="">Select a field...</option>
                    {newDelayData.contractAddress &&
                      getAvailableDelayFields(newDelayData.contractAddress).map(
                        (field) => (
                          <option key={field.name} value={field.name}>
                            {field.name} (value: {field.value}){' '}
                            {field.description && `- ${field.description}`}
                          </option>
                        ),
                      )}
                  </select>
                  {newDelayData.contractAddress &&
                    getAvailableDelayFields(newDelayData.contractAddress)
                      .length === 0 && (
                      <div className="mt-1 text-coffee-400 text-xs">
                        No numeric fields found in this contract
                      </div>
                    )}
                </div>
                <button
                  onClick={handleSetDelay}
                  disabled={
                    !newDelayData.contractAddress || !newDelayData.fieldName
                  }
                  className="rounded bg-green-600 px-3 py-1 text-white text-xs hover:bg-green-500 disabled:bg-coffee-600 disabled:text-coffee-400"
                >
                  Set Delay
                </button>
              </div>
            )}
          </div>

          {/* 7b. Mitigations Section */}
          <div className="border-coffee-700 border-b p-3">
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-coffee-300 text-xs">
                Mitigations
                {(() => {
                  const total = currentFunction?.mitigations?.length ?? 0
                  return total > 0 ? (
                    <span className="ml-1 text-aux-cyan">({total})</span>
                  ) : null
                })()}
              </label>
              {!isAddingMitigation && (
                <button
                  onClick={() => {
                    resetMitigationForm()
                    setIsAddingMitigation(true)
                  }}
                  className="rounded bg-coffee-700 px-2 py-1 text-coffee-100 text-xs hover:bg-coffee-600"
                >
                  + Add Mitigation
                </button>
              )}
            </div>

            {/* Display existing mitigations */}
            {(currentFunction?.mitigations ?? []).map((m, idx) => (
              <div key={idx} className="mb-2 rounded bg-coffee-800 p-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {/* First line: type badge + values */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] ${
                          m.type === 'valueRange'
                            ? 'bg-indigo-800 text-indigo-200'
                            : m.type === 'relativeValue'
                              ? 'bg-amber-800 text-amber-200'
                              : 'bg-coffee-700 text-coffee-300'
                        }`}
                      >
                        {m.type === 'valueRange'
                          ? 'RANGE'
                          : m.type === 'relativeValue'
                            ? 'RELATIVE'
                            : 'OTHER'}
                      </span>
                      {m.type === 'valueRange' && m.valueRange && (
                        <span className="font-mono text-coffee-100 text-xs">
                          {m.valueRange.min !== undefined && (
                            <MitigationValueDisplay
                              label="min"
                              val={m.valueRange.min}
                              contractAddress={contractAddress}
                              allContracts={allContracts}
                            />
                          )}
                          {m.valueRange.min !== undefined &&
                            m.valueRange.max !== undefined &&
                            ', '}
                          {m.valueRange.max !== undefined && (
                            <MitigationValueDisplay
                              label="max"
                              val={m.valueRange.max}
                              contractAddress={contractAddress}
                              allContracts={allContracts}
                            />
                          )}
                          {m.valueRange.unit && ` ${m.valueRange.unit}`}
                        </span>
                      )}
                      {m.type === 'relativeValue' &&
                        m.relativeValue &&
                        m.relativeValue.maxChangePercent !== undefined && (
                          <span className="font-mono text-coffee-100 text-xs">
                            max change:{' '}
                            <MitigationValueDisplay
                              label=""
                              val={m.relativeValue.maxChangePercent}
                              contractAddress={contractAddress}
                              allContracts={allContracts}
                            />
                            %
                          </span>
                        )}
                      {m.mitigatedField && (
                        <span
                          className="shrink-0 rounded bg-emerald-900/60 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300"
                          title={`Monitors ${m.mitigatedField.contractAddress}.${m.mitigatedField.fieldName} (HIGH severity)`}
                        >
                          monitors: {m.mitigatedField.fieldName}
                        </span>
                      )}
                      {m.scopedTo && (
                        <span
                          className="shrink-0 rounded bg-purple-900/60 px-1.5 py-0.5 font-mono text-[10px] text-purple-300"
                          title={`Scoped to ${m.scopedTo.type}: ${m.scopedTo.address}`}
                        >
                          {m.scopedTo.type === 'admin' ? 'admin' : 'dep'}:{' '}
                          {(() => {
                            const info = availableContracts.find((c) =>
                              addressesEqual(c.address, m.scopedTo!.address),
                            )
                            return (
                              info?.name ||
                              m.scopedTo!.address.slice(0, 12) + '...'
                            )
                          })()}
                        </span>
                      )}
                      {m.impactCap &&
                        (() => {
                          const capUsd =
                            m.impactCapUsd ??
                            m.impactCap.hardcodedUsd ??
                            (m.impactCap.fieldName
                              ? resolveCapUsd(
                                  m.impactCap as {
                                    contractAddress: string
                                    fieldName: string
                                    unit: string
                                  },
                                )
                              : undefined)
                          if (capUsd === undefined) return null
                          const formatted =
                            capUsd >= 1e9
                              ? `$${(capUsd / 1e9).toFixed(1)}B`
                              : capUsd >= 1e6
                                ? `$${(capUsd / 1e6).toFixed(1)}M`
                                : capUsd >= 1e3
                                  ? `$${(capUsd / 1e3).toFixed(0)}K`
                                  : `$${capUsd.toFixed(0)}`
                          return (
                            <span
                              className="shrink-0 rounded bg-emerald-900/60 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300"
                              title={`Maximum fund impact: $${capUsd.toLocaleString()}`}
                            >
                              {formatted} Max Impact
                            </span>
                          )
                        })()}
                    </div>
                    {/* Second line: description */}
                    {m.description && (
                      <div className="mt-1 text-coffee-300 text-xs">
                        {m.description}
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => handleEditMitigation(idx)}
                      className="rounded px-1.5 py-0.5 text-coffee-400 text-xs hover:bg-coffee-700 hover:text-coffee-200"
                      title="Edit mitigation"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRemoveMitigation(idx)}
                      className="rounded px-1.5 py-0.5 text-coffee-400 text-xs hover:bg-red-900 hover:text-red-300"
                      title="Remove mitigation"
                    >
                      x
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* No mitigations message */}
            {(currentFunction?.mitigations?.length ?? 0) === 0 &&
              !isAddingMitigation && (
                <div className="text-coffee-500 text-xs">
                  No mitigations set for this function
                </div>
              )}

            {/* Add/Edit mitigation form */}
            {isAddingMitigation && (
              <div className="rounded bg-coffee-800 p-3">
                {/* Monitored field — at the top as the primary question */}
                <div className="mb-3">
                  <label className="mb-1.5 block text-coffee-300 text-xs">
                    Monitored field{' '}
                    <span className="text-coffee-500">
                      (auto HIGH severity)
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <select
                        value={newMitigation.mitigatedField.contractAddress}
                        onChange={(e) =>
                          setNewMitigation((prev) => ({
                            ...prev,
                            mitigatedField: {
                              ...prev.mitigatedField,
                              contractAddress: e.target.value,
                              fieldName: '',
                            },
                          }))
                        }
                        className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs"
                      >
                        {availableContracts.map((contract) => (
                          <option
                            key={contract.address}
                            value={contract.address}
                          >
                            {contract.name} ({contract.address.slice(0, 10)}...)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <select
                        value={newMitigation.mitigatedField.fieldName}
                        onChange={(e) =>
                          setNewMitigation((prev) => ({
                            ...prev,
                            mitigatedField: {
                              ...prev.mitigatedField,
                              fieldName: e.target.value,
                            },
                          }))
                        }
                        disabled={!newMitigation.mitigatedField.contractAddress}
                        className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs disabled:opacity-50"
                      >
                        <option value="">No field (skip monitoring)</option>
                        {newMitigation.mitigatedField.contractAddress &&
                          getAvailableFields(
                            newMitigation.mitigatedField.contractAddress,
                          ).map((field) => (
                            <option key={field.name} value={field.name}>
                              {field.name}
                              {field.valuePreview && ` (${field.valuePreview})`}
                              {field.description && ` - ${field.description}`}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Type + constraint values */}
                <div className="mb-2 flex gap-2">
                  <div className="w-48">
                    <label className="mb-1 block text-coffee-300 text-xs">
                      Constraint:
                    </label>
                    <select
                      value={newMitigation.type}
                      onChange={(e) =>
                        setNewMitigation((prev) => ({
                          ...prev,
                          type: e.target.value as MitigationType,
                        }))
                      }
                      className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs"
                    >
                      <option value="valueRange">Value Range (MIN/MAX)</option>
                      <option value="relativeValue">Relative (% change)</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Label field for 'other' type */}
                  {newMitigation.type === 'other' && (
                    <div className="flex-1">
                      <label className="mb-1 block text-coffee-300 text-xs">
                        Label{' '}
                        <span className="text-coffee-500">
                          (short, shown in badge)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={newMitigation.label}
                        onChange={(e) =>
                          setNewMitigation((prev) => ({
                            ...prev,
                            label: e.target.value,
                          }))
                        }
                        placeholder="e.g. Rate Limit"
                        maxLength={30}
                        className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs"
                      />
                    </div>
                  )}

                  {/* Inline value fields */}
                  {newMitigation.type === 'valueRange' && (
                    <>
                      <div className="flex-1">
                        <MitigationValueFormInput
                          label="Min"
                          state={newMitigation.valueRange.min}
                          onChange={(min) =>
                            setNewMitigation((prev) => ({
                              ...prev,
                              valueRange: {
                                ...prev.valueRange,
                                min,
                              },
                            }))
                          }
                          placeholder="e.g. 0"
                          fieldPlaceholder="$self.minValue"
                          contractAddress={contractAddress}
                          allContracts={allContracts}
                        />
                      </div>
                      <div className="flex-1">
                        <MitigationValueFormInput
                          label="Max"
                          state={newMitigation.valueRange.max}
                          onChange={(max) =>
                            setNewMitigation((prev) => ({
                              ...prev,
                              valueRange: {
                                ...prev.valueRange,
                                max,
                              },
                            }))
                          }
                          placeholder="e.g. 1000"
                          fieldPlaceholder="$self.maxValue"
                          contractAddress={contractAddress}
                          allContracts={allContracts}
                        />
                      </div>
                      <div className="w-16">
                        <label className="mb-1 block text-coffee-300 text-xs">
                          Unit:
                        </label>
                        <input
                          type="text"
                          value={newMitigation.valueRange.unit}
                          onChange={(e) =>
                            setNewMitigation((prev) => ({
                              ...prev,
                              valueRange: {
                                ...prev.valueRange,
                                unit: e.target.value,
                              },
                            }))
                          }
                          placeholder="ETH"
                          className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 font-mono text-coffee-100 text-xs"
                        />
                      </div>
                    </>
                  )}
                  {newMitigation.type === 'relativeValue' && (
                    <div className="flex-1">
                      <MitigationValueFormInput
                        label="Max Change (%)"
                        state={newMitigation.relativeValue.maxChangePercent}
                        onChange={(maxChangePercent) =>
                          setNewMitigation((prev) => ({
                            ...prev,
                            relativeValue: { maxChangePercent },
                          }))
                        }
                        placeholder="e.g. 5"
                        fieldPlaceholder="$self.maxChangePercent"
                        contractAddress={contractAddress}
                        allContracts={allContracts}
                      />
                    </div>
                  )}
                </div>

                {/* Impact Cap (optional, applies to any mitigation type) */}
                <div className="mb-3">
                  <label className="mb-1 block text-coffee-300 text-xs">
                    Fund Impact Cap{' '}
                    <span className="text-coffee-500">(optional)</span>:
                  </label>
                  <div className="mb-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setNewMitigation((prev) => ({
                          ...prev,
                          impactCap: { ...prev.impactCap, mode: 'field' },
                        }))
                      }
                      className={`rounded px-2 py-0.5 text-xs ${newMitigation.impactCap.mode === 'field' ? 'bg-coffee-500 text-coffee-100' : 'bg-coffee-700 text-coffee-400'}`}
                    >
                      Contract Field
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewMitigation((prev) => ({
                          ...prev,
                          impactCap: { ...prev.impactCap, mode: 'hardcoded' },
                        }))
                      }
                      className={`rounded px-2 py-0.5 text-xs ${newMitigation.impactCap.mode === 'hardcoded' ? 'bg-coffee-500 text-coffee-100' : 'bg-coffee-700 text-coffee-400'}`}
                    >
                      Hardcoded USD
                    </button>
                  </div>
                  {newMitigation.impactCap.mode === 'hardcoded' ? (
                    <input
                      type="text"
                      value={newMitigation.impactCap.hardcodedUsd}
                      onChange={(e) =>
                        setNewMitigation((prev) => ({
                          ...prev,
                          impactCap: {
                            ...prev.impactCap,
                            hardcodedUsd: e.target.value,
                          },
                        }))
                      }
                      placeholder="e.g. 10000000"
                      className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs"
                    />
                  ) : (
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <select
                          value={newMitigation.impactCap.contractAddress}
                          onChange={(e) =>
                            setNewMitigation((prev) => ({
                              ...prev,
                              impactCap: {
                                ...prev.impactCap,
                                contractAddress: e.target.value,
                                fieldName: '',
                              },
                            }))
                          }
                          className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs"
                        >
                          {availableContracts.map((contract) => (
                            <option
                              key={contract.address}
                              value={contract.address}
                            >
                              {contract.name} ({contract.address.slice(0, 10)}
                              ...)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <select
                          value={newMitigation.impactCap.fieldName}
                          onChange={(e) =>
                            setNewMitigation((prev) => ({
                              ...prev,
                              impactCap: {
                                ...prev.impactCap,
                                fieldName: e.target.value,
                              },
                            }))
                          }
                          disabled={!newMitigation.impactCap.contractAddress}
                          className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs disabled:opacity-50"
                        >
                          <option value="">Select field...</option>
                          {newMitigation.impactCap.contractAddress &&
                            getAvailableFields(
                              newMitigation.impactCap.contractAddress,
                            )
                              .filter((f) => {
                                const entry = projectData?.entries
                                  ?.flatMap((e) => [
                                    ...e.initialContracts,
                                    ...e.discoveredContracts,
                                  ])
                                  .find((c) =>
                                    addressesEqual(
                                      c.address,
                                      newMitigation.impactCap.contractAddress,
                                    ),
                                  )
                                const field = entry?.fields?.find(
                                  (ff) => ff.name === f.name,
                                )
                                return field?.value?.type === 'number'
                              })
                              .map((field) => (
                                <option key={field.name} value={field.name}>
                                  {field.name}
                                  {field.valuePreview &&
                                    ` (${field.valuePreview})`}
                                </option>
                              ))}
                        </select>
                      </div>
                      <div className="w-44">
                        <select
                          value={newMitigation.impactCap.unit}
                          onChange={(e) =>
                            setNewMitigation((prev) => ({
                              ...prev,
                              impactCap: {
                                ...prev.impactCap,
                                unit: e.target.value as ImpactCapUnit,
                              },
                            }))
                          }
                          className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs"
                        >
                          <option value="raw">USD (raw value)</option>
                          <option value="1e6">
                            Tokens — 6 dec (USDC, USDT)
                          </option>
                          <option value="1e8">Tokens — 8 dec (WBTC)</option>
                          <option value="1e18">
                            Tokens — 18 dec (ETH, ERC20)
                          </option>
                          <option value="bps">Basis points (÷ 10,000)</option>
                          <option value="percent">Percent (÷ 100)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="mb-1 block text-coffee-300 text-xs">
                    Description:
                  </label>
                  <input
                    type="text"
                    value={newMitigation.description}
                    onChange={(e) =>
                      setNewMitigation((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder={
                      newMitigation.type === 'other'
                        ? 'Describe the mitigation...'
                        : 'Explain this constraint...'
                    }
                    className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs"
                  />
                </div>

                {/* Scope (optional) */}
                <div className="mb-3">
                  <label className="mb-1 block text-coffee-300 text-xs">
                    Scope{' '}
                    <span className="text-coffee-500">
                      (optional — leave global for all callers)
                    </span>
                  </label>
                  <select
                    value={
                      newMitigation.scopedTo.address
                        ? `${newMitigation.scopedTo.type}:${newMitigation.scopedTo.address}`
                        : ''
                    }
                    onChange={(e) => {
                      const val = e.target.value
                      if (!val) {
                        setNewMitigation((prev) => ({
                          ...prev,
                          scopedTo: { address: '', type: '' },
                        }))
                      } else {
                        const colonIdx = val.indexOf(':')
                        const scopeType = val.slice(0, colonIdx) as
                          | 'admin'
                          | 'dependency'
                        const addr = val.slice(colonIdx + 1)
                        setNewMitigation((prev) => ({
                          ...prev,
                          scopedTo: { address: addr, type: scopeType },
                        }))
                      }
                    }}
                    className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs"
                  >
                    <option value="">Global (applies to all callers)</option>
                    {resolvedOwners.length > 0 && (
                      <optgroup label="Admins">
                        {resolvedOwners
                          .filter((o) => o.isResolved)
                          .flatMap((o) =>
                            (o.allAddresses ?? [o.address])
                              .filter(
                                (addr) =>
                                  addr !== 'NO_ADDRESSES' &&
                                  addr !== 'RESOLUTION_FAILED',
                              )
                              .map((addr) => {
                                const info = availableContracts.find((c) =>
                                  addressesEqual(c.address, addr),
                                )
                                return (
                                  <option
                                    key={`admin:${addr}`}
                                    value={`admin:${addr}`}
                                  >
                                    {info?.name ?? addr.slice(0, 12) + '...'} (
                                    {addr.slice(0, 10)}...)
                                  </option>
                                )
                              }),
                          )}
                      </optgroup>
                    )}
                    {(currentFunction?.dependencies?.length ?? 0) > 0 && (
                      <optgroup label="Dependencies">
                        {(currentFunction?.dependencies ?? []).map((dep) => {
                          const info = availableContracts.find((c) =>
                            addressesEqual(c.address, dep.contractAddress),
                          )
                          return (
                            <option
                              key={`dependency:${dep.contractAddress}`}
                              value={`dependency:${dep.contractAddress}`}
                            >
                              {info?.name ??
                                dep.contractAddress.slice(0, 12) + '...'}{' '}
                              ({dep.contractAddress.slice(0, 10)}...)
                            </option>
                          )
                        })}
                      </optgroup>
                    )}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAddMitigation}
                    disabled={!isMitigationFormValid()}
                    className="rounded bg-cyan-700 px-3 py-1 text-white text-xs hover:bg-cyan-600 disabled:bg-coffee-600 disabled:text-coffee-400"
                  >
                    {editingMitigationIndex !== null
                      ? 'Save Mitigation'
                      : 'Add Mitigation'}
                  </button>
                  <button
                    onClick={resetMitigationForm}
                    className="rounded bg-coffee-700 px-3 py-1 text-coffee-100 text-xs hover:bg-coffee-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 8. Comments Section (renamed from Audit Trail) */}
          <div className="border-coffee-700 border-b p-3">
            <label className="mb-2 block text-coffee-300 text-xs">
              Comments
            </label>
            {currentFunction && (currentFunction.comments?.length || 0) > 0 ? (
              <>
                <button
                  onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                  className="flex cursor-pointer items-center gap-1 text-coffee-400 text-xs hover:text-coffee-300"
                >
                  {isCommentsOpen ? <IconChevronDown /> : <IconChevronRight />}
                  <span>
                    {isCommentsOpen ? 'collapse' : 'expand'} comments (
                    {currentFunction.comments?.length || 0})
                  </span>
                </button>
                {!isCommentsOpen &&
                  currentFunction.comments &&
                  currentFunction.comments.length > 0 && (
                    <div className="mt-1 text-coffee-500 text-xs">
                      Last:{' '}
                      {
                        currentFunction.comments[
                          currentFunction.comments.length - 1
                        ]!.date.split('T')[0]
                      }{' '}
                      by{' '}
                      <a
                        href={`https://github.com/${currentFunction.comments[currentFunction.comments.length - 1]!.author}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-aux-cyan hover:underline"
                      >
                        {
                          currentFunction.comments[
                            currentFunction.comments.length - 1
                          ]!.author
                        }
                      </a>
                    </div>
                  )}
                {isCommentsOpen && (
                  <div className="mt-2">
                    {/* Comment list */}
                    <div className="mb-2 space-y-0">
                      {currentFunction.comments?.map((comment, idx) => (
                        <div
                          key={idx}
                          className={`border-coffee-700 p-2 ${
                            idx === 0
                              ? 'rounded-t border-t border-r border-l'
                              : 'border-r border-b border-l'
                          } ${idx === (currentFunction.comments?.length || 0) - 1 ? 'rounded-b' : ''}`}
                        >
                          <div className="mb-1 flex items-center gap-2 text-coffee-400 text-xs">
                            <a
                              href={`https://github.com/${comment.author}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-aux-cyan hover:underline"
                            >
                              {comment.author}
                            </a>
                            <span>{comment.date.split('T')[0]}</span>
                          </div>
                          <div className="text-coffee-200 text-xs">
                            {comment.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Add comment form */}
                    <div className="mt-2">
                      <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="h-16 w-full resize-none rounded border border-coffee-600 bg-coffee-800 px-2 py-1 font-mono text-coffee-100 text-xs focus:border-coffee-500 focus:outline-none"
                      />
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-coffee-500 text-xs">
                          {researcherGithub ? (
                            <>
                              Posting as{' '}
                              <span className="text-aux-cyan">
                                {researcherGithub}
                              </span>
                            </>
                          ) : (
                            <span className="text-aux-red">
                              RESEARCHER_GITHUB not set
                            </span>
                          )}
                        </span>
                        <button
                          onClick={async () => {
                            if (!newCommentText.trim()) return
                            setIsSubmittingComment(true)
                            try {
                              await onAddComment(
                                contractAddress,
                                functionName,
                                newCommentText,
                              )
                              setNewCommentText('')
                            } finally {
                              setIsSubmittingComment(false)
                            }
                          }}
                          disabled={
                            !newCommentText.trim() || isSubmittingComment
                          }
                          className="rounded bg-coffee-700 px-3 py-1 text-coffee-100 text-xs hover:bg-coffee-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSubmittingComment ? 'Adding...' : 'Add Comment'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {!isCommentsOpen ? (
                  <button
                    onClick={() => setIsCommentsOpen(true)}
                    className="text-coffee-400 text-xs hover:text-coffee-300"
                  >
                    + Add comment
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={() => setIsCommentsOpen(false)}
                      className="mb-2 flex cursor-pointer items-center gap-1 text-coffee-400 text-xs hover:text-coffee-300"
                    >
                      <IconChevronDown />
                      <span>collapse</span>
                    </button>
                    <textarea
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="h-16 w-full resize-none rounded border border-coffee-600 bg-coffee-800 px-2 py-1 font-mono text-coffee-100 text-xs focus:border-coffee-500 focus:outline-none"
                    />
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-coffee-500 text-xs">
                        {researcherGithub ? (
                          <>
                            Posting as{' '}
                            <span className="text-aux-cyan">
                              {researcherGithub}
                            </span>
                          </>
                        ) : (
                          <span className="text-aux-red">
                            RESEARCHER_GITHUB not set
                          </span>
                        )}
                      </span>
                      <button
                        onClick={async () => {
                          if (!newCommentText.trim()) return
                          setIsSubmittingComment(true)
                          try {
                            await onAddComment(
                              contractAddress,
                              functionName,
                              newCommentText,
                            )
                            setNewCommentText('')
                            setIsCommentsOpen(false)
                          } finally {
                            setIsSubmittingComment(false)
                          }
                        }}
                        disabled={!newCommentText.trim() || isSubmittingComment}
                        className="rounded bg-coffee-700 px-3 py-1 text-coffee-100 text-xs hover:bg-coffee-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSubmittingComment ? 'Adding...' : 'Add Comment'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Displays a MitigationValue — handles both hardcoded and field-ref modes.
 * For field refs, resolves the current value from project data.
 */
function MitigationValueDisplay({
  label,
  val,
  contractAddress,
  allContracts,
}: {
  label: string
  val: MitigationValue | string | undefined
  contractAddress: string
  allContracts: any[]
}) {
  const normalized = normalizeMitigationValue(val as any)
  if (!normalized) return null

  if (normalized.mode === 'fieldRef' && normalized.fieldPath) {
    const dataAccess = new UIContractDataAccess(allContracts)
    const result = resolveFieldValue(
      dataAccess,
      contractAddress,
      normalized.fieldPath,
    )
    const display = result.error
      ? `[err: ${result.error}]`
      : String(result.value)
    return (
      <span title={`Field: ${normalized.fieldPath}`}>
        {label ? `${label}: ` : ''}
        <span className="text-aux-cyan">{normalized.fieldPath}</span>
        <span className="text-coffee-400"> = {display}</span>
      </span>
    )
  }

  // Hardcoded value
  return (
    <span>
      {label ? `${label}: ` : ''}
      {normalized.value}
    </span>
  )
}

/**
 * Form input for a MitigationValue — toggle between hardcoded and field ref.
 */
function MitigationValueFormInput({
  label,
  state,
  onChange,
  placeholder,
  fieldPlaceholder,
  contractAddress,
  allContracts,
}: {
  label: string
  state: { mode: 'hardcoded' | 'fieldRef'; value: string; fieldPath: string }
  onChange: (s: {
    mode: 'hardcoded' | 'fieldRef'
    value: string
    fieldPath: string
  }) => void
  placeholder: string
  fieldPlaceholder: string
  contractAddress: string
  allContracts: any[]
}) {
  // Resolve field ref value for display
  const resolvedValue = React.useMemo(() => {
    if (state.mode !== 'fieldRef' || !state.fieldPath.trim()) return null
    const dataAccess = new UIContractDataAccess(allContracts)
    return resolveFieldValue(dataAccess, contractAddress, state.fieldPath)
  }, [state.mode, state.fieldPath, contractAddress, allContracts])

  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <label className="text-coffee-300 text-xs">{label}:</label>
        <button
          type="button"
          onClick={() =>
            onChange({
              ...state,
              mode: state.mode === 'hardcoded' ? 'fieldRef' : 'hardcoded',
            })
          }
          className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
            state.mode === 'fieldRef'
              ? 'bg-aux-cyan/20 text-aux-cyan'
              : 'bg-coffee-700 text-coffee-400'
          }`}
          title={
            state.mode === 'hardcoded'
              ? 'Switch to field reference'
              : 'Switch to hardcoded value'
          }
        >
          {state.mode === 'fieldRef' ? 'Field' : 'Value'}
        </button>
      </div>
      {state.mode === 'hardcoded' ? (
        <input
          type="text"
          value={state.value}
          onChange={(e) => onChange({ ...state, value: e.target.value })}
          placeholder={placeholder}
          className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 font-mono text-coffee-100 text-xs"
        />
      ) : (
        <>
          <input
            type="text"
            value={state.fieldPath}
            onChange={(e) => onChange({ ...state, fieldPath: e.target.value })}
            placeholder={fieldPlaceholder}
            className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 font-mono text-aux-cyan text-xs"
          />
          {resolvedValue && (
            <div className="mt-0.5 font-mono text-[10px]">
              {resolvedValue.error ? (
                <span className="text-red-400">{resolvedValue.error}</span>
              ) : (
                <span className="text-coffee-400">
                  = {String(resolvedValue.value)}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function getClassName(word: string) {
  if (solidity.keywords.includes(word)) {
    return 'text-aux-orange'
  }
  if (solidity.typeNames.includes(word)) {
    return 'text-aux-red'
  }
  if (/\(|\)|,/.test(word)) {
    return 'text-coffee-400'
  }
}
