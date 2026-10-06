import { ChainSpecificAddress, parseJsonc } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { ContractConfigSchema } from '../../../schemas/schemas'
import { StructureContract } from '../../config/StructureConfig'
import { UserHandlers } from '../../handlers/user'
import { schemaProblems } from '../draft/schemaProblems'
import type { ContractFacts } from '../facts'
import { FIXTURE_NAMES, loadFixture } from '../test/fixtures'
import { buildWorklist } from '../worklist'
import {
  buildPrompt,
  DEFAULT_SOURCE_CHAR_CAP,
  type PromptInput,
  README_REFERENCE_HEADER,
  SECTION_HEADERS,
  TRUNCATION_MARKER,
  VALUE_CHAR_CAP,
  WORKED_EXAMPLE,
  WORKED_EXAMPLE_INTRO,
  WORKED_EXAMPLE_OUTRO,
} from './buildPrompt'
import { DOCUMENTED_HANDLER_TYPES, draftJsonSchema } from './draftJsonSchema'
import { HANDLER_DOCS } from './handlerDocs'
import { parseReadme } from './readmeSections'

/**
 * Renders prompts for the real fixture contracts and pins what the model is
 * shown: the five sections in order and byte-identical across runs, every
 * worklist item and event, baseline values with long ones elided, existing
 * template only when there is one, the proxy source first and the source
 * budget. The worked example and the handler docs examples are checked
 * against V1's own schemas, as the validator checks a reply, so the prompt
 * never teaches a form the validator refuses.
 */
