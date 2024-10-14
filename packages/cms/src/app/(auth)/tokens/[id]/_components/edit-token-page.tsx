'use client'

import {
  type TokenBridgeRecord,
  type TokenRecord,
  type TokenMetaRecord,
} from '@l2beat/database'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { ReadonlyCopyInput } from '~/components/readonly-copy-input'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '~/components/ui/card'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { deleteToken, insertToken, updateToken } from '../_actions'
import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DiscardChangesDialog } from '~/components/discard-changes-dialog'
import { DeleteDialog } from '~/components/delete-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '~/components/ui/select'
import { SelectValue } from '@radix-ui/react-select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import Link from 'next/link'

const tokenFormSchema = z.object({
  networkId: z.string().length(21),
  address: z.string().length(42),
  backedBy: z.array(
    z.object({
      sourceTokenId: z.string().length(21),
      externalBridgeId: z.string().length(21).or(z.literal('')),
    }),
  ),
  backing: z.array(
    z.object({
      targetTokenId: z.string().length(21),
      externalBridgeId: z.string().length(21).or(z.literal('')),
    }),
  ),
  customMeta: z
    .object({
      name: z.string(),
      symbol: z.string(),
      decimals: z.string(),
      logoUrl: z.string().url().or(z.literal('')),
      contractName: z.string(),
    })
    .nullable(),
})

