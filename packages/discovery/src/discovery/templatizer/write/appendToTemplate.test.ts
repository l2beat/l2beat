import { parseJsonc } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { readFileSync } from 'fs'
import path from 'path'
import type { DraftField } from '../draft/Draft'
import { appendToTemplate, removeInsertions } from './appendToTemplate'
import { readFieldEntries } from './jsoncEntries'
import type { TemplateFileField } from './templateFile'

const TEMPLATES = path.join(
  __dirname,
  '../../../../../config/src/projects/_templates',
)

function readTemplate(id: string): string {
  return readFileSync(path.join(TEMPLATES, id, 'template.jsonc'), 'utf8')
}

const SEQUENCERS: DraftField = {
  handler: {
    type: 'event',
    select: 'account',
    add: { event: 'UpdateSequencer', where: ['=', '#status', true] },
    remove: { event: 'UpdateSequencer', where: ['!=', '#status', true] },
  },
  covers: ['isSequencer(address)', 'UpdateSequencer'],
  reason: 'addSequencer/removeSequencer (onlyOwner) emit UpdateSequencer',
}

const MAX_DELAY: DraftField = {
  handler: { type: 'call', method: 'maxDelay', args: [] },
  edit: ['format', 'FormatSeconds'],
  covers: [],
  reason: 'maxDelay is set in the constructor',
}

/** Names no committed template of the list below has. */
const FIELDS: TemplateFileField[] = [
  { name: 'aiSequencers', ...SEQUENCERS },
  { name: 'aiMaxDelay', ...MAX_DELAY },
]

const PROVENANCE =
  'Added by fake-model via l2b discover --ai-revisit on 2026-10-02, 1 round(s). Review before committing.'

/**
 * The invariant of rule 1: whatever is appended, cutting the inserted
 * ranges out of the result gives the old text back byte for byte, and the
 * old fields read back unchanged.
 */
