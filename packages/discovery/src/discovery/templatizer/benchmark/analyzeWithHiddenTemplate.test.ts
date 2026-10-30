import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { trailDirectory } from '../artifacts'
import {
  copyTemplatesHiding,
  readTrailSummary,
} from './analyzeWithHiddenTemplate'

describe(copyTemplatesHiding.name, () => {
  let root: string

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'templatizer-benchmark-hide-'))
    for (const file of [
      'source/scroll/ScrollChain/template.jsonc',
      'source/scroll/ScrollChain/shapes.json',
      'source/scroll/ScrollChain/criteria.json',
      'source/scroll/ScrollChain/Nested/template.jsonc',
      'source/scroll/Other/template.jsonc',
    ]) {
      mkdirSync(join(root, file, '..'), { recursive: true })
      writeFileSync(join(root, file), file)
    }
  })
  afterEach(() => rmSync(root, { recursive: true, force: true }))

  it("removes the hidden template's files and keeps its nested templates and every other one", () => {
    copyTemplatesHiding(
      join(root, 'source'),
      join(root, 'copy'),
      'scroll/ScrollChain',
    )

    expect(readdirSync(join(root, 'copy/scroll/ScrollChain'))).toEqual([
      'Nested',
    ])
    expect(
      readFileSync(
        join(root, 'copy/scroll/ScrollChain/Nested/template.jsonc'),
        'utf8',
      ),
    ).toEqual('source/scroll/ScrollChain/Nested/template.jsonc')
    expect(existsSync(join(root, 'copy/scroll/Other/template.jsonc'))).toEqual(
      true,
    )
    // The committed templates are never touched.
    expect(
      existsSync(join(root, 'source/scroll/ScrollChain/template.jsonc')),
    ).toEqual(true)
  })

  it('refuses a template that is not there, rather than benchmark with nothing hidden', () => {
    expect(() =>
      copyTemplatesHiding(join(root, 'source'), join(root, 'copy'), 'nope/X'),
    ).toThrow('Template nope/X does not exist')
  })
})

describe(readTrailSummary.name, () => {
  let root: string

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'templatizer-benchmark-trail-'))
  })
  afterEach(() => rmSync(root, { recursive: true, force: true }))

  it('sums tokens and model time over the rounds the loop recorded', () => {
    const address = ChainSpecificAddress(
      'eth:0x1111111111111111111111111111111111111111',
    )
    const directory = trailDirectory(root, 'scroll', address)
    mkdirSync(directory, { recursive: true })
    writeFileSync(
      join(directory, 'summary.json'),
      JSON.stringify({
        address,
        status: 'failed',
        failure: 'no acceptable draft after 2 round(s)',
        model: 'gpt-test',
        rounds: [
          {
            index: 1,
            durationMs: 1000,
            findings: [],
            usage: {
              inputTokens: 100,
              cachedInputTokens: 10,
              outputTokens: 20,
              reasoningOutputTokens: 5,
            },
          },
          {
            index: 2,
            durationMs: 500,
            refused: 'usage limit reached',
            findings: [],
          },
        ],
      }),
    )

    expect(directory).toEqual(join(root, 'scroll', address))
    expect(readTrailSummary(directory)).toEqual({
      status: 'failed',
      failure: 'no acceptable draft after 2 round(s)',
      model: 'gpt-test',
      rounds: 2,
      tokens: { input: 100, cached: 10, output: 20, reasoning: 5 },
      modelMs: 1500,
      lastRefusal: 'usage limit reached',
    })
  })

  it('reports nothing when the templatizer made no model call', () => {
    expect(readTrailSummary(join(root, 'missing'))).toEqual(undefined)
  })
})
