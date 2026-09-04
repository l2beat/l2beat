import { Address32 } from '@l2beat/shared-pure'

interface Endpoint {
  chain: string
  address: string
}

/** Deployed tokens and relations meet on `chain|address`, address lowercased. */
export function deploymentKey(token: Endpoint): string {
  return `${token.chain}|${token.address.toLowerCase()}`
}

/** Transfers carry Address32 token addresses, so they key differently. */
export function transferTokenKey(side: Endpoint): string {
  return `${side.chain}|${side.address}`
}

/** A deployment keyed the way transfers are; undefined for a non-EVM address. */
export function deploymentTransferKey(
  deployment: Endpoint,
): string | undefined {
  const address = Address32.fromOrUndefined(deployment.address)
  return address ? `${deployment.chain}|${address}` : undefined
}
