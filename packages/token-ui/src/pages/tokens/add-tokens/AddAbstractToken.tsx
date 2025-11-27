import { UnixTime } from '@l2beat/shared-pure'
import type { Plan } from '@l2beat/token-backend'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import { Card, CardContent } from '~/components/core/Card'
import {
  AbstractTokenForm,
  AbstractTokenSchema,
} from '~/components/forms/AbstractTokenForm'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useQueryState } from '~/hooks/useQueryState'
import { api } from '~/react-query/trpc'
import { buildUrlWithParams } from '~/utils/buildUrlWithParams'
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
  const [coingeckoIdQueryState] = useQueryState('coingeckoId', '')
  const [redirectTo] = useQueryState('redirectTo', '')
  const navigate = useNavigate()
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
  const { data: checks, isLoading: areChecksLoading } =
    api.abstractTokens.checks.useQuery(debouncedCoingeckoId ?? '', {
      enabled: !!debouncedCoingeckoId,
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
    if (coingeckoIdQueryState) {
      form.setValue('coingeckoId', coingeckoIdQueryState)
    }
  }, [coingeckoIdQueryState, form.setValue])

  useEffect(() => {
    if (areChecksLoading) return
    if (!coingeckoId || !checks) return

    if (checks.error) {
      form.setError('coingeckoId', {
        message: checks.error.message,
        type: 'custom',
      })
    } else {
      form.clearErrors('coingeckoId')
    }

    if (checks.data?.iconUrl) {
      form.setValue('iconUrl', checks.data.iconUrl)
    }
    if (checks.data?.symbol) {
      form.setValue('symbol', checks.data.symbol)
    }
    if (checks.data?.listingTimestamp) {
      form.setValue(
        'coingeckoListingTimestamp',
        UnixTime.toYYYYMMDD(checks.data.listingTimestamp),
      )
    }
  }, [
    checks,
    areChecksLoading,
    form.clearErrors,
    form.setValue,
    form.setError,
    coingeckoId,
  ])

  function onSubmit(values: AbstractTokenSchema) {
    if (areChecksLoading) return
    if (checks?.error?.type === 'not-found-on-coingecko') {
      form.setError('coingeckoId', {
        message: checks.error.message,
        type: 'custom',
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

  const showChecksLoading =
    areChecksLoading || coingeckoId !== debouncedCoingeckoId

  return (
    <Card>
      <CardContent>
        <PlanConfirmationDialog
          plan={plan}
          setPlan={setPlan}
          onSuccess={() => {
            form.reset()
            if (redirectTo) {
              navigate(
                buildUrlWithParams('/tokens/new', {
                  tab: redirectTo,
                  abstractTokenId: form.getValues('id'),
                }),
              )
            }
          }}
        />
        <AbstractTokenForm
          form={form}
          onSubmit={onSubmit}
          isFormDisabled={isPending}
          refreshId={() => {
            const id = generateRandomId()
            form.setValue('id', id)
          }}
          checks={{
            isLoading: showChecksLoading,
            success: !!checks && checks.error === undefined,
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
      </CardContent>
    </Card>
  )
}
