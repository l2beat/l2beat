import { providers } from 'ethers'

const ctcMapping: Record<string, string | undefined> = {
  '0x5E4e65926BA27467555EB562121fac00D24E9dD2': 'Optimism OVM 2.0',
  '0x4BF681894abEc828B212C906082B444Ceb2f6cf6': 'Optimism OVM 1.0',
  '0x56a76bcC92361f6DF8D75476feD8843EdC70e1C9': 'Metis',
  '0x6A1DB7d799FBA381F2a518cA859ED30cB8E1d41a': 'Metis 2.0',
  '0xfBd2541e316948B259264c02f370eD088E04c3Db': 'Boba Network',
}

export async function analyzeTransaction(
  provider: providers.Provider,
  txHash: string,
) {
  const tx = await provider.getTransaction(txHash)
  const project = ctcMapping[tx.to ?? ''] ?? 'Unknown'

  return {
    data: tx.data,
    project,
  }
}
