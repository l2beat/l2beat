import { expect } from 'earl'
import { AcpConnection, type AcpHandlers } from './acp'

// A fake agent: a node process that asks the client one question, then
// waits for input until its stdin closes.
const ASKING_AGENT = `
process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: 7, method: 'session/request_permission', params: {} }) + '\\n')
process.stdin.resume()
`

function runAgent(script: string, handlers: Partial<AcpHandlers>) {
  const connection = new AcpConnection(
    process.execPath,
    ['-e', script],
    { cwd: process.cwd(), env: process.env },
    {
      onNotification: () => {},
      onRequest: async () => ({}),
      onExit: () => {},
      ...handlers,
    },
  )
  after(() => connection.close())
  return connection
}

describe(AcpConnection.name, () => {
  it('drops an answer that settles after closing', async () => {
    let answer: (result: unknown) => void = () => {}
    let asked: () => void = () => {}
    const wasAsked = new Promise<void>((resolve) => {
      asked = resolve
    })
    const connection = runAgent(ASKING_AGENT, {
      onRequest: () => {
        asked()
        return new Promise((resolve) => {
          answer = resolve
        })
      },
    })
    await wasAsked
    connection.close()
    answer({ outcome: { outcome: 'cancelled' } })
    // A write to the ended stdin used to crash the server with an
    // unhandled stream error a tick later.
    await new Promise((resolve) => setTimeout(resolve, 50))
  })

  it('reports why the agent exited and rejects what it still owed', async () => {
    let exited: (reason: string) => void = () => {}
    const reason = new Promise<string>((resolve) => {
      exited = resolve
    })
    const connection = runAgent('setTimeout(() => process.exit(3), 100)', {
      onExit: (why) => exited(why),
    })
    const request = connection.request('initialize', {})
    expect(await reason).toEqual('Agent exited with code 3')
    await expect(request).toBeRejectedWith('Agent exited with code 3')
  })
})
