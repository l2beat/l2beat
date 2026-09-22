import { expect } from 'earl'
import { attributeV1Field, describeAttribution } from './attribution'
import type { EffectiveConfig } from './loadProject'

/**
 * A hand-built effective config in the shape V1's `StructureContract`
 * produces, with one field per origin, so every attribution branch is hit
 * once and the rule for each is visible next to its input: `$` or a detector
 * name is proxy, no config is a getter, `copy` and `pickRoleMembers` and a
 * formatted `call` are projections, any other handler is a handler.
 */
describe(attributeV1Field.name, () => {
  const config: Pick<EffectiveConfig, 'fields'> = {
    fields: {
      sequencers: {
        handler: {
          type: 'event',
          select: 'account',
          add: { event: 'UpdateSequencer' },
        },
      },
      accessControl: { handler: { type: 'accessControl' } },
      Proposer: {
        handler: { type: 'accessControl', pickRoleMembers: 'PROPOSER_ROLE' },
      },
      getMinDelayFormatted: {
        handler: { type: 'call', method: 'getMinDelay', args: [] },
        edit: ['format', 'FormatSeconds'],
      },
      registryOwner: {
        handler: {
          type: 'call',
          method: 'owner',
          args: [],
          address: '{{ registry }}',
        },
      },
      scNoDelay: {
        copy: 'accessControl',
        edit: ['get', 'roles', 'X', 'members'],
      },
      counterpart: { edit: ['format', 'ScrollAddress'] },
      latestVerifier: {
        handler: { type: 'array', indices: '{{ verifierVersions }}' },
        edit: ['map', ['shape', 'a', 'b']],
      },
    } as EffectiveConfig['fields'],
  }
  const proxyNames = new Set(['$implementation', 'GnosisSafe_modules'])

  it('attributes each field to its origin', () => {
    expect(attributeV1Field('$admin', config, proxyNames)).toEqual({
      kind: 'proxy',
    })
    expect(attributeV1Field('GnosisSafe_modules', config, proxyNames)).toEqual({
      kind: 'proxy',
    })
    expect(attributeV1Field('owner', config)).toEqual({ kind: 'getter' })
    expect(attributeV1Field('counterpart', config)).toEqual({
      kind: 'getter',
      edited: true,
    })
    expect(attributeV1Field('sequencers', config)).toEqual({
      kind: 'handler',
      handlerType: 'event',
    })
    expect(attributeV1Field('accessControl', config)).toEqual({
      kind: 'handler',
      handlerType: 'accessControl',
    })
    expect(attributeV1Field('registryOwner', config)).toEqual({
      kind: 'handler',
      handlerType: 'call',
    })
    // An edited array handler still fetches: the edit reshapes, it does not derive from another field.
    expect(attributeV1Field('latestVerifier', config)).toEqual({
      kind: 'handler',
      handlerType: 'array',
    })
    expect(attributeV1Field('Proposer', config)).toEqual({
      kind: 'template-projection',
      via: 'pickRoleMembers',
      handlerType: 'accessControl',
    })
    expect(attributeV1Field('getMinDelayFormatted', config)).toEqual({
      kind: 'template-projection',
      via: 'edit',
      handlerType: 'call',
    })
    expect(attributeV1Field('scNoDelay', config)).toEqual({
      kind: 'template-projection',
      via: 'copy',
    })
  })

  it('describes attributions for tables', () => {
    expect(describeAttribution({ kind: 'proxy' })).toEqual('proxy')
    expect(describeAttribution({ kind: 'getter', edited: true })).toEqual(
      'getter (edited)',
    )
    expect(
      describeAttribution({ kind: 'handler', handlerType: 'event' }),
    ).toEqual('handler (event)')
    expect(
      describeAttribution({
        kind: 'template-projection',
        via: 'pickRoleMembers',
        handlerType: 'accessControl',
      }),
    ).toEqual('template-projection (pickRoleMembers on accessControl)')
    expect(
      describeAttribution({ kind: 'template-projection', via: 'copy' }),
    ).toEqual('template-projection (copy)')
  })
})
