/**
 * The recipe library: every shaping the model may reference, loaded from disk.
 *
 * A plan pins its output shape by naming a recipe and filling its arguments;
 * the library is the only place a shape is defined. It reads each recipe's
 * manifest and jq once, validates arguments against the manifest's schema
 * before running, and renders the prompt documentation from the same
 * manifests so the model can never be told something the validator disagrees
 * with.
 */

import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import fs from 'fs'
import path from 'path'
import { JqRunner } from '../jq/JqRunner'
import { parseSchema, type Schema, validateSchema } from './validateSchema'

export type RecipeId = `${string}@${number}`

export interface Recipe {
  /** `name@version`, the token a plan uses in `use`. */
  id: RecipeId
  name: string
  version: number
  description: string
  input: string
  args: Schema
  output: string
  replaces: string
  /** The jq program; receives `{ input, args }` and must produce one value. */
  filter: string
  directory: string
}

export interface ApplyOptions {
  timeoutMs?: number
}

/** Long enough for any realistic log replay, short enough to notice a runaway filter. */
export const DEFAULT_RECIPE_TIMEOUT_MS = 5_000

const RecipeManifest = v.strictObject({
  name: v
    .string()
    .check(
      (name) => /^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)*$/.test(name),
      'must be dotted lowerCamelCase, e.g. `set` or `format.seconds`',
    ),
  version: v
    .number()
    .check(
      (version) => Number.isInteger(version) && version >= 1,
      'must be a positive integer',
    ),
  description: v.string(),
  input: v.string(),
  args: v.unknown(),
  output: v.string(),
  replaces: v.string(),
})

export class RecipeArgsError extends Error {
  constructor(
    readonly recipe: RecipeId,
    readonly findings: readonly string[],
  ) {
    super(`${recipe} arguments are invalid: ${findings.join('; ')}`)
    this.name = 'RecipeArgsError'
  }
}

export class RecipeExecutionError extends Error {
  constructor(
    readonly recipe: RecipeId,
    cause: Error,
  ) {
    super(`${recipe}: ${cause.message}`, { cause })
    this.name = 'RecipeExecutionError'
  }
}

export class Library {
  private readonly recipes: ReadonlyMap<RecipeId, Recipe>

  constructor(
    recipes: readonly Recipe[],
    private readonly runner: JqRunner = new JqRunner(),
  ) {
    this.recipes = new Map(recipes.map((recipe) => [recipe.id, recipe]))
  }

  static load(recipesDir: string = defaultRecipesDir()): Library {
    return new Library(loadRecipes(recipesDir))
  }

  get(id: RecipeId): Recipe {
    const recipe = this.recipes.get(id)
    if (recipe === undefined) {
      throw new Error(
        `Unknown recipe "${id}". Known recipes: ${this.list()
          .map((r) => r.id)
          .join(', ')}`,
      )
    }
    return recipe
  }

  list(): Recipe[] {
    return [...this.recipes.values()].sort((a, b) => a.id.localeCompare(b.id))
  }

  /**
   * Findings against the recipe's argument schema, empty when valid. Omitted
   * arguments count as `{}` so recipes without arguments need no `args`.
   */
  validateArgs(recipe: Recipe, args: unknown): string[] {
    return validateSchema(recipe.args, args ?? {}, '$')
  }

  async apply(
    recipe: Recipe,
    input: unknown,
    args: unknown = {},
    options: ApplyOptions = {},
  ): Promise<unknown> {
    const findings = this.validateArgs(recipe, args)
    if (findings.length > 0) {
      throw new RecipeArgsError(recipe.id, findings)
    }
    try {
      return await this.runner.run(
        recipe.filter,
        { input, args: args ?? {} },
        { timeoutMs: options.timeoutMs ?? DEFAULT_RECIPE_TIMEOUT_MS },
      )
    } catch (error) {
      throw new RecipeExecutionError(recipe.id, toError(error))
    }
  }

  /** Markdown for the authoring prompt, derived from the manifests only. */
  renderDocs(): string {
    return this.list().map(renderRecipeDocs).join('\n')
  }

