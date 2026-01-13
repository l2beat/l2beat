import type { Branded } from '@l2beat/shared-pure'

export type DeployedTokenId = Branded<string, 'DeployedTokenId'>

export function DeployedTokenId(id: string) {
  return id as DeployedTokenId
}

DeployedTokenId.from = function from(chain: string, address: string) {
  // Addresses of DeployedTokens in TokenDB are always lowercase
  return `${chain}+${address.toLowerCase()}` as DeployedTokenId
}

DeployedTokenId.chain = function chain(id: DeployedTokenId) {
  return id.slice(0, id.indexOf('+'))
}

DeployedTokenId.address = function address(id: DeployedTokenId) {
  return id.slice(id.indexOf('+') + 1)
}
