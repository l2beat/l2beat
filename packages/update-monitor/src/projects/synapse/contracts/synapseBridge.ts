import { providers } from 'ethers'

import {
  getEip1967Admin,
  getEip1967Implementation,
} from '../../../common/eip1967'
import { SynapseBridge__factory } from '../../../typechain/factories/synapse'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

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

  const admins = [await synapseBridge.getRoleMember(ADMIN_ROLE, 0)]
  const adminsCount = (
    await synapseBridge.getRoleMemberCount(ADMIN_ROLE)
  ).toNumber()

  const governors = [await synapseBridge.getRoleMember(GOVERNANCE_ROLE, 0)]
  const governorsCount = (
    await synapseBridge.getRoleMemberCount(GOVERNANCE_ROLE)
  ).toNumber()

  const nodes = [await synapseBridge.getRoleMember(NODEGROUP_ROLE, 0)]
  const nodesCount = (
    await synapseBridge.getRoleMemberCount(NODEGROUP_ROLE)
  ).toNumber()

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
      admins,
      adminsCount,
      GOVERNANCE_ROLE,
      governors,
      governorsCount,
      NODEGROUP_ROLE,
      nodes,
      nodesCount,
    },
  }
}
