import { ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  type QueryClient,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { toast } from 'sonner'
import {
  createConfigFile,
  getModules,
  getProjects,
  getStaleModuleConsumers,
  readConfigFile,
  updateConfigFile,
  updateModuleEntrypoints,
} from '../../../../../api/api'
import type { ApiProjectResponse } from '../../../../../api/types'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../../components/Popover'
import {
  getProjectQueryOptions,
  useProjectQueryOptions,
} from '../../../hooks/projectQuery'
import { ConfigModel } from '../../../models/ConfigModel'
import { useTerminalStore } from '../../../panel-terminal/store'
import { useAddressUsage } from '../../../usage/useAddressUsage'
import { selectedLeafIds } from '../../NodesPanel'
import { useStore } from '../../store/store'
import { IconControlFolder } from '../icons/IconControlFolder'
import { ToolbarButton } from '../ToolbarButton'

interface Owned {
  owner: string
  contracts: string[]
}

interface ModuleChange {
  module: string
  isNew: boolean
  add: string[]
  remove: string[]
}

export function ModuleButton() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const [open, setOpen] = useState(false)
  const selected = useStore((state) => state.selected)
  const nodes = useStore((state) => state.nodes)
  const response = useQuery(useProjectQueryOptions(project))
  const usage = useAddressUsage()
  const modules = useQuery({ queryKey: ['modules'], queryFn: getModules })
  const run = useModuleChange(project)

  const owned = response.data
    ? groupByOwner(response.data, selectedLeafIds(nodes, new Set(selected)))
    : []
  const moduleConsumers = usage.data?.moduleConsumers ?? {}
  const apply = (change: ModuleChange) => {
    setOpen(false)
    void run(change)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ToolbarButton
          label="Shared module"
          description="Move contracts into a shared module or back out"
          disabled={owned.length === 0 || !usage.data || !modules.data}
        >
          <IconControlFolder />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent side="top" sideOffset={10} className="w-72 p-3">
        {owned.length > 1 && (
          <p className="text-coffee-300 text-xs">
            The selection spans {owned.map((o) => o.owner).join(', ')}. Select
            contracts of one project.
          </p>
        )}
        {owned.length === 1 && owned[0]?.owner === project && (
          <AddToModule
            project={project}
            modules={modules.data ?? []}
            contracts={owned[0].contracts}
            onAdd={(module, isNew, add) =>
              apply({ module, isNew, add, remove: [] })
            }
          />
        )}
        {owned.length === 1 && owned[0] && owned[0].owner !== project && (
          <RemoveFromModule
            owned={owned[0]}
            isDirect={moduleConsumers[owned[0].owner]?.includes(project)}
            onRemove={(module, remove) =>
              apply({ module, isNew: false, add: [], remove })
            }
          />
        )}
      </PopoverContent>
    </Popover>
  )
}

function AddToModule(props: {
  project: string
  modules: string[]
  contracts: string[]
  onAdd: (module: string, isNew: boolean, addresses: string[]) => void
}) {
  const [name, setName] = useState('shared-')
  const isValidName =
    name.startsWith('shared-') &&
    name.length > 'shared-'.length &&
    !props.modules.includes(name) &&
    [...name].every((c) => PROJECT_NAME_CHARACTERS.includes(c))

  return (
    <div className="flex flex-col gap-2 text-xs">
      <Header
        title={`Add ${props.contracts.length} ${plural(props.contracts.length, 'contract')} to a module`}
        hint="They become initial addresses of the module. The module and every project using them are rediscovered."
      />
      {props.modules
        .filter((module) => module !== props.project)
        .map((module) => (
          <button
            key={module}
            type="button"
            onClick={() => props.onAdd(module, false, props.contracts)}
            className="rounded border border-coffee-600 bg-coffee-800 px-2 py-1.5 text-left text-coffee-100 hover:bg-coffee-700"
          >
            {module}
          </button>
        ))}
      <form
        className="flex gap-1"
        onSubmit={(event) => {
          event.preventDefault()
          if (isValidName) {
            props.onAdd(name, true, props.contracts)
          }
        }}
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value.trim())}
          aria-label="New module name"
          className="min-w-0 flex-1 rounded border border-coffee-600 bg-coffee-900 px-2 py-1.5 text-coffee-100 focus:border-coffee-400 focus:outline-hidden"
        />
        <button
          type="submit"
          disabled={!isValidName}
          className="rounded border border-coffee-600 bg-coffee-800 px-2 text-coffee-100 hover:bg-coffee-700 disabled:opacity-50"
        >
          New
        </button>
      </form>
    </div>
  )
}