describe(appendToTemplate.name, () => {
  const REAL_TEMPLATES = [
    'opstack/PermissionedDisputeGame',
    'GnosisSafe',
    'opstack/DisputeGameFactory_v2',
    'scroll/ScrollChain',
    'NXV',
    'ChainlinkAuthorizedForwarder',
  ]

  for (const id of REAL_TEMPLATES) {
    it(`only inserts into ${id}`, () => {
      const oldText = readTemplate(id)
      const before = readFieldEntries(oldText)
      const notes = Object.fromEntries(
        before
          .slice(0, 1)
          .map((entry) => [
            entry.name,
            ['review: fails at block 100: Execution reverted'],
          ]),
      )

      const { text, insertions } = appendToTemplate(oldText, {
        provenance: PROVENANCE,
        fieldNotes: notes,
        fields: FIELDS,
      })

      expect(removeInsertions(text, insertions)).toEqual(oldText)
      expect(insertions.length).toBeGreaterThan(0)
      const after = readFieldEntries(text)
      expect(after.map((entry) => entry.name)).toEqual([
        ...before.map((entry) => entry.name),
        'aiSequencers',
        'aiMaxDelay',
      ])
      for (const entry of before.slice(1)) {
        expect(after.find((e) => e.name === entry.name)?.text).toEqual(
          entry.text,
        )
      }
      const parsed = parseJsonc<{ fields: Record<string, unknown> }>(text)
      expect(parsed.fields.aiSequencers).toEqual({
        handler: SEQUENCERS.handler,
      })
      expect(parsed.fields.aiMaxDelay).toEqual({
        handler: MAX_DELAY.handler,
        edit: MAX_DELAY.edit,
      })
    })
  }

  it('appends after the last field with a comma, a provenance line and the field comments', () => {
    const oldText = readTemplate('opstack/PermissionedDisputeGame')

    const { text } = appendToTemplate(oldText, {
      provenance: PROVENANCE,
      fields: [FIELDS[1] as TemplateFileField],
    })

    expect(text).toInclude(
      [
        '      "edit": ["format", "OpStackAbsolutePrestate"]',
        '    },',
        `    // ${PROVENANCE}`,
        '    // maxDelay is set in the constructor',
        '    "aiMaxDelay": {',
        '      "handler": {',
        '        "type": "call",',
        '        "method": "maxDelay",',
        '        "args": []',
        '      },',
        '      "edit": ["format", "FormatSeconds"]',
        '    }',
        '    // proposer and challenger permissions are manually set in projects that use this dispute game actively',
        '  }',
        '}',
        '',
      ].join('\n'),
    )
  })

  it('puts a note directly above the field’s key, under the researcher’s comments, and never twice', () => {
    const oldText = [
      '{',
      '  "$schema": "x",',
      '  "fields": {',
      '    // written by a researcher',
      '    "validators": {',
      '      "severity": "HIGH",',
      '      "handler": { "type": "call", "method": "validators", "args": [] }',
      '    }',
      '  }',
      '}',
      '',
    ].join('\n')
    const note = 'review: fails at block 100: Execution reverted'

    const first = appendToTemplate(oldText, {
      fieldNotes: { validators: [note] },
    })
    const again = appendToTemplate(first.text, {
      fieldNotes: { validators: [note] },
    })
    const laterBlock = appendToTemplate(first.text, {
      fieldNotes: {
        validators: ['review: fails at block 250: Execution reverted'],
      },
    })
    const otherError = appendToTemplate(first.text, {
      fieldNotes: { validators: ['review: fails at block 250: Timeout'] },
    })

    expect(removeInsertions(first.text, first.insertions)).toEqual(oldText)
    expect(first.text).toInclude(
      '    // written by a researcher\n    // review: fails at block 100: Execution reverted\n    "validators": {',
    )
    expect(again.insertions).toEqual([])
    expect(again.text).toEqual(first.text)
    expect(laterBlock.insertions).toEqual([])
    expect(otherError.insertions.length).toEqual(1)
    expect(otherError.text).toInclude(
      '    // review: fails at block 100: Execution reverted\n    // review: fails at block 250: Timeout\n    "validators": {',
    )
  })

  it('fills an empty fields object', () => {
    const oldText = '{\n  "$schema": "x",\n  "fields": {}\n}\n'

    const { text, insertions } = appendToTemplate(oldText, {
      fields: [FIELDS[1] as TemplateFileField],
    })

    expect(removeInsertions(text, insertions)).toEqual(oldText)
    expect(text).toEqual(
      [
        '{',
        '  "$schema": "x",',
        '  "fields": {',
        '    // maxDelay is set in the constructor',
        '    "aiMaxDelay": {',
        '      "handler": {',
        '        "type": "call",',
        '        "method": "maxDelay",',
        '        "args": []',
        '      },',
        '      "edit": ["format", "FormatSeconds"]',
        '    }',
        '  }',
        '}',
        '',
      ].join('\n'),
    )
  })

  it('adds a fields object to a template without one, after its last entry', () => {
    const oldText = readTemplate('NXV')

    const { text, insertions } = appendToTemplate(oldText, {
      fields: [FIELDS[1] as TemplateFileField],
    })

    expect(removeInsertions(text, insertions)).toEqual(oldText)
    expect(text).toInclude(
      [
        '  "ignoreMethods": ["getThreshold", "getOwners", "txNonces"],',
        '  "fields": {',
        '    // maxDelay is set in the constructor',
        '    "aiMaxDelay": {',
      ].join('\n'),
    )
    expect(parseJsonc<{ fields: object }>(text).fields).toEqual({
      aiMaxDelay: { handler: MAX_DELAY.handler, edit: MAX_DELAY.edit },
    })
  })

  it('places the comma before a same-line comment of the last entry', () => {
    const oldText =
      '{\n  "$schema": "x",\n  "fields": {\n    "a": { "severity": "LOW" } // keep\n  }\n}'

    const { text, insertions } = appendToTemplate(oldText, {
      fields: [FIELDS[1] as TemplateFileField],
    })

    expect(removeInsertions(text, insertions)).toEqual(oldText)
    expect(text).toInclude(
      '    "a": { "severity": "LOW" }, // keep\n    // maxDelay',
    )
    expect(text.endsWith('\n  }\n}')).toEqual(true)
  })

  it('appends after a trailing comma without adding another', () => {
    const oldText =
      '{\n  "$schema": "x",\n  "fields": {\n    "a": { "severity": "LOW" },\n  },\n}\n'

    const { text, insertions } = appendToTemplate(oldText, {
      fields: [FIELDS[1] as TemplateFileField],
    })

    expect(removeInsertions(text, insertions)).toEqual(oldText)
    expect(text).toInclude('    "a": { "severity": "LOW" },\n    // maxDelay')
    expect(text).toInclude('    }\n  },\n}\n')
  })

  it('writes nothing when there is nothing new', () => {
    const oldText = readTemplate('GnosisSafe')

    const result = appendToTemplate(oldText, { fields: [], fieldNotes: {} })

    expect(result).toEqual({ text: oldText, insertions: [] })
  })

  it('refuses a field the template already has, and a note for a field it has not', () => {
    const oldText = readTemplate('GnosisSafe')

    expect(() =>
      appendToTemplate(oldText, {
        fields: [{ name: 'GnosisSafe_modules', ...MAX_DELAY }],
      }),
    ).toThrow('already has a field of that name')
    expect(() =>
      appendToTemplate(oldText, { fieldNotes: { nope: ['review: x'] } }),
    ).toThrow('the template has no such field')
  })

  it('refuses a result the template schemas reject', () => {
    expect(() =>
      appendToTemplate(readTemplate('GnosisSafe'), {
        fields: [
          {
            name: 'broken',
            reason: '',
            covers: [],
            handler: { type: 'call', method: 'x' },
          },
        ],
      }),
    ).toThrow('Rendered template.jsonc does not load')
  })
})

describe(removeInsertions.name, () => {
  it('cuts the ranges out in any order', () => {
    expect(
      removeInsertions('a[1]b[22]c', [
        { start: 5, end: 9 },
        { start: 1, end: 4 },
      ]),
    ).toEqual('abc')
  })
})
