import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { StructureEntry } from '../output/types'
import { buildAddressToNameMap } from './buildAddressToNameMap'
import { buildPermissionsModel } from './relations'

const TIMELOCK = address('0x111')
const PROXY_ADMIN = address('0x222')

const OWN_MAP = buildAddressToNameMap([
  { type: 'Contract', address: TIMELOCK, name: 'ValidatorTimelock' },
])
const CLUSTER_MAP = buildAddressToNameMap([
  { type: 'Contract', address: TIMELOCK, name: 'ValidatorTimelock' },
  { type: 'Contract', address: PROXY_ADMIN, name: 'ProxyAdmin' },
])

// $admin points into a shared module whenever the proxy of a consumer project
// is administered by the module's ProxyAdmin. With a per project map the
// permission was dropped, which cut every chain crossing an entrypoint.
describe(buildPermissionsModel.name, () => {
  it('emits a permission whose target lives in a referenced project', () => {
    const model = buildPermissionsModel(
      { fields: {} },
      proxyAdministeredBy(PROXY_ADMIN),
      CLUSTER_MAP,
    )

    expect(model ?? '').toInclude('permission(')
    expect(model ?? '').toInclude(modelId(PROXY_ADMIN))
    expect(model ?? '').toInclude('"upgrade"')
  })

  it('skips a target that no discovery of the cluster knows', () => {
    const model = buildPermissionsModel(
      { fields: {} },
      proxyAdministeredBy(PROXY_ADMIN),
      OWN_MAP,
    )

    expect(model ?? '').not.toInclude('permission(')
  })

  it('emits nothing for a Reference stub', () => {
    const model = buildPermissionsModel(
      { fields: {} },
      { type: 'Reference', address: PROXY_ADMIN, targetProject: 'shared' },
      CLUSTER_MAP,
    )

    expect(model).toEqual(undefined)
  })
})

function proxyAdministeredBy(admin: ChainSpecificAddress): StructureEntry {
  return {
    type: 'Contract',
    address: TIMELOCK,
    name: 'ValidatorTimelock',
    values: { $admin: admin.toString() },
  }
}

function address(hex: string): ChainSpecificAddress {
  return ChainSpecificAddress.from('eth', EthereumAddress.from(hex))
}

function modelId(address: ChainSpecificAddress): string {
  return address.toLowerCase().replaceAll(':', '_')
}
