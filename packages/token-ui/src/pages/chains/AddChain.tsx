import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import { Card, CardContent } from '~/components/core/Card'
import { ChainForm, ChainSchema } from '~/components/forms/ChainForm'
import { useQueryState } from '~/hooks/useQueryState'
import { AppLayout } from '~/layouts/AppLayout'
import { api } from '~/react-query/trpc'
import { validateResolver } from '~/utils/validateResolver'

export function AddChain({ defaultValues }: { defaultValues?: ChainSchema }) {
  const utils = api.useUtils()
  const [queryName] = useQueryState('name', '')
  const form = useForm<ChainSchema>({
    resolver: validateResolver(ChainSchema),
    defaultValues: defaultValues ?? {
      chainId: 0,
    },
  })

  const { mutate: insertChain, isPending } = api.chains.insert.useMutation({
    onSuccess: (_, vars) => {
      toast.success(
        <span>
          Chain added successfully.{' '}
          <Link to={`/chains/${vars.name}`} className="underline">
            View chain
          </Link>
        </span>,
      )
      utils.chains.getAll.invalidate()
      utils.search.all.invalidate()
      form.reset()
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || 'Failed to add chain')
    },
  })

  function onSubmit(values: ChainSchema) {
    if (queryName) {
      // If query name is present - we are coming from a add deployed token page, so we need to invalidate the deployed token checks
      utils.deployedTokens.checks.invalidate()
    }
    insertChain({
      name: values.name,
      chainId: values.chainId,
      explorerUrl: values.explorerUrl || null,
      aliases: values.aliases || null,
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
