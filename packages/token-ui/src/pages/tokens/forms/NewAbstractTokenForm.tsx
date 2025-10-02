import { v } from '@l2beat/validate'
import { skipToken, useMutation, useQuery } from '@tanstack/react-query'
import { RefreshCwIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { coingecko } from '~/api/coingecko'
import { Button } from '~/components/core/Button'
import {
  Form,
  FormControl,
  FormDescription,
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
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useRandomId } from '~/hooks/useRandomId'
import { type Plan, tokenService } from '~/mock/MockTokenService'
import type { AbstractToken } from '~/mock/types'
import { l2beatResolver } from '~/utils/validationResolver'

const categoryValues = ['btc', 'ether', 'stablecoin', 'other'] as const

const formSchema = v.object({
  id: v.string(),
  issuer: v.string().optional(),
  symbol: v.string(),
  category: v.enum(categoryValues),
  coingeckoId: v.string().optional(),
  coingeckoListingTimestamp: v.string().optional(),
  iconUrl: v.string().optional(),
  comment: v.string().optional(),
})
export function NewAbstractTokenForm() {
  const { id, refresh } = useRandomId()
  const form = useForm<v.infer<typeof formSchema>>({
    resolver: l2beatResolver(formSchema),
    defaultValues: {
      id,
    },
  })
  const [plan, setPlan] = useState<Plan | undefined>(undefined)

  const coingeckoId = form.watch('coingeckoId')
  const debouncedCoingeckoId = useDebouncedValue(form.watch('coingeckoId'), 500)
  const { data: coin, isLoading } = useQuery({
    queryKey: ['coingecko', 'coin', debouncedCoingeckoId],
    queryFn: debouncedCoingeckoId
      ? () => coingecko.getCoinById(debouncedCoingeckoId)
      : skipToken,
    retry: false,
  })

  const { mutate: planAbstractToken, isPending: isPlanPending } = useMutation({
    mutationFn: (token: AbstractToken) =>
      tokenService.plan({
        type: 'AddAbstractTokenIntent',
        abstractToken: token,
      }),
    onSuccess: (data) => {
      setPlan(data)
    },
  })

  useEffect(() => {
    if (isLoading) return
    if (!coingeckoId) return
    if (coin) {
      form.clearErrors('coingeckoId')
      form.setValue('symbol', coin.symbol)
      form.setValue('iconUrl', coin.image.large)
    }
    if (!coin) {
      form.setValue('symbol', '')
      form.setValue('iconUrl', '')
    }
    if (coin === null) {
      form.setError('coingeckoId', { message: 'Coin not found' })
    }
  }, [coin])

  useEffect(() => {
    if (id !== form.getValues().id) {
      form.setValue('id', id)
    }
  }, [id])

  function onSubmit(values: v.infer<typeof formSchema>) {
    planAbstractToken({
      ...values,
      coingeckoListingTimestamp: values.coingeckoListingTimestamp
        ? new Date(values.coingeckoListingTimestamp)
        : undefined,
    })
  }

  const showCoingeckoLoading = isLoading || coingeckoId !== debouncedCoingeckoId

  return (
    <>
      <PlanConfirmationDialog plan={plan} setPlan={setPlan} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={isPlanPending} className="space-y-8">
            <FormField
              control={form.control}
              name="id"
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <Button type="button" onClick={refresh} className="size-9">
                      <RefreshCwIcon />
                    </Button>
                  </div>
                  <FormDescription>
                    This is the ID of the token. It is randomly generated with
                    refresh option.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuer</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Circle" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coingeckoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Coingecko ID{' '}
                    {showCoingeckoLoading && <Spinner className="size-3.5" />}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormDescription>
                    This is the Coingecko ID of the token. You can find it on
                    the token page on Coingecko.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symbol"
              disabled={showCoingeckoLoading}
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
              name="iconUrl"
              disabled={showCoingeckoLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coingeckoListingTimestamp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coingecko Listing Timestamp</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryValues.map((category) => (
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

            <Button type="submit">Submit</Button>
          </fieldset>
        </form>
      </Form>
    </>
  )
}
