'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type EntityRecord, type ExternalBridgeRecord } from '@l2beat/database'
import { ExternalBridgeType } from '@l2beat/database/dist/kysely/generated/enums'
import { ChevronLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { type z } from 'zod'
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
  SelectValue,
  selectNullValue,
} from '~/components/ui/select'
import { deleteBridge, insertBridge, updateBridge } from '../_actions'
import { insertBridgeSchema } from '../_actions/schemas'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

export function EditLinkPage({
  link,
  entities,
}: {
  link:
    | (ExternalBridgeRecord & { managingEntities: { entityId: string }[] })
    | null
  entities: EntityRecord[]
}) {
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      name: link?.name ?? '',
      managingEntities: link?.managingEntities ?? [],
      type: link?.type ?? null,
    },
    resolver: zodResolver(insertBridgeSchema),
  })

  const managingEntities = useFieldArray({
    control: form.control,
    name: 'managingEntities',
  })

  const [discardDialogOpen, setDiscardDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const onSubmit = useCallback(
    async (data: z.infer<typeof insertBridgeSchema>) => {
      const result = link
        ? await updateBridge({
            ...data,
            id: link.id,
          })
        : await insertBridge(data)
      if (result?.data?.failure) {
        toast.error(result.data.failure)
      } else {
        router.replace('/links')
      }
    },
    [link, router],
  )

  const onDiscard = useCallback(() => {
    router.replace('/links')
  }, [router])

  const onDelete = useCallback(async () => {
    if (!link) return
    await deleteBridge({ id: link.id })
    router.replace('/links')
  }, [link, router])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto grid w-full max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Link href="/links">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="size-4" />
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {link?.name ?? 'New link'}
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDiscardDialogOpen(true)}
              >
                Discard
              </Button>
              <Button>Save Link</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Link details</CardTitle>
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
                      The name of this link. This is displayed publicly in the
                      UI.
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
                    <FormLabel>Handler</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === selectNullValue ? null : value)
                      }
                      defaultValue={field.value ?? selectNullValue}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select handler" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={selectNullValue}>None</SelectItem>
                        {Object.values(ExternalBridgeType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The handler to use for this link. Keep in mind that there
                      can be only one link per handler. Selecting a handler will
                      cause the tokens to be automatically marked as linked
                      using this link
                      {link ? (
                        <span>
                          , and manually configured entries may be deleted. If
                          changing this, proceed with caution.
                        </span>
                      ) : (
                        '.'
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
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
          {link && (
            <div className="flex flex-row gap-4">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Link ID</CardTitle>
                  <CardDescription>
                    Unique identifier of this link.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReadonlyCopyInput value={link?.id ?? ''} />
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Delete Link</CardTitle>
                  <CardDescription>
                    This action is irreversible and will delete the link,
                    together with all associated token connections.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end">
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete Link
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
        <DiscardChangesDialog
          open={discardDialogOpen}
          onOpenChange={setDiscardDialogOpen}
          onAction={onDiscard}
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
