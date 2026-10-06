import { expect } from 'earl'
import fs from 'fs'
import os from 'os'
import path from 'path'
import {
  CODEX_INSTRUCTIONS_FILE,
  CODEX_ISOLATION_FLAGS,
  CodexClient,
  CodexTurnError,
  readModelFromRollout,
} from './CodexClient'
import { TOOL_SYSTEM_PROMPT } from './toolSystemPrompt'

/**
 * Runs the client against a stand-in `codex` executable that records its
 * arguments and stdin and replays a scripted event stream. Network is never
 * touched; what is pinned is the contract with the real binary: the exact
 * isolation flags on first and resumed turns, the instructions file that
 * replaces Codex's own prompt, the prompt arriving on stdin, the thread id
 * and usage read from events, the final message taken from
 * `--output-last-message`, and the ways a turn is refused (tool item,
 * failed or unfinished turn, timeout) next to the errors that are not
 * fatal.
 */
describe(CodexClient.name, () => {
  let directory: string
  let binary: string
  let recordFile: string
  let eventsFile: string
  let optionsFile: string

  const THREAD = '01a0c5ce-7d5d-7581-ba1f-25d1c3150a2a'
  const cleanTurn = [
    `{"type":"thread.started","thread_id":"${THREAD}"}`,
    '{"type":"turn.started"}',
    '{"type":"item.completed","item":{"id":"item_0","type":"agent_message","text":"from events"}}',
    '{"type":"turn.completed","usage":{"input_tokens":12,"output_tokens":3}}',
  ].join('\n')

  beforeEach(() => {
    directory = fs.mkdtempSync(
      path.join(os.tmpdir(), 'discovery-templatizer-codex-'),
    )
    recordFile = path.join(directory, 'record.json')
    eventsFile = path.join(directory, 'events.jsonl')
    optionsFile = path.join(directory, 'options.json')
    binary = writeFakeCodex(directory, recordFile, eventsFile, optionsFile)
  })

  function behave(options: FakeOptions): void {
    fs.writeFileSync(optionsFile, JSON.stringify(options))
  }

  afterEach(() => {
    fs.rmSync(directory, { recursive: true, force: true })
  })

  function record(): {
    args: string[]
    stdin: string
    cwd: string
    instructions: string | undefined
  } {
    return JSON.parse(fs.readFileSync(recordFile, 'utf8'))
  }

  it('starts a thread with the isolation flags, the templatizer instructions, the prompt on stdin and no --ephemeral, and reads the turn', async () => {
    fs.writeFileSync(eventsFile, cleanTurn)
    const client = new CodexClient({
      binary,
      codexHome: directory,
      model: 'gpt-test',
      reasoningEffort: 'high',
    })
    const turn = await client.start({ prompt: 'hello model', schema: {} })

    const { args, stdin, cwd, instructions } = record()
    expect(args[0]).toEqual('exec')
    expect(args.slice(1, 1 + CODEX_ISOLATION_FLAGS.length)).toEqual([
      ...CODEX_ISOLATION_FLAGS,
    ])
    expect(CODEX_ISOLATION_FLAGS).toInclude('project_doc_max_bytes=0')
    expect(CODEX_ISOLATION_FLAGS).toInclude('agents.enabled=false')
    expect(CODEX_ISOLATION_FLAGS).toInclude('include_environment_context=false')
    expect(args[1 + CODEX_ISOLATION_FLAGS.length + 1] ?? '').toEqual(
      `model_instructions_file=${JSON.stringify(path.join(cwd, CODEX_INSTRUCTIONS_FILE))}`,
    )
    expect(instructions).toEqual(TOOL_SYSTEM_PROMPT)
    expect(args).toInclude('--json')
    expect(args).toInclude('--output-last-message')
    expect(args).toInclude('--model')
    expect(args[args.indexOf('--model') + 1]).toEqual('gpt-test')
    expect(args).toInclude('model_reasoning_effort="high"')
    expect(args).not.toInclude('--ephemeral')
    expect(args).not.toInclude('--output-schema')
    expect(args[args.length - 1]).toEqual('-')
    expect(stdin).toEqual('hello model')
    expect(cwd).not.toEqual(process.cwd())

    expect(turn.threadId).toEqual(THREAD)
    expect(turn.text).toEqual('last message file')
    expect(turn.model).toEqual('gpt-test')
    expect(turn.usage).toEqual({
      inputTokens: 12,
      cachedInputTokens: undefined,
      outputTokens: 3,
      reasoningOutputTokens: undefined,
    })
    expect(turn.events.length).toEqual(4)
    expect(turn.durationMs).toBeGreaterThanOrEqual(0)
  })

  it('resumes by thread id with the same isolation flags re-applied', async () => {
    fs.writeFileSync(eventsFile, cleanTurn)
    const client = new CodexClient({ binary, codexHome: directory })
    await client.resume({ threadId: THREAD, prompt: 'fix it', schema: {} })
    const { args, stdin, instructions } = record()
    expect(args.slice(0, 3)).toEqual(['exec', 'resume', THREAD])
    expect(args.slice(3, 3 + CODEX_ISOLATION_FLAGS.length)).toEqual([
      ...CODEX_ISOLATION_FLAGS,
    ])
    expect(args[3 + CODEX_ISOLATION_FLAGS.length + 1] ?? '').toMatchRegex(
      /^model_instructions_file="/,
    )
    expect(instructions).toEqual(TOOL_SYSTEM_PROMPT)
    expect(stdin).toEqual('fix it')
  })

  it('writes the schema to a file and passes --output-schema only when asked to', async () => {
    fs.writeFileSync(eventsFile, cleanTurn)
    const client = new CodexClient({
      binary,
      codexHome: directory,
      outputSchema: true,
    })
    await client.start({ prompt: 'p', schema: { type: 'object' } })
    const { args } = record()
    expect(args).toInclude('--output-schema')
    expect(args[args.indexOf('--output-schema') + 1] ?? '').toMatchRegex(
      /output-schema\.json$/,
    )
  })

  it('falls back to the last agent message when the last-message file is missing, and reads the model from the rollout', async () => {
    fs.writeFileSync(eventsFile, cleanTurn)
    writeRollout(directory, THREAD, 'gpt-5.6-sol')
    behave({ noLastMessage: true })
    const client = new CodexClient({ binary, codexHome: directory })
    const turn = await client.start({ prompt: 'p', schema: {} })
    expect(turn.text).toEqual('from events')
    expect(turn.model).toEqual('gpt-5.6-sol')
  })

  it('refuses a turn whose events show a tool ran, even when codex exits cleanly, and keeps what it cost', async () => {
    fs.writeFileSync(
      eventsFile,
      [
        cleanTurn,
        '{"type":"item.completed","item":{"id":"item_9","type":"command_execution","command":"cat /etc/passwd"}}',
      ].join('\n'),
    )
    const client = new CodexClient({ binary, codexHome: directory })
    const refused: unknown = await client
      .start({ prompt: 'p', schema: {} })
      .then(
        () => undefined,
        (error: unknown) => error,
      )

    expect(refused).toBeA(CodexTurnError)
    const error = refused as CodexTurnError
    expect(error.message).toMatchRegex(
      /used tools despite isolation flags: command_execution: cat \/etc\/passwd/,
    )
    expect(error.usage).toEqual({
      inputTokens: 12,
      cachedInputTokens: undefined,
      outputTokens: 3,
      reasoningOutputTokens: undefined,
    })
  })

  it('reports the API error and stderr when codex fails', async () => {
    fs.writeFileSync(
      eventsFile,
      [
        `{"type":"thread.started","thread_id":"${THREAD}"}`,
        JSON.stringify({
          type: 'error',
          message: JSON.stringify({
            error: { message: 'schema must have a type key' },
          }),
        }),
      ].join('\n'),
    )
    behave({ exitCode: 1, stderr: 'boom on stderr' })
    const client = new CodexClient({ binary, codexHome: directory })
    await expect(client.start({ prompt: 'p', schema: {} })).toBeRejectedWith(
      CodexTurnError,
      /schema must have a type key[\s\S]*boom on stderr/,
    )
  })

  it('refuses a turn that failed, with the reason codex gave', async () => {
    fs.writeFileSync(
      eventsFile,
      [
        `{"type":"thread.started","thread_id":"${THREAD}"}`,
        '{"type":"turn.started"}',
        '{"type":"error","message":"stream disconnected"}',
        '{"type":"turn.failed","error":{"message":"stream disconnected"}}',
      ].join('\n'),
    )
    behave({ exitCode: 1 })
    const client = new CodexClient({ binary, codexHome: directory })
    await expect(client.start({ prompt: 'p', schema: {} })).toBeRejectedWith(
      CodexTurnError,
      /codex turn failed: stream disconnected/,
    )
  })

  it('takes the answer of a turn that reported an error and then completed, as after a reconnect', async () => {
    fs.writeFileSync(
      eventsFile,
      [
        `{"type":"thread.started","thread_id":"${THREAD}"}`,
        '{"type":"turn.started"}',
        '{"type":"error","message":"Reconnecting... 1/2"}',
        '{"type":"item.completed","item":{"id":"item_0","type":"agent_message","text":"from events"}}',
        '{"type":"turn.completed","usage":{"input_tokens":12,"output_tokens":3}}',
      ].join('\n'),
    )
    const client = new CodexClient({ binary, codexHome: directory })
    const turn = await client.start({ prompt: 'p', schema: {} })
    expect(turn.text).toEqual('last message file')
    expect(turn.events.length).toEqual(5)
  })

  it('kills a turn that exceeds the timeout', async () => {
    fs.writeFileSync(eventsFile, cleanTurn)
    behave({ sleepMs: 5_000 })
    const client = new CodexClient({
      binary,
      codexHome: directory,
      timeoutMs: 200,
    })
    const started = Date.now()
    await expect(client.start({ prompt: 'p', schema: {} })).toBeRejectedWith(
      CodexTurnError,
      /did not finish within 200 ms/,
    )
    expect(Date.now() - started).toBeLessThan(4_000)
  })

  it('fails clearly when the binary does not exist', async () => {
    const client = new CodexClient({
      binary: path.join(directory, 'no-such-codex'),
      codexHome: directory,
    })
    await expect(client.start({ prompt: 'p', schema: {} })).toBeRejectedWith(
      /could not run .*no-such-codex/,
    )
  })

  describe(readModelFromRollout.name, () => {
    it('returns the model of the last turn_context, or undefined without a rollout', () => {
      expect(
        readModelFromRollout(path.join(directory, 'sessions'), THREAD),
      ).toEqual(undefined)
      writeRollout(directory, THREAD, 'gpt-x')
      expect(
        readModelFromRollout(path.join(directory, 'sessions'), THREAD),
      ).toEqual('gpt-x')
    })

    it('returns undefined when the sessions directory cannot be read', () => {
      const notADirectory = path.join(directory, 'sessions-file')
      fs.writeFileSync(notADirectory, '')
      expect(readModelFromRollout(notADirectory, THREAD)).toEqual(undefined)
    })
  })
})

