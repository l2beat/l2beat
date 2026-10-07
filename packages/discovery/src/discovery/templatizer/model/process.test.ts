import { spawn } from 'child_process'
import { expect } from 'earl'
import { once } from 'events'
import fs from 'fs'
import os from 'os'
import path from 'path'
import waitForExpect from 'wait-for-expect'

describe('model process cleanup', () => {
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP'] as const) {
    it(`kills the detached model on ${signal} and preserves default signal termination`, async function () {
      this.timeout(10_000)
      const directory = fs.mkdtempSync(
        path.join(os.tmpdir(), 'templatizer-signal-'),
      )
      const pidFile = path.join(directory, 'child.pid')
      const childCode = `
        require('fs').writeFileSync(${JSON.stringify(pidFile)}, String(process.pid));
        setInterval(() => {}, 1000);
      `
      const parentCode = `
        const { runProcess } = require(${JSON.stringify(path.join(__dirname, 'process.ts'))});
        runProcess(process.execPath, ['-e', ${JSON.stringify(childCode)}], '',
          process.cwd(), process.env, 60000);
      `
      const parent = spawn(
        process.execPath,
        ['--import', 'tsx', '-e', parentCode],
        {
          stdio: 'ignore',
        },
      )
      const exited = once(parent, 'exit')
      let childPid: number | undefined
      try {
        await waitForExpect(() => expect(fs.existsSync(pidFile)).toEqual(true))
        childPid = Number(fs.readFileSync(pidFile, 'utf8'))
        parent.kill(signal)
        const [code, exitSignal] = await exited
        expect(code).toEqual(null)
        expect(exitSignal).toEqual(signal)
        await waitForExpect(() =>
          expect(isRunning(childPid as number)).toEqual(false),
        )
      } finally {
        parent.kill('SIGKILL')
        if (childPid !== undefined) {
          try {
            process.kill(-childPid, 'SIGKILL')
          } catch {
            // Already cleaned up by the parent.
          }
        }
        fs.rmSync(directory, { recursive: true, force: true })
      }
    })
  }
})

function isRunning(pid: number): boolean {
  try {
    process.kill(pid, 0)
    // A container's PID 1 can leave a killed orphan waiting to be reaped.
    if (process.platform === 'linux') {
      return !/^State:\s+Z/m.test(
        fs.readFileSync(`/proc/${pid}/status`, 'utf8'),
      )
    }
    return true
  } catch {
    return false
  }
}
