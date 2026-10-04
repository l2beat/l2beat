import { expect } from 'earl'
import { checkNames } from './checkNames'
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

  it('accepts the names of the ScrollChain template', () => {
    expect(runRule(checkNames, scrollChainDraft(), scroll)).toEqual([])
  })

  it('does not judge whether a name is meaningful', () => {
    expect(
      names({ data1: hardcoded, lastCommittedBatchIndex: hardcoded }),
    ).toEqual([])
  })

  it('rejects names V1 cannot hold', () => {
    expect(names({ $owner: hardcoded, 'my-field': hardcoded })).toEqual([
      {
        path: 'fields.$owner',
        message:
          '"$owner" is not a field name V1 can hold: use a Solidity identifier (letters, digits and _, not starting with a digit); a leading $ is reserved for proxy values',
      },
      {
        path: 'fields["my-field"]',
        message:
          '"my-field" is not a field name V1 can hold: use a Solidity identifier (letters, digits and _, not starting with a digit); a leading $ is reserved for proxy values',
      },
    ])
  })

  it('rejects the name of a baseline getter or of a project config field, which the field would replace', () => {
    const withOverride: ValidationContext = {
      ...scroll,
      facts: {
        ...scroll.facts,
        baseline: {
          fields: {
            ...scroll.facts.baseline.fields,
            fromConfig: { kind: 'override', value: 7 },
            broken: { kind: 'getter', error: 'Execution reverted' },
          },
        },
      },
    }
    expect(
      names(
        { owner: hardcoded, fromConfig: hardcoded, broken: hardcoded },
        withOverride,
      ),
    ).toEqual([
      {
        path: 'fields.owner',
        message:
          '"owner" is a baseline getter (V1 reads it as "eth:0x798576400F7D662961BA15C6b3F3d813447a26a6"); V1 keeps the first field of a name and template fields come first, so this field would replace that value; pick another name and reference it as {{ owner }} if you need it',
      },
      {
        path: 'fields.fromConfig',
        message:
          '"fromConfig" is a field of the project config (V1 reads it as 7); V1 keeps the first field of a name and template fields come first, so this field would replace that value; pick another name and reference it as {{ fromConfig }} if you need it',
      },
      {
        path: 'fields.broken',
        message:
          '"broken" is a baseline getter (V1 reads it, currently with an error: Execution reverted); V1 keeps the first field of a name and template fields come first, so this field would replace that value; pick another name and reference it as {{ broken }} if you need it',
      },
    ])
  })

  it('lets only an array over the probed function reuse a probe name', () => {
    const probed: ValidationContext = {
      ...scroll,
      facts: {
        ...scroll.facts,
        baseline: {
          fields: {
            ...scroll.facts.baseline.fields,
            committedBatches: { kind: 'probe', value: ['0x00'] },
          },
        },
      },
    }
    expect(
      names({ committedBatches: { type: 'array', length: 3 } }, probed),
    ).toEqual([])
    expect(
      names(
        {
          committedBatches: {
            type: 'array',
            method: 'committedBatches',
            length: 3,
          },
        },
        probed,
      ),
    ).toEqual([])
    expect(
      names(
        {
          committedBatches: {
            type: 'call',
            method: 'committedBatches',
            args: [1],
          },
        },
        probed,
      ),
    ).toEqual([
      {
        path: 'fields.committedBatches',
        message:
          '"committedBatches" is V1\'s 5-index probe of committedBatches(uint256); only an `array` field reading committedBatches(uint256) may take this name (it replaces the probe with the whole array), so pick another name',
      },
    ])
  })

  it('rejects the name of a field of the existing template', () => {
    const existing = { ...scroll, existingFieldNames: ['sequencers'] }
    expect(runRule(checkNames, scrollChainDraft(), existing)).toEqual([
      {
        path: 'fields.sequencers',
        message:
          '"sequencers" is a field of the existing template, kept as it is; pick another name (reference it as {{ sequencers }} if you need its value)',
      },
    ])
  })
})
