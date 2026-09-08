// Semantic tests: for each fixture with an expected/<Fixture>/ folder, run the pipeline and compare
// the answer relations with rows a person has checked against the source. Parity (parity.ts) proves
// the rules reproduce the old extractor; this proves they say the right thing about the code.
//
//   tsx src/semantic.ts             # run all fixtures, exit 1 on any difference
//   tsx src/semantic.ts --update    # rewrite expected/ from the current output (then review the diff!)
//
// expected/<Fixture>/<relation>.tsv holds the rows of derived/<relation>.csv, sorted. Comment lines
// (#) are ignored, so a file can say which case each row belongs to.

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import { basename, join, resolve } from 'path'
import { runPipeline } from './pipeline'

const ROOT = resolve(__dirname, '..')
/** The relations under test: what the report, qf and the agent read. */
const RELATIONS = ['storageWriters', 'findings', 'opaqueWrites', 'unhandled']

function readRows(path: string): string[] {
  if (!existsSync(path)) return []
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .sort()
}

async function main(): Promise<void> {
  const update = process.argv.includes('--update')
  const contractsDir = join(ROOT, 'contracts')
  let failed = 0
  for (const file of readdirSync(contractsDir)
    .filter((f) => f.endsWith('.sol'))
    .sort()) {
    const name = basename(file, '.sol')
    const expectedDir = join(ROOT, 'expected', name)
    if (!existsSync(expectedDir) && !update) {
      console.log(`  ? ${name}: no expected/ folder, skipped`)
      continue
    }
    const outDir = join(ROOT, 'out', 'semantic', name)
    await runPipeline({
      unit: file,
      source: readFileSync(join(contractsDir, file), 'utf8'),
      outDir,
      rulesDir: join(ROOT, 'rules'),
      cacheDir: join(ROOT, '.cache'),
    })
    if (update) {
      mkdirSync(expectedDir, { recursive: true })
      for (const relation of RELATIONS) {
        const rows = readRows(join(outDir, 'derived', `${relation}.csv`))
        writeFileSync(
          join(expectedDir, `${relation}.tsv`),
          `# ${relation}: reviewed rows for ${file}; regenerate with 'pnpm semantic --update', then check the diff\n${rows.join('\n')}${rows.length > 0 ? '\n' : ''}`,
        )
      }
      console.log(`  ~ ${name}: expected/ rewritten, review it`)
      continue
    }
    const problems: string[] = []
    let total = 0
    for (const relation of RELATIONS) {
      const expected = readRows(join(expectedDir, `${relation}.tsv`))
      const actual = readRows(join(outDir, 'derived', `${relation}.csv`))
      total += expected.length
      const want = new Set(expected)
      const got = new Set(actual)
      for (const row of expected)
        if (!got.has(row))
          problems.push(`    - ${relation}: ${row.replace(/\t/g, ' ⇥ ')}`)
      for (const row of actual)
        if (!want.has(row))
          problems.push(`    + ${relation}: ${row.replace(/\t/g, ' ⇥ ')}`)
    }
    if (problems.length === 0) {
      console.log(`ok   ${name}: ${total} expected rows match`)
    } else {
      failed++
      console.log(`FAIL ${name}: ${problems.length} difference(s)`)
      for (const p of problems) console.log(p)
    }
  }
  process.exitCode = failed > 0 ? 1 : 0
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : e)
  process.exitCode = 1
})
