import { v } from '@l2beat/validate'
import { ArrowRightIcon, CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import type { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { Link, useSearchParams } from 'react-router-dom'
import { Button, buttonVariants } from '~/components/core/Button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/core/Command'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import { Spinner } from '~/components/core/Spinner'
import { Textarea } from '~/components/core/TextArea'
import { api } from '~/react-query/trpc'
import { minLengthCheck, minNumberCheck } from '~/utils/checks'
import { cn } from '~/utils/cn'
import { getAbstractTokenDisplayId } from '~/utils/getDisplayId'

export type DeployedTokenSchema = v.infer<typeof DeployedTokenSchema>
export const DeployedTokenSchema = v.object({
  chain: v.string(),
  address: v.string(),
  decimals: v.number().check(minNumberCheck(1)),
  symbol: v.string().check(minLengthCheck(1)),
  abstractTokenId: v.string().optional(),
  deploymentTimestamp: v.string(),
  comment: v.string().optional(),
})

export function DeployedTokenForm({
  form,
  onSubmit,
  isFormDisabled,
  deployedTokenCheck,
  children,
}: {
  form: UseFormReturn<DeployedTokenSchema, unknown, DeployedTokenSchema>
  onSubmit: SubmitHandler<DeployedTokenSchema>
  isFormDisabled: boolean
  deployedTokenCheck: {
    exists: boolean | undefined
    loading: boolean
  }
  children: React.ReactNode
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: chains, isLoading: areChainsLoading } =
    api.chains.getAll.useQuery()
  const { data: abstractTokens, isLoading: areAbstractTokensLoading } =
    api.tokens.getAllAbstractTokens.useQuery()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
        <fieldset disabled={isFormDisabled} className="space-y-8">
          <div className="grid grid-cols-3 items-start gap-2">
            <FormField
              control={form.control}
              name="chain"
              success={deployedTokenCheck.exists === false}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Chain{' '}
                    {deployedTokenCheck.loading && (
                      <Spinner className="size-3.5" />
                    )}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={areChainsLoading}
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? (chains?.find((chain) => chain === field.value) ??
                              form.formState.defaultValues?.chain)
                            : 'Select chain'}
                          <ChevronsUpDownIcon className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search chain..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No chain found.</CommandEmpty>
                          <CommandGroup>
                            {chains?.map((chain) => (
                              <CommandItem
                                value={chain}
                                key={chain}
                                onSelect={() => {
                                  form.setValue('chain', chain, {
                                    shouldDirty: true,
                                  })
                                }}
                              >
                                {chain}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto',
                                    chain === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              success={deployedTokenCheck.exists === false}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    Address{' '}
                    {deployedTokenCheck.loading && (
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Abstract Token ID</FormLabel>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl className="w-[300px]">
                        <Button
                          disabled={areAbstractTokensLoading}
                          variant="outline"
                          role="combobox"
                          className={cn(
                            ' justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {areAbstractTokensLoading
                            ? 'Loading...'
                            : field.value
                              ? getAbstractTokenDisplayId(
                                  // biome-ignore lint/style/noNonNullAssertion: it's there
                                  abstractTokens?.find(
                                    (abstractToken) =>
                                      abstractToken.id === field.value,
                                  )!,
                                )
                              : 'Select abstract token'}
                          <ChevronsUpDownIcon className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search abstract token..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No abstract token found.</CommandEmpty>
                          <CommandGroup>
                            {abstractTokens?.map((abstractToken) => (
                              <CommandItem
                                value={abstractToken.id}
                                key={abstractToken.id}
                                onSelect={() => {
                                  form.setValue(
                                    'abstractTokenId',
                                    abstractToken.id,
                                    { shouldDirty: true },
                                  )
                                  setSearchParams({
                                    ...Object.fromEntries(
                                      searchParams.entries(),
                                    ),
                                    abstractTokenId: abstractToken.id,
                                  })
                                }}
                              >
                                {getAbstractTokenDisplayId(abstractToken)}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto',
                                    abstractToken.id === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Link
                    to={`/tokens/${field.value}`}
                    aria-disabled={!field.value}
                    className={buttonVariants({
                      variant: 'outline',
                      className: 'shrink-0',
                    })}
                  >
                    <ArrowRightIcon />
                  </Link>
                </div>
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
                  <Input type="datetime-local" {...field} />
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
          {children}
        </fieldset>
      </form>
    </Form>
  )
}

export function setDeployedTokenExistsError(
  form: UseFormReturn<DeployedTokenSchema>,
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
