import { StarknetABIInterface } from './StarknetABIInterface'
import type { StarknetClient, StarknetEvent } from './StarknetClient'

export interface AccessControlState {
  l1BridgeAddress: string | undefined
  l2TokenGovernance: string | undefined
  implementationAddress: string | undefined
  withdrawalLimited: Record<string, boolean>
  predefinedRoles: Record<string, string[]>
  genericRoles: Record<string, string[]>
  roleAdmin: Record<string, string>
}

export async function getAccessControlState(
  address: string,
  client: StarknetClient,
): Promise<AccessControlState> {
  // biome-ignore format: off
  const abi = [
      { name: 'L1BridgeSet',              output: ['l1_bridge_address'] },
      { name: 'L2TokenGovernanceChanged', output: ['previous_governance', 'new_governance'], },
      { name: 'WithdrawalLimitEnabled',   output: ['sender', 'l1_token'] },
      { name: 'WithdrawalLimitDisabled',  output: ['sender', 'l1_token'] },
      { name: 'ImplementationAdded',      output: ['implementation_data'] },
      { name: 'ImplementationRemoved',    output: ['implementation_data'] },
      { name: 'ImplementationReplaced',   output: ['implementation_data'] },
      { name: 'ImplementationFinalized',  output: ['impl_hash'] },
      { name: 'RoleGranted',              output: ['role', 'account', 'sender'] },
      { name: 'RoleRevoked',              output: ['role', 'account', 'sender'] },
      { name: 'RoleAdminChanged',         output: ['role', 'previous_admin_role', 'new_admin_role'], },
      { name: 'AppGovernorAdded',         output: ['added_account', 'added_by'] },
      { name: 'AppGovernorRemoved',       output: ['removed_account', 'removed_by'] },
      { name: 'AppRoleAdminAdded',        output: ['added_account', 'added_by'] },
      { name: 'AppRoleAdminRemoved',      output: ['removed_account', 'removed_by'], },
      { name: 'GovernanceAdminAdded',     output: ['added_account', 'added_by'] },
      { name: 'GovernanceAdminRemoved',   output: ['removed_account', 'removed_by'], },
      { name: 'OperatorAdded',            output: ['added_account', 'added_by'] },
      { name: 'OperatorRemoved',          output: ['removed_account', 'removed_by'] },
      { name: 'TokenAdminAdded',          output: ['added_account', 'added_by'] },
      { name: 'TokenAdminRemoved',        output: ['removed_account', 'removed_by'] },
      { name: 'UpgradeGovernorAdded',     output: ['added_account', 'added_by'] },
      { name: 'UpgradeGovernorRemoved',   output: ['removed_account', 'removed_by'], },
      { name: 'SecurityAdminAdded',       output: ['added_account', 'added_by'] },
      { name: 'SecurityAdminRemoved',     output: ['removed_account', 'removed_by'], },
      { name: 'SecurityAgentAdded',       output: ['added_account', 'added_by'] },
      { name: 'SecurityAgentRemoved',     output: ['removed_account', 'removed_by'], },
    ]
  // biome-ignore format: on

  const eventNames = abi.map((a) => a.name)
  const abiInterface = new StarknetABIInterface(abi)

  const highestBlock = await client.getBlockNumber()
  const events = await client.getLogs(0, highestBlock, address, eventNames)

  return resolveAccessControlState(abiInterface, events)
}

