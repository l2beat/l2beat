import { v } from '@l2beat/validate'
import { ArrowRightIcon, RefreshCwIcon } from 'lucide-react'
import type { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Button, buttonVariants } from '~/components/core/Button'
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
import { minLengthCheck, urlCheck } from '~/utils/checks'
import { Checkbox } from '../core/Checkbox'

const categoryValues = ['btc', 'ether', 'stablecoin', 'other'] as const

export type AbstractTokenSchema = v.infer<typeof AbstractTokenSchema>
export const AbstractTokenSchema = v.object({
  id: v.string(),
  issuer: v.string().optional(),
  symbol: v.string().check(minLengthCheck(1)),
  category: v.enum(categoryValues),
  coingeckoId: v.string().optional(),
  coingeckoListingTimestamp: v.string().optional(),
  iconUrl: v
    .string()
    .check((value) => {
      if (value) {
        return urlCheck(value)
      }
      return true
    })
    .optional(),
  comment: v.string().optional(),
  reviewed: v.boolean(),
})

export function AbstractTokenForm({
  form,
  onSubmit,
  isFormDisabled,
  refreshId,
  coingeckoFields,
  children,
}: {
  form: UseFormReturn<AbstractTokenSchema, unknown, AbstractTokenSchema>
  onSubmit: SubmitHandler<AbstractTokenSchema>
  isFormDisabled: boolean
  refreshId?: () => void
  coingeckoFields: {
    isLoading: boolean
    success: boolean
    isListingTimestampLoading: boolean
  }
  children: React.ReactNode
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
        <fieldset disabled={isFormDisabled} className="space-y-8">
          <div className="grid grid-cols-[minmax(0,_1fr)_20px_minmax(0,_1fr)_20px_minmax(0,_1fr)] items-start gap-2">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input {...field} disabled className="font-mono" />
                    </FormControl>
                    {refreshId && (
                      <Button
                        type="button"
                        onClick={refreshId}
                        className="size-9"
                      >
                        <RefreshCwIcon />
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="mt-7 text-center font-bold">:</p>

            <FormField
              control={form.control}
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuer</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="unknown" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="mt-7 text-center font-bold">:</p>
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
          </div>

          <FormField
            control={form.control}
            name="coingeckoId"
            success={coingeckoFields.success}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Coingecko ID{' '}
                  {coingeckoFields.isLoading && (
                    <Spinner className="size-3.5" />
                  )}
                </FormLabel>
                <FormControl>
                  <div className="group flex items-center gap-2">
                    <Input {...field} />
                    <Link
                      to={`https://www.coingecko.com/en/coins/${field.value}`}
                      target="_blank"
                      aria-disabled={!coingeckoFields.success}
                      className={buttonVariants({
                        variant: 'outline',
                        className: 'shrink-0',
                      })}
                    >
                      <ArrowRightIcon />
                    </Link>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="iconUrl"
            disabled={coingeckoFields.isLoading}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon URL</FormLabel>
                <FormControl>
                  <div className="group flex items-center gap-2">
                    <Input {...field} />
                    <img
                      src={
                        field.value
                          ? field.value
                          : '/images/token-placeholder.png'
                      }
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  </div>
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
                <FormLabel>
                  Coingecko Listing Timestamp{' '}
                  {coingeckoFields.isListingTimestampLoading && (
                    <Spinner className="size-3.5" />
                  )}
                </FormLabel>
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

          <FormField
            control={form.control}
            name="reviewed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange(true)
                        : field.onChange(false)
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal text-sm">Reviewed</FormLabel>
              </FormItem>
            )}
          />
          {children}
        </fieldset>
      </form>
    </Form>
  )
}
