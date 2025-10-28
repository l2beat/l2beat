import { UnixTime } from '@l2beat/shared-pure'
import type { Plan } from '@l2beat/token-backend'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import {
  AbstractTokenForm,
  AbstractTokenSchema,
} from '~/components/forms/AbstractTokenForm'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { api } from '~/react-query/trpc'
import { generateRandomString } from '~/utils/generateRandomString'
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
      reviewed: true,
    },
  })
  const [plan, setPlan] = useState<Plan | undefined>(undefined)

  const coingeckoId = form.watch('coingeckoId')
  const debouncedCoingeckoId = useDebouncedValue(form.watch('coingeckoId'), 500)
  const { data: coin, isLoading: isCoinLoading } =
    api.coingecko.getCoinById.useQuery(debouncedCoingeckoId ?? '', {
      enabled: !!debouncedCoingeckoId,
      retry: false,
    })

  const {
    data: coingeckoListingTimestamp,
    isLoading: isCoingeckoListingTimestampLoading,
  } = api.coingecko.getListingTimestamp.useQuery(coin?.id ?? '', {
    enabled: !!coin?.id,
    retry: false,
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
        UnixTime.toYYYYMMDD(coingeckoListingTimestamp),
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
    planMutate({
      type: 'AddAbstractTokenIntent',
      record: {
        ...values,
        issuer: values.issuer || null,
        iconUrl: values.iconUrl || null,
        coingeckoId: values.coingeckoId || null,
        comment: values.comment || null,
        coingeckoListingTimestamp: values.coingeckoListingTimestamp
          ? UnixTime.fromDate(new Date(values.coingeckoListingTimestamp))
          : null,
      },
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
        isFormDisabled={isPending}
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
          isLoading={isPending}
          className="w-full"
          type="submit"
        >
          Submit
        </ButtonWithSpinner>
      </AbstractTokenForm>
    </>
  )
}
