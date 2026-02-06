import { uniq } from 'es-toolkit/compat'
import { useMemo } from 'react'
import type { InteropProtocolData } from '~/server/features/scaling/interop/utils/getTopProtocols'
import { generateAccessibleColors } from '~/utils/generateColors'

export const OTHERS_PROTOCOL_NAME = 'Others'

/**
 * Creates a consistent color map for protocols based on their names.
 * This ensures the same protocol always gets the same color across different widgets,
 * regardless of sorting order.
 */
export function useProtocolColorMap(
  allProtocols: InteropProtocolData[] | undefined,
): Map<string, string> {
  return useMemo(() => {
    if (!allProtocols || allProtocols.length === 0) {
      return new Map()
    }

    // Get all unique protocol names and sort for consistent ordering
    const protocolNames = uniq(allProtocols.map((p) => p.protocolName)).sort()

    const colors = generateAccessibleColors(protocolNames.length + 1) // +1 for "Others"

    const colorMap = new Map<string, string>()
    protocolNames.forEach((name, index) => {
      colorMap.set(name, colors[index] ?? '#000000')
    })
    colorMap.set(OTHERS_PROTOCOL_NAME, colors[colors.length - 1] ?? '#000000')

    return colorMap
  }, [allProtocols])
}
