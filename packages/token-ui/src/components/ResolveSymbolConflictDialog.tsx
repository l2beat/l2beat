import type { IngestionTraceView } from '@l2beat/token-backend'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useTRPC } from '~/react-query/trpc'
import { cn } from '~/utils/cn'
import { ButtonWithSpinner } from './ButtonWithSpinner'
import { Button } from './core/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './core/Dialog'
import { Input } from './core/Input'
import { IngestionLog } from './IngestionLog'
import { LoadingState } from './LoadingState'

export interface ResolveSymbolConflictTarget {
  chain: string
  address: string
}

type SymbolChoice = 'coingecko' | 'deployed' | 'custom'

/**
 * Lets a researcher resolve a CoinGecko-symbol conflict from the ingestion
 * queue: the dialog re-plans the entry (via `preview`) to get the fresh,
 * structured conflict, offers the CoinGecko symbol, the deployed-token
 * symbol, or a custom value, and applies the choice through the
 * `resolveConflict` mutation.
 */
export function ResolveSymbolConflictDialog({
  target,
  onClose,
}: {
  target: ResolveSymbolConflictTarget | undefined
  onClose: () => void
}) {
  if (!target) return null
  return (
    <ResolveSymbolConflictDialogContent
      key={`${target.chain}:${target.address}`}
      target={target}
      onClose={onClose}
    />
  )
}

function ResolveSymbolConflictDialogContent({
  target,
  onClose,
}: {
  target: ResolveSymbolConflictTarget
  onClose: () => void
}) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [trace, setTrace] = useState<IngestionTraceView | undefined>()
  const [previewError, setPreviewError] = useState<string | undefined>()
  const [choice, setChoice] = useState<SymbolChoice>('coingecko')
  const [customSymbol, setCustomSymbol] = useState<string | undefined>()

  const preview = useMutation(
    trpc.tokenIngestionQueue.preview.mutationOptions({
      onSuccess: (result) => setTrace(result),
      onError: (error) => setPreviewError(error.message),
    }),
  )
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once per target; the dialog remounts (key) when the target changes
  useEffect(() => {
    preview.mutate(target)
  }, [])

  const resolve = useMutation(
    trpc.tokenIngestionQueue.resolveConflict.mutationOptions({
      onSuccess: async (result) => {
        await queryClient.invalidateQueries(
          trpc.tokenIngestionQueue.getPage.queryFilter(),
        )
        showResolutionToast(result)
        onClose()
      },
      onError: (error) => toast.error(error.message),
    }),
  )

  const symbolConflict =
    trace?.outcome.kind === 'conflict'
      ? trace.outcome.symbolConflict
      : undefined
  const chosenSymbol =
    choice === 'coingecko'
      ? symbolConflict?.coingeckoSymbol
      : choice === 'deployed'
        ? symbolConflict?.deployedTokenSymbol
        : (customSymbol ?? symbolConflict?.coingeckoSymbol)

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-y-auto sm:max-w-3xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="min-w-0">
          <DialogTitle>Resolve symbol conflict</DialogTitle>
          <DialogDescription className="break-words pr-6">
            Choose the symbol the new abstract token for {target.chain}:
            {target.address} should carry. The decision is recorded in the
            abstract token&apos;s comment and in the history.
          </DialogDescription>
        </DialogHeader>

        {preview.isPending && <LoadingState className="py-8" />}
        {previewError && (
          <div className="rounded border border-destructive bg-destructive/10 p-3 text-destructive text-sm">
            {previewError}
          </div>
        )}
        {trace && !symbolConflict && (
          <div className="space-y-4">
            <div className="rounded border border-amber-500/50 bg-amber-500/10 p-3 text-sm">
              Re-planning this entry no longer produces a resolvable CoinGecko
              symbol conflict — the evidence may have changed while the entry
              sat in the queue. Review the log below and use Preview / Retry
              from the queue instead.
            </div>
            <IngestionLog log={trace.text} />
          </div>
        )}
        {trace && symbolConflict && (
          <div className="min-w-0 space-y-4">
            <div className="space-y-2">
              <SymbolOption
                selected={choice === 'coingecko'}
                onSelect={() => setChoice('coingecko')}
                title="Use the CoinGecko symbol"
                symbol={symbolConflict.coingeckoSymbol}
                hint={
                  `From CoinGecko coin ${symbolConflict.coingeckoId ?? 'unknown'}. ` +
                  'CoinGecko loses the original casing, so this value is upper-cased — pick Custom to fix the casing.'
                }
              />
              <SymbolOption
                selected={choice === 'deployed'}
                onSelect={() => setChoice('deployed')}
                title="Use the deployed token symbol"
                symbol={symbolConflict.deployedTokenSymbol}
                hint="The on-chain symbol with its original casing."
              />
              <SymbolOption
                selected={choice === 'custom'}
                onSelect={() => setChoice('custom')}
                title="Use a custom symbol"
              >
                <Input
                  value={customSymbol ?? symbolConflict.coingeckoSymbol}
                  onFocus={() => setChoice('custom')}
                  onChange={(e) => setCustomSymbol(e.target.value)}
                  maxLength={255}
                  className="mt-1 max-w-60 font-mono"
                  aria-label="Custom symbol"
                />
              </SymbolOption>
            </div>
            <IngestionLog log={trace.text} />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {symbolConflict && (
            <ButtonWithSpinner
              isLoading={resolve.isPending}
              disabled={!chosenSymbol || chosenSymbol.trim().length === 0}
              onClick={() => {
                if (!chosenSymbol) return
                resolve.mutate({
                  ...target,
                  symbol: chosenSymbol.trim(),
                  expected: symbolConflict,
                })
              }}
            >
              Resolve with &quot;{chosenSymbol?.trim()}&quot;
            </ButtonWithSpinner>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SymbolOption({
  selected,
  onSelect,
  title,
  symbol,
  hint,
  children,
}: {
  selected: boolean
  onSelect: () => void
  title: string
  symbol?: string
  hint?: string
  children?: React.ReactNode
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-2 rounded-md border p-3',
        selected ? 'border-primary bg-primary/5' : 'border-input',
      )}
    >
      <input
        type="radio"
        name="symbol-choice"
        checked={selected}
        onChange={onSelect}
        className="mt-0.5 accent-primary"
      />
      <span className="min-w-0 flex-1 space-y-0.5">
        <span className="flex flex-wrap items-baseline gap-2">
          <span className="font-medium text-sm">{title}</span>
          {symbol !== undefined && (
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
              {symbol}
            </span>
          )}
        </span>
        {hint && (
          <span className="block text-muted-foreground text-xs">{hint}</span>
        )}
        {children}
      </span>
    </label>
  )
}

function showResolutionToast(trace: IngestionTraceView) {
  switch (trace.outcome.kind) {
    case 'write':
      toast.success('Conflict resolved — token written')
      return
    case 'noop':
      toast.success('Nothing to write — the token was already up to date')
      return
    case 'skip':
      toast.info(`Entry skipped: ${trace.outcome.reason}`)
      return
    case 'conflict':
      toast.warning(`Still in conflict: ${trace.outcome.message}`)
      return
    case 'error':
      toast.error(`Processing failed: ${trace.outcome.message}`)
      return
    default:
      toast.info(`Outcome: ${trace.outcome.description}`)
  }
}
