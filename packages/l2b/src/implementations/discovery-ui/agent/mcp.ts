import { toJsonSchema, type Validator, v as z } from '@l2beat/validate'
import type { Express, NextFunction, Request, Response } from 'express'
import { BOARD_TOOLS } from './boardTools'
import { AGENT_TOOLS, type AgentTool, type DiscoUi, runTool } from './tools'

const TOOLS = [...AGENT_TOOLS, ...BOARD_TOOLS]

export const MCP_PATH = '/api/agent/mcp'

// Streamable HTTP without sessions or streams: every tool answers in one
// JSON response, which every protocol version since 2025-03-26 allows.
const PROTOCOL_VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26']

const INSTRUCTIONS = [
  "DiscoUI is L2BEAT's discovery UI. The researcher has it open and sees your answers there.",
  'Read what they look at with `context` first: "this" means their selection. Point at your answer with `show`, and change their graph with `view` or `control_map` when they ask.',
  'For "who controls this" start with `permissions`, for "show me the power structure" with `control_map`.',
  "DiscoUI shows each source behind a 12-line note, so its line numbers are the .flat file's plus 12. show reports DiscoUI's; cite those to the researcher.",
  'For "show me a table of", "list everything that" or a comparison, build a `board`: tables, text and view buttons bound to the discovery, in a panel next to the graph. Research with your own tools, then show the result on the board, not in your reply or a file: the reply says what the board shows in a sentence or two.',
  'Contracts are names (Bridge), chain:Name (arb1:L2Timelock) when a name repeats across chains, or chain:0x addresses, which `permissions` gives you.',
  'A wrong name or selector fails with candidates, a snippet that is not in the code fails too: fix it and call again. A snippet opens where it is implemented, past interface declarations; found more than once, it opens at the first and the result lists the others: quote a longer snippet, or when they are other implementations, name them in the note. Keep notes short, the details go in your reply.',
].join('\n')

const messageSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.union([z.string(), z.number()]).optional(),
  method: z.string(),
  params: z.unknown().optional(),
})

const initializeSchema = z.object({ protocolVersion: z.string() })
const callSchema = z.object({
  name: z.string(),
  arguments: z.unknown().optional(),
})

type Id = string | number

class RpcError extends Error {
  constructor(
    readonly code: number,
    message: string,
    readonly detail: string,
  ) {
    super(message, { cause: { detail } })
  }
}

export function attachMcpRouter(app: Express, ui: DiscoUi) {
  app.post(MCP_PATH, async (req, res) => {
    if (Array.isArray(req.body)) {
      res.status(400).json(rpcError(null, -32600, 'Batches are not supported'))
      return
    }
    const message = messageSchema.safeParse(req.body)
    if (!message.success) {
      res.status(400).json(rpcError(null, -32600, message.message))
      return
    }
    const { id, method, params } = message.data
    if (id === undefined) {
      // A notification, like notifications/initialized, needs no answer.
      res.status(202).end()
      return
    }
    try {
      res.json({ jsonrpc: '2.0', id, result: await answer(ui, method, params) })
    } catch (error) {
      if (!(error instanceof RpcError)) {
        throw error
      }
      res.json(rpcError(id, error.code, `${error.message}: ${error.detail}`))
    }
  })

  // The body parser fails before the route runs, and its error page is HTML.
  app.use(
    MCP_PATH,
    (error: unknown, _req: Request, res: Response, next: NextFunction) => {
      if (!isParseFailure(error)) {
        next(error)
        return
      }
      res.status(400).json(rpcError(null, -32700, 'Parse error'))
    },
  )

  // No server-initiated stream and no sessions to end.
  app.get(MCP_PATH, (_req, res) => {
    res.status(405).set('Allow', 'POST').end()
  })
  app.delete(MCP_PATH, (_req, res) => {
    res.status(405).set('Allow', 'POST').end()
  })
}

async function answer(
  ui: DiscoUi,
  method: string,
  params: unknown,
): Promise<object> {
  if (method === 'initialize') {
    const requested = parseParams(initializeSchema, params).protocolVersion
    return {
      protocolVersion: PROTOCOL_VERSIONS.includes(requested)
        ? requested
        : PROTOCOL_VERSIONS[0],
      capabilities: { tools: {} },
      serverInfo: { name: 'discoui', version: '1.0.0' },
      instructions: INSTRUCTIONS,
    }
  }
  if (method === 'ping') {
    return {}
  }
  if (method === 'tools/list') {
    return { tools: TOOLS.map(describeTool) }
  }
  if (method === 'tools/call') {
    const call = parseParams(callSchema, params)
    const tool = TOOLS.find((t) => t.name === call.name)
    if (tool === undefined) {
      throw new RpcError(-32602, 'Unknown tool', call.name)
    }
    const { text, isError } = await runTool(tool, call.arguments, ui)
    return { content: [{ type: 'text', text }], isError }
  }
  throw new RpcError(-32601, 'Method not found', method)
}

function describeTool(tool: AgentTool) {
  const { $schema: _, ...schema } = toJsonSchema(tool.input) as {
    $schema: string
    properties?: Record<string, object>
  }
  const properties = { ...schema.properties }
  for (const [name, description] of Object.entries(tool.argumentHelp)) {
    properties[name] = { ...properties[name], description }
  }
  return {
    name: tool.name,
    description: tool.description,
    inputSchema: { ...schema, type: 'object', properties },
    annotations: {
      readOnlyHint: tool.readOnly,
      destructiveHint: false,
      openWorldHint: false,
    },
    // Claude Code defers MCP tools behind a search by default, and an agent
    // that calls a tool before loading it fails its first step.
    _meta: { 'anthropic/alwaysLoad': true },
  }
}

function parseParams<T>(schema: Validator<T>, params: unknown): T {
  const parsed = schema.safeParse(params)
  if (!parsed.success) {
    throw new RpcError(-32602, 'Invalid params', parsed.message)
  }
  return parsed.data
}

function isParseFailure(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as { type?: unknown }).type === 'entity.parse.failed'
  )
}

function rpcError(id: Id | null, code: number, message: string) {
  return { jsonrpc: '2.0', id, error: { code, message } }
}
