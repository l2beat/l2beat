import { assertUnreachable } from '@l2beat/shared-pure'
import type {
  IngestionOutcome,
  IngestionStep,
  IngestionTrace,
} from '@l2beat/token-backend'
import { diff } from '~/utils/getDiff'
import { Badge } from './core/Badge'
import { Button } from './core/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './core/Dialog'
import { Diff } from './Diff'
import { LoadingState } from './LoadingState'

export interface IngestionPreviewState {
  chain: string
  address: string
  trace: IngestionTrace | undefined
  isLoading: boolean
  error: string | undefined
}

export function IngestionPreviewDialog({
  state,
  onClose,
}: {
  state: IngestionPreviewState | undefined
  onClose: () => void
}) {
  if (!state) return null

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-y-auto sm:max-w-6xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="min-w-0">
          <DialogTitle>Ingestion preview</DialogTitle>
          <DialogDescription className="break-words pr-6">
            What would happen if {state.chain}:{state.address} were processed
            right now. No changes are written.
          </DialogDescription>
        </DialogHeader>

        {state.isLoading && <LoadingState className="py-8" />}
        {state.error && (
          <div className="rounded border border-destructive bg-destructive/10 p-3 text-destructive text-sm">
            {state.error}
          </div>
        )}
        {state.trace && <TraceView trace={state.trace} />}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TraceView({ trace }: { trace: IngestionTrace }) {
  return (
    <div className="min-w-0 space-y-4">
      <section className="space-y-1">
        <h3 className="font-medium text-sm">Steps</h3>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {trace.steps.map((step, index) => (
            <li key={index}>
              <StepLine step={step} />
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-2">
        <h3 className="font-medium text-sm">Outcome</h3>
        <OutcomeView outcome={trace.outcome} />
      </section>
    </div>
  )
}

function StepLine({ step }: { step: IngestionStep }) {
  switch (step.kind) {
    case 'invalid-address':
      return (
        <span>
          Address <code className="font-mono">{step.rawAddress}</code> could not
          be normalized.
        </span>
      )
    case 'existing-token':
      return (
        <span>
          Found existing deployed token (abstract:{' '}
          <code className="font-mono">
            {step.record.abstractTokenId ?? 'none'}
          </code>
          ).
        </span>
      )
    case 'no-existing-token':
      return <span>No existing deployed token in TokenDB.</span>
    case 'transfer-evidence':
      return (
        <span>
          Found {step.total} transfers ({step.nonSwapping} non-swapping). Other
          sides resolve to:{' '}
          {step.abstractTokenIds.length === 0
            ? 'no abstract tokens'
            : step.abstractTokenIds.map((id) => `"${id}"`).join(', ')}
          .
        </span>
      )
    case 'resolved-from-transfers':
      return (
        <span>
          Resolved abstract token{' '}
          <code className="font-mono">{step.abstractTokenId}</code> from
          non-swapping transfers.
        </span>
      )
    case 'resolved-from-existing':
      return (
        <span>
          Reused existing abstract token{' '}
          <code className="font-mono">{step.abstractTokenId}</code>.
        </span>
      )
    case 'coingecko-coin-found':
      return (
        <span>
          CoinGecko returned coin{' '}
          <code className="font-mono">{step.coinId}</code> ({step.symbol}).
        </span>
      )
    case 'coingecko-coin-not-found':
      return <span>CoinGecko has no coin for this address.</span>
    case 'resolved-from-coingecko-existing-abstract':
      return (
        <span>
          Reused abstract token{' '}
          <code className="font-mono">{step.abstractTokenId}</code> linked to
          CoinGecko coin <code className="font-mono">{step.coinId}</code>.
        </span>
      )
    case 'resolved-from-coingecko-new-abstract':
      return (
        <span>
          Will create new abstract token for CoinGecko coin{' '}
          <code className="font-mono">{step.coingeckoId}</code> ({step.symbol}).
        </span>
      )
    case 'fetched-coingecko-abstract':
      return (
        <span>
          Built abstract token{' '}
          <code className="font-mono">{step.record.id}</code> (
          {step.record.symbol}) from CoinGecko coin{' '}
          <code className="font-mono">{step.record.coingeckoId}</code>.
        </span>
      )
    case 'fetched-facts': {
      const warnings = step.facts.warnings
      return (
        <span>
          Fetched deployed-token facts: symbol={String(step.facts.symbol)},
          decimals={String(step.facts.decimals)}, deploymentTimestamp=
          {String(step.facts.deploymentTimestamp)}, isContract=
          {String(step.facts.isContract)}.
          {warnings.length > 0 && (
            <ul className="mt-1 list-disc pl-5 text-muted-foreground text-xs">
              {warnings.map((warning, index) => (
                <li key={index}>
                  [{warning.field}] {warning.message}
                </li>
              ))}
            </ul>
          )}
        </span>
      )
    }
    default:
      assertUnreachable(step)
  }
}

function OutcomeView({ outcome }: { outcome: IngestionOutcome }) {
  switch (outcome.kind) {
    case 'skip':
      return (
        <div className="flex flex-col gap-2 text-sm">
          <Badge variant="outline">Skip</Badge>
          <span>{outcome.reason}. The queue entry would be removed.</span>
        </div>
      )
    case 'conflict':
      return (
        <div className="flex flex-col gap-2 text-sm">
          <Badge variant="outline">Conflict</Badge>
          <span>{outcome.message}</span>
        </div>
      )
    case 'error':
      return (
        <div className="flex flex-col gap-2 text-sm">
          <Badge variant="destructive">Error</Badge>
          <span>{outcome.message}</span>
        </div>
      )
    case 'noop':
      return (
        <div className="flex flex-col gap-2 text-sm">
          <Badge variant="secondary">No change</Badge>
          <span>
            Existing deployed token already matches the resolved abstract token.
            The queue entry would be removed.
          </span>
        </div>
      )
    case 'pending':
      return (
        <div className="flex flex-col gap-2 text-sm">
          <Badge>
            {outcome.operation === 'insert' ? 'Add token' : 'Update'} (pending)
          </Badge>
          <span>
            Would{' '}
            {outcome.operation === 'insert'
              ? 'insert a new deployed token'
              : 'update the existing deployed token'}{' '}
            with abstract{' '}
            {outcome.abstract.kind === 'existing' ? (
              <code className="font-mono">{outcome.abstract.id}</code>
            ) : (
              <>
                from CoinGecko coin{' '}
                <code className="font-mono">
                  {outcome.abstract.coingeckoId}
                </code>
              </>
            )}
            .
          </span>
        </div>
      )
    case 'write':
      return (
        <div className="min-w-0 space-y-3 text-sm">
          <Badge>Write</Badge>
          {outcome.newAbstractToken && (
            <div className="min-w-0 space-y-1">
              <h4 className="font-medium">New abstract token</h4>
              <pre className="max-w-full overflow-x-auto rounded bg-muted p-2 text-xs">
                {JSON.stringify(outcome.newAbstractToken, null, 2)}
              </pre>
            </div>
          )}
          {outcome.deployedToken.type === 'insert' ? (
            <div className="min-w-0 space-y-1">
              <h4 className="font-medium">New deployed token</h4>
              <pre className="max-w-full overflow-x-auto rounded bg-muted p-2 text-xs">
                {JSON.stringify(outcome.deployedToken.record, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="min-w-0 space-y-1">
              <h4 className="font-medium">Deployed token update</h4>
              <Diff
                differences={diff(outcome.deployedToken.existing, {
                  ...outcome.deployedToken.existing,
                  ...outcome.deployedToken.update,
                })}
              />
            </div>
          )}
          {outcome.neighborsToEnqueue.length > 0 && (
            <div className="space-y-1">
              <h4 className="font-medium">Re-enqueued neighbors</h4>
              <ul className="list-disc pl-5 text-muted-foreground text-xs">
                {outcome.neighborsToEnqueue.map((neighbor, index) => (
                  <li key={index} className="font-mono">
                    {neighbor.chain}:{neighbor.address}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    default:
      assertUnreachable(outcome)
  }
}
