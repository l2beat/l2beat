import { EyeOffIcon, Undo2Icon } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/core/Button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import { Textarea } from '~/components/core/TextArea'
import { cn } from '~/utils/cn'
import { Tag, WithTooltip } from './cells'
import {
  DISMISSAL_REASON_LABELS,
  type DismissalReason,
  formatChain,
  type Row,
} from './rows'

const DISMISSAL_REASONS = Object.keys(
  DISMISSAL_REASON_LABELS,
) as DismissalReason[]

export interface DismissalActions {
  dismiss: (
    row: Row,
    reason: DismissalReason,
    comment: string,
    onDismissed: () => void,
  ) => void
  restore: (row: Row) => void
  isPending: boolean
}

export function DismissedBadge({
  dismissal,
}: {
  dismissal: NonNullable<Row['dismissal']>
}) {
  return (
    <WithTooltip
      content={
        <>
          {dismissal.comment && <div>{dismissal.comment}</div>}
          <div className="opacity-75">
            {dismissal.dismissedBy}, {formatDate(dismissal.dismissedAt)}
          </div>
        </>
      }
    >
      <div className="flex flex-col items-start gap-0.5">
        <Tag tone="neutral" className="font-normal text-muted-foreground">
          Dismissed
        </Tag>
        <span className="text-muted-foreground text-xs">
          {DISMISSAL_REASON_LABELS[dismissal.reason]}
        </span>
      </div>
    </WithTooltip>
  )
}

export function DismissalAction({
  row,
  name,
  actions,
}: {
  row: Row
  name: string
  actions: DismissalActions
}) {
  if (row.dismissal) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7 text-muted-foreground"
        title="Restore"
        aria-label="Restore"
        disabled={actions.isPending}
        onClick={() => actions.restore(row)}
      >
        <Undo2Icon />
      </Button>
    )
  }
  if (row.status === 'counted' || row.status === 'countedViaCounterpart') {
    return null
  }
  return <DismissPopover row={row} name={name} actions={actions} />
}

function DismissPopover({
  row,
  name,
  actions,
}: {
  row: Row
  name: string
  actions: DismissalActions
}) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<DismissalReason>('notRelevant')
  const [comment, setComment] = useState('')
  const symbol = row.symbol ?? row.abstractSymbol ?? 'token'

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          setReason('notRelevant')
          setComment('')
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground"
          title="Dismiss"
          aria-label="Dismiss"
        >
          <EyeOffIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-3">
        <div className="font-medium text-sm">Dismiss {symbol}</div>
        <div className="mb-3 text-muted-foreground text-xs">
          {name}
          {row.side === 'escrow' && ` · escrow on ${formatChain(row.chain)}`}
        </div>
        <div
          role="radiogroup"
          aria-label="Reason"
          className="grid grid-cols-2 gap-1.5"
        >
          {DISMISSAL_REASONS.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={reason === value}
              className={cn(
                'rounded-md border px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent',
                reason === value &&
                  'border-primary bg-primary text-primary-foreground hover:bg-primary',
              )}
              onClick={() => setReason(value)}
            >
              {DISMISSAL_REASON_LABELS[value]}
            </button>
          ))}
        </div>
        <Textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Comment (optional)"
          className="mt-2 min-h-14 text-xs md:text-xs"
        />
        <div className="mt-3 flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={actions.isPending}
            onClick={() =>
              actions.dismiss(row, reason, comment, () => setOpen(false))
            }
          >
            Dismiss
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString().slice(0, 10)
}
