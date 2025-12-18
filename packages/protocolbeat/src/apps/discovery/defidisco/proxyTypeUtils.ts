/**
 * Builds a map of contract address -> proxyType for O(1) lookups
 * @param projectData - The project data containing entries with contracts
 * @returns Map with lowercase addresses as keys and proxyType strings as values
 */
export function buildProxyTypeMap(projectData: any): Map<string, string> {
  const map = new Map<string, string>()

  if (!projectData?.entries) {
    return map
  }

  projectData.entries.forEach((entry: any) => {
    const allContracts = [
      ...(entry.initialContracts || []),
      ...(entry.discoveredContracts || []),
    ]

    allContracts.forEach((contract: any) => {
      if (contract.proxyType) {
        map.set(contract.address.toLowerCase(), contract.proxyType)
      }
    })
  })

  return map
}
