import { providers } from 'ethers'

export async function analyzeEOA(
  provider: providers.Provider,
  address: string
) {
  const bytecode = await provider.getCode(address)
  return {
    EOA: !bytecode || bytecode === '0x',
  }
}
