import { UnixTime } from '@l2beat/shared-pure'
import type { Plan } from '@l2beat/token-backend'
import { ArrowRightIcon, CoinsIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/core/Empty'
import {
  AbstractTokenForm,
  AbstractTokenSchema,
} from '~/components/forms/AbstractTokenForm'
import { LoadingState } from '~/components/LoadingState'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { AppLayout } from '~/layouts/AppLayout'
import type { AbstractTokenWithDeployedTokens } from '~/mock/types'
import { api } from '~/react-query/trpc'
import { buildUrlWithParams } from '~/utils/buildUrlWithParams'
import { getDeployedTokenDisplayId } from '~/utils/getDisplayId'
import { validateResolver } from '~/utils/validateResolver'

export function AbstractTokenPage() {
  const { id } = useParams()
  const { data } = api.abstractTokens.getById.useQuery(id ?? '', {
    enabled: id !== '',
  })

  if (!id || data === null) {
    return <Navigate to="/not-found" replace />
  }

  return (
    <AppLayout>
      {data ? (
        <AbstractTokenView token={data} />
      ) : (
        <LoadingState className="h-full" />
      )}
    </AppLayout>
  )
}

function AbstractTokenView({
  token,
}: {
  token: AbstractTokenWithDeployedTokens
}) {
  const [plan, setPlan] = useState<Plan | undefined>(undefined)

  const form = useForm<AbstractTokenSchema>({
    resolver: validateResolver(AbstractTokenSchema),
    defaultValues: {
      ...token,
      issuer: token.issuer ?? undefined,
      coingeckoId: token.coingeckoId ?? undefined,
      iconUrl: token.iconUrl ?? undefined,
      comment: token.comment ?? undefined,
      coingeckoListingTimestamp: token.coingeckoListingTimestamp
        ? UnixTime.toYYYYMMDD(token.coingeckoListingTimestamp)
        : undefined,
    },
  })

  const { mutate: planMutate, isPending } = api.plan.generate.useMutation({
    onSuccess: (data) => {
      if (data.outcome === 'success') {
        setPlan(data.plan)
      } else {
        toast.error(data.error)
      }
    },
  })

  const { data: suggestions, isLoading: isLoadingSuggestions } =
    api.deployedTokens.getSuggestionsByCoingeckoId.useQuery(
      token.coingeckoId ?? '',
      {
        enabled: !!token.coingeckoId,
      },
    )

  return (
    <>
      <PlanConfirmationDialog
        plan={plan}
        setPlan={setPlan}
        onSuccess={() => {
          const values = form.getValues()
          form.reset(values)
        }}
      />
      <div className="mx-auto flex max-w-3xl gap-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Abstract Token
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AbstractTokenForm
                form={form}
                onSubmit={(values) => {
                  planMutate({
                    type: 'UpdateAbstractTokenIntent',
                    id: token.id,
                    update: {
                      ...values,
                      issuer: values.issuer || null,
                      iconUrl: values.iconUrl || null,
                      coingeckoId: values.coingeckoId || null,
                      comment: values.comment || null,
                      coingeckoListingTimestamp:
                        values.coingeckoListingTimestamp
                          ? UnixTime.fromDate(
                              new Date(values.coingeckoListingTimestamp),
                            )
                          : null,
                    },
                  })
                }}
                isFormDisabled={isPending}
              >
                <ButtonWithSpinner
                  isLoading={false}
                  disabled={
                    Object.keys(form.formState.dirtyFields).length === 0
                  }
                  className="w-full"
                  type="submit"
                >
                  Update
                </ButtonWithSpinner>
              </AbstractTokenForm>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSuggestions ? (
                <LoadingState />
              ) : suggestions && suggestions.length !== 0 ? (
                <div className="-mx-6 flex flex-col gap-2">
                  {suggestions.map((suggestion) => {
                    return (
                      <div
                        key={suggestion.chain}
                        className="flex items-center justify-between gap-2 px-6 odd:bg-muted"
                      >
                        {suggestion.chain} ({suggestion.address})
                        <Button variant="link" asChild size="icon">
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
                    )
                  })}
                </div>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <CoinsIcon />
                    </EmptyMedia>
                    <EmptyTitle>No suggestions found</EmptyTitle>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Deployed Tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-0">
              {token.deployedTokens.length !== 0 ? (
                token.deployedTokens.map((token) => (
                  <div
                    key={getDeployedTokenDisplayId(token)}
                    className="flex items-center justify-between gap-2 px-6 odd:bg-muted"
                  >
                    {token.chain} ({token.symbol})
                    <Button asChild variant="link" size="icon">
                      <Link to={`/tokens/${token.chain}/${token.address}`}>
                        <ArrowRightIcon />
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <CoinsIcon />
                    </EmptyMedia>
                    <EmptyTitle>No Deployed Tokens</EmptyTitle>
                    <EmptyContent>
                      <Button asChild>
                        <Link to="/tokens/new?tab=deployed">Add new</Link>
                      </Button>
                    </EmptyContent>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>
        </div>
        <ButtonWithSpinner
          variant="destructive"
          className="mt-2"
          size="icon"
          onClick={() => {
            planMutate({
              type: 'DeleteAbstractTokenIntent',
              id: token.id,
            })
          }}
          isLoading={isPending}
        >
          <TrashIcon />
        </ButtonWithSpinner>
      </div>
    </>
  )
}
