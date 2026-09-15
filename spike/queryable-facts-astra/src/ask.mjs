import { execFile } from 'node:child_process'
import { mkdtemp, writeFile, readFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './pipeline.mjs'
import { answerSchema, makeBriefing, inspect, checkAnswer } from './briefing.mjs'

export function aiConfig() {
  return { provider: 'Codex CLI', model: process.env.ASTRA_MODEL || 'gpt-5.6-sol' }
}

// A bounded retrieval loop. Every request and result is saved and emitted to the UI.
// Each model call receives the index plus only the results requested so far.
export async function ask(run, question, { signal, execute = executeCodex, onEvent = () => {}, maxInspections = 12 } = {}) {
  const briefing = makeBriefing(run, question)
  const config = aiConfig()
  const parent = join(run.runDir, 'asks')
  await mkdir(parent, { recursive: true })
  const askDir = await mkdtemp(join(parent, 'ask-'))
  await writeFile(join(askDir, 'briefing.txt'), briefing.prompt)
  const started = performance.now()
  const trail = []
  const deadline = AbortSignal.timeout(300_000)
  const effectiveSignal = signal ? AbortSignal.any([signal, deadline]) : deadline
  onEvent({ type: 'started', ...config })
  try {
    for (let turn = 0; turn <= maxInspections; turn++) {
      effectiveSignal.throwIfAborted()
      const prompt = briefing.prompt + (trail.length ? `\nINSPECTION HISTORY (actual requests and results)\n${JSON.stringify(trail, null, 2)}\n` : '') +
        (turn === maxInspections ? '\nInspection budget exhausted. Answer from retrieved evidence, identifying remaining unknowns.\n' : '')
      if (prompt.length > 120_000) throw new Error('The investigation reached its context limit. Narrow the question; no final answer was accepted.')
      const turnDir = join(askDir, `turn-${String(turn + 1).padStart(2, '0')}`)
      await mkdir(turnDir)
      await writeFile(join(turnDir, 'prompt.txt'), prompt)
      await writeFile(join(turnDir, 'schema.json'), JSON.stringify(answerSchema, null, 2))
      const raw = await execute(prompt, turnDir, config.model, effectiveSignal)
      await writeFile(join(turnDir, 'response.json'), raw)
      const decision = JSON.parse(raw)
      if (decision.action === 'answer') {
        if (!trail.some((step) => step.evidence?.some((e) => e.kind === 'source'))) throw new Error('The AI attempted to answer without reading source. No final answer was accepted.')
        const answer = checkAnswer(decision, trail)
        const record = { briefing, trail, answer, ...config, elapsedMs: Math.round(performance.now() - started), askDir }
        await writeFile(join(askDir, 'answer.json'), JSON.stringify(record, null, 2))
        return record
      }
      if (decision.action !== 'inspect') throw new Error('AI returned an unknown action.')
      if (turn === maxInspections) throw new Error('The AI requested more inspections than this lesson allows. The partial investigation was saved; no final answer was accepted.')
      let step
      // An invalid request is shown and sent back to the model, not silently fixed.
      try { step = inspect(run, briefing.symbols, decision) }
      catch (error) { step = { tool: decision.tool, target: decision.target, why: decision.why, title: 'Inspection could not run', error: error.message, evidence: [] } }
      trail.push(step)
      await writeFile(join(askDir, 'trail.json'), JSON.stringify(trail, null, 2))
      onEvent({ type: 'inspection', step })
    }
  } catch (error) {
    await writeFile(join(askDir, 'error.txt'), error.message)
    throw error
  }
}

async function executeCodex(prompt, askDir, model, signal) {
  // Use an empty working directory and disable loading project instructions. Auth still comes from the user's installed Codex CLI.
  const cwd = join(askDir, 'workspace')
  await mkdir(cwd)
  const args = ['exec', '--ignore-user-config', '--ephemeral', '--skip-git-repo-check',
    '--sandbox', 'read-only', '--color', 'never', '--model', model,
    '-c', 'project_doc_max_bytes=0', '-c', 'web_search="disabled"',
    '-c', 'features.shell_tool=false', '-c', 'features.multi_agent=false',
    '--output-schema', join(askDir, 'schema.json'),
    '--output-last-message', join(askDir, 'response.json'), '-']
  await writeFile(join(askDir, 'invocation.json'), JSON.stringify({ executable: process.env.CODEX || 'codex', args, cwd }, null, 2))
  await new Promise((resolve, reject) => {
    const child = execFile(process.env.CODEX || 'codex', args,
      { cwd, signal, timeout: 180_000, killSignal: 'SIGKILL', maxBuffer: 2 * 1024 * 1024 },
      async (error, stdout, stderr) => {
        try {
          await writeFile(join(askDir, 'cli.log'), stderr + '\n' + stdout)
          if (error?.code === 'ENOENT') throw new Error('Codex was not found. Install and sign in to the Codex CLI, then retry. The source and rule views remain available without AI.')
          if (error) throw new Error(`Codex did not finish successfully: ${error.message}. Details: ${join(askDir, 'cli.log')}`)
          resolve()
        } catch (failure) { reject(failure) }
      })
    child.stdin.on('error', () => {}) // A failed/aborted process may close stdin early.
    child.stdin.end(prompt)
  })
  return readFile(join(askDir, 'response.json'), 'utf8')
}

// Only load artifacts created by our pipeline. Clients cannot submit derived facts
// or an arbitrary path and have the server treat them as trusted observations.
export async function loadRun(runId) {
  if (typeof runId !== 'string' || !/^stage-01-[A-Za-z0-9]+$/.test(runId)) throw new Error('Invalid run ID. Run the pipeline again.')
  const runDir = join(root, 'out', 'runs', runId)
  const result = JSON.parse(await readFile(join(runDir, 'result.json'), 'utf8'))
  return { ...result, runDir }
}
