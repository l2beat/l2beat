import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { toJsonSchema } from '@l2beat/validate'
import { expect } from 'earl'
import {
  type DraftHandler,
  DraftShape,
  HANDLER_TYPES,
  handlerSchemaFor,
  SKIP_REASONS,
} from '../draft/Draft'
import type { ContractFacts } from '../facts'
import { FIXTURE_NAMES, loadFixture } from '../test/fixtures'
import { buildWorklist, worklistTokens } from '../worklist'
import {
  buildPrompt,
  DEFAULT_SOURCE_CHAR_CAP,
  type PromptInput,
  SECTION_HEADERS,
  TRUNCATION_MARKER,
  VALUE_CHAR_CAP,
  WORKED_EXAMPLE,
  WORKED_EXAMPLE_INTRO,
} from './buildPrompt'
import { draftJsonSchema } from './draftJsonSchema'
import { HANDLER_DOCS } from './handlerDocs'

/**
 * Renders prompts for the real fixture contracts and pins what the model is
 * shown: the five sections in order and byte-identical across runs, every
 * worklist item and event, baseline values with long ones elided, locked
 * fields only when there are some, the proxy source first and the source
 * budget. The worked example and the handler docs examples are checked
 * against the same schemas the validator uses, so the prompt never teaches
 * a form the validator refuses.
 */
