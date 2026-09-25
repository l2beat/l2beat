import { expect } from 'earl'
import { ContractPermission } from './PermissionConfig'
import { mergePermissionContract } from './permissionUtils'

describe(mergePermissionContract.name, () => {
  it('replaces a field permission list wholesale so an empty override clears it', () => {
    const base = ContractPermission.parse({
      fields: {
        guardian: { permissions: [{ type: 'interact' }] },
        owner: { permissions: [{ type: 'upgrade' }] },
      },
    })
    const override = ContractPermission.parse({
      fields: { guardian: { permissions: [] } },
    })

    const result = mergePermissionContract(base, override)

    expect(result.fields.guardian?.permissions).toEqual([])
    expect(result.fields.owner?.permissions).toEqual([
      { type: 'upgrade', delay: 0 },
    ])
  })

  it('replaces a longer base list with a shorter override list', () => {
    const base = ContractPermission.parse({
      fields: {
        admin: { permissions: [{ type: 'upgrade' }, { type: 'act' }] },
      },
    })
    const override = ContractPermission.parse({
      fields: { admin: { permissions: [{ type: 'interact' }] } },
    })

    const result = mergePermissionContract(base, override)

    expect(result.fields.admin?.permissions).toEqual([
      { type: 'interact', delay: 0 },
    ])
  })

  it('lets the override set canActIndependently and keeps base fields', () => {
    const base = ContractPermission.parse({
      canActIndependently: false,
      fields: { owner: { permissions: [{ type: 'act' }] } },
    })
    const override = ContractPermission.parse({ canActIndependently: true })

    const result = mergePermissionContract(base, override)

    expect(result.canActIndependently).toEqual(true)
    expect(result.fields.owner?.permissions).toEqual([
      { type: 'act', delay: 0 },
    ])
  })
})
