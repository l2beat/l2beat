import {
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { basename, join, relative } from 'node:path'
import { type Finding, transformTestFile } from './transformTestFile.js'

export interface MigrationOptions {
  packageDir: string
  dryRun: boolean
  /** Rewrite the test files but leave package.json, tsconfig and configs alone. */
  filesOnly: boolean
}

export interface FileReport {
  path: string
  blockers: Finding[]
  reviews: Finding[]
}

export interface MigrationReport {
  rewritten: FileReport[]
  unchanged: number
  /** Things the codemod did to the package itself, printed so they can be
   * reviewed alongside the test diff. */
  packageChanges: string[]
  manualSteps: string[]
}

const TEST_UTILS = '@l2beat/test-utils'
const VITEST_CONFIG = '@l2beat/vitest-config'
// Globs the shared preset already covers; overriding them would only duplicate
// entries because the preset merges arrays by concatenation.
const PRESET_INCLUDES = ['src/**/*.test.ts', 'scripts/**/*.test.ts']
const DEFAULT_TEST_GLOB = '{src,test}/**/*.test.ts'
const SKIPPED_DIRECTORIES = new Set([
  'node_modules',
  'build',
  'dist',
  '.next',
  '.turbo',
])

export function migratePackage(options: MigrationOptions): MigrationReport {
  const report: MigrationReport = {
    rewritten: [],
    unchanged: 0,
    packageChanges: [],
    manualSteps: [],
  }
  let usesTestUtils = false

  for (const path of findEarlFiles(options.packageDir)) {
    const before = readFileSync(path, 'utf8')
    const result = transformTestFile(path, before)
    usesTestUtils ||= result.usesTestUtils
    if (result.text === before) {
      report.unchanged += 1
      continue
    }
    if (!options.dryRun) {
      writeFileSync(path, result.text)
    }
    report.rewritten.push({
      path: relative(options.packageDir, path),
      blockers: result.blockers,
      reviews: result.reviews,
    })
  }

  if (!options.filesOnly) {
    convertPackageConfig(options, usesTestUtils, report)
  }
  return report
}

function convertPackageConfig(
  options: MigrationOptions,
  usesTestUtils: boolean,
  report: MigrationReport,
): void {
  const { packageDir, dryRun } = options
  const loaded = loadedMochaConfig(packageDir)
  const mocha = readMochaConfig(packageDir, loaded)
  const includes = (
    mocha.specs.length > 0 ? mocha.specs : [DEFAULT_TEST_GLOB]
  ).filter((glob) => !coveredByPreset(glob))

  for (const name of readdirSync(packageDir)) {
    if (!name.startsWith('.mocharc')) {
      continue
    }
    report.packageChanges.push(`removed ${name}`)
    if (name !== loaded) {
      report.manualSteps.push(
        `${name} was only reachable through \`mocha --config\`, so point the script that named it at vitest`,
      )
    }
    if (!dryRun) {
      rmSync(join(packageDir, name))
    }
  }

  write(
    join(packageDir, 'vitest.config.ts'),
    vitestConfig(
      includes,
      [...(usesTestUtils ? [`${TEST_UTILS}/setup`] : []), ...mocha.setupFiles],
      readPathAliases(packageDir),
    ),
    options,
    report,
  )

  editJson(join(packageDir, 'package.json'), options, report, (manifest) => {
    manifest.scripts = { ...manifest.scripts, test: 'vitest run' }
    manifest.scripts = rewriteScripts(manifest.scripts, report)
    if (manifest.dependencies) {
      manifest.dependencies = withoutMochaAndEarl(manifest.dependencies)
    }
    manifest.devDependencies = withoutMochaAndEarl({
      ...manifest.devDependencies,
      [VITEST_CONFIG]: 'workspace:*',
      ...(usesTestUtils ? { [TEST_UTILS]: 'workspace:*' } : {}),
    })
  })

  // Every tsconfig.build.json overrides `exclude`, so the new config file has
  // to be named in both places or the package build tries to compile it.
  for (const name of ['tsconfig.json', 'tsconfig.build.json']) {
    editJson(join(packageDir, name), options, report, (config) => {
      const exclude: string[] = config.exclude ?? []
      if (!exclude.includes('vitest.config.ts')) {
        config.exclude = [...exclude, 'vitest.config.ts']
      }
      if (name === 'tsconfig.json') {
        declareGlobals(config, usesTestUtils, report)
      }
    })
  }

  report.manualSteps.push(
    'run `pnpm install`, then `pnpm lint:fix && pnpm format:fix`',
  )
}

/**
 * The shared base config declares mocha's globals, which would keep
 * `before`/`after` typechecking after mocha itself is gone. `@l2beat/test-utils`
 * goes on the list so that its `declare module 'vitest'` augmentation is loaded
 * even in files that only use a custom matcher and import nothing from it.
 */
function declareGlobals(
  // biome-ignore lint/suspicious/noExplicitAny: a config file is arbitrary JSON
  config: any,
  usesTestUtils: boolean,
  report: MigrationReport,
): void {
  // Writing a `types` list where there was none narrows the package to exactly
  // that list, dropping every `@types/*` it used to pick up automatically, so
  // a package without one is left alone and flagged instead.
  const types: string[] | undefined = config.compilerOptions?.types
  if (types === undefined) {
    if (usesTestUtils) {
      report.manualSteps.push(
        `tsconfig.json declares no "types", so ${TEST_UTILS}'s matcher types are not loaded - add the list by hand`,
      )
    }
    return
  }
  const kept = types.filter(
    (type: string) => type !== 'mocha' && type !== TEST_UTILS,
  )
  config.compilerOptions = {
    ...config.compilerOptions,
    types: usesTestUtils ? [...kept, TEST_UTILS] : kept,
  }
}

function vitestConfig(
  includes: string[],
  setupFiles: string[],
  aliases: Alias[],
): string {
  const testOverrides = [
    ...(includes.length > 0 ? [list('include', includes)] : []),
    ...(setupFiles.length > 0 ? [list('setupFiles', setupFiles)] : []),
  ]
  const sections = [
    ...(aliases.length > 0 ? [aliasSection(aliases)] : []),
    ...(testOverrides.length > 0
      ? [`  test: {\n${testOverrides.map((it) => `    ${it},\n`).join('')}  },`]
      : []),
  ]
  const argument = sections.length === 0 ? '' : `{\n${sections.join('\n')}\n}`
  const imports = [
    ...(aliases.length > 0 ? ["import { fileURLToPath } from 'node:url'"] : []),
    `import { defineVitestConfig } from '${VITEST_CONFIG}'`,
  ]
  return `${imports.join('\n')}

// biome-ignore lint/style/noDefaultExport: Vitest config uses a default export.
export default defineVitestConfig(${argument})
`
}

function aliasSection(aliases: Alias[]): string {
  const entries = aliases
    .map(
      ({ prefix, target }) =>
        `      '${prefix}': fileURLToPath(new URL('${target}', import.meta.url)),\n`,
    )
    .join('')
  return `  // Vitest does not read tsconfig \`paths\`, so they are restated here.
  resolve: {
    alias: {
${entries}    },
  },`
}

function list(key: string, values: string[]): string {
  return `${key}: [${values.map((it) => `'${it}'`).join(', ')}]`
}

interface Alias {
  prefix: string
  target: string
}

/**
 * Only the wildcard mappings become aliases. An exact one such as
 * `"react": ["./node_modules/@types/react"]` redirects a type declaration, and
 * turning it into a module alias would point the runtime import at a `.d.ts`.
 */
function readPathAliases(packageDir: string): Alias[] {
  const config = readJson(join(packageDir, 'tsconfig.json'))
  const paths: Record<string, string[]> = config?.compilerOptions?.paths ?? {}
  const aliases: Alias[] = []
  for (const [pattern, targets] of Object.entries(paths)) {
    const target = targets[0]
    if (!pattern.endsWith('/*') || !target?.endsWith('/*')) {
      continue
    }
    aliases.push({
      prefix: pattern.slice(0, -2),
      target: target.slice(0, -2),
    })
  }
  return aliases
}

// biome-ignore lint/suspicious/noExplicitAny: a config file is arbitrary JSON
function readJson(path: string): any {
  if (!existsSync(path)) {
    return undefined
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return undefined
  }
}

interface MochaConfig {
  specs: string[]
  /** Mocha's `file`, which runs before the suites - vitest's `setupFiles`. */
  setupFiles: string[]
}

function readMochaConfig(
  packageDir: string,
  name: string | undefined,
): MochaConfig {
  if (!name) {
    return { specs: [], setupFiles: [] }
  }
  const text = readFileSync(join(packageDir, name), 'utf8')
  return {
    specs: readStringList(text, 'spec'),
    setupFiles: readStringList(text, 'file').map(asRelativePath),
  }
}

/** A `.mocharc` is JSON or CommonJS and writes every key as either one string
 * or an array of them, so both shapes are read as a list. */
function readStringList(text: string, key: string): string[] {
  const pattern = new RegExp(
    `(?<![\\w$])['"]?${key}['"]?\\s*:\\s*(\\[[^\\]]*\\]|['"][^'"]*['"])`,
  )
  const value = pattern.exec(text)?.[1]
  if (!value) {
    return []
  }
  return [...value.matchAll(/['"]([^'"]+)['"]/g)].map((match) => match[1] ?? '')
}

/** Mocha resolves a `file` against the working directory; vitest resolves a
 * bare specifier as a package, so the path has to say it is a path. */
function asRelativePath(path: string): string {
  return path.startsWith('.') ? path : `./${path}`
}

/** Whole commands that have an unambiguous vitest spelling. Anything else is
 * reported rather than guessed at, because mocha's flags do not carry over. */
const MOCHA_COMMANDS: Record<string, string> = {
  mocha: 'vitest run',
  'mocha --watch': 'vitest watch',
}

export function rewriteScripts(
  scripts: Record<string, string> | undefined,
  report: MigrationReport,
): Record<string, string> {
  const rewritten: Record<string, string> = { ...scripts, test: 'vitest run' }
  for (const [name, command] of Object.entries(rewritten)) {
    if (!/\bmocha\b/.test(command)) {
      continue
    }
    const mapped = MOCHA_COMMANDS[command.trim()]
    if (mapped) {
      rewritten[name] = mapped
    } else {
      report.manualSteps.push(
        `the "${name}" script still runs mocha, port it by hand: ${command}`,
      )
    }
  }
  return rewritten
}

/**
 * The config mocha picks up on its own is the one that says how `pnpm test`
 * ran. A variant such as `.mocharc-smoke.json` is reachable only through
 * `mocha --config`, and taking its spec - alphabetically it even comes first -
 * would cut the package's test globs down to whatever that one script ran.
 */
function loadedMochaConfig(packageDir: string): string | undefined {
  return readdirSync(packageDir).find((it) => it.startsWith('.mocharc.'))
}

/**
 * A mocharc spec like `{src,scripts}/**\/*.test.ts` names exactly what the
 * preset already includes. Repeating it would only add a third pattern that
 * matches the same files, because the preset merges arrays by concatenation.
 */
function coveredByPreset(testGlob: string): boolean {
  return expandBraces(testGlob).every((it) => PRESET_INCLUDES.includes(it))
}

function expandBraces(glob: string): string[] {
  const match = /^(.*)\{([^{}]*)\}(.*)$/.exec(glob)
  if (!match) {
    return [glob]
  }
  const [, prefix = '', alternatives = '', suffix = ''] = match
  return alternatives
    .split(',')
    .flatMap((it) => expandBraces(`${prefix}${it}${suffix}`))
}

function withoutMochaAndEarl(
  dependencies: Record<string, string>,
): Record<string, string> {
  const kept = Object.entries(dependencies).filter(
    ([name]) => name !== 'mocha' && name !== 'earl' && name !== '@types/mocha',
  )
  return Object.fromEntries(kept)
}

function editJson(
  path: string,
  options: MigrationOptions,
  report: MigrationReport,
  // biome-ignore lint/suspicious/noExplicitAny: a config file is arbitrary JSON
  edit: (value: any) => void,
): void {
  if (!existsSync(path)) {
    return
  }
  // biome-ignore lint/suspicious/noExplicitAny: a config file is arbitrary JSON
  let parsed: any
  const before = readFileSync(path, 'utf8')
  try {
    parsed = JSON.parse(before)
  } catch {
    report.manualSteps.push(
      `${basename(path)} is not plain JSON, update it by hand`,
    )
    return
  }
  edit(parsed)
  write(path, `${JSON.stringify(parsed, null, 2)}\n`, options, report, before)
}

function write(
  path: string,
  content: string,
  options: MigrationOptions,
  report: MigrationReport,
  before?: string,
): void {
  if (before === content) {
    return
  }
  report.packageChanges.push(`wrote ${relative(options.packageDir, path)}`)
  if (!options.dryRun) {
    writeFileSync(path, content)
  }
}

/** Test helpers live outside `*.test.ts` but import earl just the same. */
function findEarlFiles(directory: string): string[] {
  const found: string[] = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      if (!SKIPPED_DIRECTORIES.has(entry.name)) {
        found.push(...findEarlFiles(path))
      }
      continue
    }
    if (!entry.name.endsWith('.ts') && !entry.name.endsWith('.tsx')) {
      continue
    }
    if (entry.name.endsWith('.test.ts') || hasEarlImport(path)) {
      found.push(path)
    }
  }
  return found.sort()
}

function hasEarlImport(path: string): boolean {
  return readFileSync(path, 'utf8').includes("from 'earl'")
}