function resolveAccessControlState(
  abi: StarknetABIInterface,
  events: StarknetEvent[],
): AccessControlState {
  const roleIdToName: Record<string, string> = {
    '0xd2ead78c620e94b02d0a996e99298c59ddccfa1d8a0149080ac3a20de06068':
      'APP_GOVERNOR',
    '0x3e615638e0b79444a70f8c695bf8f2a47033bf1cf95691ec3130f64939cee99':
      'APP_ROLE_ADMIN',
    '0x3711c9d994faf6055172091cb841fd4831aa743e6f3315163b06a122c841846':
      'GOVERNANCE_ADMIN',
    '0x023edb77f7c8cc9e38e8afe78954f703aeeda7fffe014eeb6e56ea84e62f6da7':
      'OPERATOR',
    '0x0128d63adbf6b09002c26caf55c47e2f26635807e3ef1b027218aa74c8d61a3e':
      'TOKEN_ADMIN',
    '0x251e864ca2a080f55bce5da2452e8cfcafdbc951a3e7fff5023d558452ec228':
      'UPGRADE_GOVERNOR',
    '0x26bd110619d11cfdfc28e281df893bc24828e89177318e9dbd860cdaedeb6b3':
      'SECURITY_ADMIN',
    '0x37693ba312785932d430dccf0f56ffedd0aa7c0f8b6da2cc4530c2717689b96':
      'SECURITY_AGENT',
  }

  const state: AccessControlState = {
    l1BridgeAddress: undefined,
    l2TokenGovernance: undefined,
    implementationAddress: undefined,
    withdrawalLimited: {},
    predefinedRoles: {},
    genericRoles: {},
    roleAdmin: {},
  }

  const addRoleMember = (
    container: Record<string, string[]>,
    role: string,
    account: string,
  ) => {
    container[role] ??= []
    container[role].push(account)
  }

  const removeRoleMember = (
    container: Record<string, string[]>,
    role: string,
    account: string,
  ) => {
    const index = container[role].indexOf(account)
    if (index === -1) return

    container[role].splice(index, 1)
    if (container[role].length === 0) {
      delete container[role]
    }
  }

  for (const event of events) {
    const entry = abi.decode(event)
    switch (entry.name) {
      case 'L1BridgeSet': {
        state.l1BridgeAddress = entry.values['l1_bridge_address']
        break
      }
      case 'L2TokenGovernanceChanged': {
        state.l2TokenGovernance = entry.values['new_governance']
        break
      }
      case 'WithdrawalLimitEnabled': {
        state.withdrawalLimited[entry.values['l1_token']] = true
        break
      }
      case 'WithdrawalLimitDisabled': {
        delete state.withdrawalLimited[entry.values['l1_token']]
        break
      }
      case 'ImplementationAdded': {
        // NOTE(radomski): This is for staging upgrades, we only care about the
        // ones that are finalized
        break
      }
      case 'ImplementationRemoved': {
        // NOTE(radomski): This is for staging upgrades, we only care about the
        // ones that are finalized
        break
      }
      case 'ImplementationReplaced': {
        state.implementationAddress = entry.values['implementation_data']
        break
      }
      case 'ImplementationFinalized': {
        // NOTE(radomski): This is for staging upgrades, we only care about the
        // ones that are finalized
        break
      }
      case 'RoleGranted': {
        const key = roleIdToName[entry.values['role']] ?? entry.values['role']
        addRoleMember(state.genericRoles, key, entry.values['account'])
        break
      }
      case 'RoleRevoked': {
        const key = roleIdToName[entry.values['role']] ?? entry.values['role']
        removeRoleMember(state.genericRoles, key, entry.values['account'])
        break
      }
      case 'RoleAdminChanged': {
        const key = roleIdToName[entry.values['role']] ?? entry.values['role']
        state.roleAdmin[key] = entry.values['new_admin_role']
        break
      }
      case 'AppGovernorAdded': {
        const key = 'APP_GOVERNOR'
        addRoleMember(state.predefinedRoles, key, entry.values['added_account'])
        break
      }
      case 'AppGovernorRemoved': {
        const key = 'APP_GOVERNOR'
        const account = entry.values['removed_account']
        removeRoleMember(state.predefinedRoles, key, account)
        break
      }
      case 'AppRoleAdminAdded': {
        const key = 'APP_ROLE_ADMIN'
        addRoleMember(state.predefinedRoles, key, entry.values['added_account'])
        break
      }
      case 'AppRoleAdminRemoved': {
        const key = 'APP_ROLE_ADMIN'
        const account = entry.values['removed_account']
        removeRoleMember(state.predefinedRoles, key, account)
        break
      }
      case 'GovernanceAdminAdded': {
        const key = 'GOVERNANCE_ADMIN'
        addRoleMember(state.predefinedRoles, key, entry.values['added_account'])
        break
      }
      case 'GovernanceAdminRemoved': {
        const key = 'GOVERNANCE_ADMIN'
        const account = entry.values['removed_account']
        removeRoleMember(state.predefinedRoles, key, account)
        break
      }
      case 'OperatorAdded': {
        const key = 'OPERATOR'
        addRoleMember(state.predefinedRoles, key, entry.values['added_account'])
        break
      }
      case 'OperatorRemoved': {
        const key = 'OPERATOR'
        const account = entry.values['removed_account']
        removeRoleMember(state.predefinedRoles, key, account)
        break
      }
      case 'TokenAdminAdded': {
        const key = 'TOKEN_ADMIN'
        addRoleMember(state.predefinedRoles, key, entry.values['added_account'])
        break
      }
      case 'TokenAdminRemoved': {
        const key = 'TOKEN_ADMIN'
        const account = entry.values['removed_account']
        removeRoleMember(state.predefinedRoles, key, account)
        break
      }
      case 'UpgradeGovernorAdded': {
        const key = 'UPGRADE_GOVERNOR'
        addRoleMember(state.predefinedRoles, key, entry.values['added_account'])
        break
      }
      case 'UpgradeGovernorRemoved': {
        const key = 'UPGRADE_GOVERNOR'
        const account = entry.values['removed_account']
        removeRoleMember(state.predefinedRoles, key, account)
        break
      }
      case 'SecurityAdminAdded': {
        const key = 'SECURITY_ADMIN'
        addRoleMember(state.predefinedRoles, key, entry.values['added_account'])
        break
      }
      case 'SecurityAdminRemoved': {
        const key = 'SECURITY_ADMIN'
        const account = entry.values['removed_account']
        removeRoleMember(state.predefinedRoles, key, account)
        break
      }
      case 'SecurityAgentAdded': {
        const key = 'SECURITY_AGENT'
        addRoleMember(state.predefinedRoles, key, entry.values['added_account'])
        break
      }
      case 'SecurityAgentRemoved': {
        const key = 'SECURITY_AGENT'
        const account = entry.values['removed_account']
        removeRoleMember(state.predefinedRoles, key, account)
        break
      }
    }
  }

  return state
}
