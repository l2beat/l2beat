import { providers } from 'ethers'

import { getRoleAdmin, getRoleMembers } from '../../../common/accessControl'
import {
  getEip1967Admin,
  getEip1967Implementation,
} from '../../../common/eip1967'
import { SynapseBridge__factory } from '../../../typechain/factories/synapse'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

const DEPLOYED_AT = 13033669

export async function getSynapseBridge(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const synapseBridge = SynapseBridge__factory.connect(
    addresses.synapseBridge,
    provider,
  )

  const ADMIN_ROLE = await synapseBridge.DEFAULT_ADMIN_ROLE()
  const GOVERNANCE_ROLE = await synapseBridge.GOVERNANCE_ROLE()
  const NODEGROUP_ROLE = await synapseBridge.NODEGROUP_ROLE()

  const admins = await getRoleMembers(
    provider,
    addresses.synapseBridge,
    DEPLOYED_AT,
    ADMIN_ROLE,
  )

  const governors = await getRoleMembers(
    provider,
    addresses.synapseBridge,
    DEPLOYED_AT,
    GOVERNANCE_ROLE,
  )

  const nodes = await getRoleMembers(
    provider,
    addresses.synapseBridge,
    DEPLOYED_AT,
    NODEGROUP_ROLE,
  )

  const adminRoleAdmin = await getRoleAdmin(
    provider,
    addresses.synapseBridge,
    ADMIN_ROLE,
  )

  const governorRoleAdmin = await getRoleAdmin(
    provider,
    addresses.synapseBridge,
    GOVERNANCE_ROLE,
  )

  const nodeRoleAdmin = await getRoleAdmin(
    provider,
    addresses.synapseBridge,
    NODEGROUP_ROLE,
  )

  return {
    name: 'SynapseBridge',
    address: synapseBridge.address,
    upgradeability: {
      type: 'eip1967 proxy',
      admin: await getEip1967Admin(provider, synapseBridge),
      implementation: await getEip1967Implementation(provider, synapseBridge),
    },
    values: {
      ADMIN_ROLE,
      GOVERNANCE_ROLE,
      NODEGROUP_ROLE,
      admins,
      governors,
      nodes,
      adminRoleAdmin,
      governorRoleAdmin,
      nodeRoleAdmin,
    },
  }
}
