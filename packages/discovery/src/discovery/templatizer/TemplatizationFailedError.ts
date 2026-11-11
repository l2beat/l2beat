/**
 * `--ai` was asked to templatize a contract and could not, so discovery
 * stops before saving. A contract left untemplatized would look in
 * discovered.json exactly like one nobody asked the model about, and a
 * missing template means missing values for as long as nobody notices.
 * Stopping costs little: templates written earlier in the run are already
 * in `_templates` and match on the next run without a model call.
 */
export type TemplatizationFailure =
  /** The model did not answer: CLI down, quota or rate limit, network, timeout. */
  | 'model-unavailable'
  /** The model answered every round, but no draft passed the checks. */
  | 'no-acceptable-draft'
  /** A bug in the templatizer itself. */
  | 'internal'

/** What was being done, as the message names it, and how to do without it. */
export interface TemplatizationTask {
  /** E.g. `--ai could not templatize ScrollChain (eth:0xa13B…)`. */
  failedTo: string
  /** E.g. `rerun without --ai to leave this contract untemplatized on purpose`. */
  bypass: string
}

export class TemplatizationFailedError extends Error {
  constructor(
    readonly failure: TemplatizationFailure,
    task: TemplatizationTask,
    readonly reason: string,
    readonly trail?: string,
    options?: ErrorOptions,
  ) {
    super(
      [
        `${task.failedTo}: ${reason}`,
        'Discovery stopped without writing discovered.json, so no contract is left without the template it was meant to get. Templates written earlier in this run stay in _templates and match on the next run without a model call.',
        `${ADVICE[failure]} Or ${task.bypass}.`,
        ...(trail === undefined ? [] : [`Trail: ${trail}`]),
      ].join('\n'),
      options,
    )
    this.name = 'TemplatizationFailedError'
  }
}

const ADVICE: Record<TemplatizationFailure, string> = {
  'model-unavailable':
    'The model did not answer: check that the opencode or Codex login works, the quota is not spent and the network is up, then rerun.',
  'no-acceptable-draft':
    "The model answered, but no draft passed the checks: the trail's last findings say why. Rerun (answers vary), raise --ai-rounds or --ai-effort, or write the template by hand.",
  internal: 'This is a bug in the templatizer; the error says where.',
}
