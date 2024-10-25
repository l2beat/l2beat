'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  type NetworkExplorerRecord,
  type NetworkRecord,
  type NetworkRpcRecord,
} from '@l2beat/database'
import {
  ExplorerType,
  NetworkType,
} from '@l2beat/database/dist/kysely/generated/enums'
import { SelectValue } from '@radix-ui/react-select'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { DeleteDialog } from '~/components/delete-dialog'
import { DiscardChangesDialog } from '~/components/discard-changes-dialog'
import { ReadonlyCopyInput } from '~/components/readonly-copy-input'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  selectNullValue,
} from '~/components/ui/select'
import { deleteNetwork, insertNetwork, updateNetwork } from '../_actions'

const networkFormSchema = z.object({
  name: z.string().min(3).max(191),
  logoUrl: z.string().url().or(z.literal('')),
  type: z.nativeEnum(NetworkType).or(z.literal(selectNullValue)),
  chainId: z.string(),
  coingeckoId: z.string(),
  axelarId: z.string(),
  axelarGatewayAddress: z.string(),
  orbitId: z.string(),
  wormholeId: z.string(),
  layerZeroV1EndpointAddress: z.string(),
  explorers: z.array(
    z.object({
      type: z.nativeEnum(ExplorerType),
      url: z.string(),
      apiKey: z.string(),
    }),
  ),
  rpcs: z.array(
    z.object({
      url: z.string(),
    }),
  ),
})

