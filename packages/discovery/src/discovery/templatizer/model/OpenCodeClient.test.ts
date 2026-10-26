import { expect } from 'earl'
import fs from 'fs'
import os from 'os'
import path from 'path'
import {
  OPENCODE_AGENT,
  OPENCODE_ISOLATION_CONFIG,
  OPENCODE_OUTPUT_TOKEN_MAX,
  OpenCodeClient,
  OpenCodeTurnError,
} from './OpenCodeClient'
import { TOOL_SYSTEM_PROMPT } from './toolSystemPrompt'

/**
 * Runs the client against a stand-in `opencode` executable that records how
 * it was called and replays a scripted event stream. What is pinned is the
 * contract with the real binary, and above all its isolation: the turn runs
 * in a scratch directory that is the process cwd, the `--dir` argument and
 * `$PWD` alike, because opencode reads its directory from `$PWD` and would
 * otherwise tell the model it works inside the repository and load the
 * repository's AGENTS.md. The scratch directory holds the config that
 * disables every tool and defines the agent whose prompt replaces
 * opencode's own, and an empty directory that stands in for the user's
 * global config, which opencode would otherwise merge in; the variables
 * that name or hold other config are dropped. The turn runs as that agent,
 * and the user's CLAUDE.md is kept out by the flag opencode reads for it. The
 * output token budget is raised above opencode's default, which a reasoning
 * model exhausts before it answers.
 */
