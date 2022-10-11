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

  return {
    name: 'SynapseBridge',
    address: synapseBridge.address,
    upgradeability: {
      type: 'eip1967 proxy',
      adminSlot: await getEip1967Admin(provider, synapseBridge),
      implementationSlot: await getEip1967Implementation(
        provider,
        synapseBridge,
      ),
    },
    values: {
      ADMIN_ROLE,
      admins: [await synapseBridge.getRoleMember(ADMIN_ROLE, 0)],
      adminsCount: (
        await synapseBridge.getRoleMemberCount(ADMIN_ROLE)
      ).toNumber(),
      GOVERNANCE_ROLE,
      governors: [await synapseBridge.getRoleMember(GOVERNANCE_ROLE, 0)],
      governorsCount: (
        await synapseBridge.getRoleMemberCount(GOVERNANCE_ROLE)
      ).toNumber(),
      NODEGROUP_ROLE,
      nodes: [await synapseBridge.getRoleMember(NODEGROUP_ROLE, 0)],
      nodesCount: (
        await synapseBridge.getRoleMemberCount(NODEGROUP_ROLE)
      ).toNumber(),
    },
  }
}
