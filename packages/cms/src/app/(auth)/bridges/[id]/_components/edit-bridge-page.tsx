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
import { z } from 'zod'
import { insertBridge, updateBridge } from '../_actions'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

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

  const onSubmit = useCallback(
    async (data: z.infer<typeof insertBridgeSchema>) => {
      if (bridge) {
        await updateBridge({ ...data, id: bridge.id })
      } else {
        await insertBridge(data)
      }
      router.replace('/bridges')
    },
    [bridge, router],
  )

  const onDiscard = useCallback(() => {
    router.replace('/bridges')
  }, [router])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto grid max-w-[59rem] w-full flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Link href="/bridges">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {bridge?.name ?? 'New bridge'}
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="secondary" size="sm">
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
                      The handler to use for this bridge. Selecting a handler
                      will cause the tokens to be automatically marked as
                      bridged using this bridge
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
            <Card>
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
          )}
        </div>
      </form>
    </Form>
  )
}
