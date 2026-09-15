import { readFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { root, runPipeline } from './pipeline.mjs'

try {
  const args = process.argv.slice(2)
  const followCalls = args.includes('--follow-calls')
  const sourceFile = args.find((arg) => arg !== '--follow-calls')
  const file = sourceFile ? resolve(sourceFile) : join(root, 'examples', '01-direct.sol')
  const result = await runPipeline(await readFile(file, 'utf8'), { followCalls })
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
  console.log(`\n${result.scope[1]}\nArtifacts: ${result.runDir}`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
