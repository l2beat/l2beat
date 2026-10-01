import { parseJsonc } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { readFileSync } from 'fs'
import path from 'path'
import {
  readFieldEntries,
  readTopLevelEntries,
  withTrailingComma,
} from './jsoncEntries'
import { renderTemplateFile } from './templateFile'

const TEMPLATES = path.join(
  __dirname,
  '../../../../../config/src/projects/_templates',
)

function readTemplate(id: string): string {
  return readFileSync(path.join(TEMPLATES, id, 'template.jsonc'), 'utf8')
}

const SYNTHETIC = `{
  // about a
  "a": "x \\" } { // not a comment",
  /* block { */ "b": { "c": [1, 2, /* ] */ 3] }, // trailing
  "fields": {
    // about f
    // more about f
    "f": { "handler": { "type": "hardcoded", "value": "/* no */" } },

    // detached: a blank line separates it from g

    "g": 1,
  },
}
`

describe(readTopLevelEntries.name, () => {
  it('slices entries with their comments, strings and brackets intact', () => {
    const entries = readTopLevelEntries(SYNTHETIC)

    expect(entries.map((entry) => entry.key)).toEqual(['a', 'b', 'fields'])
    expect(entries[0]?.text).toEqual(
      '// about a\n  "a": "x \\" } { // not a comment"',
    )
    expect(entries[1]?.text).toEqual(
      '/* block { */ "b": { "c": [1, 2, /* ] */ 3] } // trailing',
    )
  })

  it('keeps a same-line comment after the comma with its entry', () => {
    const entries = readTopLevelEntries(readTemplate('scroll/ScrollChain'))

    expect(entries.map((entry) => entry.key)).toEqual([
      '$schema',
      'description',
      'critical',
      'category',
      'ignoreMethods',
      'ignoreInWatchMode',
      'ignoreRelatives',
      'fields',
    ])
    expect(
      entries.find((entry) => entry.key === 'ignoreRelatives')?.text,
    ).toEqual('"ignoreRelatives": ["messageQueueV1"] // deprecated')
  })
})

describe(readFieldEntries.name, () => {
  it('attaches only the comments directly above a field', () => {
    expect(readFieldEntries(SYNTHETIC)).toEqual([
      {
        name: 'f',
        text: '// about f\n    // more about f\n    "f": { "handler": { "type": "hardcoded", "value": "/* no */" } }',
      },
      { name: 'g', text: '"g": 1' },
    ])
  })

  it('reads several comment lines above a field', () => {
    const verifier = readFieldEntries(
      readTemplate('risc0/RiscZeroVerifierRouter'),
    ).find((entry) => entry.name === 'verifier_310fe598')

    expect(verifier?.text.split('\n').slice(0, 5)).toEqual([
      '// Read the verifier registered at each known selector directly from the public `verifiers`',
      '    // mapping, so the leaf verifiers are discovered and tracked independent of the owner. Selectors',
      "    // are maintained by hand from the owner timelock's executed addVerifier calls; an unset/removed",
      '    // selector reads back as the zero/tombstone address and is not followed.',
      '    "verifier_310fe598": {',
    ])
  })

  it('returns nothing for a template without fields', () => {
    expect(readFieldEntries('{ "$schema": "x" }')).toEqual([])
  })

  describe('rendered back by renderTemplateFile', () => {
    function renderKeepingEverything(original: string): string {
      return renderTemplateFile({
        schema: parseJsonc<{ $schema: string }>(original).$schema,
        header: 'Authored by test',
        ignoreMethods: [],
        preserved: withoutSchemaAndFields(readTopLevelEntries(original)),
        lockedFields: readFieldEntries(original),
        fields: [],
      })
    }

    function withoutSchemaAndFields<T extends { key: string }>(entries: T[]) {
      return entries.filter(
        (entry) => entry.key !== '$schema' && entry.key !== 'fields',
      )
    }

    it('reproduces scroll/ScrollChain with only the header added', () => {
      const original = readTemplate('scroll/ScrollChain')

      expect(renderKeepingEverything(original)).toEqual(
        original.replace(
          /^(\{\n {2}"\$schema": .*\n)/,
          '$1  // Authored by test\n\n',
        ),
      )
    })

    const IDS = [
      'scroll/ScrollOwner',
      'risc0/RiscZeroVerifierRouter',
      'rocketpool/RocketStorage',
      'kinto/AccessManager',
    ]
    for (const id of IDS) {
      it(`reproduces every entry of ${id} byte for byte`, () => {
        const original = readTemplate(id)

        const rendered = renderKeepingEverything(original)

        expect(withoutSchemaAndFields(readTopLevelEntries(rendered))).toEqual(
          withoutSchemaAndFields(readTopLevelEntries(original)),
        )
        expect(readFieldEntries(rendered)).toEqual(readFieldEntries(original))
      })
    }
  })
})

describe(withTrailingComma.name, () => {
  it('puts the comma before a trailing line comment, else at the end', () => {
    expect(withTrailingComma('"a": [1] // note')).toEqual('"a": [1], // note')
    expect(withTrailingComma('// above\n  "a": 1')).toEqual(
      '// above\n  "a": 1,',
    )
    expect(withTrailingComma('"a": 1 /* note */')).toEqual('"a": 1 /* note */,')
  })
})
