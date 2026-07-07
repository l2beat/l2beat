import { assertUnreachable } from '@l2beat/shared-pure'
import type {
  AbstractTokenRef,
  IngestionOutcomeView,
  IngestionTraceView,
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
import { IngestionLog } from './IngestionLog'
import { LoadingState } from './LoadingState'

export interface IngestionPreviewState {
  chain: string
  address: string
  trace: IngestionTraceView | undefined
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

function TraceView({ trace }: { trace: IngestionTraceView }) {
  return (
    <div className="min-w-0 space-y-4">
      <IngestionLog log={trace.text} />
      <section className="space-y-2">
        <h3 className="font-medium text-sm">Outcome</h3>
        <OutcomeView outcome={trace.outcome} />
      </section>
    </div>
  )
}

export function ConflictBadge() {
  return (
    <Badge
      variant="outline"
      className="border-destructive text-destructive dark:border-destructive/60 dark:text-destructive-foreground"
    >
      Conflict
    </Badge>
  )
}

export function formatAbstractRef(ref: AbstractTokenRef) {
  return `${ref.id}:${ref.symbol}`
}

function OutcomeView({ outcome }: { outcome: IngestionOutcomeView }) {
  switch (outcome.kind) {
    case 'skip':
      return <Badge variant="outline">Skip</Badge>
    case 'conflict':
      return <ConflictBadge />
    case 'error':
      return <Badge variant="destructive">Error</Badge>
    case 'noop':
      return <Badge variant="secondary">No update</Badge>
    case 'pending':
      return (
        <Badge>
          {outcome.operation === 'insert' ? 'Add token' : 'Update'} (pending)
        </Badge>
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
          {outcome.deployedToken?.type === 'insert' && (
            <div className="min-w-0 space-y-1">
              <h4 className="font-medium">New deployed token</h4>
              <pre className="max-w-full overflow-x-auto rounded bg-muted p-2 text-xs">
                {JSON.stringify(outcome.deployedToken.record, null, 2)}
              </pre>
            </div>
          )}
          {outcome.deployedToken?.type === 'update' && (
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
          {outcome.tokenRelations.length > 0 && (
            <div className="min-w-0 space-y-1">
              <h4 className="font-medium">Token relations</h4>
              <pre className="max-w-full overflow-x-auto rounded bg-muted p-2 text-xs">
                {JSON.stringify(outcome.tokenRelations, null, 2)}
              </pre>
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
