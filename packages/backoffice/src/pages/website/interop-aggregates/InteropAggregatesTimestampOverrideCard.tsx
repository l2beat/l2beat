import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/core/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/core/Card'
import { Input } from '~/components/core/Input'
import { Label } from '~/components/core/Label'
import { useKeyValueQuery } from '~/hooks/useKeyValueQuery'
import { useBackendApi } from '~/react-query/trpc'
import { dateInputToTimestamp } from '~/utils/dateInputToTimestamp'
import { timestampToDateInput } from '~/utils/timestampToDateInput'

const INTEROP_PINNING_KEY = 'interopAggregatesTimestampOverride' as const

export function InteropAggregatesTimestampOverrideCard() {
  const api = useBackendApi()
  const [pinnedDate, setPinnedDate] = useState<string>('')

  const { data, refetch, isLoading } = useKeyValueQuery(
    'interopAggregatesTimestampOverride',
  )

  useEffect(() => {
    if (data) {
      setPinnedDate(timestampToDateInput(data.value))
    } else {
      setPinnedDate('')
    }
  }, [data])

  const setPinning = api.keyValue.set.useMutation({
    onSuccess: () => {
      toast.success('Interop pinning saved')
      refetch()
    },
    onError: (error) => {
      toast.error('Failed to save interop pinning', {
        description: error.message,
      })
    },
  })

  const handleSave = () => {
    if (!pinnedDate) return
    setPinning.mutate({
      key: INTEROP_PINNING_KEY,
      value: dateInputToTimestamp(pinnedDate),
    })
  }
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Timestamp override</CardTitle>
        <CardDescription>
          Pin interop aggregates to given day on website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="pinned-date">Pinned day</Label>
            <Input
              id="pinned-date"
              type="date"
              value={pinnedDate}
              onChange={(e) => setPinnedDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button
            className="self-start"
            onClick={handleSave}
            disabled={setPinning.isPending || isLoading}
          >
            {setPinning.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
