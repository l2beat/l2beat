import { expect } from 'earl'
import { readFileSync } from 'fs'
import path from 'path'
import {
  type FieldEntry,
  readFieldEntries,
  readFieldsObject,
  readTopLevelEntries,
  readTopLevelObject,
  withTrailingComma,
} from './jsoncEntries'

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

function withoutSpans(entries: FieldEntry[]) {
  return entries.map(({ name, text }) => ({ name, text }))
}

describe(readFieldEntries.name, () => {
  it('attaches only the comments directly above a field', () => {
    expect(withoutSpans(readFieldEntries(SYNTHETIC))).toEqual([
      {
        name: 'f',
        text: '// about f\n    // more about f\n    "f": { "handler": { "type": "hardcoded", "value": "/* no */" } }',
      },
      { name: 'g', text: '"g": 1' },
    ])
  })

  it('reports where each entry sits in the text, and the comma that followed it', () => {
    const [f, g] = readFieldEntries(SYNTHETIC)
    const at = (needle: string) => SYNTHETIC.indexOf(needle)

    expect(f?.span).toEqual({
      start: at('// about f'),
      keyStart: at('"f"'),
      valueEnd: at(' } },\n') + ' } }'.length,
      end: at(' } },\n') + ' } }'.length,
      comma: at(' } },\n') + ' } }'.length,
    })
    expect(g?.span).toEqual({
      start: at('"g"'),
      keyStart: at('"g"'),
      valueEnd: at('"g": 1') + '"g": 1'.length,
      end: at('"g": 1') + '"g": 1'.length,
      comma: at('"g": 1') + '"g": 1'.length,
    })
    expect(f?.text).toEqual(SYNTHETIC.slice(f?.span.start ?? 0, f?.span.end))
  })

  it('ends an entry after its same-line comment, with the comma placed before it', () => {
    const text = '{\n  "a": [1], // note\n  "b": 2\n}\n'
    const [a] = readTopLevelEntries(text)

    expect(a?.span).toEqual({
      start: text.indexOf('"a"'),
      keyStart: text.indexOf('"a"'),
      valueEnd: text.indexOf(','),
      end: text.indexOf('// note') + '// note'.length,
      comma: text.indexOf(','),
    })
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
})

describe(readFieldsObject.name, () => {
  it('locates the braces of the fields object and the document', () => {
    const fields = readFieldsObject(SYNTHETIC)
    const document = readTopLevelObject(SYNTHETIC)

    expect(fields?.open).toEqual(
      SYNTHETIC.indexOf('"fields": {') + '"fields": '.length,
    )
    expect(SYNTHETIC.slice(fields?.close ?? 0)).toEqual('},\n}\n')
    expect(fields?.entries.map((entry) => entry.key)).toEqual(['f', 'g'])
    expect(document.open).toEqual(0)
    expect(document.close).toEqual(SYNTHETIC.lastIndexOf('}'))
  })

  it('is absent for a template without fields, or whose fields is not an object', () => {
    expect(readFieldsObject('{ "$schema": "x" }')).toEqual(undefined)
    expect(readFieldsObject('{ "fields": [] }')).toEqual(undefined)
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
