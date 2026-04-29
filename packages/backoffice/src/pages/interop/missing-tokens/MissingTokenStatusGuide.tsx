import { Button } from '~/components/core/Button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import { MissingTokenStatusBadge } from './MissingTokenStatusBadge'
import { getMissingTokenStatusMeta, MISSING_TOKEN_STATUSES } from './utils'

export function MissingTokenStatusGuide() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          Status guide
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="font-medium text-sm">TokenDB statuses</h3>
            <p className="text-muted-foreground text-xs">
              These badges show whether a missing token can be fixed from
              TokenDB and whether requeueing can help.
            </p>
          </div>

          <div className="space-y-3">
            {MISSING_TOKEN_STATUSES.map((status) => {
              const meta = getMissingTokenStatusMeta(status)

              return (
                <div key={status} className="space-y-1">
                  <MissingTokenStatusBadge
                    status={status}
                    showTooltip={false}
                  />
                  <p className="text-muted-foreground text-xs">
                    {meta.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
