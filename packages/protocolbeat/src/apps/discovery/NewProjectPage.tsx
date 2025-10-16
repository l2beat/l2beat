import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createConfigFile } from '../../api/api'
import { Button } from '../../components/Button'
import { Checkbox } from '../../components/Checkbox'
import { Input, InputDescription } from '../../components/Input'
import { Loader } from '../../components/Loader'
import { Title } from '../../components/Title'
import { DiscoveryLookup } from './components/DiscoveryLookup'
import { InitialAddressesInput } from './components/InitialAddressesInput'
import { TypeTile } from './components/ProjectTypeTile'
import { useTerminalStore } from './panel-terminal/store'

export function NewProjectPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { discover, setDevMode, killCommand } = useTerminalStore()

  const [title, setTitle] = useState('')
  const [type, setType] = useState<'project' | 'token'>('project')
  const [initialAddresses, setInitialAddresses] = useState<string[]>([])

  const [overwrite, setOverwrite] = useState(false)

  const [useCustomDepth, setUseCustomDepth] = useState(false)
  const [useCustomAddresses, setUseCustomAddresses] = useState(false)
  const [maxDepth, setMaxDepth] = useState(7)
  const [maxAddresses, setMaxAddresses] = useState(100)

  const createConfigFileMutation = useMutation({
    mutationFn: async () => {
      await createConfigFile(
        title,
        type,
        initialAddresses,
        overwrite,
        useCustomDepth ? maxDepth : undefined,
        useCustomAddresses ? maxAddresses : undefined,
      )
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
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div
              className="flex cursor-pointer select-none items-center gap-2 text-sm"
              onClick={() => setUseCustomDepth(!useCustomDepth)}
            >
              <Checkbox checked={useCustomDepth} />
              Specify max depth
            </div>
            {useCustomDepth && (
              <Input
                type="number"
                className="w-full bg-transparent px-4 py-2"
                value={maxDepth.toString()}
                min="0"
                placeholder="7"
                disabled={createConfigFileMutation.isPending}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value)
                  if (!isNaN(value) && value >= 0) {
                    setMaxDepth(value)
                  }
                }}
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div
              className="flex cursor-pointer select-none items-center gap-2 text-sm"
              onClick={() => setUseCustomAddresses(!useCustomAddresses)}
            >
              <Checkbox checked={useCustomAddresses} />
              Specify max addresses
            </div>
            {useCustomAddresses && (
              <Input
                type="number"
                className="w-full bg-transparent px-4 py-2"
                value={maxAddresses.toString()}
                min="1"
                placeholder="100"
                disabled={createConfigFileMutation.isPending}
                onChange={(e) => {
                  const value = Number.parseInt(e.target.value)
                  if (!isNaN(value) && value >= 1) {
                    setMaxAddresses(value)
                  }
                }}
              />
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-between border-coffee-400 border-t pt-4">
          <div
            className="flex cursor-pointer select-none items-center gap-2 text-sm"
            onClick={() => setOverwrite(!overwrite)}
          >
            <Checkbox checked={overwrite} />
            Overwrite existing config
          </div>
          <div className="flex items-center gap-2">
            {createConfigFileMutation.isPending && (
              <>
                <Loader />
                <Button
                  onClick={() => {
                    killCommand()
                    createConfigFileMutation.reset()
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
            <Button
              onClick={() => createConfigFileMutation.mutate()}
              disabled={createConfigFileMutation.isPending || !isFormValid}
            >
              Create project
            </Button>
          </div>
        </div>

        {createConfigFileMutation.isError && (
          <div className="text-aux-red text-sm">
            Something went wrong:{' '}
            <pre>{createConfigFileMutation.error.message}</pre>
          </div>
        )}
        <DiscoveryLookup lines={10} />
      </div>
    </>
  )
}

const projectNameRegex = new RegExp('^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$')
