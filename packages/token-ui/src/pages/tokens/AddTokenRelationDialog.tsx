import {
  type KnownInteropBridgeType,
  KnownInteropBridgeTypeValues,
  MANUAL_RELATION_PLUGIN,
} from '@l2beat/shared-pure'
import type {
  ChainRecord,
  ManualRelationEvidenceInput,
  Plan,
} from '@l2beat/token-backend'
import { v } from '@l2beat/validate'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ButtonWithSpinner } from '~/components/ButtonWithSpinner'
import { Button } from '~/components/core/Button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/core/Command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/core/Dialog'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { Textarea } from '~/components/core/TextArea'
import { useTRPC } from '~/react-query/trpc'
import { cn } from '~/utils/cn'
import { validateResolver } from '~/utils/validateResolver'

const BRIDGE_TYPE_LABELS: Record<KnownInteropBridgeType, string> = {
  lockAndMint: 'Lock and mint — one token is escrowed, the other is minted',
  burnAndMint: 'Burn and mint — burned on one side, minted on the other',
  nonMinting: 'Non-minting — connected without minting',
}

const LOCKED_SIDES = ['this', 'other', 'unknown'] as const

type AddTokenRelationSchema = v.infer<typeof AddTokenRelationSchema>
const AddTokenRelationSchema = v.object({
  otherChain: v.string().check(requiredCheck('Select a chain')),
  otherAddress: v.string().check(requiredCheck('Enter an address')),
  bridgeType: v.enum(KnownInteropBridgeTypeValues),
  lockedSide: v.enum(LOCKED_SIDES),
  bridgeName: v.string(),
  bridgeChain: v.string(),
  bridgeAddress: v.string(),
  comment: v.string(),
})

function requiredCheck(message: string) {
  return (value: string) => (value.length > 0 ? true : message)
}

/**
 * Adds a manual relation between the viewed deployed token and another one:
 * plugin is pinned to the `manual` sentinel and the details a human can
 * attest to (bridge, comment) go into the `{ kind: 'manual', ... }` evidence.
 * The backend stamps the evidence with the plan-time user and the generated
 * plan is confirmed in the page's shared PlanConfirmationDialog.
 */
