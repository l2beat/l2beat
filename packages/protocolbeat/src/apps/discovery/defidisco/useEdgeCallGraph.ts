import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getCallGraphData } from '../../../api/api'
import type { ExternalCall } from '../../../api/types'

export type EdgeCallsMap = Record<string, Record<string, ExternalCall[]>>

export interface GroupedCalls {
  reads: ExternalCall[]
  writes: ExternalCall[]
  unknown: ExternalCall[]
}

/**
 * Hook to fetch call graph data and build a lookup map for edges.
 * The map is keyed by [sourceAddress][targetAddress] for O(1) lookup.
 */
export function useEdgeCallGraph(project: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['call-graph', project],
    queryFn: () => getCallGraphData(project),
  })

  const edgeCallsMap = useMemo<EdgeCallsMap>(() => {
    if (!data?.contracts) return {}

    const map: EdgeCallsMap = {}

    for (const contract of Object.values(data.contracts)) {
      if (!contract.externalCalls?.length) continue

      for (const call of contract.externalCalls) {
        if (!call.resolvedAddress) continue

        const sourceAddress = contract.address
        const targetAddress = call.resolvedAddress

        if (!map[sourceAddress]) {
          map[sourceAddress] = {}
        }
        if (!map[sourceAddress][targetAddress]) {
          map[sourceAddress][targetAddress] = []
        }
        map[sourceAddress][targetAddress].push(call)
      }
    }

    return map
  }, [data])

  return { edgeCallsMap, isLoading, error }
}

/**
 * Groups calls by their type: reads (view), writes (state-changing), unknown
 */
export function groupCallsByType(calls: ExternalCall[]): GroupedCalls {
  const reads: ExternalCall[] = []
  const writes: ExternalCall[] = []
  const unknown: ExternalCall[] = []

  for (const call of calls) {
    if (call.isViewCall === true) {
      reads.push(call)
    } else if (call.isViewCall === false) {
      writes.push(call)
    } else {
      unknown.push(call)
    }
  }

  return { reads, writes, unknown }
}

export interface BidirectionalCalls {
  outgoing: ExternalCall[] // Calls from source to target
  incoming: ExternalCall[] // Calls from target to source
}

/**
 * Gets calls between two contracts in both directions from the edge calls map
 */
export function getEdgeCalls(
  edgeCallsMap: EdgeCallsMap,
  sourceAddress: string,
  targetAddress: string,
): BidirectionalCalls {
  return {
    outgoing: edgeCallsMap[sourceAddress]?.[targetAddress] ?? [],
    incoming: edgeCallsMap[targetAddress]?.[sourceAddress] ?? [],
  }
}

/**
 * Check if there are any calls between two contracts (in either direction)
 */
export function hasEdgeCalls(
  edgeCallsMap: EdgeCallsMap,
  sourceAddress: string,
  targetAddress: string,
): boolean {
  const calls = getEdgeCalls(edgeCallsMap, sourceAddress, targetAddress)
  return calls.outgoing.length > 0 || calls.incoming.length > 0
}
