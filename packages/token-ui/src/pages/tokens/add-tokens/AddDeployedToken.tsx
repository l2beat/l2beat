import { skipToken, useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import {
  DeployedTokenForm,
  DeployedTokenSchema,
  setDeployedTokenExistsError,
} from '~/components/forms/DeployedTokenForm'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { type Plan, tokenService } from '~/mock/MockTokenService'
import type { DeployedToken } from '~/mock/types'
import { ethereumAddressCheck } from '~/utils/checks'
import { validateResolver } from '~/utils/validateResolver'

export function AddDeployedToken() {
  const form = useForm<DeployedTokenSchema>({
    resolver: validateResolver(DeployedTokenSchema),
  })
  const [plan, setPlan] = useState<Plan | undefined>(undefined)

  const { mutate: planDeployedToken, isPending: isPlanPending } = useMutation({
    mutationFn: (token: DeployedToken) =>
      tokenService.plan({
        type: 'AddDeployedTokenIntent',
        deployedToken: token,
      }),
    onSuccess: (data) => {
      setPlan(data)
    },
  })

  const chain = form.watch('chain')
  const address = form.watch('address')
  const { data: deployedTokenExists, isLoading: deployedTokenExistsLoading } =
    useQuery({
      queryKey: ['deployedTokenExists', chain, address],
      queryFn:
        chain && address && ethereumAddressCheck(address) === true
          ? () => tokenService.checkIfDeployedTokenExists(address, chain)
          : skipToken,
    })

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

    planDeployedToken({
      ...values,
      id: `${values.chain}-${values.address}`,
      deploymentTimestamp: new Date(values.deploymentTimestamp),
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
        isFormDisabled={isPlanPending}
        deployedTokenCheck={{
          exists: deployedTokenExists,
          loading: deployedTokenExistsLoading,
        }}
      >
        <ButtonWithSpinner
          isLoading={isPlanPending}
          className="w-full"
          type="submit"
        >
          Submit
        </ButtonWithSpinner>
      </DeployedTokenForm>
    </>
  )
}
