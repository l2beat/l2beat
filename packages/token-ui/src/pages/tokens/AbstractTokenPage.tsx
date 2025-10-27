import { UnixTime } from '@l2beat/shared-pure'
import type { Plan } from '@l2beat/token-backend'
import { ArrowRightIcon, CoinsIcon, TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import { LoadingText } from '~/components/LoadingText'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { AppLayout } from '~/layouts/AppLayout'
import type { AbstractTokenWithDeployedTokens } from '~/mock/types'
import { api } from '~/react-query/trpc'
import { getDeployedTokenDisplayId } from '~/utils/getDisplayId'
import { validateResolver } from '~/utils/validateResolver'

export function AbstractTokenPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data } = api.tokens.getAbstractById.useQuery(id ?? '', {
    enabled: id !== '',
  })
  if (!id || data === null) {
    navigate('/not-found')
    return
  }

  return (
    <AppLayout>
      {data ? <AbstractTokenView token={data} /> : <LoadingText />}
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

  const coingeckoId = form.watch('coingeckoId')
  const debouncedCoingeckoId = useDebouncedValue(form.watch('coingeckoId'), 500)
  const { data: coin, isLoading } = api.coingecko.getCoinById.useQuery(
    debouncedCoingeckoId ?? '',
    {
      enabled:
        !!debouncedCoingeckoId && token.coingeckoId !== debouncedCoingeckoId,
      retry: false,
    },
  )

  const showCoingeckoLoading = isLoading || coingeckoId !== debouncedCoingeckoId

  const { mutate: planMutate, isPending } = api.plan.generate.useMutation({
    onSuccess: (data) => {
      if (data.outcome === 'success') {
        setPlan(data.plan)
      } else {
        toast.error(data.error)
      }
    },
  })

  useEffect(() => {
    if (isLoading) return
    if (!debouncedCoingeckoId) return
    if (token.coingeckoId === debouncedCoingeckoId) {
      form.setValue('iconUrl', token.iconUrl ?? '')
      return
    }

    if (coin) {
      form.clearErrors('coingeckoId')
      form.setValue('iconUrl', coin.image.large)
    }
    if (!coin) {
      form.setValue('iconUrl', '')
    }
    if (coin === null) {
      form.setError('coingeckoId', {
        message: 'Coin not found',
        type: 'validate',
      })
    }
  }, [
    coin,
    form.clearErrors,
    form.setValue,
    form.setError,
    isLoading,
    debouncedCoingeckoId,
    token.coingeckoId,
    token.iconUrl,
  ])

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
                coingeckoFields={{
                  isLoading: showCoingeckoLoading,
                  success: !!coin,
                  isListingTimestampLoading: false,
                }}
              >
                <ButtonWithSpinner
                  isLoading={false}
                  disabled={
                    Object.keys(form.formState.dirtyFields).length === 0 ||
                    showCoingeckoLoading
                  }
                  className="w-full"
                  type="submit"
                >
                  Update
                </ButtonWithSpinner>
              </AbstractTokenForm>
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
                    <Button asChild variant="link">
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
