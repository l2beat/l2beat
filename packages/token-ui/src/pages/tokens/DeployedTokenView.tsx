import { TrashIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import { Button } from '~/components/core/Button'
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
import type { DeployedToken } from '~/mock/types'
import { toYYYYMMDD } from '~/utils/toYYYYMMDD'
import { validateResolver } from '~/utils/validateResolver'

export function DeployedTokenView({ token }: { token: DeployedToken }) {
  const form = useForm<DeployedTokenSchema>({
    resolver: validateResolver(DeployedTokenSchema),
    defaultValues: {
      ...token,
      deploymentTimestamp: toYYYYMMDD(token.deploymentTimestamp),
    },
  })

  return (
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
            isFormDisabled={false}
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
      <Button variant="destructive" className="mt-2">
        <TrashIcon />
      </Button>
    </div>
  )
}
