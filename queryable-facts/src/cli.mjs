import { readFile, readdir, stat } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { root, runPipeline } from './pipeline.mjs'

try {
  const args = process.argv.slice(2)
  const followCalls = args.includes('--follow-calls')
  const connectContracts = args.includes('--connect-contracts')
  const snapshotIndex = args.indexOf('--snapshot')
  if (snapshotIndex >= 0 && (!args[snapshotIndex + 1] || args[snapshotIndex + 1].startsWith('--'))) throw new Error('--snapshot needs a JSON file path.')
  const snapshot = snapshotIndex >= 0 ? JSON.parse(await readFile(resolve(args[snapshotIndex + 1]), 'utf8')) : null
  if (snapshot && !connectContracts) throw new Error('Use --connect-contracts with --snapshot.')
  const sourceFile = args.find((arg, i) => !arg.startsWith('--') && (snapshotIndex < 0 || i !== snapshotIndex + 1))
  const file = sourceFile ? resolve(sourceFile) : join(root, 'examples', '01-direct.sol')
  const source = (await stat(file)).isDirectory()
    ? Object.fromEntries(await Promise.all((await readdir(join(file, '.flat'))).filter((name) => name.endsWith('.sol')).map(async (name) => [`.flat/${name}`, await readFile(join(file, '.flat', name), 'utf8')])))
    : await readFile(file, 'utf8')
  const result = await runPipeline(source, { followCalls, connectContracts, snapshot })
  console.log(`solc ${result.compilerVersion} → ${Object.values(result.facts).flat().length} base facts → Soufflé`)
  for (const finding of result.findings) {
    console.log(`${finding.function}: direct assignment to ${finding.variable} at line ${finding.line} (potential writer)`)
  }
  if (!result.findings.length) console.log('No direct assignments matched this rule; this is not an exclusion proof.')
  if (followCalls) {
    const functions = new Map(result.facts.functionDefinition)
    const variables = new Map(result.facts.stateVariable)
    for (const [entry, variable] of result.derived.entryWrite) {
      console.log(`${functions.get(entry)}: externally callable potential writer of ${variables.get(variable)}`)
    }
    console.log('Call coverage is limited; missing paths are not exclusion proofs.')
  }
  if (connectContracts) console.log(`${result.derived.externalDependency.length} external dependencies; ${result.derived.resolvedCall.length} snapshot-resolved targets (source locations, not permission verdicts).`)
  console.log(`\n${result.scope[1]}\nArtifacts: ${result.runDir}`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
