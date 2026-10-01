import { parseJsonc } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { StructureContract } from '../../config/StructureConfig'
import type { Draft, DraftField } from '../draft/Draft'
import {
  renderTemplateFile,
  schemaPathFor,
  type TemplateFileField,
  type TemplateFileInput,
} from './templateFile'

const HEADER =
  'Authored by gpt-5.6-sol via l2b discover --ai on 2026-09-29, 2 round(s). Review before committing.'

const SEQUENCERS: DraftField = {
  handler: {
    type: 'event',
    select: 'account',
    add: { event: 'UpdateSequencer', where: ['=', '#status', true] },
    remove: { event: 'UpdateSequencer', where: ['!=', '#status', true] },
  },
  covers: ['isSequencer(address)', 'UpdateSequencer'],
  reason:
    'isSequencer is written only by addSequencer/removeSequencer (onlyOwner), which emit UpdateSequencer',
}

const MAX_DELAY: DraftField = {
  handler: { type: 'call', method: 'maxDelay', args: [] },
  edit: ['format', 'FormatSeconds'],
  covers: [],
  reason: 'maxDelay is set in the constructor',
}

function fieldsOf(draft: Draft): TemplateFileField[] {
  return Object.entries(draft.fields).map(([name, field]) => ({
    name,
    ...field,
  }))
}

function minimal(fields: TemplateFileField[]): TemplateFileInput {
  return { schema: 'schema.json', header: 'h', ignoreMethods: [], fields }
}

describe(schemaPathFor.name, () => {
  it('climbs one directory per segment of the template id', () => {
    expect(schemaPathFor('scroll/ScrollChain')).toEqual(
      '../../../../../../discovery/schemas/contract.v2.schema.json',
    )
    expect(schemaPathFor('GnosisSafe')).toEqual(
      '../../../../../discovery/schemas/contract.v2.schema.json',
    )
  })
})

