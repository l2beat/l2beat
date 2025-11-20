import type { AbstractTokenRecord, RouterOutputs } from '@l2beat/token-backend'
import { v } from '@l2beat/validate'
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  PlusIcon,
  SettingsIcon,
} from 'lucide-react'
import type { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
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
import { buildUrlWithParams } from '~/utils/buildUrlWithParams'
import { minLengthCheck, minNumberCheck } from '~/utils/checks'
import { cn } from '~/utils/cn'
import { getAbstractTokenDisplayId } from '~/utils/getDisplayId'
import { parseDateTimePaste } from '~/utils/parseDate'
import type {
  ChainApi,
  ChainRecord,
} from '../../../../database/dist/repositories/ChainRepository'
import { AutoFillIndicator } from '../AutoFillIndicator'
import { Tooltip, TooltipContent, TooltipTrigger } from '../core/Tooltip'
import { ExplorerLinkButton } from '../ExplorerLink'

export type DataSource = 'coingecko' | ChainApi['type']

export const fieldToDataSource: Record<
  'symbol' | 'decimals' | 'deploymentTimestamp' | 'abstractTokenId',
  DataSource[]
> = {
  symbol: ['coingecko'],
  decimals: ['rpc'],
  deploymentTimestamp: ['etherscan', 'blockscout'],
  abstractTokenId: ['coingecko'],
}

export const dataSourceToLabel: Record<DataSource, string> = {
  coingecko: 'Coingecko',
  rpc: 'RPC',
  etherscan: 'Etherscan',
  blockscout: 'Blockscout',
  blockscoutV2: 'Blockscout V2',
  routescan: 'Routescan',
}

export type DeployedTokenSchema = v.infer<typeof DeployedTokenSchema>
export const DeployedTokenSchema = v.object({
  chain: v.string(),
  address: v.string(),
  decimals: v.string().transform(Number).check(minNumberCheck(1)),
  symbol: v.string().check(minLengthCheck(1)),
  abstractTokenId: v.string().optional(),
  deploymentTimestamp: v.string(),
  comment: v.string().optional(),
})

interface Props {
  form: UseFormReturn<DeployedTokenSchema, unknown, DeployedTokenSchema>
  onSubmit: SubmitHandler<DeployedTokenSchema>
  isFormDisabled: boolean
  tokenDetails: {
    data: RouterOutputs['deployedTokens']['checks'] | undefined
    loading: boolean
  }
  abstractTokens: {
    data: AbstractTokenRecord[] | undefined
    loading: boolean
  }
  chains: {
    data: ChainRecord[] | undefined
    loading: boolean
  }
  autofill:
    | {
        symbol: boolean
        decimals: boolean
        deploymentTimestamp: boolean
        abstractTokenId: boolean
      }
    | undefined
  children: React.ReactNode
}

export function DeployedTokenForm({
  form,
  onSubmit,
  isFormDisabled,
  tokenDetails,
  abstractTokens,
  chains,
  autofill,
  children,
}: Props) {
  const abstractTokenId = form.watch('abstractTokenId')
  const abstractToken = abstractTokens.data?.find(
    (abstractToken) => abstractToken.id === abstractTokenId,
  )
  const chainValue = form.watch('chain')

  const success =
    tokenDetails.data && tokenDetails.data?.error?.type !== 'already-exists'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
        <fieldset disabled={isFormDisabled} className="space-y-8">
          <div className="grid grid-cols-3 items-start gap-2">
            <FormField
              control={form.control}
              name="chain"
              success={success}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Chain{' '}
                    {tokenDetails.loading && <Spinner className="size-3.5" />}
                  </FormLabel>
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className="flex-1">
                          <Button
                            disabled={chains.loading}
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'justify-between',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value
                              ? (chains.data?.find(
                                  (chain) => chain.name === field.value,
                                )?.name ?? form.formState.defaultValues?.chain)
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
                              {chains.data?.map((chain) => (
                                <CommandItem
                                  value={chain.name}
                                  key={chain.name}
                                  onSelect={() => {
                                    form.setValue('chain', chain.name, {
                                      shouldDirty: true,
                                    })
                                  }}
                                >
                                  {chain.name}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto',
                                      chain.name === field.value
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
                    {chainValue && (
                      <Link
                        to={`/chains/${chainValue}`}
                        target="_blank"
                        className={buttonVariants({
                          variant: 'outline',
                          className: 'shrink-0',
                          size: 'icon',
                        })}
                      >
                        <ArrowRightIcon />
                      </Link>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              success={success}
              render={({ field }) => {
                const chainRecord = chains.data?.find(
                  (chain) => chain.name === chainValue,
                )

                return (
                  <FormItem className="col-span-2">
                    <FormLabel>
                      Address{' '}
                      {tokenDetails.loading && <Spinner className="size-3.5" />}
                    </FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input {...field} placeholder="0xd33db33f" />
                      </FormControl>
                      {field.value?.startsWith('0x') ? (
                        chainRecord?.explorerUrl ? (
                          <ExplorerLinkButton
                            explorerUrl={chainRecord.explorerUrl}
                            value={field.value}
                            type="address"
                          />
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                to={`/chains/${chainValue}`}
                                target="_blank"
                                className={buttonVariants({
                                  variant: 'outline',
                                  className: 'shrink-0',
                                })}
                              >
                                <SettingsIcon />
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              No explorer URL configured for this chain. Click
                              to configure.
                            </TooltipContent>
                          </Tooltip>
                        )
                      ) : null}
                    </div>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          <FormField
            control={form.control}
            name="symbol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Symbol{' '}
                  {autofill && chainValue && (
                    <AutoFillIndicator
                      sources={fieldToDataSource.symbol.map(
                        (dS) => dataSourceToLabel[dS],
                      )}
                      available={autofill.symbol}
                      chainName={chainValue}
                    />
                  )}
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled={tokenDetails.loading} />
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
                <FormLabel>
                  Decimals
                  {autofill && chainValue && (
                    <AutoFillIndicator
                      sources={fieldToDataSource.decimals.map(
                        (dS) => dataSourceToLabel[dS],
                      )}
                      available={autofill.decimals}
                      chainName={chainValue}
                    />
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled={tokenDetails.loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deploymentTimestamp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Deployment Timestamp{' '}
                  {autofill && chainValue && (
                    <AutoFillIndicator
                      sources={fieldToDataSource.deploymentTimestamp.map(
                        (dS) => dataSourceToLabel[dS],
                      )}
                      available={autofill.deploymentTimestamp}
                      chainName={chainValue}
                    />
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    disabled={tokenDetails.loading}
                    onPaste={(e) => {
                      e.preventDefault()
                      const pastedText = e.clipboardData.getData('text')
                      const parsedDate = parseDateTimePaste(pastedText)
                      if (parsedDate) {
                        field.onChange(parsedDate)
                      } else {
                        toast.error(
                          `Invalid date format. If you think it's correct, please report to dev team.`,
                        )
                      }
                    }}
                  />
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
                <FormLabel>
                  Abstract Token ID{' '}
                  {autofill && chainValue && (
                    <AutoFillIndicator
                      sources={fieldToDataSource.abstractTokenId.map(
                        (dS) => dataSourceToLabel[dS],
                      )}
                      available={autofill.abstractTokenId}
                      chainName={chainValue}
                    />
                  )}
                </FormLabel>
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl className="w-[300px]">
                        <Button
                          disabled={abstractTokens.loading}
                          variant="outline"
                          role="combobox"
                          className={cn(
                            ' justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {abstractTokens.loading
                            ? 'Loading...'
                            : field.value
                              ? getAbstractTokenDisplayId(
                                  // biome-ignore lint/style/noNonNullAssertion: it's there
                                  abstractTokens.data?.find(
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
                            {abstractTokens.data?.map((abstractToken) => {
                              const displayId =
                                getAbstractTokenDisplayId(abstractToken)
                              return (
                                <CommandItem
                                  value={displayId}
                                  key={displayId}
                                  onSelect={() => {
                                    form.setValue(
                                      'abstractTokenId',
                                      abstractToken.id,
                                      { shouldDirty: true },
                                    )
                                  }}
                                >
                                  {displayId}
                                  <CheckIcon
                                    className={cn(
                                      'ml-auto',
                                      abstractToken.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                </CommandItem>
                              )
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {abstractToken && (
                    <Link
                      to={`/tokens/${field.value}`}
                      target="_blank"
                      className={buttonVariants({
                        variant: 'outline',
                        className: 'shrink-0',
                        size: 'icon',
                      })}
                    >
                      <ArrowRightIcon />
                    </Link>
                  )}
                  {tokenDetails.data?.data?.coingeckoId && !abstractToken && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={buildUrlWithParams('/tokens/new', {
                            tab: 'abstract',
                            coingeckoId: tokenDetails.data?.data?.coingeckoId,
                            redirectTo: 'deployed',
                          })}
                          className={buttonVariants({
                            variant: 'outline',
                            className: 'shrink-0',
                          })}
                        >
                          <PlusIcon />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        No abstract token found for this token. Click to add
                        one.
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
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
}
