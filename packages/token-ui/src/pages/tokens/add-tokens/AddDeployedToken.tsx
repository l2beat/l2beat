import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import type { Plan } from '@l2beat/token-backend'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import {
  DeployedTokenForm,
  DeployedTokenSchema,
  setDeployedTokenExistsError,
} from '~/components/forms/DeployedTokenForm'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { useQueryState } from '~/hooks/useQueryState'
import { api } from '~/react-query/trpc'
import { dateTimeInputToUnixTimestamp } from '~/utils/dateTimeInputToUnixTimestamp'
import { validateResolver } from '~/utils/validateResolver'

export function AddDeployedToken() {
  const [abstractTokenId, , clearAbstractTokenId] = useQueryState(
    'abstractTokenId',
    '',
  )
  const form = useForm<DeployedTokenSchema>({
    resolver: validateResolver(DeployedTokenSchema),
  })
  const [plan, setPlan] = useState<Plan | undefined>(undefined)

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
    switch (checks.type) {
      case 'already-exists':
        setDeployedTokenExistsError(form)
        break

      case 'not-found-on-rpc':
        form.setError('address', {
          type: 'custom',
          message: 'Token not found on chain',
        })
        break
      case 'not-found-on-coingecko':
        form.setError('address', {
          type: 'custom',
          message: 'Coin not found on Coingecko',
        })
        if (checks.data.decimals) {
          form.setValue('decimals', checks.data.decimals, { shouldDirty: true })
        }
        // form.setValue(
        //   'deploymentTimestamp',
        //   UnixTime.toYYYYMMDDHHMM(checks.data.deploymentTimestamp),
        //   { shouldDirty: true },
        // )
        break

      case 'success':
        form.clearErrors('address')
        form.setValue('symbol', checks.data.symbol, { shouldDirty: true })
        if (checks.data.decimals) {
          form.setValue('decimals', checks.data.decimals, { shouldDirty: true })
        }
        form.setValue(
          'deploymentTimestamp',
          UnixTime.toYYYYMMDDHHMM(checks.data.deploymentTimestamp),
          { shouldDirty: true },
        )
        if (checks.data.abstractToken) {
          form.setValue('abstractTokenId', checks.data.abstractToken.id, {
            shouldDirty: true,
          })
        }
        break
      default:
        assertUnreachable(checks)
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

  function onSubmit(values: DeployedTokenSchema) {
    if (checksLoading) return
    if (checks?.type === 'already-exists') {
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

  return (
    <>
      <PlanConfirmationDialog
        plan={plan}
        setPlan={setPlan}
        onSuccess={() => {
          form.reset()
          clearAbstractTokenId()
        }}
      />
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
        <ButtonWithSpinner
          isLoading={isPending}
          className="w-full"
          type="submit"
        >
          Submit
        </ButtonWithSpinner>
      </DeployedTokenForm>
    </>
  )
}