export function EditNetworkPage({
  network,
}: {
  network:
    | (NetworkRecord & {
        explorers: NetworkExplorerRecord[]
        rpcs: NetworkRpcRecord[]
      })
    | null
}) {
  const router = useRouter()
  const form = useForm<z.infer<typeof networkFormSchema>>({
    defaultValues: {
      name: network?.name ?? '',
      logoUrl: network?.logoUrl ?? '',
      type: network?.type === null ? selectNullValue : network?.type,
      chainId: network?.chainId?.toString() ?? '0',
      coingeckoId: network?.coingeckoId ?? '',
      axelarId: network?.axelarId ?? '',
      axelarGatewayAddress: network?.axelarGatewayAddress ?? '',
      orbitId: network?.orbitId ?? '',
      wormholeId: network?.wormholeId ?? '',
      layerZeroV1EndpointAddress: network?.layerZeroV1EndpointAddress ?? '',
      rpcs: network?.rpcs ?? [],
      explorers: network?.explorers ?? [],
    },
    resolver: zodResolver(networkFormSchema),
  })
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const rpcs = useFieldArray({
    control: form.control,
    name: 'rpcs',
  })

  const explorers = useFieldArray({
    control: form.control,
    name: 'explorers',
  })

  const onSubmit = useCallback(
    async (rawData: z.infer<typeof networkFormSchema>) => {
      const data = {
        name: rawData.name,
        chainId:
          rawData.type !== NetworkType.EVM ? null : Number(rawData.chainId),
        type: rawData.type !== selectNullValue ? rawData.type : null,
        logoUrl: rawData.logoUrl !== '' ? rawData.logoUrl : null,
        coingeckoId: rawData.coingeckoId !== '' ? rawData.coingeckoId : null,
        axelarId: rawData.axelarId !== '' ? rawData.axelarId : null,
        axelarGatewayAddress:
          rawData.axelarGatewayAddress !== ''
            ? rawData.axelarGatewayAddress
            : null,
        orbitId: rawData.orbitId !== '' ? rawData.orbitId : null,
        wormholeId: rawData.wormholeId !== '' ? rawData.wormholeId : null,
        layerZeroV1EndpointAddress:
          rawData.layerZeroV1EndpointAddress !== ''
            ? rawData.layerZeroV1EndpointAddress
            : null,
        rpcs: rawData.rpcs,
        explorers: rawData.explorers,
      }
      const result = network
        ? await updateNetwork({ ...data, id: network.id })
        : await insertNetwork(data)

      if (!result?.data?.success) {
        toast.error(result?.data?.failure ?? 'Unknown error')
      } else {
        router.replace('/networks')
      }
    },
    [network, router],
  )

  const discard = useCallback(() => {
    router.replace('/networks')
  }, [router])

  const onDiscard = useCallback(() => {
    if (form.formState.isDirty) {
      setDiscardDialogOpen(true)
    } else {
      discard()
    }
  }, [form.formState.isDirty, discard])

  const onDelete = useCallback(async () => {
    if (!network) return
    await deleteNetwork({ id: network.id })
    router.replace('/networks')
  }, [network, router])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto grid w-full max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onDiscard}
              type="button"
              variant="ghost"
              size="icon"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {network?.name ?? 'New network'}
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button
                variant="secondary"
                type="button"
                size="sm"
                onClick={onDiscard}
              >
                Discard
              </Button>
              <Button>Save Network</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Network details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the network. This is displayed publicly in the
                      UI.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The URL of the logo for the network.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select network type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={selectNullValue}>
                            Custom
                          </SelectItem>
                          {Object.values(NetworkType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>The type of the network.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          {form.watch('type') === 'EVM' && (
            <Card>
              <CardHeader>
                <CardTitle>EVM network data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="chainId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chain ID</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          The EVM chain ID of the network.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>External IDs and addresses</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="coingeckoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CoinGecko ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The CoinGecko ID of the network.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="axelarId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Axelar ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The Axelar ID of the network.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="axelarGatewayAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Axelar Gateway Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The Axelar gateway address of the network.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orbitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orbit ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The Orbit ID of the network.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wormholeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wormhole ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The Wormhole ID of the network.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="layerZeroV1EndpointAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LayerZero v1 Endpoint Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The LayerZero v1 endpoint address of the network.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <div className="flex flex-row gap-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>RPCs</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {rpcs.fields.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No RPCs added yet.
                  </p>
                )}
                {rpcs.fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`rpcs.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RPC {index + 1}</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => rpcs.remove(index)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="button" onClick={() => rpcs.append({ url: '' })}>
                  Add RPC
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Explorers</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {explorers.fields.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    No explorers added yet.
                  </p>
                )}
                {explorers.fields.map((field, index) => (
                  <div key={field.id} className="flex flex-row gap-2">
                    <Card key={field.id} className="flex-1">
                      <CardHeader>
                        <CardTitle>Explorer {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2">
                          <FormField
                            control={form.control}
                            name={`explorers.${index}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type</FormLabel>
                                <FormControl>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.values(ExplorerType).map(
                                        (type) => (
                                          <SelectItem key={type} value={type}>
                                            {type}
                                          </SelectItem>
                                        ),
                                      )}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormDescription>
                                  The type of the explorer. This determines
                                  which handler is used in Token DB.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`explorers.${index}.url`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>URL</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                  The URL of the explorer.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`explorers.${index}.apiKey`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>API Key</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                  The API key for the explorer.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => explorers.remove(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  type="button"
                  onClick={() =>
                    explorers.append({
                      type: 'Etherscan',
                      url: '',
                      apiKey: '',
                    })
                  }
                >
                  Add Explorer
                </Button>
              </CardFooter>
            </Card>
          </div>
          {network && (
            <div className="flex flex-row gap-4">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Network ID</CardTitle>
                  <CardDescription>
                    Unique identifier of this network.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReadonlyCopyInput value={network?.id ?? ''} />
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Delete Network</CardTitle>
                  <CardDescription>
                    This action is irreversible and will delete the network.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end">
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete Network
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
        <DiscardChangesDialog
          open={discardDialogOpen}
          onOpenChange={setDiscardDialogOpen}
          onAction={discard}
        />
        <DeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onAction={onDelete}
        />
      </form>
    </Form>
  )
}
