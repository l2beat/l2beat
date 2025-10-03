import { v } from '@l2beat/validate'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
import { Textarea } from '~/components/core/TextArea'
import { PlanConfirmationDialog } from '~/components/PlanConfirmationDialog'
import { type Plan, tokenService } from '~/mock/MockTokenService'
import type { DeployedToken } from '~/mock/types'
import { validateResolver } from '~/utils/validationResolver'

const formSchema = v.object({
  chain: v.string(),
  address: v.string(),
  decimals: v.number(),
  symbol: v.string(),
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

  function onSubmit(values: v.infer<typeof formSchema>) {
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
            <FormField
              control={form.control}
              name="chain"
              disabled={areChainsLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chain</FormLabel>
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="0xd33db33f" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                          {token.id}
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