// A module reached only through another module is discovered by that one, so
// removing from it would not hand the contracts back to this project.
function RemoveFromModule(props: {
  owned: Owned
  isDirect: boolean | undefined
  onRemove: (module: string, addresses: string[]) => void
}) {
  const { owner, contracts } = props.owned
  const them = contracts.length === 1 ? 'it' : 'them'
  return (
    <div className="flex flex-col gap-2 text-xs">
      <Header
        title={`${contracts.length} selected ${plural(contracts.length, 'contract')} of ${owner}`}
        hint={
          props.isDirect
            ? `${owner} stops discovering ${them} and the projects using ${them} discover ${them} themselves again. All of them are rediscovered.`
            : `This project reaches ${owner} through another module. Change it from the module that references ${owner}.`
        }
      />
      {props.isDirect && (
        <button
          type="button"
          onClick={() => props.onRemove(owner, contracts)}
          className="rounded border border-coffee-600 bg-coffee-800 px-2 py-1.5 text-left text-coffee-100 hover:bg-coffee-700"
        >
          Remove from {owner}
        </button>
      )}
      <Link
        to={`/ui/p/${owner}`}
        className="text-coffee-300 underline hover:text-coffee-100"
      >
        Open {owner}
      </Link>
    </div>
  )
}

function Header(props: { title: string; hint: string }) {
  return (
    <div className="border-coffee-600/70 border-b pb-2">
      <div className="font-medium text-coffee-100 text-sm">{props.title}</div>
      <div className="text-[11px] text-coffee-300 leading-tight">
        {props.hint}
      </div>
    </div>
  )
}

// Held from the first config write to the last discovery, so a second change
// can not read a config the first one is about to overwrite.
let isModuleChangeRunning = false

function useModuleChange(project: string) {
  const queryClient = useQueryClient()
  return async (change: ModuleChange) => {
    if (isModuleChangeRunning || useTerminalStore.getState().command.inFlight) {
      toast.error('Another command is running')
      return
    }
    isModuleChangeRunning = true
    try {
      await applyModuleChange(project, change, queryClient)
    } catch (error) {
      toast.error(`Updating ${change.module} failed`, {
        id: MODULE_CHANGE_TOAST,
        description: describeError(error),
      })
    } finally {
      isModuleChangeRunning = false
    }
  }
}

