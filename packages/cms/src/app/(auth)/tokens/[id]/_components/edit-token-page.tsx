'use client'

import Dagre from '@dagrejs/dagre'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type EntityRecord,
  type TokenBridgeRecord,
  type TokenMetaRecord,
  type TokenRecord,
} from '@l2beat/database'
import { SelectValue } from '@radix-ui/react-select'
import {
  Background,
  Controls,
  type Edge,
  type Node,
  ReactFlow,
} from '@xyflow/react'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
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
} from '~/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { deleteToken, insertToken, updateToken } from '../_actions'
import '@xyflow/react/dist/style.css'
import { nanoidSchema } from '~/lib/schemas'
import { api } from '~/trpc/react'

const tokenFormSchema = z.object({
  networkId: nanoidSchema,
  address: z.union([
    z.literal('native'),
    z.string().length(42, "Must be 42 characters long or 'native'"),
  ]),
  managingEntities: z.array(z.object({ entityId: nanoidSchema })),
  backedBy: z.array(
    z.object({
      sourceTokenId: nanoidSchema,
      externalBridgeId: nanoidSchema.or(z.literal('')),
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
  bridges: links,
  networks,
  entities,
}: {
  networks: { id: string; name: string }[]
  bridges: { id: string; name: string }[]
  tokens: { tokenId: string; name: string | null }[]
  token:
    | (TokenRecord & {
        relations: TokenBridgeRecord[]
        meta: TokenMetaRecord[]
        managingEntities: { entityId: string }[]
      })
    | null
  entities: EntityRecord[]
}) {
  const router = useRouter()
  const tokenMeta = useMemo(
    () =>
      token?.meta && {
        aggregate: token.meta.filter((m) => m.source === 'Aggregate'),
        overrides: token.meta.find((m) => m.source === 'Overrides'),
        rest: token.meta.filter(
          (m) => m.source !== 'Aggregate' && m.source !== 'Overrides',
        ),
      },
    [token?.meta],
  )

  const form = useForm<z.infer<typeof tokenFormSchema>>({
    defaultValues: {
      networkId: token?.networkId ?? '',
      address: token?.address ?? '',
      managingEntities: token?.managingEntities ?? [],
      backedBy:
        token?.relations
          .filter((r) => r.sourceTokenId !== token.id)
          .map((r) => ({
            sourceTokenId: r.sourceTokenId,
            externalBridgeId: r.externalBridgeId ?? '',
          })) ?? [],
      customMeta: {
        name: tokenMeta?.overrides?.name ?? '',
        symbol: tokenMeta?.overrides?.symbol ?? '',
        decimals: tokenMeta?.overrides?.decimals?.toString() ?? '',
        logoUrl: tokenMeta?.overrides?.logoUrl ?? '',
        contractName: tokenMeta?.overrides?.contractName ?? '',
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

  const managingEntities = useFieldArray({
    control: form.control,
    name: 'managingEntities',
  })

  const backing =
    token?.relations
      .filter((r) => r.targetTokenId !== token.id)
      .map((r) => ({
        targetTokenId: r.targetTokenId,
        externalBridgeId: r.externalBridgeId ?? '',
      })) ?? []

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
          ...(token?.relations ?? []).filter(
            (r) => r.sourceTokenId === token?.id,
          ),
          ...rawData.backedBy.map((r) => ({
            sourceTokenId: r.sourceTokenId,
            externalBridgeId: r.externalBridgeId,
          })),
        ],
        managingEntities: rawData.managingEntities,
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

  const { data: flowDiagram } = api.tokens.tokensFlowDiagram.useQuery({
    tokenIds: token ? [token.id] : [],
  })

  const { nodes, edges } = useMemo(() => {
    return getLayoutedElements(
      flowDiagram?.nodes.map((node) => ({
        id: node.tokenId,
        position: { x: 0, y: 0 },
        data: { label: node.meta?.name ?? node.tokenId },
      })) ?? [],
      flowDiagram?.edges.map((edge) => ({
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
      })) ?? [],
      {
        direction: 'LR',
      },
    )
  }, [flowDiagram?.nodes, flowDiagram?.edges])

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
                                <span className="text-muted-foreground text-xs">
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
                  ].map((meta) => {
                    const cellClassName =
                      meta.source === 'Aggregate' ? 'font-bold' : ''
                    return (
                      <TableRow key={meta.source}>
                        <TableCell className={cellClassName}>
                          {meta.source}
                        </TableCell>
                        <TableCell className="max-w-[200px] break-words font-mono text-xs">
                          {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
                          {meta.externalId || 'N/A'}
                        </TableCell>
                        <TableCell className={cellClassName}>
                          {meta.name}
                        </TableCell>
                        <TableCell className={cellClassName}>
                          {meta.symbol}
                        </TableCell>
                        <TableCell className={cellClassName}>
                          {meta.decimals}
                        </TableCell>
                        <TableCell>{meta.logoUrl}</TableCell>
                        <TableCell>{meta.contractName}</TableCell>
                      </TableRow>
                    )
                  })}
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
              <CardTitle>Flow</CardTitle>
              <CardDescription>Flow of tokens.</CardDescription>
            </CardHeader>
            <CardContent className="h-[256px] w-full">
              <ReactFlow fitView nodes={nodes} edges={edges}>
                <Background />
                <Controls />
              </ReactFlow>
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
                <p className="text-muted-foreground text-sm">
                  This token is not backed by any other token.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableHead>Token</TableHead>
                    <TableHead>Link</TableHead>
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
                                      {tokens.map((token) => (
                                        <SelectItem
                                          key={token.tokenId}
                                          value={token.tokenId}
                                        >
                                          {token.name ?? 'Unknown'}{' '}
                                          <span className="text-muted-foreground text-xs">
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
                                      <SelectValue placeholder="Select a link" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {links
                                        .sort((a, b) =>
                                          a.name.localeCompare(b.name),
                                        )
                                        .map((bridge) => (
                                          <SelectItem
                                            key={bridge.id}
                                            value={bridge.id}
                                          >
                                            {bridge.name}{' '}
                                            <span className="text-muted-foreground text-xs">
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

          {token && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Backing</CardTitle>
                  <CardDescription>
                    Shows which tokens is this token backing.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {backing.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      This token is not backing any other token.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableHead>Token</TableHead>
                        <TableHead>Link</TableHead>
                      </TableHeader>
                      <TableBody>
                        {backing.map((field, index) => (
                          <TableRow key={index}>
                            <TableCell>{field.targetTokenId}</TableCell>
                            <TableCell>{field.externalBridgeId}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
              <div className="flex flex-row gap-4">
                <Card className="flex-1">
                  <CardHeader>
                    <CardTitle>Token ID</CardTitle>
                    <CardDescription>
                      Unique identifier of this token.
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
            </>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Managing Entities</CardTitle>
              <CardDescription>
                Shows which entities manage this token.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {managingEntities.fields.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  This token is not managed by any entity.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableHead>Entity</TableHead>
                    <TableHead className="w-0" />
                  </TableHeader>
                  <TableBody>
                    {managingEntities.fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`managingEntities.${index}.entityId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select an entity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {entities.map((entity) => (
                                        <SelectItem
                                          key={entity.id}
                                          value={entity.id}
                                        >
                                          {entity.name ?? 'Unknown'}{' '}
                                          <span className="text-muted-foreground text-xs">
                                            ({entity.id})
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
                            onClick={() => managingEntities.remove(index)}
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
                onClick={() => managingEntities.append({ entityId: '' })}
              >
                Add
              </Button>
            </CardFooter>
          </Card>
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

function getLayoutedElements<N extends Node, E extends Edge>(
  nodes: N[],
  edges: E[],
  options: { direction: 'TB' | 'LR' },
) {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: options.direction })

  edges.forEach((edge) => g.setEdge(edge.source, edge.target))
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: 200,
      height: 100,
    }),
  )

  Dagre.layout(g)

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id)
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2
      const y = position.y - (node.measured?.height ?? 0) / 2

      return { ...node, position: { x, y } }
    }),
    edges,
  }
}
