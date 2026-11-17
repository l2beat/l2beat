import { useState } from 'react'
import { Button } from '~/components/core/Button'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { parseHolderInput } from '~/server/features/insight/parseHolderInput'

export function HolderSearchForm({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue)
  const [isInvalid, setIsInvalid] = useState(false)

  return (
    <PrimaryCard>
      <form
        className="flex flex-col gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          const holder = parseHolderInput(value)
          if (!holder) {
            setIsInvalid(true)
            return
          }
          const segment =
            holder.kind === 'address' ? holder.address : holder.name
          // A full navigation, so the URL of a report can be shared.
          window.location.assign(`/insight/${encodeURIComponent(segment)}`)
        }}
      >
        <label htmlFor="insight-holder" className="text-label-value-14">
          Ethereum address or ENS name
        </label>
        <div className="flex gap-2 max-md:flex-col">
          <input
            id="insight-holder"
            type="text"
            spellCheck={false}
            autoComplete="off"
            placeholder="0x… or vitalik.eth"
            aria-invalid={isInvalid}
            aria-describedby={isInvalid ? 'insight-holder-error' : undefined}
            className="min-w-0 flex-1 rounded-lg border border-divider bg-surface-secondary px-3 py-2 font-mono text-sm outline-none focus:border-brand"
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              setIsInvalid(false)
            }}
          />
          <Button type="submit" variant="fill">
            Check
          </Button>
        </div>
        {isInvalid && (
          <p id="insight-holder-error" className="text-negative text-sm">
            Enter 0x followed by 40 hex digits, or an ENS name like vitalik.eth.
          </p>
        )}
      </form>
    </PrimaryCard>
  )
}
