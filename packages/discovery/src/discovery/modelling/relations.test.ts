import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ContractPermission } from '../config/PermissionConfig'
import type { StructureEntry } from '../output/types'
import { buildPermissionsModel } from './relations'

describe(buildPermissionsModel.name, () => {
  const self = ChainSpecificAddress(
    'eth:0x0000000000000000000000000000000000000001',
  )
  const target = ChainSpecificAddress(
    'eth:0x0000000000000000000000000000000000000002',
  )
  const entry: StructureEntry = {
    type: 'Contract',
    address: self,
    name: 'ConfiguredContract',
    values: { target },
  }
  const addressToNameMap = {
    [self.toLowerCase()]: 'configuredContract',
    [target.toLowerCase()]: 'target',
  }

  it('handles entries without a permission template', () => {
    expect(() =>
      buildPermissionsModel({} as ContractPermission, entry, addressToNameMap),
    ).not.toThrow()
  })

  it('models a thresholded interact group without turning it into act', () => {
    const otherTarget = ChainSpecificAddress(
      'eth:0x0000000000000000000000000000000000000003',
    )
    const admin = ChainSpecificAddress(
      'eth:0x0000000000000000000000000000000000000004',
    )
    const permission: ContractPermission = {
      fields: {
        target: {
          permissions: [
            {
              id: 'submit',
              type: 'interact',
              delay: 0,
              description: 'submit authorized reports.',
              group: {
                name: 'Relayers',
                memberName: 'Relayer',
                threshold: '{{ quorum }}',
                admin: '{{ owner }}',
              },
            },
          ],
        },
      },
    }

    const result = buildPermissionsModel(
      permission,
      {
        ...entry,
        values: {
          target: [target, otherTarget],
          quorum: 1,
          owner: admin,
        },
      },
      {
        ...addressToNameMap,
        [otherTarget.toLowerCase()]: 'otherTarget',
        [admin.toLowerCase()]: 'admin',
      },
    )
    assert(result !== undefined)

    expect(result).toInclude(
      'permissionGroup(\n  configuredContract,\n  target,\n  "submit",\n  "Relayers",\n  "Relayer",\n  1,\n  admin,\n  "interact",',
    )
    expect(result).toInclude(
      'permissionGroup(\n  configuredContract,\n  otherTarget,\n  "submit",\n  "Relayers",\n  "Relayer",\n  1,\n  admin,\n  "interact",',
    )
    expect(result).not.toInclude('"act"')
    expect(result).toInclude('submit authorized reports.')
  })

  it('rejects permission groups that use act semantics', () => {
    const permission: ContractPermission = {
      fields: {
        target: {
          permissions: [
            {
              id: 'members',
              type: 'act',
              delay: 0,
              group: {
                name: 'Members',
                memberName: 'Member',
                threshold: 1,
              },
            },
          ],
        },
      },
    }

    expect(() =>
      buildPermissionsModel(permission, entry, addressToNameMap),
    ).toThrow(
      'Permission group "Members" on ConfiguredContract must use an interact permission',
    )
  })

  it('rejects incomplete permission-group membership', () => {
    const undiscovered = ChainSpecificAddress(
      'eth:0x0000000000000000000000000000000000000003',
    )
    const permission: ContractPermission = {
      fields: {
        target: {
          permissions: [
            {
              id: 'members',
              type: 'interact',
              delay: 0,
              group: {
                name: 'Members',
                memberName: 'Member',
                threshold: 1,
              },
            },
          ],
        },
      },
    }

    expect(() =>
      buildPermissionsModel(
        permission,
        { ...entry, values: { target: [target, undiscovered] } },
        addressToNameMap,
      ),
    ).toThrow(
      `Permission group "Members" on ConfiguredContract contains undiscovered member ${undiscovered}`,
    )
  })
})
