import { providers } from 'ethers'

import { AccessControl__factory } from '../typechain/factories/common/AccessControl__factory'
import { bytes32ToAddress } from './address'

// many deployments are using OpenZeppelin access control contracts
// this file includes methods for obtaining the data from them
// source code of the contract
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.7.3/contracts/access/IAccessControl.sol
export async function getRoleAdmin(
  provider: providers.JsonRpcProvider,
  address: string,
  role: string,
) {
  const accessControl = AccessControl__factory.connect(address, provider)

  return await accessControl.getRoleAdmin(role)
}

export async function getRoleMembers(
  provider: providers.JsonRpcProvider,
  address: string,
  fromBlock: number,
  role: string,
): Promise<string[]> {
  const accessControl = AccessControl__factory.connect(address, provider)

  const grantedFilter = accessControl.filters.RoleGranted(role)

  const logsGranted = await provider.getLogs({
    ...grantedFilter,
    fromBlock,
  })

  const granted = logsGranted
    .filter((log) => log.topics[1] === role)
    .map((log) => log.topics[2])

  const revokedFilter = accessControl.filters.RoleRevoked(role)

  const logsRevoked = await provider.getLogs({
    ...revokedFilter,
    fromBlock,
  })

  const revoked = logsRevoked
    .filter((log) => log.topics[1] === role)
    .map((log) => log.topics[2])

  const members = getMembers(granted, revoked)

  return members.map(bytes32ToAddress)
}

const getMembers = (granted: string[], revoked: string[]) => {
  const members = granted.filter((log) => {
    if (revoked.includes(log)) {
      const index = revoked.indexOf(log)
      revoked.splice(index, 1)
      return false
    }
    return true
  })

  return members
}
