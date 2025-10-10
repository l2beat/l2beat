import { skipToken, useMutation, useQuery } from '@tanstack/react-query'
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
import { type Plan, tokenService } from '~/mock/MockTokenService'
import type {
  AbstractToken,
  AbstractTokenWithDeployedTokens,
} from '~/mock/types'
import { toYYYYMMDD } from '~/utils/toYYYYMMDD'
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
      coingeckoListingTimestamp: token.coingeckoListingTimestamp
        ? toYYYYMMDD(token.coingeckoListingTimestamp)
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

  const { mutate: planDeleteAbstractToken, isPending: isPlanDeletePending } =
    useMutation({
      mutationFn: () =>
        tokenService.plan({
          type: 'DeleteAbstractTokenIntent',
          abstractTokenId: token.id,
        }),
      onSuccess: (data) => {
        setPlan(data)
      },
    })

  const { mutate: planUpdateAbstractToken, isPending: isPlanUpdatePending } =
    useMutation({
      mutationFn: (token: AbstractToken) =>
        tokenService.plan({
          type: 'UpdateAbstractTokenIntent',
          abstractToken: token,
        }),
      onSuccess: (data) => {
        setPlan(data)
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

  const isPending = isPlanDeletePending || isPlanUpdatePending

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
                  planUpdateAbstractToken({
                    ...values,
                    coingeckoListingTimestamp: values.coingeckoListingTimestamp
                      ? new Date(values.coingeckoListingTimestamp)
                      : undefined,
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
                  key={token.id}
                  className="flex items-center justify-between gap-2 px-6 odd:bg-muted"
                >
                  {token.chain}-{token.address} ({token.symbol})
                  <Button asChild variant="outline">
                    <Link to={`/tokens/${token.id}`}>
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
            planDeleteAbstractToken()
          }}
          isLoading={isPending}
        >
          <TrashIcon />
        </ButtonWithSpinner>
      </div>
    </>
  )
}
