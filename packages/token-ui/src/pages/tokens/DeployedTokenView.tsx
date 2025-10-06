import { useMutation } from '@tanstack/react-query'
import { TrashIcon } from 'lucide-react'
import { useState } from 'react'
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
} from '~/components/forms/DeployedTokenForm'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { type Plan, tokenService } from '~/mock/MockTokenService'
import type { DeployedToken } from '~/mock/types'
import { toYYYYMMDD } from '~/utils/toYYYYMMDD'
import { validateResolver } from '~/utils/validateResolver'

export function DeployedTokenView({ token }: { token: DeployedToken }) {
  const [plan, setPlan] = useState<Plan | undefined>(undefined)

  const form = useForm<DeployedTokenSchema>({
    resolver: validateResolver(DeployedTokenSchema),
    defaultValues: {
      ...token,
      deploymentTimestamp: toYYYYMMDD(token.deploymentTimestamp),
    },
  })
  const { mutate: planDeleteDeployedToken, isPending } = useMutation({
    mutationFn: () =>
      tokenService.plan({
        type: 'DeleteDeployedTokenIntent',
        deployedTokenId: token.id,
      }),
    onSuccess: (data) => {
      setPlan(data)
    },
  })

  return (
    <>
      <PlanConfirmationDialog
        plan={plan}
        setPlan={setPlan}
        onSuccess={form.reset}
      />
      <div className="mx-auto flex max-w-2xl gap-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Deployed Token
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeployedTokenForm
              form={form}
              onSubmit={() => {}}
              isFormDisabled={isPending}
              deployedTokenCheck={{
                exists: undefined,
                loading: false,
              }}
            >
              <ButtonWithSpinner
                isLoading={false}
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
            planDeleteDeployedToken()
          }}
          isLoading={isPending}
        >
          <TrashIcon />
        </ButtonWithSpinner>
      </div>
    </>
  )
}
