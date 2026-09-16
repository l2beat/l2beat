import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import test from 'node:test'
import { checkSetup } from '../src/doctor.mjs'

const exec = promisify(execFile)
const flags = '--ignore-user-config --ephemeral --skip-git-repo-check --sandbox --model --color --output-schema --output-last-message'

function fakeCodex({ signedIn = true, compatible = true } = {}) {
  return async (bin, args) => {
    if (bin !== 'test-codex') return exec(bin, args, { timeout: 15_000 })
    if (args[0] === '--version') return { stdout: 'test CLI', stderr: '' }
    if (args[0] === 'exec') return { stdout: compatible ? flags : '--model', stderr: '' }
    if (!signedIn) throw new Error('Not logged in: private diagnostic must not be printed')
    return { stdout: 'Private authentication data must not be printed', stderr: '' }
  }
}
const env = { CODEX: 'test-codex', SOUFFLE_BIN: process.env.SOUFFLE_BIN || 'souffle' }

test('setup requires working compiler, real Soufflé execution and Codex sign-in; honors executable overrides', async () => {
  const checks = await checkSetup({ env, run: fakeCodex() })
  assert.equal(checks.length, 5)
  assert.ok(checks.every((check) => check.ok))
  assert.match(checks.find((check) => check.name === 'Soufflé').detail, /Version:.*rule execution passed/)
  assert.doesNotMatch(JSON.stringify(checks), /Private/)
})

test('signed-out and incompatible Codex fail setup without leaking authentication output', async () => {
  const checks = await checkSetup({ env, run: fakeCodex({ signedIn: false, compatible: false }) })
  assert.deepEqual(checks.filter((check) => !check.ok).map((check) => check.name), ['Codex CLI', 'Codex sign-in'])
  assert.doesNotMatch(JSON.stringify(checks), /private diagnostic/)
  assert.match(checks.at(-1).detail, /codex login/)
})

test('missing tools and unsupported Node fail independently with actionable instructions', async () => {
  const checks = await checkSetup({ node: '20.0.0', run: async () => { throw new Error('ENOENT') } })
  assert.deepEqual(checks.filter((check) => !check.ok).map((check) => check.name), ['Node', 'Soufflé', 'Codex CLI', 'Codex sign-in'])
  assert.match(checks.find((check) => check.name === 'Soufflé').detail, /brew install souffle/)
})

test('startup stops before opening a server if required Codex is missing', async () => {
  await assert.rejects(exec(process.execPath, ['src/dev.mjs'], {
    cwd: new URL('../', import.meta.url),
    env: { ...process.env, CODEX: '/nonexistent/queryable-facts-codex' }, timeout: 30_000,
  }), (error) => {
    assert.equal(error.code, 1)
    assert.match(error.stdout, /FAIL  Codex CLI/)
    assert.doesNotMatch(error.stdout, /http:\/\/localhost/)
    return true
  })
})