// The module is registered before its discovery, so if that discovery fails
// the module is listed and picking it again retries. Every consumer goes
// after it: they only reference the module's contracts once their entrypoints
// exist.
async function applyModuleChange(
  project: string,
  change: ModuleChange,
  queryClient: QueryClient,
) {
  toast.loading(`Updating ${change.module}`, { id: MODULE_CHANGE_TOAST })
  await writeModuleConfig(change)
  await updateModuleEntrypoints(change.module, {
    create: change.isNew,
    remove: change.remove,
  })
  void queryClient.invalidateQueries({ queryKey: ['modules'] })
  const projects = await queryClient.fetchQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })
  const isDiscovered = projects.some((p) => p.name === change.module)
  if (!(await discover(change.module, isDiscovered))) {
    return
  }
  const consumers = await rediscoverStaleConsumers()
  if (consumers === undefined) {
    return
  }
  await queryClient.invalidateQueries({ queryKey: ['projects'] })
  void queryClient.invalidateQueries({ queryKey: ['address-usage'] })
  void queryClient.invalidateQueries({ queryKey: ['config-sync-status'] })
  const kept = groupByOwner(
    await queryClient.fetchQuery(getProjectQueryOptions(project)),
    change.remove,
  ).find((owned) => owned.owner === change.module)
  if (kept) {
    const it = kept.contracts.length === 1
    toast.warning(`${change.module} still discovers some contracts`, {
      id: MODULE_CHANGE_TOAST,
      description: `Another ${change.module} contract points at ${it ? 'it' : 'them'}, so ${it ? 'it stays' : 'they stay'} in the module.`,
    })
    return
  }
  toast.success(
    `Updated ${change.module} and rediscovered ${consumers.length} ${plural(consumers.length, 'project')}`,
    {
      id: MODULE_CHANGE_TOAST,
    },
  )
}

// A rediscovered consumer can itself be a module whose own consumers then go
// stale, so this repeats until nothing is left, bounded by the module depth.
async function rediscoverStaleConsumers(): Promise<string[] | undefined> {
  const rediscovered = new Set<string>()
  for (let round = 0; round < MODULE_DEPTH_MAX; round++) {
    const stale = await getStaleModuleConsumers()
    if (stale.length === 0) {
      return [...rediscovered]
    }
    for (const consumer of stale) {
      if (!(await discover(consumer, true))) {
        return undefined
      }
      rediscovered.add(consumer)
    }
  }
  throw new Error('Consumers are still stale after rediscovery')
}

// The terminal ignores a command while another one runs, so the check has to
// sit right before each discovery, not only at the start.
async function discover(project: string, devMode: boolean): Promise<boolean> {
  const terminal = useTerminalStore.getState()
  if (terminal.command.inFlight) {
    throw new Error('Another command is running')
  }
  toast.loading(`Discovering ${project}`, { id: MODULE_CHANGE_TOAST })
  terminal.setDevMode(devMode)
  const ok = await terminal.discover(project)
  if (!ok) {
    toast.error(`Discovery of ${project} failed, see the terminal`, {
      id: MODULE_CHANGE_TOAST,
    })
  }
  return ok
}

async function writeModuleConfig(change: ModuleChange) {
  if (change.isNew) {
    await createConfigFile(change.module, change.add, false)
    return
  }
  const { config } = await readConfigFile(change.module)
  const updated = ConfigModel.fromRawJsonc(config).updateInitialAddresses({
    add: change.add.map(ChainSpecificAddress),
    remove: change.remove.map(ChainSpecificAddress),
  })
  await updateConfigFile(change.module, updated.toFileContents())
}

function describeError(error: unknown): string | undefined {
  if (!(error instanceof Error)) {
    return undefined
  }
  const cause = error.cause as { error?: string } | undefined
  return cause?.error ?? error.message
}

function groupByOwner(
  response: ApiProjectResponse,
  addresses: readonly string[],
): Owned[] {
  const selected = new Set(addresses)
  const result: Owned[] = []
  for (const chain of response.entries) {
    const contracts = [...chain.initialContracts, ...chain.discoveredContracts]
      .map((c) => c.address)
      .filter((address) => selected.has(address))
    if (contracts.length === 0) {
      continue
    }
    const existing = result.find((o) => o.owner === chain.project)
    if (existing) {
      existing.contracts.push(...contracts)
    } else {
      result.push({ owner: chain.project, contracts })
    }
  }
  return result
}

const MODULE_CHANGE_TOAST = 'module-change'
const MODULE_DEPTH_MAX = 4
const PROJECT_NAME_CHARACTERS = 'abcdefghijklmnopqrstuvwxyz0123456789-'

function plural(count: number, word: string): string {
  return count === 1 ? word : `${word}s`
}
