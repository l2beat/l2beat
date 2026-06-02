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
import { useAppStateQuery } from '~/hooks/useAppStateQuery'
import { useBackendApi } from '~/react-query/trpc'
import { dateInputToTimestamp } from '~/utils/dateInputToTimestamp'
import { timestampToDateInput } from '~/utils/timestampToDateInput'

const INTEROP_PINNING_KEY = 'interopAggregatesTimestampOverride' as const

export function InteropAggregatesTimestampOverrideCard() {
  const api = useBackendApi()
  const [pinnedDate, setPinnedDate] = useState<string>('')

  const { data, refetch, isLoading } = useAppStateQuery(
    'interopAggregatesTimestampOverride',
  )

  useEffect(() => {
    if (data) {
      setPinnedDate(timestampToDateInput(data.value))
    } else {
      setPinnedDate('')
    }
  }, [data])

  const setPinning = api.appState.insert.useMutation({
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

  const unsetPinning = api.appState.deleteByKey.useMutation({
    onSuccess: () => {
      toast.success('Interop pinning removed')
      refetch()
    },
    onError: (error) => {
      toast.error('Failed to remove interop pinning', {
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

  const handleRemove = () => {
    unsetPinning.mutate(INTEROP_PINNING_KEY)
  }

  const today = timestampToDateInput(Math.floor(Date.now() / 1000))
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
              max={today}
              onChange={(e) => setPinnedDate(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={setPinning.isPending || isLoading}
            >
              {setPinning.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={unsetPinning.isPending || isLoading || !data}
            >
              {unsetPinning.isPending ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
