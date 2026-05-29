import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { parse, stringify } from 'comment-json'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  readEntrypointsFile,
  updateEntrypointsFile,
} from '../../../../api/api'
import { Dialog } from '../../../../components/Dialog'
import { removeJSONTrailingCommas } from '../../../../utils/removeJSONTrailingCommas'
import { getProjectQueryOptions } from '../../hooks/projectQuery'
import { useProjectData } from '../../hooks/useProjectData'
import {
  collectUsedEntrypointColors,
  pickUnusedEntrypointColor,
  readEntrypointsFileColor,
} from '../entrypointColors'
import { useTerminalStore } from '../../panel-terminal/store'
import { useStore } from '../store/store'
import { ColorPicker } from './ColorPicker'

const REFRESH_DISCOVERY_TOAST_ID = 'entrypoints.discovery.refresh'

interface ManageEntrypointsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type EntrypointType = 'Contract' | 'EOA'

type AddEntrypointForm = {
  name: string
  type: EntrypointType
  project: string
  color: number
}

export function ManageEntrypointsDialog(props: ManageEntrypointsDialogProps) {
  const queryClient = useQueryClient()
  const { project, selected } = useProjectData()
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [form, setForm] = useState<AddEntrypointForm>({
    name: '',
    type: 'Contract',
    project: '',
    color: 1,
  })
  const [colorInitialized, setColorInitialized] = useState(false)

  const saveTargetProject = addModalOpen ? form.project.trim() : project
  const projectResponse = useQuery(getProjectQueryOptions(project))
  const nodes = useStore((state) => state.nodes)

  const entrypointsFileQuery = useQuery({
    queryKey: ['entrypoints-files', saveTargetProject],
    queryFn: () => readEntrypointsFile(saveTargetProject),
    enabled: (props.open || addModalOpen) && saveTargetProject.length > 0,
  })

  const canManage = !!selected && 'fields' in selected

  const appearances = useMemo(() => {
    const all =
      selected && 'allAppearances' in selected
        ? selected.allAppearances
        : (selected?.appearsInProjects ?? [])
    return all.filter((entry) => entry.project !== project)
  }, [selected, project])
  const [entrypointsProjects, otherProjects] = useMemo(() => {
    const withEntrypoint = appearances.filter((entry) => entry.hasEntrypoint)
    const withoutEntrypoint = appearances.filter((entry) => !entry.hasEntrypoint)
    return [withEntrypoint, withoutEntrypoint]
  }, [appearances])
  const otherProjectNames = useMemo(
    () => [...new Set(otherProjects.map((entry) => entry.project))],
    [otherProjects],
  )

  const discover = useTerminalStore((state) => state.discover)
  const discoveryInFlight = useTerminalStore((state) => state.command.inFlight)

  const refreshDiscoveriesMutation = useMutation({
    mutationFn: async (projects: readonly string[]) => {
      for (let index = 0; index < projects.length; index++) {
        const targetProject = projects[index]
        toast.loading(
          `Discovering ${targetProject} (${index + 1}/${projects.length})…`,
          { id: REFRESH_DISCOVERY_TOAST_ID },
        )
        const ok = await discover(targetProject)
        if (!ok) {
          throw new Error(`Discovery failed for ${targetProject}`)
        }
      }
    },
    onSuccess: async (_, projects) => {
      await queryClient.invalidateQueries(getProjectQueryOptions(project))
      for (const targetProject of projects) {
        await queryClient.invalidateQueries({
          queryKey: ['projects', targetProject],
        })
        await queryClient.invalidateQueries({
          queryKey: ['config-sync-status', targetProject],
        })
      }
      toast.success(
        `Discovery finished for ${projects.length} project${projects.length === 1 ? '' : 's'}`,
        { id: REFRESH_DISCOVERY_TOAST_ID },
      )
    },
    onError: (error) => {
      toast.error('Discovery refresh stopped', {
        id: REFRESH_DISCOVERY_TOAST_ID,
        description: String(error),
      })
    },
  })

  const saveMutation = useMutation({
    mutationFn: async ({
      targetProject,
      nextContent,
    }: {
      targetProject: string
      nextContent: string
    }) => {
      return updateEntrypointsFile(targetProject, nextContent, project)
    },
    onSuccess: async (result, { targetProject }) => {
      await queryClient.invalidateQueries({
        queryKey: ['entrypoints-files', targetProject],
      })
      await queryClient.invalidateQueries(getProjectQueryOptions(project))
      const parts = [`${targetProject}/entrypoints.json`]
      if (result.sharedModuleLinked) {
        parts.push(`${project}/config.jsonc sharedModules`)
      }
      toast.success(`Entrypoint saved (${parts.join(', ')})`)
      setAddModalOpen(false)
    },
    onError: (error) => {
      toast.error('Failed to save entrypoint', {
        description: String(error),
      })
    },
  })

  useEffect(() => {
    if (!addModalOpen) {
      setColorInitialized(false)
      return
    }
    if (colorInitialized || entrypointsFileQuery.isLoading) {
      return
    }
    const fileColor = readEntrypointsFileColor(entrypointsFileQuery.data?.content)
    if (fileColor !== undefined && fileColor > 0) {
      setForm((current) => ({ ...current, color: fileColor }))
      setColorInitialized(true)
      return
    }
    const used = collectUsedEntrypointColors(
      projectResponse.data?.entrypointGroups ?? [],
      nodes,
    )
    setForm((current) => ({
      ...current,
      color: pickUnusedEntrypointColor(used),
    }))
    setColorInitialized(true)
  }, [
    addModalOpen,
    colorInitialized,
    entrypointsFileQuery.data,
    entrypointsFileQuery.isLoading,
    nodes,
    projectResponse.data?.entrypointGroups,
  ])

  const openAddModal = (sourceProject: string) => {
    const defaultType: EntrypointType =
      selected?.type === 'EOA' || selected?.type === 'EOAPermissioned'
        ? 'EOA'
        : 'Contract'
    const used = collectUsedEntrypointColors(
      projectResponse.data?.entrypointGroups ?? [],
      nodes,
    )
    setForm({
      name: selected?.name ?? '',
      type: defaultType,
      project: sourceProject,
      color: pickUnusedEntrypointColor(used),
    })
    setColorInitialized(false)
    setAddModalOpen(true)
  }

  const onSave = () => {
    if (!selected) {
      return
    }

    const targetProject = form.project.trim()
    if (targetProject.length === 0) {
      return
    }

    try {
      const existingContent = entrypointsFileQuery.data?.content
      const parsed = parseEntrypointsFile(existingContent)

      const entrypoints = asRecord(parsed.entrypoints) ?? {}
      const nextEntrypoint: Record<string, string> = {
        type: form.type,
        project: targetProject,
      }
      const trimmedName = form.name.trim()
      if (trimmedName.length > 0) {
        nextEntrypoint.name = trimmedName
      }
      entrypoints[selected.address] = nextEntrypoint
      parsed.entrypoints = entrypoints
      if (form.color > 0) {
        parsed.color = form.color
      } else {
        delete parsed.color
      }

      const nextContent = stringify(parsed, null, 2)
      saveMutation.mutate({
        targetProject,
        nextContent: nextContent.endsWith('\n') ? nextContent : `${nextContent}\n`,
      })
    } catch (error) {
      toast.error('Invalid entrypoints file format', {
        description: String(error),
      })
    }
  }

  return (
    <>
      <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
        <Dialog.Body className="max-w-[720px]">
          <Dialog.Title>Manage entrypoints</Dialog.Title>
          {!canManage && (
            <p className="text-coffee-200 text-sm">
              Select a contract node first.
            </p>
          )}
          {canManage && selected && (
            <div className="space-y-4">
              <div className="rounded border border-coffee-500 p-3">
                <div className="font-medium text-coffee-100 text-sm">
                  {selected.name ?? selected.address}
                </div>
                <div className="font-mono text-coffee-300 text-xs">
                  {selected.address}
                </div>
              </div>

              <Section
                title="Entrypoints"
                description="Projects where this address is declared in entrypoints.json (including shared modules)."
              >
                {entrypointsProjects.length === 0 && (
                  <EmptyRow message="No entrypoints found for this address." />
                )}
                {entrypointsProjects.map((entry) => (
                  <div
                    key={entry.project}
                    className="flex items-center justify-between rounded border border-coffee-600 px-3 py-2"
                  >
                    <span className="text-coffee-100 text-sm">{entry.project}</span>
                    <span className="rounded border border-coffee-500 px-1 py-px text-[10px] text-coffee-300">
                      Entrypoint
                    </span>
                  </div>
                ))}
              </Section>

              <Section
                title="Other projects"
                description="Projects where this address appears but is not in entrypoints yet. Saving updates that project's entrypoints.json and adds it to this project's sharedModules."
              >
                {otherProjectNames.length > 0 && (
                  <button
                    type="button"
                    disabled={
                      discoveryInFlight || refreshDiscoveriesMutation.isPending
                    }
                    className="w-full rounded border border-coffee-500 bg-coffee-800 px-3 py-2 text-coffee-100 text-sm hover:bg-coffee-700 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() =>
                      refreshDiscoveriesMutation.mutate(otherProjectNames)
                    }
                  >
                    {refreshDiscoveriesMutation.isPending
                      ? 'Refreshing discovery…'
                      : 'Refresh discovery for entrypoints'}
                  </button>
                )}
                {otherProjects.length === 0 && (
                  <EmptyRow message="No additional projects found." />
                )}
                {otherProjects.map((entry) => (
                  <div
                    key={entry.project}
                    className="flex items-center justify-between rounded border border-coffee-600 px-3 py-2"
                  >
                    <span className="text-coffee-100 text-sm">{entry.project}</span>
                    <button
                      type="button"
                      className="rounded border border-coffee-500 px-2 py-1 text-coffee-200 text-xs hover:bg-coffee-700"
                      onClick={() => openAddModal(entry.project)}
                    >
                      Add as entrypoint
                    </button>
                  </div>
                ))}
              </Section>
            </div>
          )}
        </Dialog.Body>
      </Dialog.Root>

      <Dialog.Root open={addModalOpen} onOpenChange={setAddModalOpen}>
        <Dialog.Body className="max-w-[560px]">
          <Dialog.Title>Add as entrypoint</Dialog.Title>
          {form.project.trim().length > 0 && (
            <p className="text-coffee-300 text-xs">
              Writes to <span className="font-mono">{form.project.trim()}/entrypoints.json</span>
              {form.project.trim() !== project && (
                <>
                  {' '}
                  and adds <span className="font-mono">{form.project.trim()}</span> to{' '}
                  <span className="font-mono">{project}</span> sharedModules
                </>
              )}
            </p>
          )}
          <div className="space-y-3">
            <Label title="Address">
              <div className="rounded border border-coffee-600 bg-coffee-800 px-3 py-2 font-mono text-coffee-200 text-xs">
                {selected?.address}
              </div>
            </Label>
            <Label title="Name">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-label="Entrypoint name"
                className="w-full border border-coffee-600 bg-coffee-800 px-3 py-2 text-coffee-100 text-sm"
              />
            </Label>
            <Label title="Type">
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as EntrypointType })
                }
                aria-label="Entrypoint type"
                className="w-full border border-coffee-600 bg-coffee-800 px-3 py-2 text-coffee-100 text-sm"
              >
                <option value="Contract">Contract</option>
                <option value="EOA">EOA</option>
              </select>
            </Label>
            <Label title="Project folder">
              <input
                value={form.project}
                onChange={(e) => {
                  setColorInitialized(false)
                  setForm({ ...form, project: e.target.value })
                }}
                aria-label="Project folder for entrypoints.json"
                className="w-full border border-coffee-600 bg-coffee-800 px-3 py-2 text-coffee-100 text-sm"
              />
            </Label>
            <div className="rounded border border-coffee-600 bg-coffee-800 p-3">
              <ColorPicker
                value={form.color}
                onChange={(color) => setForm({ ...form, color })}
                title="Entrypoint color"
                description="Applied to all contracts in this entrypoint group."
                showAutoOption={false}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="rounded border border-coffee-600 px-3 py-1.5 text-coffee-200 text-sm hover:bg-coffee-700"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saveMutation.isPending || form.project.trim().length === 0}
                className="rounded border border-coffee-500 bg-coffee-800 px-3 py-1.5 text-coffee-100 text-sm hover:bg-coffee-700 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={onSave}
              >
                Save
              </button>
            </div>
          </div>
        </Dialog.Body>
      </Dialog.Root>
    </>
  )
}

function Section(props: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="font-medium text-coffee-100 text-sm">{props.title}</h3>
        <p className="text-coffee-300 text-xs">{props.description}</p>
      </div>
      <div className="space-y-2">{props.children}</div>
    </div>
  )
}

function EmptyRow(props: { message: string }) {
  return (
    <div className="rounded border border-dashed border-coffee-600 px-3 py-2 text-coffee-300 text-xs">
      {props.message}
    </div>
  )
}

function Label(props: { title: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-coffee-300 text-xs">{props.title}</span>
      {props.children}
    </label>
  )
}

function parseEntrypointsFile(content: string | undefined): Record<string, unknown> {
  if (!content || content.trim().length === 0) {
    return { entrypoints: {} }
  }
  const parsed = parse(removeJSONTrailingCommas(content))
  return asRecord(parsed) ?? { entrypoints: {} }
}

function asRecord(
  value: unknown,
): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return undefined
  }
  return value as Record<string, unknown>
}
