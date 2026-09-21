import { v } from '@l2beat/validate'
import { expect } from 'earl'
import fs from 'fs'
import path from 'path'
import { Library, type Recipe } from './Library'

/**
 * A recipe is defined by its fixtures: each `tests/*.json` says what a fetch
 * result plus plan arguments must produce, and why that behaviour matters.
 * Fixtures are discovered rather than listed so adding one is enough to pin
 * new behaviour, and every recipe must have at least one so none ships
 * untested.
 */
const Case = v.object({
  input: v.unknown(),
  args: v.unknown().optional(),
  expected: v.unknown().optional(),
  expectedError: v.string().optional(),
})

const Fixture = v.object({
  description: v.string(),
  args: v.unknown().optional(),
  input: v.unknown().optional(),
  expected: v.unknown().optional(),
  expectedError: v.string().optional(),
  cases: v.array(Case).optional(),
})
type Fixture = v.infer<typeof Fixture>
type Case = v.infer<typeof Case>

describe('recipes', () => {
  const library = Library.load()
  after(() => library.close())

  for (const recipe of library.list()) {
    describe(recipe.id, () => {
      const fixtures = loadFixtures(recipe)

      it('has at least one fixture', () => {
        expect(fixtures.length).toBeGreaterThan(0)
      })

      for (const { file, fixture } of fixtures) {
        for (const [i, testCase] of casesOf(fixture).entries()) {
          const suffix = fixture.cases ? ` [${i + 1}]` : ''
          it(`${fixture.description}${suffix} (${file})`, async () => {
            await check(library, recipe, testCase)
          })
        }
      }
    })
  }
})

async function check(library: Library, recipe: Recipe, testCase: Case) {
  const run = library.apply(recipe, testCase.input, testCase.args)
  if (testCase.expectedError !== undefined) {
    await expect(run).toBeRejectedWith(testCase.expectedError)
    return
  }
  expect(await run).toEqual(testCase.expected)
}

/** A fixture is either one case or a table of cases sharing description and args. */
function casesOf(fixture: Fixture): Case[] {
  if (fixture.cases === undefined) {
    return [fixture]
  }
  return fixture.cases.map((c) => ({
    ...c,
    args: c.args ?? fixture.args,
  }))
}

function loadFixtures(recipe: Recipe): { file: string; fixture: Fixture }[] {
  const dir = path.join(recipe.directory, 'tests')
  if (!fs.existsSync(dir)) {
    return []
  }
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .sort()
    .map((file) => ({
      file,
      fixture: parseFixture(path.join(dir, file)),
    }))
}

function parseFixture(file: string): Fixture {
  const fixture = Fixture.parse(JSON.parse(fs.readFileSync(file, 'utf8')))
  const hasSingle = 'input' in fixture
  const hasTable = fixture.cases !== undefined
  if (hasSingle === hasTable) {
    throw new Error(`${file}: a fixture has either input/expected or cases`)
  }
  for (const c of casesOf(fixture)) {
    if ('expected' in c === (c.expectedError !== undefined)) {
      throw new Error(`${file}: each case has either expected or expectedError`)
    }
  }
  return fixture
}
