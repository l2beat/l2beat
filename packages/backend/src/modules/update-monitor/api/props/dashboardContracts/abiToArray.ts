import type { ethers } from 'ethers'

export function abiToArray(abi: ethers.utils.Interface): string[] {
  return Object.entries(abi.functions).map(([name]) => name)
}
