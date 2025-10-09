import type { Plan } from '@l2beat/token-service'
import { skipToken, useQuery } from '@tanstack/react-query'
import { ArrowRightIcon, TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { coingecko } from '~/api/coingecko'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import {
  AbstractTokenForm,
  AbstractTokenSchema,
} from '~/components/forms/AbstractTokenForm'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import type { AbstractTokenWithDeployedTokens } from '~/mock/types'
import { api } from '~/react-query/trpc'
import { UnixTime } from '~/utils/UnixTime'
import { validateResolver } from '~/utils/validateResolver'

export function AbstractTokenView({
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
  const { data: coin, isLoading } = useQuery({
    queryKey: ['coingecko', 'coin', debouncedCoingeckoId],
    queryFn:
      debouncedCoingeckoId && token.coingeckoId !== debouncedCoingeckoId
        ? () => coingecko.getCoinById(debouncedCoingeckoId)
        : skipToken,
    retry: false,
  })

  const showCoingeckoLoading = isLoading || coingeckoId !== debouncedCoingeckoId

  const { mutate: planMutate, isPending } = api.plan.generate.useMutation({
    onSuccess: (data) => {
      if (data.outcome === 'success') {
        setPlan(data.plan)
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
                    intent: {
                      type: 'UpdateAbstractTokenIntent',
                      id: token.id,
                      update: {
                        symbol: values.symbol,
                        issuer: values.issuer || null,
                        category: values.category,
                        iconUrl: values.iconUrl || null,
                        coingeckoId: values.coingeckoId || null,
                        comment: values.comment || null,
                        coingeckoListingTimestamp:
                          values.coingeckoListingTimestamp
                            ? UnixTime.fromDate(
                                new Date(values.coingeckoListingTimestamp),
                              )
                            : null,
                        reviewed: false,
                      },
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
              {token.deployedTokens.map((token) => (
                <div
                  key={`${token.chain}+${token.address}`}
                  className="flex items-center justify-between gap-2 px-6 odd:bg-muted"
                >
                  {token.chain}-{token.address} ({token.symbol})
                  <Button asChild variant="outline">
                    <Link to={`/tokens/${token.chain}+${token.address}`}>
                      <ArrowRightIcon />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <ButtonWithSpinner
          variant="destructive"
          className="mt-2"
          onClick={() => {
            planMutate({
              intent: {
                type: 'DeleteAbstractTokenIntent',
                id: token.id,
              },
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
