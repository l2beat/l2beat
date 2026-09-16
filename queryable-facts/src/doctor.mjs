import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const command = (file, args) => exec(file, args, { timeout: 15_000, maxBuffer: 256_000 })

// No model requests and no credential contents in the report.
export async function checkSetup({ run = command, env = process.env, node = process.versions.node } = {}) {
  const checks = []
  async function check(name, fix, task) {
    try { checks.push({ name, ok: true, detail: await task() }) }
    catch { checks.push({ name, ok: false, detail: fix }) }
  }
  await check('Node', 'Install Node 22 or newer.', async () => {
    if (Number(node.split('.')[0]) < 22) throw new Error('Old Node')
    return node
  })
  await check('Solidity compiler', 'Run npm install inside queryable-facts.', async () => {
    const { default: solc } = await import('solc')
    const output = JSON.parse(solc.compile(JSON.stringify({ language: 'Solidity',
      sources: { 'Check.sol': { content: 'pragma solidity 0.8.34; contract Check {}' } },
      settings: { outputSelection: { '*': { '': ['ast'] } } },
    })))
    if (!output.sources?.['Check.sol']?.ast) throw new Error('Compiler failed')
    return solc.version()
  })
  await check('Soufflé', 'Install Soufflé (macOS: brew install souffle). Check SOUFFLE_BIN if set.', async () => {
    const bin = env.SOUFFLE_BIN || 'souffle'
    const { stdout, stderr } = await run(bin, ['--version'])
    const dir = await mkdtemp(join(tmpdir(), 'queryable-facts-doctor-'))
    try {
      const rule = join(dir, 'check.dl')
      await writeFile(rule, '.decl edge(a:number,b:number)\n.decl reach(a:number,b:number)\nedge(1,2).\nedge(2,3).\nreach(a,b) :- edge(a,b).\nreach(a,c) :- reach(a,b), edge(b,c).\n.output reach\n')
      await run(bin, ['-D', dir, rule])
      const rows = (await readFile(join(dir, 'reach.csv'), 'utf8')).trim().split('\n').sort()
      if (JSON.stringify(rows) !== JSON.stringify(['1\t2', '1\t3', '2\t3'])) throw new Error('Unexpected result')
      return `${(stdout || stderr).split('\n').find((line) => /version/i.test(line))?.trim() || 'Version not reported'} · rule execution passed`
    } finally { await rm(dir, { recursive: true, force: true }) }
  })
  const codex = env.CODEX || 'codex'
  await check('Codex CLI', 'Install/update: npm install -g @openai/codex. Check CODEX if set.', async () => {
    const { stdout } = await run(codex, ['--version'])
    const help = await run(codex, ['exec', '--help'])
    for (const flag of ['--ignore-user-config', '--ephemeral', '--skip-git-repo-check', '--sandbox', '--model', '--color', '--output-schema', '--output-last-message']) {
      if (!help.stdout.includes(flag)) throw new Error('Unsupported CLI')
    }
    return stdout.trim()
  })
  await check('Codex sign-in', 'Run codex login (or your CODEX executable followed by login).', async () => {
    await run(codex, ['login', 'status'])
    return 'Credentials present'
  })
  return checks
}

export async function doctor(options) {
  const checks = await checkSetup(options)
  for (const check of checks) console.log(`${check.ok ? 'OK' : 'FAIL'}  ${check.name}: ${check.detail}`)
  const ok = checks.every((check) => check.ok)
  console.log(ok
    ? '\nLocal setup ready. Model access, quota and network are checked when you ask AI.'
    : '\nFix the items above, then run npm run doctor again.')
  return ok
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!await doctor()) process.exitCode = 1
}
