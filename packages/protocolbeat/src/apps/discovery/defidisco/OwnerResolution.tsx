import React from 'react'
import type { OwnerDefinition } from '../../../api/types'

// Interface for resolved owner information
export interface ResolvedOwner {
  address: string
  source: OwnerDefinition
  isResolved: boolean
  error?: string
}

/**
 * Resolves owner definitions to actual addresses using already discovered data.
 * This function uses the backend API that reads from discovered.json.
 */
export async function resolveOwnerAddresses(
  definitions: OwnerDefinition[],
  project: string,
): Promise<ResolvedOwner[]> {
  if (!definitions || definitions.length === 0) {
    return []
  }

  try {
    const response = await fetch(`/api/projects/${project}/resolve-owners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerDefinitions: definitions }),
    })

    if (!response.ok) {
      throw new Error(`Failed to resolve owners: ${response.statusText}`)
    }

    const result = await response.json()
    return result.resolved || []
  } catch (error) {
    console.error('Error resolving owners:', error)
    // Return error entries for all definitions
    return definitions.map(definition => ({
      address: 'RESOLUTION_FAILED',
      source: definition,
      isResolved: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }))
  }
}

/**
 * React hook for resolving owner definitions with caching and error handling.
 */
export function useOwnerResolution(
  definitions: OwnerDefinition[] | undefined,
  project: string
) {
  const [resolved, setResolved] = React.useState<ResolvedOwner[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!definitions || definitions.length === 0 || !project) {
      setResolved([])
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    resolveOwnerAddresses(definitions, project)
      .then(owners => {
        if (!cancelled) {
          setResolved(owners)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [definitions, project])

  return { resolved, loading, error }
}

/**
 * Utility function to get all unique resolved addresses from owner definitions.
 */
export function getResolvedAddresses(resolved: ResolvedOwner[]): string[] {
  return Array.from(new Set(
    resolved
      .filter(owner => owner.isResolved && owner.address !== 'RESOLUTION_FAILED')
      .map(owner => owner.address)
  ))
}

/**
 * Utility function to format owner definition for display.
 */
export function formatOwnerDefinition(definition: OwnerDefinition): string {
  if (definition.type === 'field') {
    const { contractAddress, method } = definition.field || {}
    return `${method}() on ${contractAddress?.slice(0, 8)}...`
  }

  if (definition.type === 'role') {
    const { roleName, accessControlContract } = definition.role || {}
    return `${roleName} role on ${accessControlContract?.slice(0, 8)}...`
  }

  return 'Unknown definition'
}