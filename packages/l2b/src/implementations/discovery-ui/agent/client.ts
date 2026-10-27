import { v } from '@l2beat/validate'
import { MCP_PATH } from './mcp'

const callResponse = v.object({
  result: v
    .object({
      content: v.array(v.object({ text: v.string().optional() })),
      isError: v.boolean().optional(),
    })
    .optional(),
  error: v.object({ message: v.string() }).optional(),
})

// The CLI runs the same tools DiscoUI offers agents over MCP, so a terminal
// agent without MCP gets the same answers.
export async function callTool(url: string, name: string, args: object) {
  const response = await fetch(url + MCP_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name, arguments: args },
    }),
  }).catch(() =>
    fail(`DiscoUI is not reachable at ${url}, start it with l2b ui`),
  )
  if (!response.ok) {
    throw new Error('DiscoUI rejected the request', {
      cause: { status: response.status, body: await response.text() },
    })
  }
  const message = callResponse.parse(await response.json())
  if (message.result === undefined) {
    throw new Error('DiscoUI rejected the tool call', { cause: message.error })
  }
  const text = message.result.content.map((c) => c.text ?? '').join('\n')
  if (message.result.isError === true) {
    fail(text)
  }
  console.log(text)
}

// Agents read the message and retry, so it goes out without a stack trace.
export function fail(message: string): never {
  console.error(message)
  process.exit(1)
}
