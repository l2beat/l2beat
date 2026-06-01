import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import { Card, CardContent } from '~/components/core/Card'
import { ChainForm, ChainSchema } from '~/components/forms/ChainForm'
import { useQueryState } from '~/hooks/useQueryState'
import { AppLayout } from '~/layouts/AppLayout'
import { useTRPC } from '~/react-query/trpc'
import { buildUrlWithParams } from '~/utils/buildUrlWithParams'
import { validateResolver } from '~/utils/validateResolver'

export function AddChain({ defaultValues }: { defaultValues?: ChainSchema }) {
  const api = useTRPC()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [queryName] = useQueryState('name', '')
  const [queryAddress] = useQueryState('address', '')
  const [queryAbstractTokenId] = useQueryState('abstractTokenId', '')
  const [redirectTo] = useQueryState('redirectTo', '')
  const form = useForm<ChainSchema>({
    resolver: validateResolver(ChainSchema),
    defaultValues: defaultValues ?? {
      chainId: 0,
    },
  })

  const { mutate: insertChain, isPending } = useMutation(
    api.chains.insert.mutationOptions({
      onSuccess: (_, vars) => {
        toast.success(
          <span>
            Chain added successfully.{' '}
            <Link to={`/chains/${vars.name}`} className="underline">
              View chain
            </Link>
          </span>,
        )
        queryClient.invalidateQueries(api.chains.getAll.queryFilter())
        queryClient.invalidateQueries(api.search.all.queryFilter())
        if (redirectTo === 'deployed') {
          queryClient.invalidateQueries(api.deployedTokens.checks.queryFilter())
          navigate(
            buildUrlWithParams('/tokens/new', {
              tab: redirectTo,
              chain: vars.name,
              address: queryAddress,
              abstractTokenId: queryAbstractTokenId,
            }),
          )
          return
        }
        form.reset({ chainId: 0, aliases: [] })
      },
      onError: (error: { message?: string }) => {
        toast.error(error.message || 'Failed to add chain')
      },
    }),
  )

  function onSubmit(values: ChainSchema) {
    insertChain({
      name: values.name,
      chainId: values.chainId,
      explorerUrl: values.explorerUrl || null,
      aliases: values.aliases?.map((a) => a.value) || null,
      apis: values.apis || null,
    })
  }

  useEffect(() => {
    if (queryName) {
      form.setValue('name', queryName)
    }
  }, [queryName, form.setValue])

  return (
    <AppLayout>
      <Card className="mx-auto w-full max-w-3xl">
        <CardContent>
          <ChainForm form={form} onSubmit={onSubmit} isFormDisabled={isPending}>
            <ButtonWithSpinner
              isLoading={isPending}
              className="w-full"
              type="submit"
            >
              Submit
            </ButtonWithSpinner>
          </ChainForm>
        </CardContent>
      </Card>
    </AppLayout>
  )
}
