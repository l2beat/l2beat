'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type ExternalBridgeRecord } from '@l2beat/database'
import { ExternalBridgeType } from '@l2beat/database/dist/kysely/generated/enums'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
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

export function EditLinkPage({ link }: { link: ExternalBridgeRecord | null }) {
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      name: link?.name ?? '',
      managedBy: link?.managedBy ?? '',
      type: link?.type ?? null,
    },
    resolver: zodResolver(insertBridgeSchema),
  })
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const onSubmit = useCallback(
    async (data: z.infer<typeof insertBridgeSchema>) => {
      const result = link
        ? await updateBridge({
            ...data,
            managedBy:
              data.managedBy && data.managedBy.length > 0
                ? data.managedBy
                : null,
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
                name="managedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Managed By</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the entity that is responsible for this link.
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