describe(buildPrompt.name, () => {
  const inputFor = (facts: ContractFacts): PromptInput => ({
    facts,
    worklist: buildWorklist(facts.abi),
  })
  const scrollChain = () => inputFor(loadFixture('ScrollChain'))

  it('renders byte-identical prompts for identical inputs', () => {
    const first = buildPrompt(scrollChain())
    const second = buildPrompt(scrollChain())
    expect(second.prompt).toEqual(first.prompt)
    expect(first.truncated).toEqual(false)
  })

  it('renders the five sections once each, in order', () => {
    const { prompt } = buildPrompt(scrollChain())
    const positions = Object.values(SECTION_HEADERS).map((header) =>
      prompt.indexOf(header),
    )
    expect(positions.every((position) => position >= 0)).toEqual(true)
    expect([...positions].sort((a, b) => a - b)).toEqual(positions)
    for (const header of Object.values(SECTION_HEADERS)) {
      expect(prompt.split(header).length - 1).toEqual(1)
    }
  })

  it('states the rules the validator enforces, numbered with output last', () => {
    const rules = section(buildPrompt(scrollChain()).prompt, 'rules')
    for (const reason of SKIP_REASONS) {
      const definition = rules
        .split('\n')
        .find((line) => line.trimStart().startsWith(`- \`${reason}\`:`))
      expect(definition ?? '').toInclude('Example:')
    }
    for (const title of [
      'Shape.',
      'Name.',
      'Selection.',
      'Covers.',
      'Event-only state.',
      'Privileged events.',
      'Roles.',
      'References.',
      'Literals.',
      'Only the draft.',
    ]) {
      expect(rules).toInclude(`**${title}**`)
    }
    expect(rules).toInclude('`["format", "FormatSeconds"]`')
    expect(rules).toInclude('`["!=", "#arg", literal]`')
    expect(rules).toInclude('`eth:0x…`')
    expect(rules).toInclude('`ignoreMethods` is derived from your skips')
    expect(rules).toMatchRegex(
      /\n15\. \*\*Output\.\*\* Reply with exactly one JSON object/,
    )
    expect(rules).not.toInclude('**Locked fields.**')
  })

  it('shows the schema and a worked example that has the draft shape', () => {
    const schemaSection = section(buildPrompt(scrollChain()).prompt, 'schema')
    expect(schemaSection).toInclude(JSON.stringify(draftJsonSchema(), null, 2))

    const example = JSON.parse(
      jsonBlockAfter(schemaSection, WORKED_EXAMPLE_INTRO),
    )
    expect(example).toEqual(WORKED_EXAMPLE)
    expect(DraftShape.safeValidate(example).success).toEqual(true)
    for (const field of Object.values(WORKED_EXAMPLE.fields)) {
      expect(
        handlerSchemaFor(field.handler).safeParse(field.handler).success,
      ).toEqual(true)
    }
  })

  it('takes the worked example from a contract outside the benchmark suite', () => {
    const suiteTokens = new Set(
      FIXTURE_NAMES.flatMap((name) =>
        worklistTokens(inputFor(loadFixture(name)).worklist),
      ),
    )
    const answered = Object.values(WORKED_EXAMPLE.fields).flatMap(
      (field) => field.covers,
    )

    expect(answered.filter((token) => suiteTokens.has(token))).toEqual([])
  })

  it('embeds the handler docs as section 3', () => {
    const handlers = section(buildPrompt(scrollChain()).prompt, 'handlers')
    expect(handlers).toInclude(HANDLER_DOCS)
  })

  it('lists identity, ABI, every worklist item and every event for every fixture', () => {
    for (const name of FIXTURE_NAMES) {
      const input = inputFor(loadFixture(name))
      const facts = section(buildPrompt(input).prompt, 'facts')
      expect(facts).toInclude(`- Address: ${input.facts.address}`)
      expect(facts).toInclude(`- Block: ${input.facts.blockNumber}`)
      expect(facts).toInclude(`- Contract name: ${input.facts.name}`)
      expect(facts).toInclude(
        ['```solidity', ...input.facts.abi, '```'].join('\n'),
      )
      for (const item of input.worklist.items) {
        expect(facts).toInclude(`- \`${item.signature}\`: ${item.fragment}`)
      }
      for (const event of input.worklist.events) {
        expect(facts).toInclude(`- \`${event.name}\`: ${event.fragment}`)
      }
    }
  })

  it('flags probed worklist items and overloaded events', () => {
    const facts = section(buildPrompt(scrollChain()).prompt, 'facts')
    expect(facts).toInclude(
      '- `committedBatches(uint256)`: function committedBatches(uint256) view returns (bytes32) (probed)',
    )
    expect(facts).toInclude(
      '- `isSequencer(address)`: function isSequencer(address) view returns (bool)\n',
    )
    expect(facts).toInclude(
      '- `RevertBatch`: event RevertBatch(uint256 indexed batchIndex, bytes32 indexed batchHash) (overloaded:',
    )
    expect(facts).toInclude(
      '- `UpdateSequencer`: event UpdateSequencer(address indexed account, bool status)\n',
    )
  })

  it('shows baseline values, probes and errors, and elides long values with a marker', () => {
    const input = scrollChain()
    const long = 'x'.repeat(VALUE_CHAR_CAP + 50)
    input.facts.baseline.fields.description = { kind: 'getter', value: long }
    input.facts.baseline.fields.committedBatches = {
      kind: 'probe',
      value: ['0x01', '0x02'],
    }
    input.facts.baseline.fields.brokenGetter = {
      kind: 'getter',
      error: 'Execution reverted',
    }
    const facts = section(buildPrompt(input).prompt, 'facts')
    expect(facts).toInclude('- `lastFinalizedBatchIndex` = 519245')
    expect(facts).toInclude('- `miscData` = {"lastCommittedBatchIndex":519245,')
    expect(facts).toInclude(
      '- `committedBatches` (probed at indices 0–4) = ["0x01","0x02"]',
    )
    expect(facts).toInclude('- `brokenGetter` = error: Execution reverted')
    expect(facts).toInclude('[52 more characters elided]')
    expect(facts).not.toInclude(long)
    expect(facts).toMatchRegex(
      /- Proxy value `\$pastUpgrades` \(not referenceable\): .*… \[\d+ more characters elided\]/,
    )
    expect(facts).toInclude(
      'Reference these as `{{ name }}`; never fetch them again',
    )
  })

  it('renders locked fields and their rule only when there are some', () => {
    const input = {
      ...scrollChain(),
      locked: [
        {
          name: 'sequencers',
          text: '{\n  // kept\n  "handler": { "type": "event", "select": "account", "add": { "event": "UpdateSequencer" } }\n}',
        },
      ],
    }
    const { prompt } = buildPrompt(input)
    expect(section(prompt, 'facts')).toInclude('### Locked fields (1)')
    expect(section(prompt, 'facts')).toInclude(
      ['```jsonc', `"sequencers": ${input.locked[0]?.text}`, '```'].join('\n'),
    )
    expect(section(prompt, 'rules')).toInclude('**Locked fields.**')
    expect(section(prompt, 'rules')).toMatchRegex(/\n16\. \*\*Output\.\*\*/)

    const unlocked = buildPrompt({ ...scrollChain(), locked: [] }).prompt
    expect(unlocked).not.toInclude('### Locked fields')
    expect(unlocked).not.toInclude('**Locked fields.**')
  })

  it('puts the proxy source first and cuts the sources at the shared budget with a marker', () => {
    const input = scrollChain()
    const implementation = input.facts.sources[0]?.flattened ?? ''
    const proxySource = 'contract TransparentUpgradeableProxy {}'
    input.facts.sources.push({
      address: input.facts.address,
      name: 'TransparentUpgradeableProxy',
      flattened: proxySource,
    })

    const full = buildPrompt(input)
    expect(full.truncated).toEqual(false)
    expect(full.prompt).toInclude(implementation)

    const { prompt, truncated } = buildPrompt(input, {
      sourceCharCap: proxySource.length + 1000,
    })
    expect(truncated).toEqual(true)
    const source = section(prompt, 'source')
    const proxyAt = source.indexOf(
      `### TransparentUpgradeableProxy (${input.facts.address})`,
    )
    const implementationAt = source.indexOf('### ScrollChain (')
    expect(proxyAt).toBeGreaterThan(0)
    expect(implementationAt).toBeGreaterThan(proxyAt)
    expect(source).toInclude(proxySource)
    expect(source).toInclude(implementation.slice(0, 1000))
    expect(source).not.toInclude(implementation.slice(0, 1001))
    expect(source).toInclude(
      `${TRUNCATION_MARKER}: ${implementation.length - 1000} of ${implementation.length} characters omitted]`,
    )
  })

  it('reports every source as omitted once the budget is spent and marks unflattened bundles', () => {
    const input = scrollChain()
    input.facts.sources.push({
      address: ChainSpecificAddress(
        'eth:0x0000000000000000000000000000000000000001',
      ),
      name: 'Broken',
      flattened: '',
    })
    const { prompt, truncated } = buildPrompt(input, { sourceCharCap: 0 })
    expect(truncated).toEqual(true)
    expect(prompt).toInclude('the source budget is exhausted')
    expect(prompt.split(TRUNCATION_MARKER).length - 1).toEqual(1)
    expect(prompt).toInclude(
      '// [UNAVAILABLE: this bundle could not be flattened]',
    )
  })

  it('uses the default cap when none is given', () => {
    const input = scrollChain()
    input.facts.sources[0] = {
      ...(input.facts.sources[0] as ContractFacts['sources'][number]),
      flattened: 'y'.repeat(DEFAULT_SOURCE_CHAR_CAP + 1),
    }
    const { prompt, truncated } = buildPrompt(input)
    expect(truncated).toEqual(true)
    expect(prompt).toInclude(
      `${TRUNCATION_MARKER}: 1 of ${DEFAULT_SOURCE_CHAR_CAP + 1} characters omitted]`,
    )
  })
})

