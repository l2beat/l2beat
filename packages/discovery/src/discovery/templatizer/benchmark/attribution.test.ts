import { expect } from 'earl'
import { attributeV1Field, describeAttribution } from './attribution'
import type { EffectiveConfig } from './types'

/**
 * A hand-built effective config in the shape V1's `StructureContract`
 * produces, with one field per origin, so every attribution branch is hit
 * once and the rule for each is visible next to its input: `$` or a detector
 * name is proxy, no config is a getter, a field the override defines is the
 * override's, `copy` and `pickRoleMembers` and a formatted `call` are
 * projections, any other handler is a handler, unreachable when its type is
 * not one the model is offered or the suite marks it.
 */
describe(attributeV1Field.name, () => {
  const config: Pick<EffectiveConfig, 'fields' | 'overrideFields'> = {
    overrideFields: ['fromConfig'],
    fields: {
      fromConfig: { handler: { type: 'hardcoded', value: 1 } },
      chainId: { handler: { type: 'hardcoded', value: 534352 } },
      gamesTotal: { handler: { type: 'eventCount', topics: [] } },
      slot7: { handler: { type: 'storage', slot: 7 } },
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
      votingDelay: {
        handler: {
          type: 'call',
          method: 'function votingDelay() view returns (uint256)',
          args: [],
        },
      },
      quorumVotes: { handler: { type: 'call', args: [] } },
      owners: { handler: { type: 'call', method: 'owner', args: [] } },
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
    expect(attributeV1Field('fromConfig', config)).toEqual({
      kind: 'override',
    })
    // A template's `call` of a 0-argument function under its own name reads what the getter does.
    expect(attributeV1Field('votingDelay', config)).toEqual({ kind: 'getter' })
    expect(attributeV1Field('quorumVotes', config)).toEqual({ kind: 'getter' })
    expect(attributeV1Field('owners', config)).toEqual({
      kind: 'handler',
      handlerType: 'call',
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
      unreachable: 'reads another contract',
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

  it('marks handler fields the model could not have written, by type or by the suite', () => {
    expect(attributeV1Field('chainId', config)).toEqual({
      kind: 'handler',
      handlerType: 'hardcoded',
      unreachable: 'hardcoded handler',
    })
    expect(attributeV1Field('gamesTotal', config)).toEqual({
      kind: 'handler',
      handlerType: 'eventCount',
      unreachable: 'eventCount handler',
    })
    expect(attributeV1Field('slot7', config)).toEqual({
      kind: 'handler',
      handlerType: 'storage',
    })
    expect(
      attributeV1Field('slot7', config, undefined, {
        slot7: 'the slot is not derivable from the source',
      }),
    ).toEqual({
      kind: 'handler',
      handlerType: 'storage',
      unreachable: 'the slot is not derivable from the source',
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
        kind: 'handler',
        handlerType: 'eventCount',
        unreachable: 'eventCount handler',
      }),
    ).toEqual('handler (eventCount), unreachable: eventCount handler')
    expect(describeAttribution({ kind: 'override' })).toEqual('override')
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
