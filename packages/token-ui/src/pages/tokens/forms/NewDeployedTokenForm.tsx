import { v } from '@l2beat/validate'
import { skipToken, useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { type UseFormReturn, useForm } from 'react-hook-form'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/core/Form'
import { Input } from '~/components/core/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { Spinner } from '~/components/core/Spinner'
import { Textarea } from '~/components/core/TextArea'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { type Plan, tokenService } from '~/mock/MockTokenService'
import type { DeployedToken } from '~/mock/types'
import {
  ethereumAddressCheck,
  minLengthCheck,
  minNumberCheck,
} from '~/utils/checks'
import { validateResolver } from '~/utils/validationResolver'

const formSchema = v.object({
  chain: v.string(),
  address: v.string().check(ethereumAddressCheck),
  decimals: v.number().check(minNumberCheck(1)),
  symbol: v.string().check(minLengthCheck(1)),
  abstractTokenId: v.string().optional(),
  deploymentTimestamp: v.string(),
  comment: v.string().optional(),
})

export function NewDeployedTokenForm() {
  const form = useForm<v.infer<typeof formSchema>>({
    resolver: validateResolver(formSchema),
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

  const { data: chains, isLoading: areChainsLoading } = useQuery({
    queryKey: ['chains'],
    queryFn: () => tokenService.getChains(),
  })
  const { data: abstractTokens, isLoading: areAbstractTokensLoading } =
    useQuery({
      queryKey: ['abstractTokens'],
      queryFn: () => tokenService.getAbstractTokens(),
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

  function onSubmit(values: v.infer<typeof formSchema>) {
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={isPlanPending} className="space-y-8">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="chain"
                disabled={areChainsLoading}
                success={deployedTokenExists === false}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Chain{' '}
                      {deployedTokenExistsLoading && (
                        <Spinner className="size-3.5" />
                      )}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a chain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {chains?.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                success={deployedTokenExists === false}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Address{' '}
                      {deployedTokenExistsLoading && (
                        <Spinner className="size-3.5" />
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="0xd33db33f" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="decimals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decimals</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="abstractTokenId"
              disabled={areAbstractTokensLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abstract Token ID</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an abstract token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {abstractTokens?.map((token) => (
                        <SelectItem key={token.id} value={token.id}>
                          {token.id}:{token.issuer ?? 'unknown'}:{token.symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deploymentTimestamp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deployment Timestamp</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ButtonWithSpinner
              isLoading={isPlanPending}
              className="w-full"
              type="submit"
            >
              Submit
            </ButtonWithSpinner>
          </fieldset>
        </form>
      </Form>
    </>
  )
}

function setDeployedTokenExistsError(
  form: UseFormReturn<v.infer<typeof formSchema>>,
) {
  form.setError('address', {
    type: 'custom',
    message: 'Deployed token with given address and chain already exists',
  })
  form.setError('chain', {
    type: 'custom',
    message: 'Deployed token with given address and chain already exists',
  })
}