  async close(): Promise<void> {
    await this.runner.close()
  }
}

export function defaultRecipesDir(): string {
  return path.join(__dirname, 'recipes')
}

function loadRecipes(recipesDir: string): Recipe[] {
  assert(
    fs.existsSync(recipesDir),
    `Recipes directory does not exist: ${recipesDir}`,
  )
  return fs
    .readdirSync(recipesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => loadRecipe(path.join(recipesDir, entry.name)))
}

function loadRecipe(directory: string): Recipe {
  const manifestPath = path.join(directory, 'recipe.json')
  const manifest = RecipeManifest.parse(readJson(manifestPath))
  const folder = path.basename(directory)
  assert(
    manifest.name === folder,
    `${manifestPath}: name "${manifest.name}" must equal its folder "${folder}"`,
  )
  const args = parseSchema(manifest.args, `${manifestPath} args`)
  assert(
    args.type === 'object',
    `${manifestPath}: args schema must have type "object" so plans pass named arguments`,
  )
  return {
    ...manifest,
    id: `${manifest.name}@${manifest.version}`,
    args,
    filter: fs.readFileSync(path.join(directory, 'recipe.jq'), 'utf8'),
    directory,
  }
}

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function renderRecipeDocs(recipe: Recipe): string {
  const properties = Object.entries(recipe.args.properties ?? {})
  const args =
    properties.length === 0
      ? '**Arguments:** none'
      : [
          '**Arguments:**',
          ...properties.map(([name, schema]) =>
            renderProperty(name, schema, recipe.args.required ?? [], 0),
          ),
        ].join('\n')
  return [
    `## ${recipe.id}`,
    '',
    recipe.description,
    '',
    `Replaces V1: ${recipe.replaces}`,
    '',
    `**Input:** ${recipe.input}`,
    '',
    args,
    '',
    `**Output:** ${recipe.output}`,
    '',
  ].join('\n')
}

function renderProperty(
  name: string,
  schema: Schema,
  required: readonly string[],
  depth: number,
): string {
  const indent = '  '.repeat(depth)
  const flags = required.includes(name) ? ', required' : ''
  const description = schema.description ? `: ${schema.description}` : ''
  const line = `${indent}- \`${name}\` (${describeType(schema)}${flags})${description}`
  return [line, ...renderChildren(schema, depth + 1)].join('\n')
}

/** Nested properties of an object, or of an array's object items, one level down. */
function renderChildren(schema: Schema, depth: number): string[] {
  const object = schema.items ?? schema
  const properties = Object.entries(object.properties ?? {})
  const children = properties.map(([name, child]) =>
    renderProperty(name, child, object.required ?? [], depth),
  )
  if (typeof object.additionalProperties === 'object') {
    children.push(
      renderProperty(
        '<key>',
        {
          ...object.additionalProperties,
          description: describeKeyedValue(object),
        },
        [],
        depth,
      ),
    )
  }
  return children
}

function describeKeyedValue(schema: Schema): string {
  const pattern = schema.propertyNames?.pattern
  const value = describeType(schema.additionalProperties as Schema)
  return pattern
    ? `any number of entries; keys match ${pattern}, values are ${value}`
    : `any number of entries with ${value} values`
}

function describeType(schema: Schema): string {
  if ('const' in schema) return `always ${JSON.stringify(schema.const)}`
  if (schema.enum)
    return `one of ${schema.enum.map((e) => JSON.stringify(e)).join(', ')}`
  if (schema.oneOf) return schema.oneOf.map(describeType).join(' | ')
  if (schema.anyOf) return schema.anyOf.map(describeType).join(' | ')
  if (schema.type === undefined) return 'any JSON value'
  const type = Array.isArray(schema.type)
    ? schema.type.join(' | ')
    : schema.type
  if (type === 'array') {
    const items = schema.items ? describeType(schema.items) : 'any JSON value'
    const min = schema.minItems ? `, at least ${schema.minItems}` : ''
    return `array of ${items}${min}`
  }
  return type
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error))
}