interface FakeOptions {
  sleepMs?: number
  exitCode?: number
  stderr?: string
  noLastMessage?: boolean
}

/**
 * A `codex` stand-in: records argv, cwd, stdin and the contents of the
 * `model_instructions_file` named in argv to `recordFile` (read now, because
 * the client deletes the directory after the turn), reads its behaviour from
 * `optionsFile`, sleeps if asked, prints the events file to stdout, writes
 * the last-message file named by `--output-last-message`, and exits with the
 * requested code.
 */
function writeFakeCodex(
  directory: string,
  recordFile: string,
  eventsFile: string,
  optionsFile: string,
): string {
  const script = path.join(directory, 'fake-codex.js')
  fs.writeFileSync(
    script,
    `
const fs = require('fs')
const args = process.argv.slice(2)
const stdin = fs.readFileSync(0, 'utf8')
const instructionsArg = args.find((arg) => arg.startsWith('model_instructions_file='))
const instructions = instructionsArg === undefined ? undefined : fs.readFileSync(JSON.parse(instructionsArg.slice('model_instructions_file='.length)), 'utf8')
fs.writeFileSync(${JSON.stringify(recordFile)}, JSON.stringify({ args, stdin, cwd: process.cwd(), instructions }))
const options = fs.existsSync(${JSON.stringify(optionsFile)}) ? JSON.parse(fs.readFileSync(${JSON.stringify(optionsFile)}, 'utf8')) : {}
setTimeout(() => {
  process.stdout.write(fs.readFileSync(${JSON.stringify(eventsFile)}, 'utf8') + '\\n')
  if (options.stderr) process.stderr.write(options.stderr + '\\n')
  const at = args.indexOf('--output-last-message')
  if (at !== -1 && !options.noLastMessage) fs.writeFileSync(args[at + 1], 'last message file')
  process.exit(options.exitCode ?? 0)
}, options.sleepMs ?? 0)
`,
  )
  const binary = path.join(directory, 'codex')
  fs.writeFileSync(
    binary,
    `#!/bin/sh\nexec "${process.execPath}" "${script}" "$@"\n`,
  )
  fs.chmodSync(binary, 0o755)
  return binary
}

function writeRollout(codexHome: string, threadId: string, model: string) {
  const day = path.join(codexHome, 'sessions', '2026', '09', '21')
  fs.mkdirSync(day, { recursive: true })
  fs.writeFileSync(
    path.join(day, `rollout-2026-09-21T21-10-39-${threadId}.jsonl`),
    [
      JSON.stringify({ type: 'session_meta', payload: { id: threadId } }),
      JSON.stringify({ type: 'turn_context', payload: { model: 'older' } }),
      JSON.stringify({ type: 'turn_context', payload: { model } }),
    ].join('\n'),
  )
}
