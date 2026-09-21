import { expect } from 'earl'
import { Library } from '../../library/Library'
import {
  fixtureBaseline,
  fixturePrepared,
  fixtureWorklist,
  IMPLEMENTATION,
  SELF,
} from '../../testing/fixture'
import {
  BASELINE_VALUE_CAP,
  buildAuthoringPrompt,
  SECTION_HEADERS,
  TRUNCATION_MARKER,
} from './buildAuthoringPrompt'

/**
 * Renders the prompt for the fixture contract and pins what the model is
 * shown: the five sections in order, every worklist item and event, every
 * baseline value (long ones elided), the proxy source before the
 * implementation, and the source budget. Determinism is asserted directly,
 * because identical prompts are the precondition for comparing plans.
 */
describe(buildAuthoringPrompt.name, () => {
  const library = Library.load()
  after(() => library.close())

  const ctx = {
    prepared: fixturePrepared(),
    baseline: fixtureBaseline(),
    worklist: fixtureWorklist(),
    library,
  }

  it('renders the sections in order and is deterministic', () => {
    const { prompt, truncated } = buildAuthoringPrompt(ctx, {
      sourceCharCap: 400_000,
    })
    const positions = Object.values(SECTION_HEADERS).map((header) =>
      prompt.indexOf(header),
    )
    expect(positions.every((position) => position >= 0)).toEqual(true)
    expect([...positions].sort((a, b) => a - b)).toEqual(positions)
    expect(truncated).toEqual(false)
    expect(
      buildAuthoringPrompt(ctx, { sourceCharCap: 400_000 }).prompt,
    ).toEqual(prompt)
  })

  it('states the rules the validator enforces, the schema and the worked example', () => {
    const { prompt } = buildAuthoringPrompt(ctx, { sourceCharCap: 400_000 })
    expect(prompt).toInclude('`user-activity`')
    expect(prompt).toInclude('`accessControl@1`')
    expect(prompt).toInclude('"additionalProperties": false')
    expect(prompt).toInclude('"contract": "ZkLink"')
    expect(prompt).toInclude('## set@1')
    expect(prompt).toInclude('exactly one JSON object')
  })

  it('lists every worklist item and event, the ABI and the identity facts', () => {
    const { prompt } = buildAuthoringPrompt(ctx, { sourceCharCap: 400_000 })
    for (const item of ctx.worklist.items) {
      expect(prompt).toInclude(`- \`${item.signature}\`: ${item.fragment}`)
    }
    for (const event of ctx.worklist.events) {
      expect(prompt).toInclude(`- ${event.fragment}`)
    }
    expect(prompt).toInclude(`- Address: ${SELF}`)
    expect(prompt).toInclude('- Block: 1000')
    expect(prompt).toInclude('- Proxy type: EIP1967 proxy')
    expect(prompt).toInclude(
      `- Proxy value $implementation: "${IMPLEMENTATION}"`,
    )
    expect(prompt).toInclude(
      `- Shape hash (\`shapeHash\`): 0x${'22'.repeat(32)}`,
    )
    expect(prompt).toInclude(
      'function committeeThresholds(uint8, uint256) view returns (uint256)',
    )
  })

  it('shows baseline values and errors, eliding long values with a marker', () => {
    const long = 'x'.repeat(BASELINE_VALUE_CAP + 50)
    const baseline = fixtureBaseline({
      description: {
        fragment: 'function description() view returns (string)',
        value: long,
      },
    })
    const { prompt } = buildAuthoringPrompt(
      { ...ctx, baseline },
      { sourceCharCap: 400_000 },
    )
    expect(prompt).toInclude('- `paused` = error: Execution reverted')
    expect(prompt).toInclude('- `validatorCount` = 2')
    expect(prompt).toInclude('- `getConfig` = {"admin":')
    expect(prompt).toInclude('[52 more characters elided]')
    expect(prompt).not.toInclude(long)
  })

  it('puts the proxy source first and truncates at the total budget with a marker', () => {
    const proxySource = 'contract TransparentUpgradeableProxy {}'
    const { prompt, truncated } = buildAuthoringPrompt(ctx, {
      sourceCharCap: proxySource.length + 20,
    })
    expect(truncated).toEqual(true)
    const proxyAt = prompt.indexOf('### TransparentUpgradeableProxy')
    const implementationAt = prompt.indexOf('### Fixture')
    expect(proxyAt).toBeGreaterThan(0)
    expect(implementationAt).toBeGreaterThan(proxyAt)
    expect(prompt).toInclude(proxySource)
    expect(prompt).toInclude(`${TRUNCATION_MARKER}: `)
    expect(prompt).toInclude('characters omitted')
    expect(prompt).not.toInclude('validators[validator] = active')
  })

  it('reports every later source as omitted once the budget is spent', () => {
    const { prompt } = buildAuthoringPrompt(ctx, { sourceCharCap: 5 })
    expect(prompt).toInclude('the source budget is exhausted')
    expect(prompt.split(TRUNCATION_MARKER).length - 1).toEqual(2)
  })
})
