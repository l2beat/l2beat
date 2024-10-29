import { getChainShortName } from '@l2beat/discovery'

export function toAddress(chain: string, address: string) {
  return `${getChainShortName(chain)}:${address}`
}
