type Network = { id: string; display: string }

export function generateNetworkPairs(
  networks: readonly Network[],
): [Network, Network][] {
  const pairs: [Network, Network][] = []

  for (let i = 0; i < networks.length; i++) {
    for (let j = i + 1; j < networks.length; j++) {
      pairs.push([networks[i], networks[j]])
    }
  }

  return pairs
}
