import { assertUnreachable } from '@l2beat/shared-pure'
import type {
  AbstractTokenRef,
  IngestionOutcome,
  IngestionOutcomeView,
  IngestionStep,
  IngestionStepView,
  IngestionTrace,
  IngestionTraceView,
} from './IngestionTrace'

/**
 * Canonical text descriptions for each `IngestionStep` and `IngestionOutcome`.
 * Both the UI's preview dialog and the persisted ingestion log come from these
 * functions, so there is exactly one source of truth for "what did the
 * ingestion decide and why".
 */

/**
 * Renders an `IngestionTrace` as a plain-text log: one line per decision step,
 * followed by a single outcome line. Persisted on `TokenDbHistory` for
 * every command produced by automatic ingestion so the reasoning behind each
 * write is part of the audit trail.
 */
export function formatIngestionTrace(trace: IngestionTrace): string {
  const lines: string[] = []
  lines.push(`Ingestion ID: ${trace.id}`)
  lines.push(`Address: ${trace.address.chain}:${trace.address.address}`)
  trace.steps.forEach((step, index) => {
    lines.push(`${index + 1}. ${describeIngestionStep(step)}`)
  })
  lines.push(`Outcome: ${describeIngestionOutcome(trace.outcome)}`)
  return lines.join('\n')
}

export function describeIngestionStep(step: IngestionStep): string {
  switch (step.kind) {
    case 'invalid-address':
      return `Address ${step.rawAddress} could not be normalized.`
    case 'existing-token':
      return `Found existing deployed token (abstract: ${step.record.abstractTokenId ?? 'none'}).`
    case 'no-existing-token':
      return 'No existing deployed token in TokenDB.'
    case 'transfer-evidence': {
      const refs =
        step.abstractTokens.length === 0
          ? 'no abstract tokens'
          : step.abstractTokens.map(formatRef).join(', ')
      return `Found ${step.total} transfers (${step.nonSwapping} non-swapping). Other sides resolve to: ${refs}.`
    }
    case 'resolved-from-transfers':
      return `Resolved abstract token ${formatRef(step.abstractToken)} from non-swapping transfers.`
    case 'resolved-from-existing':
      return `Reused existing abstract token ${formatRef(step.abstractToken)}.`
    case 'coingecko-coin-found':
      return `CoinGecko returned coin ${step.coinId} (${step.symbol}).`
    case 'coingecko-coin-not-found':
      return 'CoinGecko has no coin for this address.'
    case 'resolved-from-coingecko-existing-abstract':
      return `Reused abstract token ${formatRef(step.abstractToken)} linked to CoinGecko coin ${step.coinId}.`
    case 'resolved-from-coingecko-new-abstract':
      return `Will create new abstract token for CoinGecko coin ${step.coingeckoId} (${step.symbol}).`
    case 'fetched-coingecko-abstract':
      return `Built abstract token ${step.record.id} (${step.record.symbol}) from CoinGecko coin ${step.record.coingeckoId}.`
    case 'corrected-coingecko-symbol-casing':
      return `Corrected CoinGecko symbol casing ${step.from} → ${step.to} from the deployed-token symbol.`
    case 'fetched-facts': {
      const base = `Fetched deployed-token facts: symbol=${String(step.facts.symbol)}, decimals=${String(step.facts.decimals)}, deploymentTimestamp=${String(step.facts.deploymentTimestamp)}, isContract=${String(step.facts.isContract)}.`
      if (step.facts.warnings.length === 0) return base
      const warnings = step.facts.warnings
        .map((warning) => `[${warning.field}] ${warning.message}`)
        .join('; ')
      return `${base} Warnings: ${warnings}.`
    }
    default:
      assertUnreachable(step)
  }
}

export function describeIngestionOutcome(outcome: IngestionOutcome): string {
  switch (outcome.kind) {
    case 'skip':
      return `skip — ${outcome.reason}.`
    case 'conflict':
      return `conflict — ${outcome.message}`
    case 'error':
      return `error — ${outcome.message}`
    case 'noop':
      return 'noop — existing deployed token already matches the resolved abstract token.'
    case 'pending': {
      const target =
        outcome.abstract.kind === 'existing'
          ? formatRef(outcome.abstract.token)
          : `CoinGecko coin ${outcome.abstract.coingeckoId}`
      return `pending ${outcome.operation} — abstract ${target}.`
    }
    case 'write': {
      const dt = outcome.deployedToken
      if (dt.type === 'insert') {
        return `write — insert deployed token ${dt.record.chain}:${dt.record.address} (abstract: ${dt.record.abstractTokenId ?? 'none'}).`
      }
      const fields = Object.keys(dt.update).join(', ') || '(no fields)'
      return `write — update deployed token ${dt.pk.chain}:${dt.pk.address}; fields: ${fields}.`
    }
    default:
      assertUnreachable(outcome)
  }
}

function formatRef(ref: AbstractTokenRef): string {
  return `${ref.id}:${ref.symbol}`
}

/**
 * Attaches a pre-rendered `description` to each step and to the outcome.
 * Called at the tRPC boundary so that the UI never has to call the describer
 * functions itself.
 */
export function toIngestionTraceView(
  trace: IngestionTrace,
): IngestionTraceView {
  return {
    id: trace.id,
    address: trace.address,
    steps: trace.steps.map(toIngestionStepView),
    outcome: toIngestionOutcomeView(trace.outcome),
    text: formatIngestionTrace(trace),
  }
}

export function toIngestionStepView(step: IngestionStep): IngestionStepView {
  return { ...step, description: describeIngestionStep(step) }
}

export function toIngestionOutcomeView(
  outcome: IngestionOutcome,
): IngestionOutcomeView {
  return { ...outcome, description: describeIngestionOutcome(outcome) }
}
