import { useState } from 'react'
import { Button } from '~/components/core/Button'
import { parseHolderInput } from '~/server/features/insight/parseHolderInput'

export function HolderSearchForm({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue)
  const [isInvalid, setIsInvalid] = useState(false)

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        const holder = parseHolderInput(value)
        if (!holder) {
          setIsInvalid(true)
          return
        }
        const segment = holder.kind === 'address' ? holder.address : holder.name
        // A full navigation, so the URL of a report can be shared.
        window.location.assign(`/insight/${encodeURIComponent(segment)}`)
      }}
    >
      <label htmlFor="insight-holder" className="sr-only">
        Ethereum address or ENS name
      </label>
      <div className="flex gap-2">
        <input
          id="insight-holder"
          type="text"
          spellCheck={false}
          autoComplete="off"
          placeholder="Address or ENS name"
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? 'insight-holder-error' : undefined}
          className="h-10 min-w-0 flex-1 rounded-lg border border-divider bg-surface-secondary px-3 font-mono text-label-value-14 outline-none placeholder:font-sans placeholder:text-secondary focus-visible:border-brand"
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setIsInvalid(false)
          }}
        />
        <Button type="submit" variant="fill" className="h-10 shrink-0">
          Check
        </Button>
      </div>
      {isInvalid && (
        <p id="insight-holder-error" className="text-negative text-sm">
          Enter 0x followed by 40 hex digits, or an ENS name like vitalik.eth.
        </p>
      )}
    </form>
  )
}
