import { utils } from 'ethers'

const MASK_250 = (1n << 250n) - 1n

/** sn_keccak: keccak256 truncated to 250 bits, as used for Starknet selectors */
export function starknetKeccak(data: string | Buffer): string {
  const bytes = typeof data === 'string' ? Buffer.from(data, 'utf8') : data
  const hash = BigInt(utils.keccak256(bytes))
  return `0x${(hash & MASK_250).toString(16)}`
}

/** Selector of an external function or event, from its (unqualified) name */
export function starknetSelector(name: string): string {
  return starknetKeccak(name)
}
