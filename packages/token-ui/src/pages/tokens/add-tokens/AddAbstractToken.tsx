import { skipToken, useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { coingecko } from '~/api/coingecko'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import {
  AbstractTokenForm,
  AbstractTokenSchema,
} from '~/components/forms/AbstractTokenForm'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { type Plan, tokenService } from '~/mock/MockTokenService'
import type { AbstractToken } from '~/mock/types'
import { generateRandomString } from '~/utils/generateRandomString'
import { toYYYYMMDD } from '~/utils/toYYYYMMDD'
import { validateResolver } from '~/utils/validateResolver'

function generateRandomId() {
  return generateRandomString(6)
}

export function AddAbstractToken({
  defaultValues,
}: {
  defaultValues?: AbstractTokenSchema
}) {
  const form = useForm<AbstractTokenSchema>({
    resolver: validateResolver(AbstractTokenSchema),
    defaultValues: defaultValues ?? {
      id: generateRandomId(),
    },
  })
  const [plan, setPlan] = useState<Plan | undefined>(undefined)

  const coingeckoId = form.watch('coingeckoId')
  const debouncedCoingeckoId = useDebouncedValue(form.watch('coingeckoId'), 500)
  const { data: coin, isLoading: isCoinLoading } = useQuery({
    queryKey: ['coingecko', 'coin', debouncedCoingeckoId],
    queryFn: debouncedCoingeckoId
      ? () => coingecko.getCoinById(debouncedCoingeckoId)
      : skipToken,
    retry: false,
  })

  const {
    data: coingeckoListingTimestamp,
    isLoading: isCoingeckoListingTimestampLoading,
  } = useQuery({
    queryKey: ['coingecko', 'listingTimestamp', debouncedCoingeckoId],
    queryFn: coin ? () => coingecko.getListingTimestamp(coin.id) : skipToken,
    retry: false,
  })

  const { mutate: planAbstractToken, isPending: isPlanPending } = useMutation({
    mutationFn: (token: AbstractToken) =>
      tokenService.plan({
        type: 'AddAbstractTokenIntent',
        abstractToken: token,
      }),
    onSuccess: (data) => {
      setPlan(data)
    },
  })

  useEffect(() => {
    if (isCoinLoading) return
    if (!coingeckoId) return
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
    isCoinLoading,
    coingeckoId,
  ])

  useEffect(() => {
    if (isCoingeckoListingTimestampLoading) return
    if (coingeckoListingTimestamp) {
      form.clearErrors('coingeckoListingTimestamp')
      form.setValue(
        'coingeckoListingTimestamp',
        toYYYYMMDD(coingeckoListingTimestamp),
      )
      return
    }

    form.setValue('coingeckoListingTimestamp', undefined)
  }, [
    coingeckoListingTimestamp,
    form.clearErrors,
    form.setValue,
    isCoingeckoListingTimestampLoading,
  ])

  function onSubmit(values: AbstractTokenSchema) {
    if (isCoinLoading) return
    if (coin === null) {
      form.setError('coingeckoId', {
        message: 'Coin not found',
        type: 'validate',
      })
      return
    }
    planAbstractToken({
      ...values,
      coingeckoListingTimestamp: values.coingeckoListingTimestamp
        ? new Date(values.coingeckoListingTimestamp)
        : undefined,
    })
  }

  const showCoingeckoLoading =
    isCoinLoading || coingeckoId !== debouncedCoingeckoId

  return (
    <>
      <PlanConfirmationDialog
        plan={plan}
        setPlan={setPlan}
        onSuccess={form.reset}
      />
      <AbstractTokenForm
        form={form}
        onSubmit={onSubmit}
        isFormDisabled={isPlanPending}
        refreshId={() => {
          const id = generateRandomId()
          form.setValue('id', id)
        }}
        coingeckoFields={{
          isLoading: showCoingeckoLoading,
          isListingTimestampLoading: isCoingeckoListingTimestampLoading,
          success: !!coin,
        }}
      >
        <ButtonWithSpinner
          isLoading={isPlanPending}
          className="w-full"
          type="submit"
        >
          Submit
        </ButtonWithSpinner>
      </AbstractTokenForm>
    </>
  )
}