describe(buildPrompt.name, () => {
  const inputFor = (facts: ContractFacts): PromptInput => ({
    facts,
    worklist: buildWorklist(facts.abi, facts.baseline),
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

  it('states the rules, with what needs no field and an example of each, numbered with output last', () => {
    const rules = section(buildPrompt(scrollChain()).prompt, 'rules')
    for (const kind of [
      'A computation:',
      'User activity:',
      'Unbounded state:',
      'State already shown:',
      'Not state:',
    ]) {
      const definition = rules
        .split('\n')
        .find((line) => line.trimStart().startsWith(`- ${kind}`))
      expect(definition ?? '').toInclude('Example:')
    }
    for (const title of [
      'Shape.',
      'Name.',
      'Place.',
      'What to read.',
      'Enumeration source.',
      'Event-only state.',
      'Privileged events.',
      'Roles.',
      'References.',
      'Literals.',
      'Reason.',
      'User activity is never fetched.',
    ]) {
      expect(rules).toInclude(`**${title}**`)
    }
    expect(rules).toInclude('`["format", "FormatSeconds"]`')
    expect(rules).toInclude('`["!=", "#arg", literal]`')
    expect(rules).toInclude('`eth:0x…`')
    expect(rules).toInclude('are the researcher’s to write')
    expect(rules).toInclude('since `array` takes no `uint8` key')
    expect(HANDLER_DOCS).toInclude('A `uint8` key is not accepted')
    expect(rules).toMatchRegex(
      /\n13\. \*\*Output\.\*\* Reply with exactly one JSON object/,
    )
    expect(rules).not.toInclude('**Existing template.**')
  })

  it('shows the schema and a worked example V1’s template schema accepts, every field with a reason', () => {
    const schemaSection = section(buildPrompt(scrollChain()).prompt, 'schema')
    expect(schemaSection).toInclude(JSON.stringify(draftJsonSchema(), null, 2))
    expect(schemaSection).toInclude(WORKED_EXAMPLE_OUTRO)

    const example = JSON.parse(
      jsonBlockAfter(schemaSection, WORKED_EXAMPLE_INTRO),
    )
    expect(example).toEqual(WORKED_EXAMPLE)
    const fields: Record<string, Record<string, unknown>> = example.fields
    const withoutReasons = Object.fromEntries(
      Object.entries(fields).map(([name, { reason, ...field }]) => {
        expect(typeof reason).toEqual('string')
        return [name, field]
      }),
    )
    expect(
      schemaProblems(ContractConfigSchema, { fields: withoutReasons }, ''),
    ).toEqual([])
  })

  it('takes the worked example from a contract outside the benchmark suite', () => {
    const suiteNames = new Set(
      FIXTURE_NAMES.flatMap((name) => {
        const { items, events } = inputFor(loadFixture(name)).worklist
        return [...items, ...events].map((item) => item.name)
      }),
    )
    const read = JSON.stringify(WORKED_EXAMPLE).match(
      /"(event|method)":"[A-Za-z]+"/g,
    )
    const names = (read ?? []).map((pair) => pair.split(':')[1]?.slice(1, -1))

    expect(names).toEqual([
      'UpdateChallenger',
      'UpdateChallenger',
      'rollupDelayPeriod',
    ])
    expect(names.filter((name) => suiteNames.has(name ?? ''))).toEqual([])
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
      const ctor = input.worklist.constructorItem
      if (ctor === undefined) {
        expect(facts).not.toInclude('### Constructor')
      } else {
        expect(facts).toInclude(
          `### Constructor\n\n- \`${ctor.signature}\`: ${ctor.fragment}`,
        )
      }
    }
  })

  it('flags the worklist items V1 probes for this address, and overloaded events', () => {
    const input = scrollChain()
    input.facts.baseline.fields.committedBatches = { kind: 'probe', value: [] }
    const facts = section(
      buildPrompt({
        ...input,
        worklist: buildWorklist(input.facts.abi, input.facts.baseline),
      }).prompt,
      'facts',
    )
    expect(facts).toInclude(
      '- `committedBatches(uint256)`: function committedBatches(uint256) view returns (bytes32) (probed)',
    )
    expect(facts).toInclude(
      '- `isSequencer(address)`: function isSequencer(address) view returns (bool)\n',
    )
    expect(facts).toInclude(
      '- `finalizedStateRoots(uint256)`: function finalizedStateRoots(uint256) view returns (bytes32)\n',
    )
    expect(facts).toInclude(
      '- `RevertBatch`: event RevertBatch(uint256 indexed batchIndex, bytes32 indexed batchHash) (overloaded:',
    )
    expect(facts).toInclude(
      '- `UpdateSequencer`: event UpdateSequencer(address indexed account, bool status)\n',
    )
  })

  it('shows baseline values, probes, override fields and errors, and elides long values with a marker', () => {
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
    input.facts.baseline.fields.validators = {
      kind: 'probe',
      value: ['0x01', '0x02', '0x03', '0x04', '0x05'],
      error: 'Too many values. Update configuration to explore fully',
    }
    input.facts.baseline.fields.fromConfig = { kind: 'override', value: 7 }
    const facts = section(buildPrompt(input).prompt, 'facts')
    expect(facts).toInclude('- `lastFinalizedBatchIndex` = 519245')
    expect(facts).toInclude('- `miscData` = {"lastCommittedBatchIndex":519245,')
    expect(facts).toInclude(
      '- `committedBatches` (probed at indices 0–4) = ["0x01","0x02"]',
    )
    expect(facts).toInclude('- `fromConfig` (from the project config) = 7')
    expect(facts).toInclude('- `brokenGetter` = error: Execution reverted')
    expect(facts).toInclude(
      '- `validators` (probed at indices 0–4) = ["0x01","0x02","0x03","0x04","0x05"] (error: Too many values. Update configuration to explore fully)',
    )
    expect(facts).toInclude('[52 more characters elided]')
    expect(facts).not.toInclude(long)
    expect(facts).toMatchRegex(
      /- Proxy value `\$pastUpgrades` \(not referenceable\): .*… \[\d+ more characters elided\]/,
    )
    expect(facts).toInclude(
      'Reference these as `{{ name }}`; never fetch them again',
    )
  })

  it('renders the existing template verbatim and its failing fields, and its rule only when there is one', () => {
    const text = `{
  "fields": {
    // kept
    "sequencers": {
      "handler": { "type": "event", "select": "account", "add": { "event": "UpdateSequencer" } }
    }
  }
}
`
    const input: PromptInput = {
      ...scrollChain(),
      existing: existingTemplate(text, [
        { name: 'broken', error: 'Execution reverted' },
      ]),
    }
    const { prompt } = buildPrompt(input)
    const facts = section(prompt, 'facts')
    expect(facts).toInclude(
      '### The template this contract already has (`scroll/ScrollChain`)',
    )
    expect(facts).toInclude(['```jsonc', text.trimEnd(), '```'].join('\n'))
    expect(facts).toInclude(
      `- \`broken\` fails at block ${input.facts.blockNumber}: Execution reverted`,
    )
    expect(section(prompt, 'rules')).toInclude('**Existing template.**')
    expect(section(prompt, 'rules')).toMatchRegex(/\n14\. \*\*Output\.\*\*/)

    const fresh = buildPrompt(scrollChain()).prompt
    expect(fresh).not.toInclude('### The template this contract already has')
    expect(fresh).not.toInclude('**Existing template.**')
  })

  it('adds the README sections for handlers and edits the existing fields use beyond the seven types, and only then', () => {
    const readme = parseReadme(
      [
        '## Handlers',
        '### Scroll access control handler',
        'Reads the roles of Scroll.',
        '```json',
        '{ "type": "scrollAccessControl" }',
        '```',
        '## Edit',
        '### Filters',
        '#### `pipe`',
        'Runs programs in sequence.',
        '### `get`',
        'Accesses a property.',
      ].join('\n'),
    )
    const generic: PromptInput = {
      ...scrollChain(),
      existing: existingTemplate(
        JSON.stringify({
          fields: {
            a: {
              handler: { type: 'event', add: { event: 'X' } },
              edit: ['get', 'x'],
            },
          },
        }),
      ),
    }
    const specific: PromptInput = {
      ...scrollChain(),
      existing: existingTemplate(
        JSON.stringify({
          fields: {
            roles: { handler: { type: 'scrollAccessControl' } },
            b: { edit: ['pipe', ['get', 'x']] },
          },
        }),
      ),
    }

    const plain = buildPrompt(generic, { readme }).prompt
    expect(plain).not.toInclude(README_REFERENCE_HEADER)

    const handlers = section(
      buildPrompt(specific, { readme }).prompt,
      'handlers',
    )
    expect(handlers).toInclude(README_REFERENCE_HEADER)
    expect(handlers).toInclude(
      '### Scroll access control handler\nReads the roles of Scroll.',
    )
    expect(handlers).toInclude('#### `pipe`\nRuns programs in sequence.')
    expect(handlers).not.toInclude('### `get`')
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

  it('is V1’s template field cut to handler, edit and reason, handler one of the documented types', () => {
    const schema = draftJsonSchema() as {
      definitions: Record<string, unknown>
      properties: {
        fields: {
          additionalProperties: {
            properties: Record<string, unknown>
            required: string[]
          }
        }
      }
    }
    const field = schema.properties.fields.additionalProperties
    expect(Object.keys(field.properties)).toEqual(['handler', 'edit', 'reason'])
    expect(field.required).toEqual(['handler', 'reason'])
    expect(field.properties.handler).toEqual({
      anyOf: DOCUMENTED_HANDLER_TYPES.map((type) => ({
        $ref: `#/definitions/${type}Handler`,
      })),
    })
    expect(Object.keys(schema.definitions)).toEqual(
      DOCUMENTED_HANDLER_TYPES.map((type) => `${type}Handler`),
    )
  })
})

describe('HANDLER_DOCS', () => {
  it('documents every documented handler type and edit', () => {
    for (const type of [...DOCUMENTED_HANDLER_TYPES, 'edit']) {
      expect(HANDLER_DOCS).toInclude(`\n### ${type}\n`)
    }
  })

  it('shows only examples V1’s own handler schemas accept, with no key they do not name', () => {
    const examples = jsonBlocks(HANDLER_DOCS).flatMap((block) =>
      block
        .split('\n')
        .map((line) => JSON.parse(line) as { type: keyof typeof UserHandlers }),
    )
    expect([...new Set(examples.map((handler) => handler.type))]).toEqual([
      ...DOCUMENTED_HANDLER_TYPES,
    ])
    for (const handler of examples) {
      expect(schemaProblems(UserHandlers[handler.type], handler, '')).toEqual(
        [],
      )
    }
  })
})

function existingTemplate(
  text: string,
  failing: { name: string; error: string }[] = [],
): PromptInput['existing'] {
  return {
    templateId: 'scroll/ScrollChain',
    text,
    template: StructureContract.parse(parseJsonc(text)),
    failing,
  }
}

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