export function EditTokenPage({
  token,
  tokens,
  bridges,
  networks,
}: {
  networks: { id: string; name: string }[]
  bridges: { id: string; name: string }[]
  tokens: { tokenId: string; name: string | null }[]
  token:
    | (TokenRecord & {
        relations: TokenBridgeRecord[]
        meta: TokenMetaRecord[]
      })
    | null
}) {
  const router = useRouter()
  const tokenMeta = useMemo(
    () =>
      token?.meta && {
        aggregate: token.meta.filter((m) => m.source === 'Aggregate'),
        manual: token.meta.find((m) => m.source === 'Manual'),
        rest: token.meta.filter(
          (m) => m.source !== 'Aggregate' && m.source !== 'Manual',
        ),
      },
    [token?.meta],
  )

  const form = useForm<z.infer<typeof tokenFormSchema>>({
    defaultValues: {
      networkId: token?.networkId ?? '',
      address: token?.address ?? '',
      backedBy:
        token?.relations
          .filter((r) => r.sourceTokenId !== token.id)
          .map((r) => ({
            sourceTokenId: r.sourceTokenId,
            externalBridgeId: r.externalBridgeId ?? '',
          })) ?? [],
      backing:
        token?.relations
          .filter((r) => r.targetTokenId !== token.id)
          .map((r) => ({
            targetTokenId: r.targetTokenId,
            externalBridgeId: r.externalBridgeId ?? '',
          })) ?? [],
      customMeta: {
        name: tokenMeta?.manual?.name ?? '',
        symbol: tokenMeta?.manual?.symbol ?? '',
        decimals: tokenMeta?.manual?.decimals?.toString() ?? '',
        logoUrl: tokenMeta?.manual?.logoUrl ?? '',
        contractName: tokenMeta?.manual?.contractName ?? '',
      },
    },
    resolver: zodResolver(tokenFormSchema),
  })
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const backedBy = useFieldArray({
    control: form.control,
    name: 'backedBy',
  })

  const backing = useFieldArray({
    control: form.control,
    name: 'backing',
  })

  const onSubmit = useCallback(
    async (rawData: z.infer<typeof tokenFormSchema>) => {
      const data = {
        networkId: rawData.networkId,
        address: rawData.address,
        customMeta:
          rawData.customMeta &&
          Object.values(rawData.customMeta).some((value) => value !== '')
            ? {
                name:
                  rawData.customMeta.name !== ''
                    ? rawData.customMeta.name
                    : null,
                symbol:
                  rawData.customMeta.symbol !== ''
                    ? rawData.customMeta.symbol
                    : null,
                decimals:
                  rawData.customMeta.decimals !== ''
                    ? parseInt(rawData.customMeta.decimals)
                    : null,
                logoUrl:
                  rawData.customMeta.logoUrl !== ''
                    ? rawData.customMeta.logoUrl
                    : null,
                contractName:
                  rawData.customMeta.contractName !== ''
                    ? rawData.customMeta.contractName
                    : null,
              }
            : null,
        relations: [
          ...rawData.backedBy.map((r) => ({
            targetTokenId: r.sourceTokenId,
            externalBridgeId: r.externalBridgeId,
          })),
          ...rawData.backing.map((r) => ({
            sourceTokenId: r.targetTokenId,
            externalBridgeId: r.externalBridgeId,
          })),
        ],
      }
      const result = token
        ? await updateToken({ ...data, id: token.id })
        : await insertToken(data)
      if (result?.data?.failure) {
        toast.error(result.data.failure)
      } else {
        router.replace('/tokens')
      }
    },
    [router, token],
  )

  const discard = useCallback(() => {
    router.replace('/tokens')
  }, [router])

  const onDiscard = useCallback(() => {
    if (form.formState.isDirty) {
      setDiscardDialogOpen(true)
    } else {
      discard()
    }
  }, [form.formState.isDirty, discard])

  const onDelete = useCallback(async () => {
    if (!token) return
    await deleteToken({ id: token.id })
    router.replace('/tokens')
  }, [token, router])

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
              {token?.address ?? 'New token'}
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
              <Button>Save Token</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Token details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="networkId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Network</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a network" />
                        </SelectTrigger>
                        <SelectContent>
                          {networks
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((network) => (
                              <SelectItem key={network.id} value={network.id}>
                                {network.name}{' '}
                                <span className="text-xs text-muted-foreground">
                                  ({network.id})
                                </span>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      The network on which this token lives.
                    </FormDescription>
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
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>The address of the token.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>External ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Decimals</TableHead>
                    <TableHead>Logo URL</TableHead>
                    <TableHead>Contract Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ...(tokenMeta?.aggregate ?? []),
                    ...(tokenMeta?.rest ?? []),
                  ].map((meta) => (
                    <TableRow key={meta.source}>
                      <TableCell
                        className={
                          meta.source === 'Aggregate' ? 'font-bold' : ''
                        }
                      >
                        {meta.source}
                      </TableCell>
                      <TableCell>
                        {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
                        {meta.externalId || 'N/A'}
                      </TableCell>
                      <TableCell
                        className={
                          meta.source === 'Aggregate' ? 'font-bold' : ''
                        }
                      >
                        {meta.name}
                      </TableCell>
                      <TableCell
                        className={
                          meta.source === 'Aggregate' ? 'font-bold' : ''
                        }
                      >
                        {meta.symbol}
                      </TableCell>
                      <TableCell
                        className={
                          meta.source === 'Aggregate' ? 'font-bold' : ''
                        }
                      >
                        {meta.decimals}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>Overrides</TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="customMeta.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="customMeta.symbol"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="customMeta.decimals"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="customMeta.logoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name="customMeta.contractName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Backed by</CardTitle>
              <CardDescription>
                Shows which tokens this token is backed by.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {backedBy.fields.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  This token is not backed by any other token.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableHead>Token</TableHead>
                    <TableHead>Bridge</TableHead>
                    <TableHead className="w-0" />
                  </TableHeader>
                  <TableBody>
                    {backedBy.fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`backedBy.${index}.sourceTokenId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a token" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {tokens.slice(0, 10).map((token) => (
                                        <SelectItem
                                          key={token.tokenId}
                                          value={token.tokenId}
                                        >
                                          {token.name ?? 'Unknown'}{' '}
                                          <span className="text-xs text-muted-foreground">
                                            ({token.tokenId})
                                          </span>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`backedBy.${index}.externalBridgeId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a bridge" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {bridges
                                        .sort((a, b) =>
                                          a.name.localeCompare(b.name),
                                        )
                                        .map((bridge) => (
                                          <SelectItem
                                            key={bridge.id}
                                            value={bridge.id}
                                          >
                                            {bridge.name}{' '}
                                            <span className="text-xs text-muted-foreground">
                                              ({bridge.id})
                                            </span>
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => backedBy.remove(index)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                type="button"
                onClick={() =>
                  backedBy.append({ sourceTokenId: '', externalBridgeId: '' })
                }
              >
                Add
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Backing</CardTitle>
              <CardDescription>
                Shows which tokens is this token backing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {backing.fields.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  This token is not backing any other token.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableHead>Token</TableHead>
                    <TableHead>Bridge</TableHead>
                    <TableHead className="w-0" />
                  </TableHeader>
                  <TableBody>
                    {backing.fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`backedBy.${index}.sourceTokenId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a token" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {tokens.slice(0, 10).map((token) => (
                                        <SelectItem
                                          key={token.tokenId}
                                          value={token.tokenId}
                                        >
                                          {token.name ?? 'Unknown'}{' '}
                                          <span className="text-xs text-muted-foreground">
                                            ({token.tokenId})
                                          </span>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`backedBy.${index}.externalBridgeId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a bridge" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {bridges
                                        .sort((a, b) =>
                                          a.name.localeCompare(b.name),
                                        )
                                        .map((bridge) => (
                                          <SelectItem
                                            key={bridge.id}
                                            value={bridge.id}
                                          >
                                            {bridge.name}{' '}
                                            <span className="text-xs text-muted-foreground">
                                              ({bridge.id})
                                            </span>
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => backing.remove(index)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                type="button"
                onClick={() =>
                  backing.append({ targetTokenId: '', externalBridgeId: '' })
                }
              >
                Add
              </Button>
            </CardFooter>
          </Card>
          {token && (
            <div className="flex flex-row gap-4">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Bridge ID</CardTitle>
                  <CardDescription>
                    Unique identifier of this bridge.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReadonlyCopyInput value={token.id} />
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Delete Token</CardTitle>
                  <CardDescription>
                    This action is irreversible and will delete the token.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end">
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete Token
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
