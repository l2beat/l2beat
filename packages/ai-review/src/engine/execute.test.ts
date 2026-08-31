import { expect } from 'earl'
import { execute } from './execute.js'

const options = { cwd: process.cwd(), stdin: '', timeoutMs: 10_000 }

describe(execute.name, () => {
  it('captures stdout, stderr and the exit code', async () => {
    const result = await execute(
      'node',
      [
        '-e',
        'process.stdout.write("out"); process.stderr.write("err"); process.exit(3)',
      ],
      options,
    )
    expect(result).toEqual({
      stdout: 'out',
      stderr: 'err',
      timedOut: false,
      code: 3,
    })
  })

  it('feeds stdin to the child', async () => {
    const result = await execute(
      'node',
      ['-e', 'process.stdin.pipe(process.stdout)'],
      {
        ...options,
        stdin: 'hello',
      },
    )
    expect(result.stdout).toEqual('hello')
    expect(result.code).toEqual(0)
  })

  it('settles on a spawn failure', async () => {
    const result = await execute('this-binary-does-not-exist', [], options)
    expect(result.code).toEqual(null)
    expect(result.stderr).toInclude('ENOENT')
  })

  it('kills the child on timeout', async () => {
    const result = await execute(
      'node',
      ['-e', 'setInterval(() => {}, 1000)'],
      {
        ...options,
        timeoutMs: 200,
      },
    )
    expect(result.timedOut).toEqual(true)
    expect(result.code).toEqual(null)
  })

  it('resolves even when a detached grandchild keeps the pipes open', async function () {
    this.timeout(5000)
    const script = `
      const { spawn } = require('node:child_process')
      spawn('sleep', ['30'], { detached: true, stdio: 'inherit' }).unref()
      setInterval(() => {}, 1000)
    `
    const start = Date.now()
    const result = await execute('node', ['-e', script], {
      ...options,
      timeoutMs: 200,
    })
    expect(result.timedOut).toEqual(true)
    // Must settle on the kill grace, not on the grandchild's 30s exit.
    expect(Date.now() - start).toBeLessThan(4000)
  })
})
