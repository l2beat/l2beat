import { v } from '@l2beat/validate'
import { PlusIcon, TrashIcon } from 'lucide-react'
import type { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { useFieldArray } from 'react-hook-form'
import { Button } from '~/components/core/Button'
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
import { minLengthCheck, urlCheck } from '~/utils/checks'
import { Card, CardContent } from '../core/Card'
import { TestApiButton } from './TestApiButton'

const withoutURL = ['etherscan'] as const
const withURL = ['rpc', 'blockscout', 'blockscoutV2', 'routescan'] as const
const apiTypeValues = [...withoutURL, ...withURL] as const

export type ChainApiSchema = v.infer<typeof ChainApiSchema>
export const ChainApiSchema = v.union([
  v.object({
    type: v.enum(withoutURL),
    callsPerMinute: v.number().optional(),
  }),
  v.object({
    type: v.enum(withURL),
    url: v.string().check(urlCheck),
    callsPerMinute: v.number().optional(),
  }),
])

export type ChainSchema = v.infer<typeof ChainSchema>
export const ChainSchema = v.object({
  name: v.string().check(minLengthCheck(1)),
  chainId: v.number(),
  explorerUrl: v
    .union([
      v.string().check((value) => {
        if (value) {
          return urlCheck(value)
        }
        return true
      }),
      v.null(),
    ])
    .optional(),
  aliases: v.array(v.string()).optional(),
  apis: v.array(ChainApiSchema).optional(),
})

export function ChainForm({
  form,
  onSubmit,
  isFormDisabled,
  children,
}: {
  form: UseFormReturn<ChainSchema, unknown, ChainSchema>
  onSubmit: SubmitHandler<ChainSchema>
  isFormDisabled: boolean
  children: React.ReactNode
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'apis',
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
        <fieldset disabled={isFormDisabled} className="space-y-8">
          <div className="grid grid-cols-2 items-start gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chainId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chain ID</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === '' ? undefined : Number(value))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="explorerUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Explorer URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value === '' ? null : value)
                    }}
                    placeholder="https://..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <FormLabel>APIs</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    type: 'rpc',
                    url: '',
                  })
                }
              >
                <PlusIcon className="size-4" />
                Add API
              </Button>
            </div>

            {fields.map((field, index) => {
              const apiType = form.watch(`apis.${index}.type`)
              const url = form.watch(`apis.${index}.url`)
              const chainId = form.watch('chainId')
              return (
                <Card key={field.id} className="relative">
                  <div className="absolute top-6 right-6">
                    {apiType &&
                      (apiType === 'rpc' ||
                        apiType === 'etherscan' ||
                        apiType === 'blockscout') && (
                        <TestApiButton
                          type={apiType}
                          url={url || undefined}
                          chainId={chainId || undefined}
                        />
                      )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </div>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`apis.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              // Clear URL when switching to etherscan
                              if (value === 'etherscan') {
                                form.setValue(`apis.${index}.url`, '')
                              }
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select API type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {apiTypeValues.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch(`apis.${index}.type`) !== 'etherscan' && (
                      <FormField
                        control={form.control}
                        name={`apis.${index}.url`}
                        rules={{
                          required: 'URL is required for this API type',
                          validate: (value) => {
                            if (!value) {
                              return 'URL is required for this API type'
                            }
                            return urlCheck(value)
                          },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value ?? ''}
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(value === '' ? null : value)
                                }}
                                placeholder="https://..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name={`apis.${index}.callsPerMinute`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Calls Per Minute (optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                const value = e.target.value
                                field.onChange(
                                  value === '' ? undefined : Number(value),
                                )
                              }}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {children}
        </fieldset>
      </form>
    </Form>
  )
}
