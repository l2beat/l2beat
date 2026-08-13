import { expect, mockObject } from 'earl'
import type { StarknetDiscoveryProvider } from './StarknetDiscoveryProvider'
import { starknetKeccak } from './starknetKeccak'
import { getStarknetRoles } from './starknetRoles'

const UPGRADE_GOVERNOR_ROLE =
  '0x251e864ca2a080f55bce5da2452e8cfcafdbc951a3e7fff5023d558452ec228'
const CUSTOM_ROLE = '0xdead'
const ALICE = '0xa11ce'
const BOB = '0xb0b'

function event(
  name: 'RoleGranted' | 'RoleRevoked',
  role: string,
  account: string,
) {
  return {
    block_number: 1,
    transaction_hash: '0x1',
    event_index: 0,
    keys: [starknetKeccak(name)],
    data: [role, account, account],
  }
}

function providerWithEvents(events: ReturnType<typeof event>[]) {
  return mockObject<StarknetDiscoveryProvider>({
    getEvents: async () => events,
  })
}

describe(getStarknetRoles.name, () => {
  it('replays grants and revocations', async () => {
    const provider = providerWithEvents([
      event('RoleGranted', UPGRADE_GOVERNOR_ROLE, ALICE),
      event('RoleGranted', UPGRADE_GOVERNOR_ROLE, BOB),
      event('RoleRevoked', UPGRADE_GOVERNOR_ROLE, ALICE),
    ])
    const roles = await getStarknetRoles(provider, '0x123', 0)
    expect(roles).toEqual({
      UPGRADE_GOVERNOR: [`strk:0x${'b0b'.padStart(64, '0')}`],
    })
  })

  it('drops roles whose last holder was revoked', async () => {
    const provider = providerWithEvents([
      event('RoleGranted', UPGRADE_GOVERNOR_ROLE, ALICE),
      event('RoleRevoked', UPGRADE_GOVERNOR_ROLE, ALICE),
    ])
    expect(await getStarknetRoles(provider, '0x123', 0)).toEqual({})
  })

  it('keeps unknown role ids as normalized hex', async () => {
    const provider = providerWithEvents([
      event('RoleGranted', CUSTOM_ROLE, ALICE),
    ])
    const roles = await getStarknetRoles(provider, '0x123', 0)
    expect(Object.keys(roles)).toEqual(['0xdead'])
  })

  it('deduplicates repeated grants', async () => {
    const provider = providerWithEvents([
      event('RoleGranted', UPGRADE_GOVERNOR_ROLE, ALICE),
      event('RoleGranted', UPGRADE_GOVERNOR_ROLE, ALICE),
    ])
    const roles = await getStarknetRoles(provider, '0x123', 0)
    expect(roles.UPGRADE_GOVERNOR?.length).toEqual(1)
  })
})
