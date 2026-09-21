import { expect } from 'earl'
import {
  DEFAULT_RECIPE_TIMEOUT_MS,
  Library,
  RecipeArgsError,
  RecipeExecutionError,
  type RecipeId,
} from './Library'

const EXPECTED_RECIPES: RecipeId[] = [
  'accessControl@1',
  'array@1',
  'count@1',
  'format.seconds@1',
  'format.undecimal@1',
  'latest@1',
  'list@1',
  'map@1',
  'set@1',
]

/**
 * Exercises the real recipes directory: the library's job is to make what is
 * on disk usable, so a mocked file system would test nothing of value.
 */
describe(Library.name, () => {
  const library = Library.load()
  after(() => library.close())

  it('loads every recipe the README promises, sorted by id', () => {
    expect(library.list().map((r) => r.id)).toEqual(EXPECTED_RECIPES)
  })

  it('rejects an unknown recipe id and lists the known ones to choose from', () => {
    expect(() => library.get('sets@1')).toThrow(
      `Unknown recipe "sets@1". Known recipes: ${EXPECTED_RECIPES.join(', ')}`,
    )
  })

  it('reports argument findings with paths so the model can repair the plan', () => {
    const recipe = library.get('set@1')
    expect(library.validateArgs(recipe, { key: 'a', add: [] })).toEqual([
      '$.add: expected at least 1 item(s), got 0',
    ])
    expect(
      library.validateArgs(recipe, {
        key: 'a',
        add: [{ event: 'E', when: { arg: 'x' } }],
        extra: 1,
      }),
    ).toEqual([
      '$.add[0].when: missing required property "equals"',
      '$.extra: unexpected property (allowed: "key", "add", "remove")',
    ])
    expect(library.validateArgs(recipe, {})).toEqual([
      '$: missing required property "key"',
      '$: missing required property "add"',
    ])
  })

  it('treats omitted arguments as {} for recipes that take none', () => {
    expect(library.validateArgs(library.get('array@1'), undefined)).toEqual([])
    expect(library.validateArgs(library.get('array@1'), { x: 1 })).toEqual([
      '$.x: unexpected property (allowed: )',
    ])
  })

  it('refuses to run a recipe with invalid arguments before touching jq', async () => {
    await expect(
      library.apply(library.get('count@1'), [], { events: 'Upgraded' }),
    ).toBeRejectedWith(
      RecipeArgsError,
      'count@1 arguments are invalid: $.events: expected array, got "Upgraded"',
    )
  })

  it('wraps recipe failures with the recipe id and keeps the cause', async () => {
    const error = await library
      .apply(library.get('format.seconds@1'), 'soon')
      .then(
        () => undefined,
        (e: unknown) => e,
      )
    expect(error).toBeA(RecipeExecutionError)
    expect((error as Error).message).toInclude('format.seconds@1: jq: error')
    expect((error as Error).cause).toBeA(Error)
  })

  it('applies a recipe with a default timeout of five seconds', async () => {
    expect(DEFAULT_RECIPE_TIMEOUT_MS).toEqual(5000)
    const result = await library.apply(
      library.get('map@1'),
      [{ key: [1, 0], value: 2 }],
      {},
    )
    expect(result).toEqual({ '1,0': 2 })
  })

  it('renders prompt documentation from the manifests for every recipe', () => {
    const docs = library.renderDocs()
    for (const id of EXPECTED_RECIPES) {
      expect(docs).toInclude(`## ${id}\n`)
    }
    // Nested argument structure is rendered so the model sees the rule shape.
    expect(docs).toInclude('- `add` (array of object, at least 1, required)')
    expect(docs).toInclude('  - `when` (object)')
    expect(docs).toInclude('    - `negate` (boolean)')
    expect(docs).toInclude('- `equals` (any JSON value, required)')
    // Map-like arguments explain their keys.
    expect(docs).toInclude(
      '- `<key>` (string): any number of entries; keys match',
    )
    // Recipes without arguments say so instead of rendering an empty list.
    expect(docs).toInclude('**Arguments:** none')
    // Every recipe names the V1 handler it replaces.
    expect(docs).toInclude('Replaces V1: accessControl')
  })
})