export function AddTokenRelationDialog({
  token,
  setPlan,
}: {
  token: { chain: string; address: string; symbol: string }
  setPlan: (plan: Plan | undefined) => void
}) {
  const trpc = useTRPC()
  const [open, setOpen] = useState(false)

  const form = useForm<AddTokenRelationSchema>({
    resolver: validateResolver(AddTokenRelationSchema),
    defaultValues: {
      otherChain: '',
      otherAddress: '',
      bridgeType: 'lockAndMint',
      lockedSide: 'unknown',
      bridgeName: '',
      bridgeChain: '',
      bridgeAddress: '',
      comment: '',
    },
  })

  const { data: chains, isLoading: areChainsLoading } = useQuery(
    trpc.chains.getAll.queryOptions(),
  )

  const otherChain = form.watch('otherChain')
  const otherAddress = form.watch('otherAddress')
  const bridgeType = form.watch('bridgeType')

  const { data: otherTokenExists, isLoading: isOtherTokenCheckLoading } =
    useQuery(
      trpc.deployedTokens.checkIfExists.queryOptions(
        { chain: otherChain, address: otherAddress },
        { enabled: open && !!otherChain && !!otherAddress },
      ),
    )

  const { mutate: planMutate, isPending } = useMutation(
    trpc.plan.generate.mutationOptions({
      onSuccess: (data) => {
        if (data.outcome === 'success') {
          setOpen(false)
          form.reset()
          setPlan(data.plan)
        } else {
          toast.error(data.error)
        }
      },
    }),
  )

  function onSubmit(values: AddTokenRelationSchema) {
    if (isOtherTokenCheckLoading) return
    if (otherTokenExists === false) {
      setOtherTokenMissingError(form)
      return
    }
    if (
      values.otherChain === token.chain &&
      values.otherAddress.toLowerCase() === token.address.toLowerCase()
    ) {
      form.setError('otherAddress', {
        type: 'validation',
        message: 'A token relation must connect two different tokens',
      })
      return
    }
    if (!values.bridgeName && (values.bridgeChain || values.bridgeAddress)) {
      form.setError('bridgeName', {
        type: 'validation',
        message: 'Name the bridge or clear its chain and address',
      })
      return
    }

    const evidence: ManualRelationEvidenceInput = {
      kind: 'manual',
      comment: values.comment || null,
      bridge: values.bridgeName
        ? {
            name: values.bridgeName,
            chain: values.bridgeChain || null,
            address: values.bridgeAddress || null,
          }
        : null,
    }

    planMutate({
      type: 'AddTokenRelationIntent',
      record: {
        tokenAChain: token.chain,
        tokenAAddress: token.address,
        tokenBChain: values.otherChain,
        tokenBAddress: values.otherAddress,
        plugin: MANUAL_RELATION_PLUGIN,
        bridgeType: values.bridgeType,
        lockedToken:
          values.bridgeType !== 'lockAndMint'
            ? null
            : values.lockedSide === 'this'
              ? 'A'
              : values.lockedSide === 'other'
                ? 'B'
                : null,
        transfer: evidence,
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) form.reset()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusIcon /> Add relation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add manual relation</DialogTitle>
          <DialogDescription>
            Record a relation the interop pipeline cannot observe (e.g. a
            same-chain wrapper like ETH and WETH). It is stored with plugin{' '}
            <span className="font-mono">{MANUAL_RELATION_PLUGIN}</span> and your
            entry as its evidence.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isPending} className="space-y-4">
              <div className="grid grid-cols-3 items-start gap-2">
                <FormField
                  control={form.control}
                  name="otherChain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other token chain</FormLabel>
                      <ChainCombobox
                        value={field.value}
                        chains={chains}
                        loading={areChainsLoading}
                        onSelect={(chain) =>
                          form.setValue('otherChain', chain, {
                            shouldDirty: true,
                          })
                        }
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otherAddress"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Other token address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="0xd33db33f or native" />
                      </FormControl>
                      {otherTokenExists === false && (
                        <p className="text-destructive text-sm">
                          No deployed token with this chain and address —
                          relations can only be added between catalogued tokens.
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="bridgeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bridge type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select bridge type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {KnownInteropBridgeTypeValues.map((value) => (
                          <SelectItem key={value} value={value}>
                            {BRIDGE_TYPE_LABELS[value]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {bridgeType === 'lockAndMint' && (
                <FormField
                  control={form.control}
                  name="lockedSide"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Locked token</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select locked token" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="this">
                            This token ({token.symbol}) is locked — the other is
                            minted
                          </SelectItem>
                          <SelectItem value="other">
                            The other token is locked — this one is minted
                          </SelectItem>
                          <SelectItem value="unknown">
                            Not identified
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="space-y-2 rounded-md border p-3">
                <div>
                  <div className="font-medium text-sm">Bridge (optional)</div>
                  <p className="text-muted-foreground text-xs">
                    The mechanism you claim creates this relation, e.g. the WETH
                    contract for ETH and WETH.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="bridgeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. WETH contract" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-3 items-start gap-2">
                  <FormField
                    control={form.control}
                    name="bridgeChain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chain</FormLabel>
                        <ChainCombobox
                          value={field.value}
                          chains={chains}
                          loading={areChainsLoading}
                          onSelect={(chain) =>
                            form.setValue(
                              'bridgeChain',
                              chain === field.value ? '' : chain,
                              { shouldDirty: true },
                            )
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bridgeAddress"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Contract address</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="0xd33db33f" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Why does this relation exist?"
                      />
                    </FormControl>
                    <FormDescription>
                      Stored in the relation's evidence together with your
                      email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <ButtonWithSpinner type="submit" isLoading={isPending}>
                  Plan
                </ButtonWithSpinner>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </fieldset>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function setOtherTokenMissingError(form: {
  setError: (
    name: 'otherAddress',
    error: { type: string; message: string },
  ) => void
}) {
  form.setError('otherAddress', {
    type: 'validation',
    message:
      'No deployed token with this chain and address — relations can only be added between catalogued tokens',
  })
}

function ChainCombobox({
  value,
  chains,
  loading,
  onSelect,
}: {
  value: string
  chains: ChainRecord[] | undefined
  loading: boolean
  onSelect: (chain: string) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            disabled={loading}
            variant="outline"
            role="combobox"
            className={cn(
              'w-full justify-between',
              !value && 'text-muted-foreground',
            )}
          >
            <span className="truncate">{value || 'Select chain'}</span>
            <ChevronsUpDownIcon className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search chain..." className="h-9" />
          <CommandList>
            <CommandEmpty>No chain found.</CommandEmpty>
            <CommandGroup>
              {chains?.map((chain) => (
                <CommandItem
                  value={chain.name}
                  key={chain.name}
                  onSelect={() => onSelect(chain.name)}
                >
                  {chain.name}
                  <CheckIcon
                    className={cn(
                      'ml-auto',
                      chain.name === value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
