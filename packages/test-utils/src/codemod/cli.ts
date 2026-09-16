import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import type { FileReport, MigrationReport } from './migratePackage.js'
import { migratePackage } from './migratePackage.js'

const USAGE = `Usage: pnpm tsx scripts/migrate-to-vitest.ts <package-dir> [--dry-run] [--files-only]

Rewrites a package's earl + mocha tests to vitest and points it at the shared
helpers in @l2beat/test-utils. Anything it could not rewrite is printed with a
file, a line and a snippet, and makes the command exit non-zero.`

export function runCli(argv: string[]): number {
  const target = argv.find((arg) => !arg.startsWith('--'))
  if (!target) {
    console.log(USAGE)
    return 1
  }
  const packageDir = resolve(target)
  if (!existsSync(packageDir) || !statSync(packageDir).isDirectory()) {
    console.error(`${packageDir} is not a directory`)
    return 1
  }

  const report = migratePackage({
    packageDir,
    dryRun: argv.includes('--dry-run'),
    filesOnly: argv.includes('--files-only'),
  })
  print(report)
  return report.rewritten.some((file) => file.blockers.length > 0) ? 1 : 0
}

function print(report: MigrationReport): void {
  console.log(
    `rewrote ${report.rewritten.length} file(s), left ${report.unchanged} unchanged`,
  )
  for (const change of report.packageChanges) {
    console.log(`  ${change}`)
  }

  printFindings('Needs a human', report, (file) => file.blockers)
  printFindings('Worth reviewing', report, (file) => file.reviews)

  for (const step of report.manualSteps) {
    console.log(`\nNext: ${step}`)
  }
}

function printFindings(
  title: string,
  report: MigrationReport,
  select: (file: FileReport) => FileReport['blockers'],
): void {
  const total = report.rewritten.reduce(
    (sum, file) => sum + select(file).length,
    0,
  )
  if (total === 0) {
    return
  }
  console.log(`\n${title} (${total}):`)
  for (const file of report.rewritten) {
    for (const finding of select(file)) {
      console.log(
        `  ${file.path}:${finding.line}:${finding.column}  ${finding.note}`,
      )
      console.log(`    ${finding.snippet}`)
    }
  }
}
