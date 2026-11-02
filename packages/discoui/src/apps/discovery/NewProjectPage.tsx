import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { createConfigFile } from '../../api/api'
import { Button } from '../../components/Button'
import { Checkbox } from '../../components/Checkbox'
import { Input, InputDescription } from '../../components/Input'
import { Loader } from '../../components/Loader'
import { Title } from '../../components/Title'
import { DiscoveryLookup } from './components/DiscoveryLookup'
import { InitialAddressesInput } from './components/InitialAddressesInput'
import { useTerminalStore } from './panel-terminal/store'

export function NewProjectPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { discover, setDevMode, killCommand } = useTerminalStore()

  const [title, setTitle] = useState('')
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
        initialAddresses,
        overwrite,
        useCustomDepth ? maxDepth : undefined,
        useCustomAddresses ? maxAddresses : undefined,
      )
      setDevMode(false)
      if (!(await discover(title))) {
        throw new Error('Discovery failed')
      }
      await queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onSuccess: () => {
      void navigate(`/ui/p/${title}`)
    },
  })

  const isProjectNameValid = projectNameRegex.test(title)
  const atLeastOneAddress = initialAddresses.length > 0

  const isFormValid = isProjectNameValid && atLeastOneAddress

  return (
    <>
      <Title title={`DiscoUI - ${!title ? 'New project' : title}`} />
      <div className="mx-auto max-w-(--breakpoint-md) space-y-6 p-4">
        <h1 className="border-coffee-700 border-b pb-3 font-semibold text-coffee-100 text-lg">
          New project
        </h1>
        <div>
          <div className="mb-1 font-medium text-coffee-100 text-sm">
            Project title
          </div>
          <Input
            className="w-full px-3 py-2"
            value={title}
            disabled={createConfigFileMutation.isPending}
            placeholder="new-project"
            onChange={(e) => setTitle(e.target.value)}
          />
          <InputDescription>
            Unique, no spaces, words can be separated by '-'
          </InputDescription>
        </div>
        <InitialAddressesInput
          value={initialAddresses}
          onChange={setInitialAddresses}
          disabled={createConfigFileMutation.isPending}
        />
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div
              className="flex cursor-pointer select-none items-center gap-2 font-medium text-coffee-100 text-sm"
              onClick={() => setUseCustomDepth(!useCustomDepth)}
            >
              <Checkbox checked={useCustomDepth} />
              Specify max depth
            </div>
            {useCustomDepth && (
              <Input
                type="number"
                className="w-full px-3 py-2"
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
              className="flex cursor-pointer select-none items-center gap-2 font-medium text-coffee-100 text-sm"
              onClick={() => setUseCustomAddresses(!useCustomAddresses)}
            >
              <Checkbox checked={useCustomAddresses} />
              Specify max addresses
            </div>
            {useCustomAddresses && (
              <Input
                type="number"
                className="w-full px-3 py-2"
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
        <div className="mt-4 flex justify-between border-coffee-700 border-t pt-4">
          <div
            className="flex cursor-pointer select-none items-center gap-2 font-medium text-coffee-100 text-sm"
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
              className="border-autumn-300 bg-autumn-300 font-semibold text-coffee-900 hover:bg-autumn-200 hover:text-coffee-900 disabled:border-coffee-600 disabled:bg-coffee-800 disabled:text-coffee-400 disabled:opacity-100"
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
