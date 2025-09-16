import { ChainSpecificAddress } from '@l2beat/shared-pure'
import clsx from 'clsx'
import { useState } from 'react'
import { Title } from './common/Title'

export function NewProjectPage() {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'project' | 'token'>('project')
  const [initialAddresses, setInitialAddresses] = useState<string[]>([])
  return (
    <>
      <Title title={`DiscoUI - ${!title ? 'New project' : title}`} />
      <div className="mx-auto max-w-screen-md p-4">
        <h1 className="font-bold">I'd like to discover...</h1>
        <div className="flex flex-row items-stretch justify-center gap-2 py-4">
          <div
            className={clsx(
              'flex w-1/2 flex-col items-center justify-center gap-1 border border-coffee-200 p-4',
              'cursor-pointer',
              'hover:bg-coffee-600/50',
              type === 'project' && 'bg-coffee-600 hover:bg-coffee-600',
            )}
            onClick={() => setType('project')}
          >
            <div className="font-bold text-2xl">Project</div>
            <div className="text-center font-thin text-sm">
              Regular discovery. Project will be put in the root folder.
            </div>
          </div>
          <div
            className={clsx(
              'flex w-1/2 flex-col items-center justify-center gap-1 border border-coffee-200 p-4',
              'cursor-pointer',
              'hover:bg-coffee-600/50',
              type === 'token' && 'bg-coffee-600 hover:bg-coffee-600',
            )}
            onClick={() => setType('token')}
          >
            <div className="font-bold text-2xl">Token</div>
            <div className="text-center font-thin text-sm">
              Will be put under <span className="font-mono">(tokens)</span>{' '}
              folder group. Each initial address will be assigned{' '}
              <span className="font-mono">ERC20DataHandler</span> override.
            </div>
          </div>
        </div>
        <label htmlFor="title" className="mb-1 block text-sm">
          Project title
        </label>
        <input
          className="w-full border border-coffee-600 bg-coffee-800 px-4 py-2 placeholder:text-coffee-400"
          value={title}
          placeholder="new-project"
          onChange={(e) => setTitle(e.target.value)}
        />
        <InputDescription>
          Unique, lowercase, no spaces, words can be '-'-separated
        </InputDescription>

        <InitialAddressesInput
          value={initialAddresses}
          onChange={setInitialAddresses}
        />
      </div>
    </>
  )
}

function InputDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className=" w-full text-right text-coffee-400 text-sm">{children}</p>
  )
}

type InitialAddressesInputProps = {
  value: string[]
  onChange: (value: string[]) => void
}

function InitialAddressesInput(props: InitialAddressesInputProps) {
  const [draft, setDraft] = useState('')

  const normalizedDraft = (() => {
    try {
      return ChainSpecificAddress(draft)
    } catch (error) {
      console.error(error)
      return undefined
    }
  })()

  const isDuplicate = normalizedDraft
    ? props.value.some((a) => a.toLowerCase() === normalizedDraft.toLowerCase())
    : false

  const isValid = Boolean(normalizedDraft) && !isDuplicate

  function addDraftIfValid() {
    if (!isValid || !normalizedDraft) return
    props.onChange([...props.value, normalizedDraft])
    setDraft('')
  }

  function removeAt(index: number) {
    const next = props.value.slice()
    next.splice(index, 1)
    props.onChange(next)
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="initialAddresses" className="mb-1 block text-sm">
        Initial addresses
      </label>

      {props.value.map((address, i) => (
        <div key={`${address}-${i}`} className="flex flex-row gap-2">
          <input
            readOnly
            className="w-full border border-coffee-600 bg-coffee-800 px-4 py-2 font-mono text-sm placeholder:text-coffee-400"
            value={address}
          />
          <button
            className="border border-coffee-600 px-3 py-2 hover:bg-coffee-700"
            onClick={() => removeAt(i)}
            aria-label="Remove address"
          >
            x
          </button>
        </div>
      ))}

      <div className="flex flex-col gap-1">
        <input
          className={clsx(
            'w-full bg-coffee-800 px-4 py-2 font-mono text-sm placeholder:text-coffee-400',
            'border',
            draft.length === 0
              ? 'border-coffee-600/50'
              : isValid
                ? 'border-green-600'
                : 'border-red-600',
          )}
          placeholder="eth:0x0000000000000000000000000000000000000000"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addDraftIfValid()
            }
          }}
          aria-invalid={draft.length > 0 && !isValid}
        />
        {draft.length > 0 && !isValid && (
          <p className="text-red-400 text-xs">
            {isDuplicate
              ? 'Duplicate address'
              : 'Invalid address. Use format shortName:checksumHex'}
          </p>
        )}
        {isValid && (
          <div className="flex justify-end">
            <button
              className="mt-1 border border-coffee-600 px-3 py-1 text-sm hover:bg-coffee-700"
              onClick={addDraftIfValid}
            >
              Add address
            </button>
          </div>
        )}
        <InputDescription>
          More will inputs will appear as you add valid addresses
        </InputDescription>
      </div>
    </div>
  )
}
