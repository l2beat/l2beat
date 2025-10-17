import type { Plan } from '@l2beat/token-backend'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import {
  DeployedTokenForm,
  DeployedTokenSchema,
  setDeployedTokenExistsError,
} from '~/components/forms/DeployedTokenForm'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { api } from '~/react-query/trpc'
import { dateTimeInputToUnixTimestamp } from '~/utils/dateTimeInputToUnixTimestamp'
import { validateResolver } from '~/utils/validateResolver'

export function AddDeployedToken() {
  const [searchParams] = useSearchParams()
  const form = useForm<DeployedTokenSchema>({
    resolver: validateResolver(DeployedTokenSchema),
    defaultValues: {
      abstractTokenId: searchParams.get('abstractTokenId') ?? undefined,
    },
  })
  const [plan, setPlan] = useState<Plan | undefined>(undefined)

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
  const { data: deployedTokenExists, isLoading: deployedTokenExistsLoading } =
    api.tokens.checkIfDeployedTokenExists.useQuery(
      {
        chain,
        address,
      },
      {
        enabled: !!chain && !!address,
      },
    )

  useEffect(() => {
    if (deployedTokenExistsLoading) return
    if (deployedTokenExists) {
      setDeployedTokenExistsError(form)
    } else {
      form.clearErrors('address')
      form.clearErrors('chain')
    }
  }, [deployedTokenExists, deployedTokenExistsLoading, form])

  function onSubmit(values: DeployedTokenSchema) {
    if (deployedTokenExistsLoading) return
    if (deployedTokenExists) {
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
        onSuccess={form.reset}
      />
      <DeployedTokenForm
        form={form}
        onSubmit={onSubmit}
        isFormDisabled={isPending}
        deployedTokenCheck={{
          exists: deployedTokenExists,
          loading: deployedTokenExistsLoading,
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
