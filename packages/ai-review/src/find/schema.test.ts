import { expect } from 'earl'
import { FIND_OUTPUT_SCHEMA, FindOutput } from './schema.js'

describe('FIND_OUTPUT_SCHEMA', () => {
  it('is strict at every level and requires every property', () => {
    const schema = FIND_OUTPUT_SCHEMA as {
      additionalProperties: boolean
      required: string[]
      properties: {
        findings: {
          items: { additionalProperties: boolean; required: string[] }
        }
      }
    }
    expect(schema.additionalProperties).toEqual(false)
    expect(schema.required).toEqual(['intent', 'findings'])
    expect(schema.properties.findings.items.additionalProperties).toEqual(false)
    expect(schema.properties.findings.items.required).toEqual([
      'file',
      'line_start',
      'line_end',
      'severity',
      'category',
      'claim',
      'evidence',
      'fix_sketch',
      'confidence',
    ])
  })

  it('accepts what the validator accepts', () => {
    expect(
      FindOutput.isValid({
        intent: 'x',
        findings: [
          {
            file: null,
            line_start: null,
            line_end: null,
            severity: 'minor',
            category: 'perf',
            claim: 'c',
            evidence: 'e',
            fix_sketch: 'f',
            confidence: 0.5,
          },
        ],
      }),
    ).toEqual(true)
    expect(FindOutput.isValid({ intent: 'x', findings: [], extra: 1 })).toEqual(
      false,
    )
  })
})
