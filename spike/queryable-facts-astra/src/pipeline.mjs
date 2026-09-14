import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import solc from 'solc'
import { atoms, extractFacts, inputText, schema } from './facts.mjs'

export const root = fileURLToPath(new URL('../', import.meta.url))
const exec = promisify(execFile)

export const scope = [
  'A directWrite tuple proves a syntactic match: an assignment inside a function refers directly to a state variable.',
  'Potential means we have not checked whether the assignment can execute or persist. Even unreachable assignments match.',
  'This first rule covers bare-identifier assignments (=, +=, etc.). It does not cover ++, --, delete, array/member writes, storage aliases, initializers, assembly, modifier bodies, or writes in called functions.',
  'An absent tuple is not a general proof that a function cannot affect storage. No permissions, call graph, or whole-transaction analysis is performed.',
]

export async function runPipeline(source, { outputRoot = join(root, 'out', 'runs') } = {}) {
  const started = performance.now()
  const input = {
    language: 'Solidity',
    sources: { 'Playground.sol': { content: source } },
    settings: { outputSelection: { '*': { '': ['ast'], '*': ['storageLayout'] } } },
  }
  // Pinned compiler; solc itself rejects incompatible pragmas and unresolved imports.
  const output = JSON.parse(solc.compile(JSON.stringify(input)))
  const errors = (output.errors ?? []).filter((error) => error.severity === 'error')
  if (errors.length) throw new Error(errors.map((error) => error.formattedMessage).join('\n'))
  const ast = output.sources['Playground.sol'].ast
  const { facts, locations } = extractFacts(ast, source)
  const rules = await readFile(join(root, 'rules', '01-direct-writes.dl'), 'utf8')

  await mkdir(outputRoot, { recursive: true })
  const runDir = await mkdtemp(join(outputRoot, 'stage-01-'))
  const factDir = join(runDir, 'facts')
  const derivedDir = join(runDir, 'derived')
  await mkdir(factDir)
  await mkdir(derivedDir)
  for (const [name, rows] of Object.entries(facts)) {
    await writeFile(join(factDir, `${name}.facts`), inputText(rows))
  }
  // Execute the saved rule copy, so every run can be reproduced from its artifacts.
  await writeFile(join(runDir, 'rules.dl'), rules)
  try {
    await exec(process.env.SOUFFLE_BIN || 'souffle', [
      '-F', factDir, '-D', derivedDir, join(runDir, 'rules.dl'),
    ], { timeout: 15_000, maxBuffer: 1024 * 1024 })
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('Soufflé was not found. Put souffle on PATH or set SOUFFLE_BIN to its executable path.')
    }
    throw new Error(`Soufflé did not finish successfully: ${error.stderr || error.message}`)
  }
  const text = await readFile(join(derivedDir, 'directWrite.csv'), 'utf8')
  const tuples = text.trim() ? text.trim().split('\n').map((line) => line.split('\t').map(Number)) : []
  const functionNames = new Map(facts.functionDefinition)
  const variableNames = new Map(facts.stateVariable)
  const findings = tuples.map(([fn, variable, assignment]) => ({
    tuple: [fn, variable, assignment],
    function: functionNames.get(fn),
    variable: variableNames.get(variable),
    line: locations[assignment].line,
    assignment: locations[assignment].source,
  }))
  const result = {
    stage: '01-direct-writes',
    source,
    compilerVersion: solc.version(),
    compilerInput: input,
    compilerOutput: output,
    schema, facts, locations, rules, tuples, findings, scope,
    warnings: (output.errors ?? []).map((error) => error.formattedMessage),
    runDir,
    elapsedMs: Math.round(performance.now() - started),
  }
  for (const [file, contents] of Object.entries({
    'source.sol': source,
    'compiler-input.json': JSON.stringify(input, null, 2),
    'compiler-output.json': JSON.stringify(output, null, 2),
    'facts.dl': Object.entries(facts).map(([name, rows]) => atoms(name, rows)).join('\n'),
    'result.json': JSON.stringify(result, null, 2),
  })) await writeFile(join(runDir, file), contents)
  return result
}
