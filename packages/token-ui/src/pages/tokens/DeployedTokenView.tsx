import type { Plan } from '@l2beat/token-service'
import { skipToken, useQuery } from '@tanstack/react-query'
import { TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import {
  DeployedTokenForm,
  DeployedTokenSchema,
  setDeployedTokenExistsError,
} from '~/components/forms/DeployedTokenForm'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { tokenService } from '~/mock/MockTokenService'
import type { DeployedToken } from '~/mock/types'
import { api } from '~/react-query/trpc'
import { ethereumAddressCheck } from '~/utils/checks'
import { UnixTime } from '~/utils/UnixTime'
import { validateResolver } from '~/utils/validateResolver'

export function DeployedTokenView({ token }: { token: DeployedToken }) {
  const [plan, setPlan] = useState<Plan | undefined>(undefined)

  const form = useForm<DeployedTokenSchema>({
    resolver: validateResolver(DeployedTokenSchema),
    defaultValues: {
      ...token,
      abstractTokenId: token.abstractTokenId ?? undefined,
      comment: token.comment ?? undefined,
      deploymentTimestamp: UnixTime.toYYYYMMDD(token.deploymentTimestamp),
    },
  })

  const { mutate: planMutate, isPending: isPending } =
    api.plan.generate.useMutation({
      onSuccess: (data) => {
        if (data.outcome === 'success') {
          setPlan(data.plan)
        }
      },
    })

  function onSubmit(values: DeployedTokenSchema) {
    if (deployedTokenExistsLoading) return
    if (deployedTokenExists) {
      setDeployedTokenExistsError(form)
      return
    }
    planMutate({
      intent: {
        type: 'UpdateDeployedTokenIntent',
        pk: {
          address: values.address,
          chain: values.chain,
        },
        update: {
          abstractTokenId: values.abstractTokenId || null,
          comment: values.comment || null,
          decimals: values.decimals,
          symbol: values.symbol,
          deploymentTimestamp: UnixTime.fromDate(
            new Date(values.deploymentTimestamp),
          ),
        },
      },
    })
  }

  const chain = form.watch('chain')
  const address = form.watch('address')
  const { data: deployedTokenExists, isLoading: deployedTokenExistsLoading } =
    useQuery({
      queryKey: ['deployedTokenExists', chain, address],
      queryFn:
        chain &&
        address &&
        (address !== form.formState.defaultValues?.address ||
          chain !== form.formState.defaultValues?.chain) &&
        ethereumAddressCheck(address) === true
          ? () => tokenService.checkIfDeployedTokenExists(address, chain)
          : skipToken,
    })

  useEffect(() => {
    if (deployedTokenExistsLoading) return
    if (address === token.address && chain === token.chain) {
      form.setValue('address', token.address)
      form.setValue('chain', token.chain)
      return
    }
    if (deployedTokenExists) {
      setDeployedTokenExistsError(form)
    } else {
      form.clearErrors('address')
      form.clearErrors('chain')
    }
  }, [
    deployedTokenExists,
    deployedTokenExistsLoading,
    form,
    address,
    chain,
    token.address,
    token.chain,
  ])

  return (
    <>
      <PlanConfirmationDialog
        plan={plan}
        setPlan={setPlan}
        onSuccess={() => {
          form.reset(form.getValues())
        }}
      />
      <div className="mx-auto flex w-full max-w-3xl gap-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Deployed Token
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                disabled={Object.keys(form.formState.dirtyFields).length === 0}
                className="w-full"
                type="submit"
              >
                Update
              </ButtonWithSpinner>
            </DeployedTokenForm>
          </CardContent>
        </Card>
        <ButtonWithSpinner
          variant="destructive"
          className="mt-2"
          onClick={() => {
            planMutate({
              intent: {
                type: 'DeleteDeployedTokenIntent',
                pk: {
                  address: token.address,
                  chain: token.chain,
                },
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
