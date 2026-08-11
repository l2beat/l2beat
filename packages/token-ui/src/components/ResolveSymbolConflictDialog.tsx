import type { IngestionTraceView, Plan } from '@l2beat/token-backend'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useTRPC } from '~/react-query/trpc'
import { cn } from '~/utils/cn'
import { generateRandomString } from '~/utils/generateRandomString'
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
import { PlanConfirmationDialog } from './PlanConfirmationDialog'

export interface ResolveSymbolConflictTarget {
  chain: string
  address: string
}

type SymbolChoice = 'coingecko' | 'deployed' | 'custom'

/**
 * Lets a researcher resolve a CoinGecko-symbol conflict from the ingestion
 * queue. The dialog re-plans the entry (via `preview`) to get the fresh,
 * structured conflict and offers the CoinGecko symbol, the deployed-token
 * symbol, or a custom value. Confirming goes through the ordinary manual
 * write path — `plan.generate` plus the standard plan-confirmation dialog
 * that every other TokenDB write uses — to create the abstract token with
 * the chosen symbol and the coin's CoinGecko data, then retries the queue
 * entry: the next ingestion run finds the abstract by its CoinGecko id and
 * links the deployed token to it, so the conflict never fires again.
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
  const [plan, setPlan] = useState<Plan | undefined>()
  const [isRetrying, setIsRetrying] = useState(false)

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

  const symbolConflict =
    trace?.outcome.kind === 'conflict'
      ? trace.outcome.symbolConflict
      : undefined

  // The same CoinGecko lookup the Add abstract token form runs: supplies the
  // icon and listing timestamp so the created abstract token carries the same
  // data automatic ingestion would have written.
  const checks = useQuery(
    trpc.abstractTokens.checks.queryOptions(symbolConflict?.coingeckoId ?? '', {
      enabled: !!symbolConflict?.coingeckoId,
      retry: false,
    }),
  )

  const generatePlan = useMutation(trpc.plan.generate.mutationOptions())
  const retryEntry = useMutation(
    trpc.tokenIngestionQueue.retry.mutationOptions(),
  )

  const chosenSymbol =
    choice === 'coingecko'
      ? symbolConflict?.coingeckoSymbol
      : choice === 'deployed'
        ? symbolConflict?.deployedTokenSymbol
        : (customSymbol ?? symbolConflict?.coingeckoSymbol)

  // Builds the AddAbstractTokenIntent plan and opens the standard plan
  // confirmation dialog — the same review step every other TokenDB write
  // goes through. Executing the plan is PlanConfirmationDialog's job.
  async function generateResolutionPlan() {
    // The isPending/isRetrying check also guards re-entry: ButtonWithSpinner
    // debounces its disabled state by 150ms, so a double-click would
    // generate two plans for two different token ids.
    if (
      generatePlan.isPending ||
      isRetrying ||
      !symbolConflict ||
      !chosenSymbol
    ) {
      return
    }
    const symbol = chosenSymbol.trim()
    if (symbol.length === 0) return

    const record = {
      id: generateRandomString(6),
      issuer: null,
      symbol,
      category: null,
      iconUrl: checks.data?.data?.iconUrl ?? null,
      coingeckoId: symbolConflict.coingeckoId,
      coingeckoListingTimestamp: checks.data?.data?.listingTimestamp ?? null,
      additionalCoingeckoEntries: null,
      comment: `Symbol conflict resolution: CoinGecko symbol is "${symbolConflict.coingeckoSymbol}", the ${target.chain} deployed token symbol is "${symbolConflict.deployedTokenSymbol}"; chose "${symbol}".`,
      // Created from CoinGecko data plus a single human decision (the
      // symbol) — still needs the same review as other ingested tokens.
      reviewed: false,
      isPriceUnreliable: false,
    }

    try {
      const generated = await generatePlan.mutateAsync({
        type: 'AddAbstractTokenIntent',
        record,
      })
      if (generated.outcome === 'error') {
        toast.error(`Could not create the abstract token: ${generated.error}`)
        return
      }
      setPlan(generated.plan)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error))
    }
  }

  // Runs after PlanConfirmationDialog successfully executed the plan (it
  // also shows the standard success toast and invalidates the abstract-token
  // queries). All that is left is retrying the queue entry and refreshing
  // the queue page.
  async function onPlanExecuted() {
    setIsRetrying(true)
    try {
      await retryEntry.mutateAsync(target)
    } catch (error) {
      toast.warning(
        `The abstract token was created, but the queue entry could not be retried: ${error instanceof Error ? error.message : String(error)}`,
      )
    } finally {
      setIsRetrying(false)
      await queryClient.invalidateQueries(
        trpc.tokenIngestionQueue.getPage.queryFilter(),
      )
    }
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-y-auto sm:max-w-3xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="min-w-0">
          <DialogTitle>Resolve symbol conflict</DialogTitle>
          <DialogDescription className="break-words pr-6">
            Creates the abstract token for {target.chain}:{target.address} with
            the chosen symbol and retries the entry; ingestion then links the
            deployed token to it. The abstract token is shared by all
            deployments of this coin, so prefer a chain-neutral symbol.
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
            {checks.data?.error && (
              <div className="rounded border border-amber-500/50 bg-amber-500/10 p-3 text-sm">
                CoinGecko no longer returns coin{' '}
                {symbolConflict.coingeckoId ?? 'unknown'} — the icon and listing
                timestamp cannot be fetched, and the retried entry may not link
                to the new abstract token.
              </div>
            )}
            <IngestionLog log={trace.text} />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {symbolConflict && (
            <ButtonWithSpinner
              isLoading={generatePlan.isPending || isRetrying}
              disabled={
                generatePlan.isPending ||
                isRetrying ||
                !chosenSymbol ||
                chosenSymbol.trim().length === 0 ||
                checks.isLoading
              }
              onClick={generateResolutionPlan}
            >
              Resolve with &quot;{chosenSymbol?.trim()}&quot;
            </ButtonWithSpinner>
          )}
        </DialogFooter>
      </DialogContent>
      <PlanConfirmationDialog
        plan={plan}
        setPlan={setPlan}
        onSuccess={onPlanExecuted}
        note={
          <>
            Afterwards the queue entry {target.chain}:{target.address} is
            retried automatically so ingestion links the deployed token to the
            new abstract token.
          </>
        }
      />
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
