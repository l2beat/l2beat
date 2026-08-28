import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect } from 'earl'
import type { DatasetEntry } from '../types.js'
import {
  buildJudgePrompt,
  type JudgeEngine,
  judgePr,
  parseVerdicts,
} from './Judge.js'

const FIXTURES_DIR = join(dirname(fileURLToPath(import.meta.url)), 'fixtures')

interface Fixture {
  description: string
  entry: Pick<DatasetEntry, 'pr' | 'title'> & {
    humanComments: { id: number; body: string; path?: string }[]
    codexFindings: { id: number; body: string; path?: string }[]
  }
  rawOutput: string
  expected: { findingId: number; humanCommentId: number; match: boolean }[]
}

function toEntry(fixture: Fixture): DatasetEntry {
  const comment = (c: { id: number; body: string; path?: string }) => ({
    ...c,
    author: 'x',
    url: '',
    createdAt: '',
  })
  return {
    ...fixture.entry,
    url: '',
    author: 'author',
    mergedAt: '',
    headSha: '',
    baseSha: '',
    mergeCommitSha: '',
    stratum: 'backend',
    changedFiles: [],
    linear: null,
    humanComments: fixture.entry.humanComments.map(comment),
    codexFindings: fixture.entry.codexFindings.map(comment),
  }
}

class FixtureEngine implements JudgeEngine {
  readonly name = 'fixture'
  constructor(private readonly text: string) {}
  run() {
    return Promise.resolve({ text: this.text, latencyMs: 0 })
  }
}

describe('judge golden fixtures', () => {
  for (const file of readdirSync(FIXTURES_DIR).filter((f) =>
    f.endsWith('.json'),
  )) {
    it(file, async () => {
      const fixture = JSON.parse(
        readFileSync(join(FIXTURES_DIR, file), 'utf8'),
      ) as Fixture
      const entry = toEntry(fixture)
      const result = await judgePr(new FixtureEngine(fixture.rawOutput), entry)
      expect(result.missingPairs).toEqual(0)
      const verdicts = result.verdicts
        .map(({ findingId, humanCommentId, match }) => ({
          findingId,
          humanCommentId,
          match,
        }))
        .sort(
          (a, b) =>
            a.findingId - b.findingId || a.humanCommentId - b.humanCommentId,
        )
      expect(verdicts).toEqual(fixture.expected)
    })
  }
})

describe(parseVerdicts.name, () => {
  const entry = toEntry({
    description: '',
    entry: {
      pr: 1,
      title: '',
      humanComments: [
        { id: 1, body: '' },
        { id: 2, body: '' },
      ],
      codexFindings: [{ id: 10, body: '' }],
    },
    rawOutput: '',
    expected: [],
  })

  it('counts omitted pairs and drops unknown ids', () => {
    const result = parseVerdicts(
      entry,
      JSON.stringify({
        verdicts: [
          { finding_id: 10, human_comment_id: 1, match: true, reason: '' },
          { finding_id: 99, human_comment_id: 1, match: true, reason: '' },
        ],
      }),
    )
    expect(result.verdicts.length).toEqual(1)
    expect(result.missingPairs).toEqual(1)
  })

  it('lets a match win over a duplicate no-match', () => {
    const result = parseVerdicts(
      entry,
      JSON.stringify({
        verdicts: [
          { finding_id: 10, human_comment_id: 1, match: false, reason: '' },
          { finding_id: 10, human_comment_id: 1, match: true, reason: '' },
          { finding_id: 10, human_comment_id: 2, match: true, reason: '' },
          { finding_id: 10, human_comment_id: 2, match: false, reason: '' },
        ],
      }),
    )
    expect(result.verdicts.map((v) => v.match)).toEqual([true, true])
  })

  it('rejects malformed output', () => {
    expect(() => parseVerdicts(entry, '{"verdicts":[{"match":1}]}')).toThrow()
  })
})

describe(buildJudgePrompt.name, () => {
  it('skips the model entirely when one side is empty', async () => {
    const empty = toEntry({
      description: '',
      entry: {
        pr: 1,
        title: '',
        humanComments: [],
        codexFindings: [{ id: 1, body: '' }],
      },
      rawOutput: '',
      expected: [],
    })
    let called = false
    const engine: JudgeEngine = {
      name: 'spy',
      run: () => {
        called = true
        return Promise.resolve({ text: '', latencyMs: 0 })
      },
    }
    await judgePr(engine, empty)
    expect(called).toEqual(false)
  })
})