describe(draftJsonSchema.name, () => {
  it('is deterministic', () => {
    expect(JSON.stringify(draftJsonSchema())).toEqual(
      JSON.stringify(draftJsonSchema()),
    )
  })

  it('equals the DraftShape schema except that handler is the union of the handler definitions', () => {
    const schema = draftJsonSchema() as {
      definitions: Record<string, unknown>
      properties: {
        fields: {
          additionalProperties: { properties: Record<string, unknown> }
        }
      }
    }
    const { definitions, ...shape } = structuredClone(schema)
    const fieldProperties =
      shape.properties.fields.additionalProperties.properties
    expect(fieldProperties.handler).toEqual({
      anyOf: Object.keys(definitions)
        .filter((name) => name.endsWith('Handler'))
        .map((name) => ({ $ref: `#/definitions/${name}` })),
    })
    fieldProperties.handler = {}
    expect(shape).toEqual(toJsonSchema(DraftShape) as typeof shape)
  })

  it('defines every handler type, strict, with its type literal', () => {
    const { definitions } = draftJsonSchema() as {
      definitions: Record<
        string,
        {
          properties: { type?: { const: string } }
          additionalProperties: boolean
        }
      >
    }
    const types = Object.values(definitions)
      .map((definition) => definition.properties.type?.const)
      .filter((type) => type !== undefined)
    expect([...new Set(types)]).toEqual([...HANDLER_TYPES])
    for (const definition of Object.values(definitions)) {
      expect(definition.additionalProperties).toEqual(false)
    }
  })
})

describe('HANDLER_DOCS', () => {
  it('documents every handler type and edit', () => {
    for (const type of [...HANDLER_TYPES, 'edit']) {
      expect(HANDLER_DOCS).toInclude(`\n### ${type}\n`)
    }
  })

  it('shows only examples that pass the validator’s handler schemas', () => {
    const examples = jsonBlocks(HANDLER_DOCS).flatMap((block) =>
      block.split('\n').map((line) => JSON.parse(line) as DraftHandler),
    )
    expect(examples.length).toBeGreaterThanOrEqual(HANDLER_TYPES.length)
    expect([...new Set(examples.map((handler) => handler.type))]).toEqual([
      ...HANDLER_TYPES,
    ])
    for (const handler of examples) {
      expect(handlerSchemaFor(handler).safeParse(handler)).toEqual({
        success: true,
        data: expect.anything(),
      })
    }
  })
})

function section(prompt: string, key: keyof typeof SECTION_HEADERS): string {
  const headers = Object.values(SECTION_HEADERS)
  const start = prompt.indexOf(SECTION_HEADERS[key])
  const next = headers[headers.indexOf(SECTION_HEADERS[key]) + 1]
  return prompt.slice(
    start,
    next === undefined ? undefined : prompt.indexOf(next),
  )
}

function jsonBlockAfter(text: string, marker: string): string {
  const rest = text.slice(text.indexOf(marker))
  const [block] = jsonBlocks(rest)
  return block ?? ''
}

function jsonBlocks(text: string): string[] {
  return [...text.matchAll(/```json\n([\s\S]*?)\n```/g)].map(
    (match) => match[1] ?? '',
  )
}
