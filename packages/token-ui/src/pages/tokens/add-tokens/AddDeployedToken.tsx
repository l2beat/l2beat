import { UnixTime } from '@l2beat/shared-pure'
import type { Plan } from '@l2beat/token-backend'
import {
  CheckIcon,
  ListIcon,
  ListPlusIcon,
  ListXIcon,
  PlusIcon,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import { Button, buttonVariants } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/core/Empty'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/core/Sheet'
import { Textarea } from '~/components/core/TextArea'
import {
  DeployedTokenForm,
  DeployedTokenSchema,
  fieldToDataSource,
  setDeployedTokenExistsError,
} from '~/components/forms/DeployedTokenForm'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { useQueryState } from '~/hooks/useQueryState'
import { api } from '~/react-query/trpc'
import { buildUrlWithParams } from '~/utils/buildUrlWithParams'
import { cn } from '~/utils/cn'
import { dateTimeInputToUnixTimestamp } from '~/utils/dateTimeInputToUnixTimestamp'
import { validateResolver } from '~/utils/validateResolver'

export function AddDeployedToken() {
  const [, setSearchParams] = useSearchParams()
  const [queryChain] = useQueryState('chain', '')
  const [queryAddress] = useQueryState('address', '')
  const [abstractTokenId] = useQueryState('abstractTokenId', '')

  const [queue, setQueue] = useState<{ chain: string; address: string }[]>([])
  const addToQueue = useCallback((chain: string, address: string) => {
    setQueue((prev) => [...prev, { chain, address }])
  }, [])

  const form = useForm<DeployedTokenSchema>({
    resolver: validateResolver(DeployedTokenSchema),
  })
  const [plan, setPlan] = useState<Plan | undefined>(undefined)
  const [isQueueSheetOpen, setIsQueueSheetOpen] = useState(false)

  const { data: abstractTokens, isLoading: areAbstractTokensLoading } =
    api.abstractTokens.getAll.useQuery()
  const { mutate: planMutate, isPending } = api.plan.generate.useMutation({
    onSuccess: (data) => {
      if (data.outcome === 'success') {
        setPlan(data.plan)
      } else {
        toast.error(data.error)
      }
    },
  })

  const { data: chains, isLoading: isLoadingChains } =
    api.chains.getAll.useQuery()

  const chain = form.watch('chain')
  const address = form.watch('address')
  const { data: checks, isLoading: checksLoading } =
    api.deployedTokens.checks.useQuery(
      {
        chain,
        address,
      },
      {
        enabled: !!chain && !!address,
      },
    )

  useEffect(() => {
    if (!checks || checksLoading) return
    if (checks.error) {
      form.setError('address', {
        type: 'custom',
        message: checks.error.message,
      })
    } else {
      form.clearErrors('address')
    }
    if (checks.data?.decimals) {
      form.setValue('decimals', checks.data.decimals, { shouldDirty: true })
    }
    if (checks.data?.deploymentTimestamp) {
      form.setValue(
        'deploymentTimestamp',
        UnixTime.toYYYYMMDDHHMM(checks.data.deploymentTimestamp),
        { shouldDirty: true },
      )
    }
    if (checks.data?.abstractTokenId) {
      form.setValue('abstractTokenId', checks.data.abstractTokenId, {
        shouldDirty: true,
      })
    }
    if (checks.data?.symbol) {
      form.setValue('symbol', checks.data.symbol, { shouldDirty: true })
    }
  }, [checks, checksLoading, form])

  useEffect(() => {
    const exists = abstractTokens?.find(
      (abstractToken) => abstractToken.id === abstractTokenId,
    )
    if (abstractTokenId && exists) {
      form.setValue('abstractTokenId', abstractTokenId, { shouldDirty: true })
    }
  }, [abstractTokenId, form.setValue, abstractTokens])

  useEffect(() => {
    if (queryChain) {
      form.setValue('chain', queryChain, { shouldDirty: true })
    }
    if (queryAddress) {
      form.setValue('address', queryAddress, { shouldDirty: true })
    }
  }, [queryChain, queryAddress, form.setValue])

  function onSubmit(values: DeployedTokenSchema) {
    if (checksLoading) return
    if (checks?.error?.type === 'already-exists') {
      setDeployedTokenExistsError(form)
      return
    }

    planMutate({
      type: 'AddDeployedTokenIntent',
      record: {
        ...values,
        comment: values.comment || null,
        abstractTokenId: values.abstractTokenId || null,
        deploymentTimestamp: dateTimeInputToUnixTimestamp(
          values.deploymentTimestamp,
        ),
        metadata: null,
      },
    })
  }

  function handleImport(tokens: { chain: string; address: string }[]) {
    if (!chain && !address) {
      const first = tokens.shift()
      if (!first) return

      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev)
        newParams.set('chain', first.chain)
        newParams.set('address', first.address)
        return newParams
      })
    }

    setQueue((prev) => [...prev, ...tokens])
  }

  const chainRecord = chains?.find((c) => c.name === chain)

  return (
    <>
      <PlanConfirmationDialog
        plan={plan}
        setPlan={setPlan}
        onSuccess={() => {
          form.reset()
          const queueItem = queue[0]
          if (!queueItem) {
            setSearchParams((prev) => {
              const newParams = new URLSearchParams(prev)
              newParams.delete('chain')
              newParams.delete('address')
              newParams.delete('abstractTokenId')
              return newParams
            })
          } else {
            setSearchParams((prev) => {
              const newParams = new URLSearchParams(prev)
              newParams.set('chain', queueItem.chain)
              newParams.set('address', queueItem.address)
              newParams.delete('abstractTokenId')
              return newParams
            })
            setQueue(queue.slice(1))
          }
        }}
      />
      <Card className="relative">
        <CardContent>
          <DeployedTokenForm
            form={form}
            onSubmit={onSubmit}
            isFormDisabled={isPending}
            chains={{
              data: chains,
              loading: isLoadingChains,
            }}
            tokenDetails={{
              data: checks,
              loading: checksLoading,
            }}
            abstractTokens={{
              data: abstractTokens,
              loading: areAbstractTokensLoading,
            }}
            autofill={
              chainRecord
                ? {
                    symbol: true,
                    decimals: !!chainRecord.apis?.some((api) =>
                      fieldToDataSource.decimals.includes(api.type),
                    ),
                    deploymentTimestamp: !!chainRecord.apis?.some((api) =>
                      fieldToDataSource.deploymentTimestamp.includes(api.type),
                    ),
                    abstractTokenId: true,
                  }
                : undefined
            }
          >
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <ButtonWithSpinner
                  isLoading={isPending}
                  className="flex-1"
                  type="submit"
                >
                  {queue.length > 0 ? 'Submit and add next' : 'Submit'}
                </ButtonWithSpinner>
              </div>
              {queue.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={() => {
                    const next = queue.at(0)
                    setQueue((prev) => prev.slice(1))
                    form.resetField('symbol')
                    form.resetField('decimals')
                    form.resetField('deploymentTimestamp')
                    form.resetField('abstractTokenId')
                    form.resetField('comment')

                    if (next) {
                      setSearchParams((prev) => {
                        const newParams = new URLSearchParams(prev)
                        newParams.set('chain', next.chain)
                        newParams.set('address', next.address)
                        return newParams
                      })
                    } else {
                      setSearchParams((prev) => {
                        const newParams = new URLSearchParams(prev)
                        newParams.delete('chain')
                        newParams.delete('address')
                        return newParams
                      })
                    }
                  }}
                >
                  Skip
                </Button>
              )}
            </div>
          </DeployedTokenForm>
        </CardContent>
        <Sheet open={isQueueSheetOpen} onOpenChange={setIsQueueSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              type="button"
              className="absolute top-2 left-full ml-2"
            >
              <ListIcon className="size-4" />
              {queue.length > 0 && (
                <span className="-right-2 -bottom-2 absolute flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  {queue.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <Queue queue={queue} onImport={handleImport} />
        </Sheet>
      </Card>
      {checks?.data?.suggestions && checks.data.suggestions.length !== 0 && (
        <Suggestions
          suggestions={checks.data.suggestions}
          queue={queue}
          addToQueue={addToQueue}
        />
      )}
    </>
  )
}

function Suggestions({
  suggestions,
  queue,
  addToQueue,
}: {
  suggestions: { chain: string; address: string }[]
  queue: { chain: string; address: string }[]
  addToQueue: (chain: string, address: string) => void
}) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Suggestions</CardTitle>
        <CardDescription>
          We've found this token on other chains and thought you may want to add
          it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="-mx-6 flex flex-col gap-2">
          {suggestions.map((suggestion) => {
            const isInQueue = queue.some(
              (q) =>
                q.chain === suggestion.chain &&
                q.address === suggestion.address,
            )
            return (
              <div
                key={suggestion.chain}
                className="flex items-center justify-between gap-2 px-6 odd:bg-muted"
              >
                {suggestion.chain} ({suggestion.address})
                <div className="flex items-center">
                  {isInQueue ? (
                    <div className={buttonVariants({ variant: 'link' })}>
                      <CheckIcon className={cn('size-4 stroke-green-500')} />
                    </div>
                  ) : (
                    <Button
                      variant="link"
                      size="icon"
                      onClick={() =>
                        addToQueue(suggestion.chain, suggestion.address)
                      }
                    >
                      <ListPlusIcon />
                    </Button>
                  )}

                  <Button variant="link" size="icon" asChild>
                    <Link
                      to={buildUrlWithParams('/tokens/new', {
                        tab: 'deployed',
                        chain: suggestion.chain,
                        address: suggestion.address,
                      })}
                      target="_blank"
                    >
                      <PlusIcon />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function Queue({
  queue,
  onImport,
}: {
  queue: { chain: string; address: string }[]
  onImport: (tokens: { chain: string; address: string }[]) => void
}) {
  const [csvInput, setCsvInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleImport() {
    try {
      setError(null)
      if (!csvInput.trim()) {
        setError('Please enter at least one token')
        return
      }

      const tokens = parseCSV(csvInput)
      if (tokens.length === 0) {
        setError('No valid tokens found')
        return
      }

      toast.success(`Successfully imported ${tokens.length} token(s) to queue`)
      onImport(tokens)
      setCsvInput('')
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to parse CSV'
      setError(message)
    }
  }

  return (
    <SheetContent side="right" className="flex flex-col">
      <SheetHeader>
        <SheetTitle>Queue</SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto px-4">
        {queue.length > 0 ? (
          <ul className="list-inside list-decimal space-y-2">
            {queue.map((item, index) => (
              <li
                key={index}
                className="truncate whitespace-nowrap even:bg-muted"
              >
                {item.chain} ({item.address})
              </li>
            ))}
          </ul>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ListXIcon />
              </EmptyMedia>
              <EmptyTitle>No tokens in queue</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
      </div>
      <SheetFooter>
        <div className="space-y-2">
          <Textarea
            value={csvInput}
            onChange={(e) => {
              setCsvInput(e.target.value)
              setError(null)
            }}
            placeholder="ethereum,0x1234567890123456789012345678901234567890&#10;arbitrum,0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
            rows={10}
            className="max-h-[192px] font-mono text-sm"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <Button className="w-full" onClick={handleImport}>
          Import
        </Button>
      </SheetFooter>
    </SheetContent>
  )
}

function parseCSV(csv: string): { chain: string; address: string }[] {
  const lines = csv.trim().split('\n')
  const tokens: { chain: string; address: string }[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim()
    if (!line) continue // Skip empty lines

    const parts = line.split(',').map((part) => part.trim())
    if (parts.length !== 2) {
      throw new Error(
        `Line ${i + 1}: Expected format "chain,address", got "${line}"`,
      )
    }

    const [chain, address] = parts
    if (!chain || !address) {
      throw new Error(`Line ${i + 1}: Both chain and address are required`)
    }

    tokens.push({ chain, address })
  }

  return tokens
}
