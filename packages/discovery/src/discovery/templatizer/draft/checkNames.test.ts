import { expect } from 'earl'
import { checkNames, identifierWords, sharesWord } from './checkNames'
import type { DraftHandler } from './Draft'
import type { Finding } from './Finding'
import type { ValidationContext } from './ruleContext'
import {
  contextFor,
  draftOf,
  field,
  runRule,
  scrollChainDraft,
} from './test/drafts'

describe(checkNames.name, () => {
  const scroll = contextFor('ScrollChain')
  const factory = contextFor('DisputeGameFactory')
  const hardcoded: DraftHandler = { type: 'hardcoded', value: 1 }

  function names(
    fields: Record<string, DraftHandler>,
    ctx: ValidationContext = scroll,
  ): Finding[] {
    const draft = draftOf(
      Object.fromEntries(
        Object.entries(fields).map(([name, handler]) => [name, field(handler)]),
      ),
    )
    return runRule(checkNames, draft, ctx)
  }

  it('accepts the V1 names of the ScrollChain template without a warning', () => {
    expect(runRule(checkNames, scrollChainDraft(), scroll)).toEqual([])
  })

  it('rejects names V1 cannot hold', () => {
    expect(names({ $owner: hardcoded, 'my-field': hardcoded })).toEqual([
      {
        severity: 'error',
        path: 'fields.$owner',
        message:
          '"$owner" is not a field name V1 can hold: use a Solidity identifier (letters, digits and _, not starting with a digit); a leading $ is reserved for proxy values',
      },
      {
        severity: 'error',
        path: 'fields["my-field"]',
        message:
          '"my-field" is not a field name V1 can hold: use a Solidity identifier (letters, digits and _, not starting with a digit); a leading $ is reserved for proxy values',
      },
    ])
  })

  it('rejects a baseline getter name, which would replace the getter', () => {
    expect(names({ owner: hardcoded })).toEqual([
      {
        severity: 'error',
        path: 'fields.owner',
        message:
          '"owner" is a baseline getter (V1 reads it as "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"); V1 keeps the first field of a name and template fields come first, so this field would replace that value; pick another name and reference the getter as {{ owner }} if you need it',
      },
    ])
  })

  it('lets only an array over the probed function reuse a probe name', () => {
    const facts = scroll.facts
    const probed: ValidationContext = {
      ...scroll,
      facts: {
        ...facts,
        baseline: {
          fields: {
            ...facts.baseline.fields,
            committedBatches: { kind: 'probe', value: ['0x00'] },
          },
        },
      },
    }
    expect(
      names({ committedBatches: { type: 'array', length: 3 } }, probed),
    ).toEqual([])
    expect(
      names({ committedBatches: { type: 'call', args: [1] } }, probed),
    ).toEqual([
      {
        severity: 'error',
        path: 'fields.committedBatches',
        message:
          '"committedBatches" is V1\'s 5-index probe of committedBatches(uint256); only an `array` field reading committedBatches(uint256) may take this name (it replaces the probe with the whole array), so pick another name',
      },
    ])
  })

  it('rejects the name of a field kept from the existing template', () => {
    const locked = { ...scroll, lockedFieldNames: ['sequencers'] }
    expect(runRule(checkNames, scrollChainDraft(), locked)).toEqual([
      {
        severity: 'error',
        path: 'fields.sequencers',
        message:
          '"sequencers" is a field of the existing template, kept as it is; pick another name (reference it as {{ sequencers }} if you need its value)',
      },
    ])
  })

  it('enforces the fixed names, except for an accessControl field that picks one role', () => {
    expect(
      names({
        roles: { type: 'accessControl' },
        gameCreators: {
          type: 'accessControl',
          pickRoleMembers: 'GAME_CREATOR_ROLE',
        },
        args: { type: 'constructorArgs' },
      }).filter((finding) => finding.severity === 'error'),
    ).toEqual([
      {
        severity: 'error',
        path: 'fields.roles',
        message:
          'an accessControl field must be named "accessControl", the name V1\'s permission analysis reads; to list one role\'s members under another name, add "pickRoleMembers"',
      },
      {
        severity: 'error',
        path: 'fields.args',
        message:
          'a constructorArgs field must be named "constructorArgs"; V1\'s handler refuses any other name',
      },
    ])
  })

  it('only warns about a name that says nothing about what it reads', () => {
    expect(
      names({ lastCommittedBatchIndex: hardcoded, data1: hardcoded }),
    ).toEqual([
      {
        severity: 'warning',
        path: 'fields.lastCommittedBatchIndex',
        message:
          '"lastCommittedBatchIndex" shares no word with the function or events it reads, but appears in the source, so it is kept as a state variable name',
      },
      {
        severity: 'warning',
        path: 'fields.data1',
        message:
          '"data1" shares no word with the function or events it reads and does not appear in the source; name the field after the getter, state variable or event subject it comes from',
      },
    ])
    expect(
      names(
        {
          gameImpls: { type: 'array', length: 5 },
          game42: { type: 'call', method: 'gameImpls', args: [42] },
          versionFormatted: { type: 'call', method: 'version', args: [] },
        },
        factory,
      ),
    ).toEqual([])
  })
})

describe(sharesWord.name, () => {
  it('matches plurals and participles of words of four letters or more', () => {
    expect(identifierWords('revertedBatches')).toEqual(['reverted', 'batches'])
    expect(identifierWords('ZkRouteAdded')).toEqual(['zk', 'route', 'added'])
    expect(identifierWords('DEFAULT_ADMIN_ROLE')).toEqual([
      'default',
      'admin',
      'role',
    ])
    expect(identifierWords('initBondGame42')).toEqual([
      'init',
      'bond',
      'game',
      '42',
    ])
    expect(sharesWord('revertedBatches', 'RevertBatch')).toEqual(true)
    expect(sharesWord('zkVerifierRoutes', 'ZkRouteAdded')).toEqual(true)
    expect(sharesWord('sequencers', 'isSequencer')).toEqual(true)
    expect(sharesWord('isOwner', 'isPaused')).toEqual(false)
  })
})
