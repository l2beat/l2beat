import { expect } from 'earl'
import { parseSchema, validateSchema } from '../library/validateSchema'
import { planSchema } from './planSchema'

/**
 * Checks the plan schema against the validator's schema subset and against
 * the README example, and that every object is closed. The schema is shown
 * to the model as the contract for its answer and is what the loop validates
 * that answer against, so a keyword the local validator does not understand
 * or an open object would let the model emit a plan the code cannot read.
 */
describe('planSchema', () => {
  it('uses only keywords the milestone 1 validator understands', () => {
    expect(() => parseSchema(planSchema, 'planSchema')).not.toThrow()
  })

  it('closes every object except recipe args and describes every property, so the model is told exactly what is accepted', () => {
    const problems: string[] = []
    walk(
      planSchema as unknown as Record<string, unknown>,
      'planSchema',
      problems,
    )
    expect(problems).toEqual([])
  })

  it('accepts the README example plan', () => {
    const plan = {
      version: 1,
      contract: 'ZkLink',
      shapeHash: '0x12',
      steps: [
        {
          id: 'validators',
          covers: ['validators(address)'],
          fetch: { kind: 'logs', events: ['ValidatorStatusUpdate'] },
          use: 'set@1',
          args: {
            key: 'validatorAddress',
            add: [
              {
                event: 'ValidatorStatusUpdate',
                when: { arg: 'isActive', equals: true },
              },
            ],
            remove: [
              {
                event: 'ValidatorStatusUpdate',
                when: { arg: 'isActive', equals: true, negate: true },
              },
            ],
          },
          reason:
            'validators is written only in setValidator, which emits ValidatorStatusUpdate',
        },
        {
          id: 'committeeThresholds',
          covers: ['committeeThresholds(uint8,uint256)'],
          fetch: {
            kind: 'callEach',
            method: 'committeeThresholds(uint8,uint256)',
            keys: {
              literal: [
                [1, 0],
                [1, 1],
                [2, 0],
              ],
            },
          },
          use: 'map@1',
          reason: 'keys are the enum values used in setThresholds',
        },
        {
          id: 'owner',
          fetch: { kind: 'call', method: 'owner()', at: '$baseline.registry' },
          reason: 'governance reads the owner of the registry it points to',
        },
      ],
      skips: [
        { item: 'balanceOf(address)', reason: 'user-activity' },
        { item: 'quote(uint256)', reason: 'computation' },
      ],
    }
    expect(validateSchema(planSchema, plan, '$')).toEqual([])
  })

  it('rejects unknown fetch kinds, malformed references, unknown skip reasons and extra keys with paths', () => {
    const plan = {
      version: 1,
      contract: 'X',
      steps: [
        { id: 'a', fetch: { kind: 'guess' }, reason: 'r' },
        {
          id: 'b',
          fetch: { kind: 'call', method: 'owner()', at: 'baseline.registry' },
          reason: 'r',
        },
        {
          id: 'c',
          fetch: { kind: 'call', method: 'owner()' },
          reason: 'r',
          extra: 1,
        },
      ],
      skips: [{ item: 'x()', reason: 'boring' }],
    }
    const findings = validateSchema(planSchema, plan, '$')
    expect(findings.map((finding) => finding.split(': ')[0])).toEqual([
      '$.steps[0].fetch',
      '$.steps[1].fetch',
      '$.steps[2].extra',
      '$.skips[0].reason',
    ])
    expect(findings[3]).toEqual(
      '$.skips[0].reason: expected one of "user-activity", "computation", "unbounded", "covered", "not-state", got "boring"',
    )
  })
})

/** Recipe arguments are validated against each recipe's own schema instead. */
const OPEN_BY_DESIGN = new Set(['planSchema.steps.items.args'])

function walk(
  schema: Record<string, unknown>,
  path: string,
  problems: string[],
): void {
  if (
    schema.type === 'object' &&
    schema.additionalProperties !== false &&
    !OPEN_BY_DESIGN.has(path)
  ) {
    problems.push(`${path}: object is not closed`)
  }
  const properties = (schema.properties ?? {}) as Record<
    string,
    Record<string, unknown>
  >
  for (const [name, property] of Object.entries(properties)) {
    if (typeof property.description !== 'string') {
      problems.push(`${path}.${name}: no description`)
    }
    walk(property, `${path}.${name}`, problems)
  }
  if (schema.items !== undefined) {
    walk(schema.items as Record<string, unknown>, `${path}.items`, problems)
  }
  for (const combinator of ['anyOf', 'oneOf']) {
    const variants = (schema[combinator] ?? []) as Record<string, unknown>[]
    variants.forEach((variant, i) =>
      walk(variant, `${path}.${combinator}[${i}]`, problems),
    )
  }
}
