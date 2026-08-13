// Reconstructs StarkWare-style role assignments by replaying
// RoleGranted/RoleRevoked events. State of the roles component is not
// readable through view functions, so event replay is the only way.
// Ported from packages/l2b/src/implementations/starknet-access-control.

import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { StarknetDiscoveryProvider } from './StarknetDiscoveryProvider'
import type { SierraAbi } from './sierraAbi'
import { starknetKeccak } from './starknetKeccak'

// Values are sn_keccak of the role name, as defined in starkware_utils
const ROLE_ID_TO_NAME: Record<string, string> = normalizeKeys({
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
})

const ROLE_GRANTED = starknetKeccak('RoleGranted')
const ROLE_REVOKED = starknetKeccak('RoleRevoked')

export function hasRolesEvents(abi: SierraAbi): boolean {
  return abi.events.some(
    (e) =>
      e.kind === 'struct' &&
      (e.name.endsWith('::RoleGranted') || e.name === 'RoleGranted'),
  )
}

/** @returns role name -> current holders, in grant order */
export async function getStarknetRoles(
  provider: StarknetDiscoveryProvider,
  address: string,
  fromBlock: number,
): Promise<Record<string, string[]>> {
  const events = await provider.getEvents(address, fromBlock, [
    ROLE_GRANTED,
    ROLE_REVOKED,
  ])

  const holders: Record<string, string[]> = {}
  for (const event of events) {
    const selector = event.keys[0]
    if (selector === undefined || event.data.length < 2) {
      continue
    }
    // RoleGranted / RoleRevoked = { role: felt252, account, sender }
    const role = roleName(event.data[0] ?? '0x0')
    const account = ChainSpecificAddress.from(
      'strk',
      event.data[1] ?? '0x0',
    ).toString()

    if (matchesSelector(selector, ROLE_GRANTED)) {
      holders[role] ??= []
      if (!holders[role].includes(account)) {
        holders[role].push(account)
      }
    } else if (matchesSelector(selector, ROLE_REVOKED)) {
      const members = holders[role]
      if (members) {
        const index = members.indexOf(account)
        if (index !== -1) {
          members.splice(index, 1)
        }
        if (members.length === 0) {
          delete holders[role]
        }
      }
    }
  }

  return holders
}

function roleName(roleId: string): string {
  return ROLE_ID_TO_NAME[normalizeFelt(roleId)] ?? normalizeFelt(roleId)
}

function matchesSelector(a: string, b: string): boolean {
  return normalizeFelt(a) === normalizeFelt(b)
}

function normalizeFelt(felt: string): string {
  return `0x${BigInt(felt).toString(16)}`
}

function normalizeKeys(record: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [normalizeFelt(key), value]),
  )
}
