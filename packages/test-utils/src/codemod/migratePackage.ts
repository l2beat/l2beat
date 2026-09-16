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
  const testGlob = readMochaSpec(packageDir) ?? DEFAULT_TEST_GLOB

  for (const name of readdirSync(packageDir)) {
    if (name.startsWith('.mocharc')) {
      report.packageChanges.push(`removed ${name}`)
      if (!dryRun) {
        rmSync(join(packageDir, name))
      }
    }
  }

  write(
    join(packageDir, 'vitest.config.ts'),
    vitestConfig(testGlob, usesTestUtils),
    options,
    report,
  )

  editJson(join(packageDir, 'package.json'), options, report, (manifest) => {
    manifest.scripts = { ...manifest.scripts, test: 'vitest run' }
    manifest.devDependencies = withoutMochaAndEarl({
      ...manifest.devDependencies,
      vitest: '^5.0.0',
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
        declareGlobals(config, usesTestUtils)
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
// biome-ignore lint/suspicious/noExplicitAny: a config file is arbitrary JSON
function declareGlobals(config: any, usesTestUtils: boolean): void {
  const types: string[] = config.compilerOptions?.types ?? ['node']
  const kept = types.filter(
    (type: string) => type !== 'mocha' && type !== TEST_UTILS,
  )
  config.compilerOptions = {
    ...config.compilerOptions,
    types: usesTestUtils ? [...kept, TEST_UTILS] : kept,
  }
}

function vitestConfig(testGlob: string, usesTestUtils: boolean): string {
  const setup = usesTestUtils
    ? "\n    setupFiles: ['@l2beat/test-utils/setup'],"
    : ''
  return `import { defineConfig } from 'vitest/config'

// biome-ignore lint/style/noDefaultExport: Vitest config uses a default export.
export default defineConfig({
  test: {
    include: ['${testGlob}'],${setup}
    env: { NODE_ENV: 'test' },
  },
})
`
}

function readMochaSpec(packageDir: string): string | undefined {
  const name = readdirSync(packageDir).find((it) => it.startsWith('.mocharc'))
  if (!name) {
    return undefined
  }
  const spec = /['"]?spec['"]?\s*:\s*['"]([^'"]+)['"]/.exec(
    readFileSync(join(packageDir, name), 'utf8'),
  )
  return spec?.[1]
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