describe(OpenCodeClient.name, () => {
  let directory: string
  let binary: string
  let recordFile: string
  let eventsFile: string
  let countFile: string

  const cleanTurn = [
    '{"type":"step_start","sessionID":"ses_1","part":{"type":"step-start"}}',
    '{"type":"text","sessionID":"ses_1","part":{"type":"text","text":"{\\"fields\\":{}}"}}',
    '{"type":"step_finish","sessionID":"ses_1","part":{"type":"step-finish","tokens":{"input":10,"output":3,"reasoning":1,"cache":{"read":100,"write":0}}}}',
  ].join('\n')
  const markupTurn = JSON.stringify({
    type: 'text',
    sessionID: 'ses_1',
    part: {
      type: 'text',
      text: '<｜｜DSML｜｜ calls>\n<｜｜DSML｜｜ invoke name="bash">\n</｜｜DSML｜｜ invoke>\n</｜｜DSML｜｜ calls>',
    },
  })

  beforeEach(() => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), 'opencode-client-test-'))
    recordFile = path.join(directory, 'record.json')
    eventsFile = path.join(directory, 'events.jsonl')
    countFile = path.join(directory, 'count.txt')
    binary = writeFakeOpenCode(directory, recordFile, eventsFile, countFile)
  })

  afterEach(() => {
    fs.rmSync(directory, { recursive: true, force: true })
  })

  function record(): Record {
    return JSON.parse(fs.readFileSync(recordFile, 'utf8'))
  }

  function calls(): number {
    return Number(fs.readFileSync(countFile, 'utf8'))
  }

  it('runs the turn as the templatizer agent in a scratch directory that is the cwd, --dir and $PWD, holding only the isolation config', async () => {
    fs.writeFileSync(eventsFile, cleanTurn)
    const client = new OpenCodeClient({
      binary,
      model: 'opencode-go/test-model',
      variant: 'high',
    })
    const previous = {
      content: process.env.OPENCODE_CONFIG_CONTENT,
      permission: process.env.OPENCODE_PERMISSION,
    }
    process.env.OPENCODE_CONFIG_CONTENT = '{"permission":{"bash":"allow"}}'
    process.env.OPENCODE_PERMISSION = '{"bash":"allow"}'
    const turn = await client
      .start({ prompt: 'hello model', schema: {} })
      .finally(() => {
        restoreEnv('OPENCODE_CONFIG_CONTENT', previous.content)
        restoreEnv('OPENCODE_PERMISSION', previous.permission)
      })

    const {
      args,
      stdin,
      cwd,
      pwd,
      configPath,
      config,
      files,
      configHome,
      configHomeFiles,
      configContent,
      permission,
      disableProjectConfig,
      outputTokenMax,
      disableClaudeCodePrompt,
    } = record()
    expect(args.slice(0, 4)).toEqual(['run', '--format', 'json', '--pure'])
    expect(args[args.indexOf('--dir') + 1]).toEqual(cwd)
    expect(pwd).toEqual(cwd)
    expect(cwd).not.toEqual(process.cwd())
    expect(path.dirname(configPath)).toEqual(cwd)
    expect(JSON.parse(config)).toEqual(OPENCODE_ISOLATION_CONFIG)
    expect(OPENCODE_ISOLATION_CONFIG.agent[OPENCODE_AGENT].prompt).toEqual(
      TOOL_SYSTEM_PROMPT,
    )
    expect(files).toEqual(['config', 'opencode.json'])
    expect(configHome).toEqual(path.join(cwd, 'config'))
    expect(configHomeFiles).toEqual([])
    expect(configContent).toEqual(undefined)
    expect(permission).toEqual(undefined)
    expect(disableProjectConfig).toEqual('1')
    expect(outputTokenMax).toEqual(String(OPENCODE_OUTPUT_TOKEN_MAX))
    expect(disableClaudeCodePrompt).toEqual('1')
    expect(args[args.indexOf('--model') + 1]).toEqual('opencode-go/test-model')
    expect(args[args.indexOf('--agent') + 1]).toEqual(OPENCODE_AGENT)
    expect(args[args.indexOf('--variant') + 1]).toEqual('high')
    expect(args).not.toInclude('--session')
    expect(args[args.indexOf('--title') + 1]).toEqual('templatizer')
    expect(stdin).toEqual('hello model')

    expect(turn.threadId).toEqual('ses_1')
    expect(turn.text).toEqual('{"fields":{}}')
    expect(turn.model).toEqual('opencode-go/test-model')
    expect(turn.usage).toEqual({
      inputTokens: 110,
      cachedInputTokens: 100,
      outputTokens: 4,
      reasoningOutputTokens: 1,
    })
    expect(fs.existsSync(cwd)).toEqual(true)
  })

  it('resumes by session id in the same scratch directory, where opencode keeps the session', async () => {
    fs.writeFileSync(eventsFile, cleanTurn)
    const client = new OpenCodeClient({
      binary,
      model: 'opencode-go/test-model',
    })
    await client.start({ prompt: 'first', schema: {} })
    const first = record()
    await client.resume({ threadId: 'ses_1', prompt: 'fix it', schema: {} })

    const { args, stdin, cwd, pwd } = record()
    expect(cwd).toEqual(first.cwd)
    expect(args[args.indexOf('--session') + 1]).toEqual('ses_1')
    expect(args[args.indexOf('--dir') + 1]).toEqual(cwd)
    expect(args[args.indexOf('--agent') + 1]).toEqual(OPENCODE_AGENT)
    expect(pwd).toEqual(cwd)
    expect(args).not.toInclude('--variant')
    expect(args).not.toInclude('--title')
    expect(stdin).toEqual('fix it')
  })

  it('samples a first turn once more when the text holds tool-call markup, and refuses a resumed one at once', async () => {
    fs.writeFileSync(eventsFile, markupTurn)
    const client = new OpenCodeClient({
      binary,
      model: 'opencode-go/test-model',
    })

    const refused: unknown = await client
      .start({ prompt: 'p', schema: {} })
      .catch((error: unknown) => error)
    expect(refused).toBeA(OpenCodeTurnError)
    expect((refused as OpenCodeTurnError).message).toInclude(
      'tool-call markup (DSML)',
    )
    // Both samples are in the trail the loop writes for the refused round.
    expect((refused as OpenCodeTurnError).events.length).toEqual(2)
    expect(calls()).toEqual(2)

    fs.writeFileSync(countFile, '0')
    await expect(
      client.resume({ threadId: 'ses_1', prompt: 'p', schema: {} }),
    ).toBeRejectedWith(OpenCodeTurnError, 'tool-call markup (DSML)')
    expect(calls()).toEqual(1)
  })

  it('keeps the refused sample in the turn that replaces it: its events, tokens and time', async () => {
    fs.writeFileSync(
      `${eventsFile}.1`,
      [
        markupTurn,
        '{"type":"step_finish","sessionID":"ses_1","part":{"type":"step-finish","tokens":{"input":5,"output":7,"reasoning":2,"cache":{"read":50,"write":0}}}}',
      ].join('\n'),
    )
    fs.writeFileSync(eventsFile, cleanTurn)
    const client = new OpenCodeClient({
      binary,
      model: 'opencode-go/test-model',
    })

    const turn = await client.start({ prompt: 'p', schema: {} })

    expect(calls()).toEqual(2)
    expect(turn.text).toEqual('{"fields":{}}')
    expect(turn.events.length).toEqual(5)
    expect(turn.usage).toEqual({
      inputTokens: 165,
      cachedInputTokens: 150,
      outputTokens: 13,
      reasoningOutputTokens: 3,
    })
  })
})

function restoreEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    Reflect.deleteProperty(process.env, name)
  } else {
    process.env[name] = value
  }
}

interface Record {
  args: string[]
  stdin: string
  cwd: string
  pwd: string | undefined
  configPath: string
  config: string
  files: string[]
  configHome: string | undefined
  configHomeFiles: string[]
  configContent: string | undefined
  permission: string | undefined
  disableProjectConfig: string | undefined
  outputTokenMax: string | undefined
  disableClaudeCodePrompt: string | undefined
}

/**
 * An `opencode` stand-in: records argv, cwd, `$PWD`, the config file
 * `$OPENCODE_CONFIG` names, the scratch directory's contents (read now,
 * because the client deletes the directory after the turn), the global
 * config directory and the config environment variables, counts its
 * invocations, prints the events file (or
 * `<events file>.<n>` on the n-th invocation, when there is one) and exits
 * cleanly.
 */
function writeFakeOpenCode(
  directory: string,
  recordFile: string,
  eventsFile: string,
  countFile: string,
): string {
  const script = path.join(directory, 'fake-opencode.js')
  fs.writeFileSync(
    script,
    `
const fs = require('fs')
const path = require('path')
const args = process.argv.slice(2)
const stdin = fs.readFileSync(0, 'utf8')
const configPath = process.env.OPENCODE_CONFIG
const cwd = process.cwd()
fs.writeFileSync(${JSON.stringify(recordFile)}, JSON.stringify({
  args,
  stdin,
  cwd,
  pwd: process.env.PWD,
  configPath,
  config: fs.readFileSync(configPath, 'utf8'),
  files: fs.readdirSync(cwd),
  configHome: process.env.XDG_CONFIG_HOME,
  configHomeFiles: fs.readdirSync(process.env.XDG_CONFIG_HOME),
  configContent: process.env.OPENCODE_CONFIG_CONTENT,
  permission: process.env.OPENCODE_PERMISSION,
  disableProjectConfig: process.env.OPENCODE_DISABLE_PROJECT_CONFIG,
  outputTokenMax: process.env.OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX,
  disableClaudeCodePrompt: process.env.OPENCODE_DISABLE_CLAUDE_CODE_PROMPT,
}))
const count = fs.existsSync(${JSON.stringify(countFile)}) ? Number(fs.readFileSync(${JSON.stringify(countFile)}, 'utf8')) : 0
fs.writeFileSync(${JSON.stringify(countFile)}, String(count + 1))
const numbered = ${JSON.stringify(eventsFile)} + '.' + (count + 1)
const events = fs.existsSync(numbered) ? numbered : ${JSON.stringify(eventsFile)}
process.stdout.write(fs.readFileSync(events, 'utf8') + '\\n')
`,
  )
  const binary = path.join(directory, 'opencode')
  fs.writeFileSync(
    binary,
    `#!/bin/sh\nexec "${process.execPath}" "${script}" "$@"\n`,
  )
  fs.chmodSync(binary, 0o755)
  return binary
}
