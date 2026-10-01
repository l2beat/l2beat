/**
 * Picks the client for the `--ai-model` string.
 *
 * opencode names models `provider/model`, and `opencode/…` is its own
 * gateway, so that prefix is an unambiguous sign the model is not one of
 * Codex's; the whole string then goes to opencode unchanged. Everything
 * else, no model at all included, goes to Codex, whose default model is the
 * templatizer's default.
 */
import { CodexClient } from './CodexClient'
import type { ModelClient } from './ModelClient'
import { OpenCodeClient } from './OpenCodeClient'

const OPENCODE_PREFIX = 'opencode/'

export function createModelClient(model: string | undefined): ModelClient {
  if (model?.startsWith(OPENCODE_PREFIX)) {
    return new OpenCodeClient({ model })
  }
  return new CodexClient({ model })
}

/** The model as a provenance header names it, even when none was asked for. */
export function describeModel(model: string | undefined): string {
  return model ?? 'codex default model'
}
