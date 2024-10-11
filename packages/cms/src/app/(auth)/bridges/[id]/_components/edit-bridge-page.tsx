'use client'

import { type ExternalBridgeRecord } from '@l2beat/database'
import { ExternalBridgeType } from '@l2beat/database/enums'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { insertBridgeSchema, updateBridgeSchema } from '../_actions/schemas'
import { type z } from 'zod'
import { deleteBridge, insertBridge, updateBridge } from '../_actions'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DiscardChangesDialog } from '~/components/discard-changes-dialog'
import { DeleteDialog } from '~/components/delete-dialog'

const selectNullValue = '$null$'

export function EditBridgePage({
  bridge,
}: { bridge: ExternalBridgeRecord | null }) {
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      name: bridge?.name ?? '',
      type: bridge?.type ?? null,
    },
    resolver: zodResolver(insertBridgeSchema),
  })
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const onSubmit = useCallback(
    async (data: z.infer<typeof insertBridgeSchema>) => {
      const result = bridge
        ? await updateBridge({ ...data, id: bridge.id })
        : await insertBridge(data)
      if (result?.data?.failure) {
        toast.error(result.data.failure)
      } else {
        router.replace('/bridges')
      }
    },
    [bridge, router],
  )

  const onDiscard = useCallback(() => {
    router.replace('/bridges')
  }, [router])

  const onDelete = useCallback(async () => {
    if (!bridge) return
    await deleteBridge({ id: bridge.id })
    router.replace('/bridges')
  }, [bridge, router])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto grid w-full max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Link href="/bridges">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="size-4" />
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {bridge?.name ?? 'New bridge'}
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDiscardDialogOpen(true)}
              >
                Discard
              </Button>
              <Button>Save Bridge</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Bridge details</CardTitle>
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
                      The name of the bridge. This is displayed publicly in the
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
                      The handler to use for this bridge. Keep in mind that
                      there can be only one bridge per handler. Selecting a
                      handler will cause the tokens to be automatically marked
                      as bridged using this bridge
                      {bridge ? (
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
          {bridge && (
            <div className="flex flex-row gap-4">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Bridge ID</CardTitle>
                  <CardDescription>
                    Unique identifier of this bridge.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReadonlyCopyInput value={bridge?.id ?? ''} />
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Delete Bridge</CardTitle>
                  <CardDescription>
                    This action is irreversible and will delete the bridge,
                    together with all associated token connections.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end">
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete Bridge
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
