import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createConfigFile } from '../../api/api'
import { Title } from '../../common/Title'
import { Button } from '../../components/Button'
import { Checkbox } from '../../components/Checkbox'
import { Input } from '../../components/Input'
import { Loader } from '../../components/Loader'
import { useTerminalStore } from '../../panel-terminal/store'

export function NewProjectPage() {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'project' | 'token'>('project')
  const [overwrite, setOverwrite] = useState(false)
  const [initialAddresses, setInitialAddresses] = useState<string[]>([])
  const queryClient = useQueryClient()
  const { discover, setDevMode } = useTerminalStore()
  const navigate = useNavigate()

  const createConfigFileMutation = useMutation({
    mutationFn: async () => {
      await createConfigFile(title, type, initialAddresses, overwrite)
      setDevMode(false)
      await discover(title)
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onSuccess: () => {
      navigate(`/ui/p/${title}`)
    },
  })

  const isProjectNameValid = projectNameRegex.test(title)
  const atLeastOneAddress = initialAddresses.length > 0

  const isFormValid = isProjectNameValid && atLeastOneAddress

  return (
    <>
      <Title title={`DiscoUI - ${!title ? 'New project' : title}`} />
      <div className="mx-auto max-w-screen-md space-y-6 p-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold leading-none">I'd like to discover...</h1>
          <div className="flex items-stretch justify-center gap-2">
            <TypeTile
              type="Project"
              active={type === 'project'}
              onClick={() => setType('project')}
              disabled={createConfigFileMutation.isPending}
            >
              Regular discovery. Project will be put in the root folder.
            </TypeTile>
            <TypeTile
              type="Token"
              active={type === 'token'}
              onClick={() => setType('token')}
              disabled={createConfigFileMutation.isPending}
            >
              Will be put under <span className="font-mono">(tokens)</span>{' '}
              folder group. Each initial address will have{' '}
              <span className="font-mono">ERC20Data</span> handler assigned.
            </TypeTile>
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-stretch text-sm">
            <div className="whitespace-nowrap">Project title</div>
            <InputDescription>
              Unique, no spaces, words can be separated by '-'
            </InputDescription>
          </div>
          <Input
            className="w-full bg-transparent px-4 py-2"
            value={title}
            disabled={createConfigFileMutation.isPending}
            placeholder="new-project"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <InitialAddressesInput
          value={initialAddresses}
          onChange={setInitialAddresses}
          disabled={createConfigFileMutation.isPending}
        />
        <div className="mt-4 flex justify-between">
          <div
            className="flex cursor-pointer select-none items-center gap-2 text-sm"
            onClick={() => setOverwrite(!overwrite)}
          >
            <Checkbox checked={overwrite} />
            Overwrite existing config
          </div>
          <div className="flex items-center gap-2">
            {createConfigFileMutation.isPending && <Loader />}
            <Button
              onClick={() => createConfigFileMutation.mutate()}
              disabled={createConfigFileMutation.isPending || !isFormValid}
            >
              Create
            </Button>
          </div>
        </div>

        {createConfigFileMutation.isError && (
          <div className="text-aux-red text-sm">
            Something went wrong:{' '}
            <pre>{createConfigFileMutation.error.message}</pre>
          </div>
        )}
      </div>
    </>
  )
}

function InputDescription({ children }: { children: React.ReactNode }) {
  return <p className="w-full text-right text-coffee-400 text-xs">{children}</p>
}

type InitialAddressesInputProps = {
  value: string[]
  onChange: (value: string[]) => void
  disabled: boolean
}

function InitialAddressesInput(props: InitialAddressesInputProps) {
  const [draft, setDraft] = useState('')

  const normalizedDraft = (() => {
    try {
      return ChainSpecificAddress(draft)
    } catch {
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
            <Button
              onClick={() => removeAt(i)}
              aria-label="Remove address"
              disabled={props.disabled}
            >
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

type TypeTileProps = {
  type: string
  onClick: () => void
  children: React.ReactNode
  active: boolean
  disabled: boolean
}

function TypeTile(props: TypeTileProps) {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className={clsx(
        'flex flex-1 flex-col items-center justify-center gap-1 border border-coffee-200 p-4',
        'cursor-pointer',
        props.disabled && 'cursor-not-allowed opacity-50',
        !props.active && !props.disabled && 'hover:bg-coffee-600/50',
        props.active && 'bg-coffee-600',
      )}
    >
      <div className="font-bold text-2xl">{props.type}</div>
      <div className="text-center font-thin text-sm">{props.children}</div>
    </button>
  )
}

const projectNameRegex = new RegExp('^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$')