describe(renderTemplateFile.name, () => {
  it('writes the header, verbatim entries and commented fields in order', () => {
    const text = renderTemplateFile({
      schema: schemaPathFor('scroll/ScrollChain'),
      header: HEADER,
      displayName: 'Scroll Chain',
      ignoreMethods: ['committedBatches', 'finalizedStateRoots'],
      preserved: [
        {
          key: 'ignoreRelatives',
          text: '"ignoreRelatives": ["messageQueueV1"] // deprecated',
        },
      ],
      lockedFields: [
        {
          name: 'paused',
          text: '// kept\n    "paused": {\n      "severity": "MEDIUM"\n    }',
        },
      ],
      fields: fieldsOf({
        fields: { sequencers: SEQUENCERS, maxDelay: MAX_DELAY },
        skips: [],
      }),
    })

    expect(text).toEqual(`{
  "$schema": "../../../../../../discovery/schemas/contract.v2.schema.json",
  // ${HEADER}

  "displayName": "Scroll Chain",
  "ignoreMethods": ["committedBatches", "finalizedStateRoots"],
  "ignoreRelatives": ["messageQueueV1"], // deprecated
  "fields": {
    // kept
    "paused": {
      "severity": "MEDIUM"
    },
    // ${SEQUENCERS.reason}
    // covers: isSequencer(address), UpdateSequencer
    "sequencers": {
      "handler": {
        "type": "event",
        "select": "account",
        "add": { "event": "UpdateSequencer", "where": ["=", "#status", true] },
        "remove": {
          "event": "UpdateSequencer",
          "where": ["!=", "#status", true]
        }
      }
    },
    // maxDelay is set in the constructor
    "maxDelay": {
      "handler": {
        "type": "call",
        "method": "maxDelay",
        "args": []
      },
      "edit": ["format", "FormatSeconds"]
    }
  }
}
`)
  })

  it('packs a long array of numbers as many per line as fit', () => {
    const text = renderTemplateFile(
      minimal([
        {
          name: 'selected',
          reason: '',
          covers: [],
          handler: {
            type: 'array',
            method: 'function verifiers(bytes4) view returns (address)',
            indices: Array.from({ length: 30 }, (_, i) => i * 1000),
          },
        },
      ]),
    )

    expect(text).toEqual(`{
  "$schema": "schema.json",
  // h

  "fields": {
    "selected": {
      "handler": {
        "type": "array",
        "method": "function verifiers(bytes4) view returns (address)",
        "indices": [
          0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000,
          12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000,
          22000, 23000, 24000, 25000, 26000, 27000, 28000, 29000
        ]
      }
    }
  }
}
`)
  })

  it('leaves out what is empty', () => {
    expect(renderTemplateFile(minimal([]))).toEqual(
      '{\n  "$schema": "schema.json"\n  // h\n}\n',
    )
  })

  it('keeps reasons and covers on one comment line each', () => {
    const text = renderTemplateFile(
      minimal([
        {
          ...MAX_DELAY,
          name: 'maxDelay',
          reason: 'set once,\n  never */ changed\r\n',
          covers: ['maxDelay()\n'],
        },
      ]),
    )

    expect(text).toInclude(
      '    // set once, never */ changed\n    // covers: maxDelay()\n    "maxDelay": {',
    )
  })

  it('writes the dry run note under the covers', () => {
    const text = renderTemplateFile(
      minimal([
        {
          ...SEQUENCERS,
          name: 'sequencers',
          notes: ['empty at block 100: no logs yet for UpdateSequencer'],
        },
      ]),
    )

    expect(text).toInclude(
      '    // covers: isSequencer(address), UpdateSequencer\n    // empty at block 100: no logs yet for UpdateSequencer\n    "sequencers": {',
    )
  })

  it('round-trips the handlers and edits of a draft through the template parser', () => {
    const draft: Draft = {
      fields: {
        sequencers: SEQUENCERS,
        maxDelay: MAX_DELAY,
        revertedBatches: {
          handler: {
            type: 'event',
            select: 'batchIndex',
            add: { event: 'RevertBatch' },
          },
          covers: ['RevertBatch'],
          reason: 'revertBatch (onlyOwner) emits RevertBatch',
        },
        accessControl: {
          handler: {
            type: 'accessControl',
            roleNames: {
              '0x0000000000000000000000000000000000000000000000000000000000000000':
                'DEFAULT_ADMIN_ROLE',
            },
          },
          edit: ['get', 'DEFAULT_ADMIN_ROLE', 'members'],
          covers: ['hasRole(bytes32,address)'],
          reason: 'grantRole/revokeRole (onlyRole(getRoleAdmin(role)))',
        },
        verifiers: {
          handler: { type: 'array', method: 'verifiers', length: 3 },
          covers: ['verifiers(uint256)'],
          reason: 'addVerifier (onlyOwner)',
        },
        messageQueue: {
          handler: { type: 'storage', slot: 151, returnType: 'address' },
          covers: [],
          reason: 'set in initialize',
        },
        constructorArgs: {
          handler: { type: 'constructorArgs', nameArgs: true },
          covers: [],
          reason: 'immutables',
        },
        layer2ChainId: {
          handler: { type: 'hardcoded', value: 534352 },
          covers: [],
          reason: 'fixed',
        },
      },
      skips: [],
    }

    const text = renderTemplateFile({
      ...minimal(fieldsOf(draft)),
      ignoreMethods: ['committedBatches'],
    })
    const parsed = StructureContract.parse(parseJsonc(text))

    expect(parsed.ignoreMethods).toEqual(['committedBatches'])
    expect<unknown>(parsed.fields).toEqual(
      Object.fromEntries(
        Object.entries(draft.fields).map(([name, { handler, edit }]) => [
          name,
          edit === undefined ? { handler } : { handler, edit },
        ]),
      ),
    )
  })

  it('refuses a key or field name that would appear twice', () => {
    expect(() =>
      renderTemplateFile({
        ...minimal([]),
        displayName: 'A',
        preserved: [{ key: 'displayName', text: '"displayName": "B"' }],
      }),
    ).toThrow('would repeat the top-level key "displayName"')
    expect(() =>
      renderTemplateFile({
        ...minimal([{ ...MAX_DELAY, name: 'maxDelay' }]),
        lockedFields: [{ name: 'maxDelay', text: '"maxDelay": {}' }],
      }),
    ).toThrow('would repeat the field name "maxDelay"')
  })

  it('refuses a result the template schemas reject', () => {
    expect(() =>
      renderTemplateFile(
        minimal([
          {
            name: 'broken',
            reason: '',
            covers: [],
            handler: { type: 'call', method: 'x' },
          },
        ]),
      ),
    ).toThrow('Rendered template.jsonc does not load')
  })
})
