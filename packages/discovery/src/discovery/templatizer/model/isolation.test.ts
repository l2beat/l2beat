import { spawnSync } from 'child_process'
import { expect } from 'earl'
import fs from 'fs'
import http from 'http'
import type { AddressInfo } from 'net'
import os from 'os'
import path from 'path'
import { CodexClient } from './CodexClient'
import { OpenCodeClient } from './OpenCodeClient'

/**
 * Runs the installed `codex` and `opencode` through their clients against a
 * local endpoint that records the request and refuses it, and checks that
 * the request offers the model no tool. The stand-in executables in the
 * other client tests pin the flags; only the real binary can say what the
 * flags leave in the request, and a CLI upgrade can add a tool. A thin
 * wrapper adds the local provider and nothing else. Skipped where the
 * binary is not installed, as on CI.
 *
 * Codex runs with the user's login, because with a ChatGPT login it adds
 * the ChatGPT apps to the request, and with a model it has no catalogue
 * entry for, so that no model-specific tool hides or adds anything.
 * opencode runs with a global config and a config in a directory above the
 * scratch one that both allow `bash`, which opencode would merge into the
 * turn's own config.
 */
describe('model isolation against the installed CLIs', function () {
  this.timeout(90_000)

  let directory: string
  let server: CaptureServer

  beforeEach(async () => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'isolation-test-'))
    server = await startCaptureServer()
  })

  afterEach(async () => {
    await server.close()
    fs.rmSync(directory, { recursive: true, force: true })
  })

  it('codex sends a request with no tools', async function () {
    const codex = findBinary('codex')
    if (codex === undefined) {
      this.skip()
    }
    const binary = writeWrapper(directory, 'codex', [
      `sub="$1"; shift`,
      `exec ${quote(codex)} "$sub" --ephemeral -c ${quote(
        `model_providers.probe={name="probe",base_url="${server.url}/v1",wire_api="responses",request_max_retries=0,stream_max_retries=0}`,
      )} -c 'model_provider="probe"' "$@"`,
    ])
    const client = new CodexClient({ binary, model: 'isolation-probe' })

    await expect(client.start({ prompt: 'hi', schema: {} })).toBeRejected()

    expectNoTools(server.requests)
  })

  it('opencode sends a request with no tools, whatever the global and parent configs allow', async function () {
    const opencode = findBinary('opencode')
    if (opencode === undefined) {
      this.skip()
    }
    const globalConfig = path.join(directory, 'global')
    fs.mkdirSync(path.join(globalConfig, 'opencode'), { recursive: true })
    fs.writeFileSync(
      path.join(globalConfig, 'opencode', 'opencode.json'),
      JSON.stringify({ permission: { bash: 'allow' } }),
    )
    const provider = {
      provider: {
        probe: {
          npm: '@ai-sdk/openai-compatible',
          options: { baseURL: `${server.url}/v1`, apiKey: 'probe' },
          models: { m: {} },
        },
      },
    }
    const binary = writeWrapper(directory, 'opencode', [
      `export XDG_DATA_HOME=${quote(path.join(directory, 'data'))}`,
      `export OPENCODE_CONFIG_CONTENT=${quote(JSON.stringify(provider))}`,
      `exec ${quote(opencode)} "$@"`,
    ])
    const client = new OpenCodeClient({ binary, model: 'probe/m' })

    // The scratch directory is made under the temporary directory.
    const parent = path.join(directory, 'tmp')
    fs.mkdirSync(parent)
    fs.writeFileSync(
      path.join(parent, 'opencode.json'),
      JSON.stringify({ permission: { bash: 'allow' } }),
    )
    const previous = {
      XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME,
      TMPDIR: process.env.TMPDIR,
    }
    process.env.XDG_CONFIG_HOME = globalConfig
    process.env.TMPDIR = parent
    try {
      await expect(client.start({ prompt: 'hi', schema: {} })).toBeRejected()
    } finally {
      restoreEnv('XDG_CONFIG_HOME', previous.XDG_CONFIG_HOME)
      restoreEnv('TMPDIR', previous.TMPDIR)
    }

    // The turn's own request only: with the title given, opencode does not
    // ask the model for one.
    expect(server.requests.length).toEqual(1)
    expectNoTools(server.requests)
  })
})

interface CaptureServer {
  url: string
  requests: Record<string, unknown>[]
  close(): Promise<void>
}

async function startCaptureServer(): Promise<CaptureServer> {
  const requests: Record<string, unknown>[] = []
  const server = http.createServer((request, response) => {
    const chunks: Buffer[] = []
    request.on('data', (chunk: Buffer) => chunks.push(chunk))
    request.on('end', () => {
      if (request.method === 'POST') {
        requests.push(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      }
      response.writeHead(request.method === 'POST' ? 400 : 404, {
        'content-type': 'application/json',
      })
      response.end('{"error":{"message":"refused by the isolation test"}}')
    })
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const { port } = server.address() as AddressInfo
  return {
    url: `http://127.0.0.1:${port}`,
    requests,
    close: () => new Promise((resolve) => server.close(() => resolve())),
  }
}

function expectNoTools(requests: Record<string, unknown>[]): void {
  expect(requests.length).toBeGreaterThan(0)
  const tools = requests.flatMap((request) =>
    ((request.tools ?? []) as Record<string, unknown>[]).map((tool) => {
      const fn = tool.function as Record<string, unknown> | undefined
      return String(tool.name ?? fn?.name ?? tool.type)
    }),
  )
  expect(tools).toEqual([])
}

function findBinary(name: string): string | undefined {
  const found = spawnSync('sh', ['-c', `command -v ${name}`], {
    encoding: 'utf8',
  })
  const location = found.stdout.trim()
  return found.status === 0 && location !== '' ? location : undefined
}

function writeWrapper(directory: string, name: string, lines: string[]) {
  const file = path.join(directory, name)
  fs.writeFileSync(file, ['#!/bin/sh', ...lines, ''].join('\n'))
  fs.chmodSync(file, 0o755)
  return file
}

function quote(value: string): string {
  return `'${value.replaceAll("'", `'\\''`)}'`
}

function restoreEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    Reflect.deleteProperty(process.env, name)
  } else {
    process.env[name] = value
  }
}
