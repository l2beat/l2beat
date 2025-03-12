import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { ConfigReader } from '../config/ConfigReader'
import type { DiscoveryPaths } from '../config/getDiscoveryPaths'
import { parseClingoFact } from './clingoparser'

export async function runClingo(program: string) {
  // import full clingo-wasm only if this function is called
  const clingoModule = await import('clingo-wasm')
  // @ts-ignore Handle both ESM and CommonJS module formats,
  // so that it works in unit tests.
  const run = clingoModule.default.run ?? clingoModule.run

  const clingoResult = await run(program, 0)
  return clingoResult
}

export async function buildProjectPageFacts(
  project: string,
  paths: DiscoveryPaths,
) {
  const configReader = new ConfigReader(paths.discovery)
  const model = readAllModelsAndRelationsOfProject(project, configReader)
  const projectPageClingoFile = readProjectPageClingoFile(paths)
  const clingoResult = await runClingo(model + '\n' + projectPageClingoFile)
  if (clingoResult.Result === 'ERROR') {
    throw new Error(clingoResult.Error)
  }
  if (clingoResult.Models.Number !== 1) {
    throw new Error('Expected 1 model, got ' + clingoResult.Models.Number)
  }
  const facts = clingoResult.Call[0]?.Witnesses[0]?.Value
  if (!facts) {
    throw new Error('No facts found')
  }
  const parsed = { facts: facts.map(parseClingoFact) }
  const outputPath = configReader.getProjectPath(project)
  writeFileSync(
    join(outputPath, 'projectPageFacts.json'),
    JSON.stringify(parsed, null, 2) + '\n',
  )
}

export function readProjectPageClingoFile(paths: DiscoveryPaths): string {
  const path = join(paths.discovery, '_clingo', 'forProjectPage.lp')
  return readFileSync(path, 'utf8')
}

export function readAllModelsAndRelationsOfProject(
  project: string,
  configReader: ConfigReader,
): string {
  const result = []
  const optionalFiles = ['model.lp']
  const requiredFiles = ['relations.lp']

  const chainPaths = configReader
    .readAllChainsForProject(project)
    .map((chain) => configReader.getProjectChainPath(project, chain))

  for (const path of chainPaths) {
    for (const modelName of [...optionalFiles, ...requiredFiles]) {
      const modelFilePath = join(path, modelName)
      if (!existsSync(modelFilePath)) {
        if (requiredFiles.includes(modelName)) {
          throw new Error(`Required file ${modelName} not found in ${path}`)
        }
        continue
      }
      const content = readFileSync(modelFilePath, 'utf8')
      result.push(`\n% ${modelFilePath}\n`)
      result.push(content)
    }
  }
  return result.join('\n')
}
