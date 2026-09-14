import { readFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { root, runPipeline } from './pipeline.mjs'

try {
  const file = process.argv[2] ? resolve(process.argv[2]) : join(root, 'examples', '01-direct.sol')
  const result = await runPipeline(await readFile(file, 'utf8'))
  console.log(`solc ${result.compilerVersion} → ${Object.values(result.facts).flat().length} base facts → Soufflé`)
  for (const finding of result.findings) {
    console.log(`${finding.function}: direct assignment to ${finding.variable} at line ${finding.line} (potential writer)`)
  }
  if (!result.findings.length) console.log('No direct assignments matched this rule; this is not an exclusion proof.')
  console.log(`\n${result.scope[1]}\nArtifacts: ${result.runDir}`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
