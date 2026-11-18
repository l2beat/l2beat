/**
 * The effort levels opencode offers for a model, read from `opencode models
 * <provider> --verbose` once per run. `opencode run --variant` silently
 * ignores a level the model does not have, so without this check a typo,
 * or a level another model has, would run at the model's default effort
 * and nobody would know. Levels differ per model (DeepSeek: low, high, max;
 * some models have none).
 */
import os from 'os'
import { runProcess } from './process'

const LIST_TIMEOUT_MS = 60_000

/** Undefined when opencode does not list the model at all. */
export async function openCodeEffortLevels(
  model: string,
  binary = 'opencode',
): Promise<string[] | undefined> {
  const provider = model.slice(0, model.indexOf('/'))
  const run = await runProcess(
    binary,
    ['models', provider, '--verbose'],
    '',
    os.tmpdir(),
    process.env,
    LIST_TIMEOUT_MS,
  )
  if (run.timedOut || run.exitCode !== 0) {
    throw new Error(
      `\`opencode models ${provider} --verbose\` failed (exit ${run.exitCode}${run.timedOut ? ', timed out' : ''}): ${run.stderr.trim().slice(0, 300)}`,
    )
  }
  return parseVerboseModels(run.stdout).get(model)
}

/**
 * The verbose listing is a `provider/model` line followed by that model as
 * a JSON object, for every model. A block that does not parse means the
 * format changed, and guessing "no levels" would bring back the silent
 * default this module exists to prevent, so it throws.
 */
export function parseVerboseModels(text: string): Map<string, string[]> {
  const parts = text.split(/^([\w.-]+\/\S+)[ \t]*$/m)
  const levels = new Map<string, string[]>()
  for (let i = 1; i < parts.length; i += 2) {
    const name = parts[i] as string
    levels.set(name, variantsOf(name, parts[i + 1] ?? ''))
  }
  return levels
}

function variantsOf(name: string, block: string): string[] {
  let model: unknown
  try {
    model = JSON.parse(block)
  } catch {
    throw new Error(`could not read ${name} in opencode's model list`)
  }
  const variants =
    typeof model === 'object' && model !== null && 'variants' in model
      ? model.variants
      : undefined
  return typeof variants === 'object' && variants !== null
    ? Object.keys(variants)
    : []
}
