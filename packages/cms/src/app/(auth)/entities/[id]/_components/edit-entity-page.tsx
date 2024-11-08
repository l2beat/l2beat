'use client'

import { zodResolver } from '@hookform/resolvers/zod'
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
import { deleteEntity, insertEntity, updateEntity } from '../_actions'
import { insertEntitySchema } from '../_actions/schemas'
import { type EntityRecord } from '@l2beat/database'

export function EditEntityPage({ entity }: { entity: EntityRecord | null }) {
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      name: entity?.name ?? '',
    },
    resolver: zodResolver(insertEntitySchema),
  })
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const onSubmit = useCallback(
    async (data: z.infer<typeof insertEntitySchema>) => {
      const result = entity
        ? await updateEntity({
            id: entity.id,
            ...data,
          })
        : await insertEntity(data)
      if (result?.data?.failure) {
        toast.error(result.data.failure)
      } else {
        router.replace('/entities')
      }
    },
    [entity, router],
  )

  const onDiscard = useCallback(() => {
    router.replace('/entities')
  }, [router])

  const onDelete = useCallback(async () => {
    if (!entity) return
    await deleteEntity({ id: entity.id })
    router.replace('/entities')
  }, [entity, router])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto grid w-full max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Link href="/entities">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="size-4" />
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {entity?.name ?? 'New entity'}
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setDiscardDialogOpen(true)}
              >
                Discard
              </Button>
              <Button>Save Entity</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Entity details</CardTitle>
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
                      The name of this entity. This is displayed publicly in the
                      UI.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          {entity && (
            <div className="flex flex-row gap-4">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Entity ID</CardTitle>
                  <CardDescription>
                    Unique identifier of this entity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReadonlyCopyInput value={entity.id ?? ''} />
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Delete Entity</CardTitle>
                  <CardDescription>
                    This action is irreversible and will delete the entity.
                    Other things that referred to this entity will not be
                    deleted.
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end">
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete Entity
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
