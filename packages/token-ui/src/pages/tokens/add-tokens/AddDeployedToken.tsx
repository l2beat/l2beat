import { UnixTime } from '@l2beat/shared-pure'
import type { Plan } from '@l2beat/token-backend'
import { CheckIcon, CoinsIcon, ListPlusIcon, PlusIcon } from 'lucide-react'
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
  CardFooter,
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
  DeployedTokenForm,
  DeployedTokenSchema,
  setDeployedTokenExistsError,
} from '~/components/forms/DeployedTokenForm'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { TokenImportDialog } from '~/components/TokenImportDialog'
import { useQueryState } from '~/hooks/useQueryState'
import { api } from '~/react-query/trpc'
import { buildUrlWithParams } from '~/utils/buildUrlWithParams'
import { cn } from '~/utils/cn'
import { dateTimeInputToUnixTimestamp } from '~/utils/dateTimeInputToUnixTimestamp'
import { validateResolver } from '~/utils/validateResolver'

export function AddDeployedToken() {
  const [, setSearchParams] = useSearchParams()
  const [queryChain, , clearQueryChain] = useQueryState('chain', '')
  const [queryAddress, , clearQueryAddress] = useQueryState('address', '')
  const [abstractTokenId, , clearAbstractTokenId] = useQueryState(
    'abstractTokenId',
    '',
  )

  const [queue, setQueue] = useState<{ chain: string; address: string }[]>([])
  const addToQueue = useCallback((chain: string, address: string) => {
    setQueue((prev) => [...prev, { chain, address }])
  }, [])

  const form = useForm<DeployedTokenSchema>({
    resolver: validateResolver(DeployedTokenSchema),
  })
  const [plan, setPlan] = useState<Plan | undefined>(undefined)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

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

  return (
    <>
      <PlanConfirmationDialog
        plan={plan}
        setPlan={setPlan}
        onSuccess={() => {
          form.reset()
          clearAbstractTokenId()
          const queueItem = queue[0]
          if (!queueItem) {
            clearQueryChain()
            clearQueryAddress()
          } else {
            setSearchParams((prev) => {
              const newParams = new URLSearchParams(prev)
              newParams.set('chain', queueItem.chain)
              newParams.set('address', queueItem.address)
              return newParams
            })
            setQueue(queue.slice(1))
          }
        }}
      />
      <TokenImportDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImport={handleImport}
      />
      <Card className="relative">
        <CardContent>
          <DeployedTokenForm
            form={form}
            onSubmit={onSubmit}
            isFormDisabled={isPending}
            tokenDetails={{
              data: checks,
              loading: checksLoading,
            }}
            abstractTokens={{
              data: abstractTokens,
              loading: areAbstractTokensLoading,
            }}
          >
            <div className="flex flex-col gap-4">
              <ButtonWithSpinner
                isLoading={isPending}
                className="w-full"
                type="submit"
              >
                {queue.length > 0 ? 'Submit and add next' : 'Submit'}
              </ButtonWithSpinner>
              {queue.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={() => {
                    const next = queue.at(0)
                    setQueue((prev) => prev.slice(1))

                    if (next) {
                      setSearchParams((prev) => {
                        const newParams = new URLSearchParams(prev)
                        newParams.set('chain', next.chain)
                        newParams.set('address', next.address)
                        return newParams
                      })
                    } else {
                      clearQueryChain()
                      clearQueryAddress()
                    }
                  }}
                >
                  Skip
                </Button>
              )}
            </div>
          </DeployedTokenForm>
        </CardContent>

        <Card className="absolute top-0 left-full ml-4 max-h-[400px] w-full max-w-xs overflow-y-auto">
          <CardHeader>
            <CardTitle>Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {queue.length > 0 ? (
              <ul className="list-inside list-decimal">
                {queue.map((item, index) => (
                  <li key={index} className="truncate whitespace-nowrap">
                    {item.chain} ({item.address})
                  </li>
                ))}
              </ul>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CoinsIcon />
                  </EmptyMedia>
                  <EmptyTitle>No tokens in queue</EmptyTitle>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => setIsImportDialogOpen(true)}
            >
              Import
            </Button>
          </CardFooter>
        </Card>
      </Card>
      {checks?.data?.suggestions && checks.data.suggestions.length !== 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Suggestions</CardTitle>
            <CardDescription>
              We've found this token on other chains and thought you may want to
              add it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="-mx-6 flex flex-col gap-2">
              {checks.data.suggestions.map((suggestion) => {
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
                          <CheckIcon
                            className={cn('size-4 stroke-green-500')}
                          />
                        </div>
                      ) : (
                        <Button
                          variant="link"
                          onClick={() =>
                            addToQueue(suggestion.chain, suggestion.address)
                          }
                        >
                          <ListPlusIcon />
                        </Button>
                      )}

                      <Button variant="link" asChild>
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
      )}
    </>
  )
}
