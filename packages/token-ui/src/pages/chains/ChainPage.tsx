import { TrashIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { ChainForm, ChainSchema } from '~/components/forms/ChainForm'
import { LoadingState } from '~/components/LoadingState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import { validateResolver } from '~/utils/validateResolver'
import type { ChainRecord } from '../../../../database/dist/repositories/ChainRepository'

export function ChainPage() {
  const { name } = useParams()
  const { data } = api.chains.getByName.useQuery(name ?? '', {
    enabled: name !== '',
  })

  if (!name || data === null) {
    return <Navigate to="/not-found" replace />
  }

  return (
    <AppLayout>
      {data ? <ChainView chain={data} /> : <LoadingState className="h-full" />}
    </AppLayout>
  )
}

function ChainView({ chain }: { chain: ChainRecord }) {
  const navigate = useNavigate()
  const utils = api.useUtils()
  const form = useForm<ChainSchema>({
    resolver: validateResolver(ChainSchema),
    defaultValues: {
      name: chain.name,
      chainId: chain.chainId,
      explorerUrl: chain.explorerUrl ?? undefined,
      aliases: chain.aliases ?? undefined,
      apis: chain.apis ?? undefined,
    },
  })

  const { mutate: updateChain, isPending: isUpdating } =
    api.chains.update.useMutation({
      onSuccess: (_: unknown, vars: { update: { name?: string } }) => {
        toast.success('Chain updated successfully')
        utils.chains.getAll.invalidate()
        // If name changed, navigate to new URL
        if (vars.update.name && vars.update.name !== chain.name) {
          navigate(`/chains/${vars.update.name}`)
        } else {
          utils.chains.getByName.invalidate(chain.name)
        }
        const values = form.getValues()
        form.reset(values)
      },
      onError: (error: { message?: string }) => {
        toast.error(error.message || 'Failed to update chain')
      },
    })

  const { mutate: deleteChain, isPending: isDeleting } =
    api.chains.delete.useMutation({
      onSuccess: () => {
        toast.success('Chain deleted successfully')
        utils.chains.getAll.invalidate()
        navigate('/chains')
      },
      onError: (error: { message?: string }) => {
        toast.error(error.message || 'Failed to delete chain')
      },
    })

  return (
    <div className="mx-auto flex w-full max-w-3xl gap-2">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Chain</CardTitle>
        </CardHeader>
        <CardContent>
          <ChainForm
            form={form}
            onSubmit={(values) => {
              updateChain({
                name: chain.name,
                update: {
                  name: values.name,
                  chainId: values.chainId,
                  explorerUrl: values.explorerUrl || null,
                  aliases: values.aliases || null,
                  apis: values.apis || null,
                },
              })
            }}
            isFormDisabled={isUpdating || isDeleting}
          >
            <ButtonWithSpinner
              isLoading={isUpdating}
              disabled={
                Object.keys(form.formState.dirtyFields).length === 0 ||
                isDeleting
              }
              className="w-full"
              type="submit"
            >
              Update
            </ButtonWithSpinner>
          </ChainForm>
        </CardContent>
      </Card>
      <ButtonWithSpinner
        variant="destructive"
        className="mt-2"
        size="icon"
        onClick={() => {
          if (
            confirm(
              `Are you sure you want to delete chain "${chain.name}"? This action cannot be undone.`,
            )
          ) {
            deleteChain({ name: chain.name })
          }
        }}
        isLoading={isDeleting}
        disabled={isUpdating}
      >
        <TrashIcon />
      </ButtonWithSpinner>
    </div>
  )
}
