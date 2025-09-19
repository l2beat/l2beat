import clsx from 'clsx'
import { useState } from 'react'
import { Button } from '../../../components/Button'
import { Input, InputDescription } from '../../../components/Input'

type Props = {
  value: string[]
  onChange: (value: string[]) => void
  disabled: boolean
}

export function InitialAddressesInput(props: Props) {
  const [draft, setDraft] = useState('')

  const normalizedDraft = isChainSpecificLike(draft) ? draft : undefined

  const isDuplicate = normalizedDraft
    ? props.value.some((a) => a.toLowerCase() === normalizedDraft.toLowerCase())
    : false

  const isValid = Boolean(normalizedDraft) && !isDuplicate

  function addDraftIfValid() {
    if (!isValid || !normalizedDraft) {
      return
    }

    props.onChange([...props.value, normalizedDraft])
    setDraft('')
  }

  function removeAt(index: number) {
    const next = props.value.slice()
    next.splice(index, 1)
    props.onChange(next)
  }

  return (
    <div className="flex flex-col">
      <div className="mb-1 flex items-stretch text-sm">
        <div className="whitespace-nowrap">Initial addresses</div>
        <InputDescription>
          More inputs will appear as you enter valid addresses
        </InputDescription>
      </div>

      <div className="flex flex-col gap-2">
        {props.value.map((address, i) => (
          <div key={`${address}-${i}`} className="flex flex-row gap-2">
            <Input
              readOnly
              disabled={props.disabled}
              value={address}
              className="w-full px-4 py-2 font-mono"
            />
            <Button onClick={() => removeAt(i)} disabled={props.disabled}>
              x
            </Button>
          </div>
        ))}

        <div className="flex flex-col">
          <Input
            disabled={props.disabled}
            className={clsx('w-full bg-coffee-800 px-4 py-2 font-mono')}
            placeholder="eth:0x0000000000000000000000000000000000000000"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addDraftIfValid()
              }
            }}
          />
          {draft.length > 0 && !isValid && (
            <p className="text-red-400 text-xs">
              {isDuplicate
                ? 'Duplicate address'
                : 'Invalid address. Use format shortName:checksumHex'}
            </p>
          )}
          {isValid && (
            <div className="mt-2 flex justify-end">
              <Button
                className="mt-1 border border-coffee-600 px-3 py-1 text-sm hover:bg-coffee-700"
                onClick={addDraftIfValid}
              >
                Add address
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function isChainSpecificLike(address: string): boolean {
  return /^[a-zA-Z0-9_-]+:0x[a-fA-F0-9]{40}$/.test(address)
}
