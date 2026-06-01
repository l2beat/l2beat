import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { parse, stringify } from 'comment-json'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  addSharedModule,
  readEntrypointsFile,
  removeSharedModule,
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
  const navigate = useNavigate()
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
  const sharedModulesSet = useMemo(
    () => new Set(projectResponse.data?.sharedModules ?? []),
    [projectResponse.data?.sharedModules],
  )
  // Categorize by whether the project is a sharedModule of the opened project,
  // not by whether the address is an entrypoint there. Only sharedModules are
  // actually pulled into the opened project's discovery; everything else is
  // just "another project that also uses this address".
  const [sharedModuleProjects, otherProjects] = useMemo(() => {
    const shared = appearances.filter((entry) =>
      sharedModulesSet.has(entry.project),
    )
    const other = appearances.filter(
      (entry) => !sharedModulesSet.has(entry.project),
    )
    return [shared, other]
  }, [appearances, sharedModulesSet])
  const ownAppearance = useMemo(() => {
    const all =
      selected && 'allAppearances' in selected ? selected.allAppearances : []
    return all.find((entry) => entry.project === project)
  }, [selected, project])
  // Whether the selected address is declared as an entrypoint of the *opened*
  // project itself (its own entrypoints.json), used for the top toggle button.
  const isEntrypointOfOpenProject = ownAppearance?.hasEntrypoint === true
  // The opened project lists this address among its own (non-referenced)
  // discovered entries when its discovered.json has NOT yet applied an
  // entrypoint that another project declares for it. Once discovery accounts
  // for the entrypoint, the address becomes a Reference to the entrypoint's
  // project and stops appearing as an own entry of the opened project. So an
  // own appearance that is not itself an entrypoint means: re-discover needed.
  const entrypointUndiscovered =
    ownAppearance !== undefined && !ownAppearance.hasEntrypoint

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

  const addSharedModuleMutation = useMutation({
    mutationFn: async ({ moduleProject }: { moduleProject: string }) => {
      const result = await addSharedModule(project, moduleProject)
      return { moduleProject, linked: result.linked }
    },
    onSuccess: async ({ moduleProject, linked }) => {
      await queryClient.invalidateQueries(getProjectQueryOptions(project))
      await queryClient.invalidateQueries({
        queryKey: ['config-sync-status', project],
      })
      if (linked) {
        toast.success(
          `Added ${moduleProject} to ${project} sharedModules — re-discover ${project} to apply it.`,
        )
      } else {
        toast.message(`${moduleProject} is already a shared module of ${project}`)
      }
    },
    onError: (error) => {
      toast.error('Failed to add shared module', {
        description: String(error),
      })
    },
  })

  const removeSharedModuleMutation = useMutation({
    mutationFn: async ({ moduleProject }: { moduleProject: string }) => {
      const result = await removeSharedModule(project, moduleProject)
      return { moduleProject, unlinked: result.unlinked }
    },
    onSuccess: async ({ moduleProject, unlinked }) => {
      await queryClient.invalidateQueries(getProjectQueryOptions(project))
      await queryClient.invalidateQueries({
        queryKey: ['config-sync-status', project],
      })
      if (unlinked) {
        toast.success(
          `Removed ${moduleProject} from ${project} sharedModules — re-discover ${project} to drop it from the graph.`,
        )
      } else {
        toast.message(`${moduleProject} is not a shared module of ${project}`)
      }
    },
    onError: (error) => {
      toast.error('Failed to remove shared module', {
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
      // Only writes the entrypoint into that project's entrypoints.json.
      // Linking it into the opened project is a separate, explicit action
      // ("Add as shared module").
      return updateEntrypointsFile(targetProject, nextContent)
    },
    onSuccess: async (_result, { targetProject }) => {
      await queryClient.invalidateQueries({
        queryKey: ['entrypoints-files', targetProject],
      })
      await queryClient.invalidateQueries(getProjectQueryOptions(project))
      await queryClient.invalidateQueries({
        queryKey: ['projects', targetProject],
      })
      toast.success(`Entrypoint saved (${targetProject}/entrypoints.json)`)
      setAddModalOpen(false)
    },
    onError: (error) => {
      toast.error('Failed to save entrypoint', {
        description: String(error),
      })
    },
  })

  const removeMutation = useMutation({
    mutationFn: async ({ targetProject }: { targetProject: string }) => {
      if (!selected) {
        throw new Error('No address selected')
      }

      const file = await readEntrypointsFile(targetProject)
      const parsed = parseEntrypointsFile(file.content)
      const entrypoints = asRecord(parsed.entrypoints) ?? {}
      if (!(selected.address in entrypoints)) {
        return { targetProject, removed: false, unlinked: false }
      }

      delete entrypoints[selected.address]
      parsed.entrypoints = entrypoints

      // When the target project has no entrypoints left, drop the sharedModules
      // link this project added for it — otherwise it stays loaded as its own
      // project section instead of being treated as a contract of this project.
      const isLastEntrypoint =
        Object.keys(entrypoints).length === 0 && targetProject !== project

      const nextContent = stringify(parsed, null, 2)
      const result = await updateEntrypointsFile(
        targetProject,
        nextContent.endsWith('\n') ? nextContent : `${nextContent}\n`,
        undefined,
        isLastEntrypoint ? project : undefined,
      )
      return {
        targetProject,
        removed: true,
        unlinked: result.sharedModuleUnlinked,
      }
    },
    onSuccess: async ({ targetProject, removed, unlinked }) => {
      await queryClient.invalidateQueries({
        queryKey: ['entrypoints-files', targetProject],
      })
      await queryClient.invalidateQueries(getProjectQueryOptions(project))
      await queryClient.invalidateQueries({
        queryKey: ['projects', targetProject],
      })
      await queryClient.invalidateQueries({
        queryKey: ['config-sync-status', project],
      })
      if (!removed) {
        toast.message(`No entrypoint for this address in ${targetProject}`)
        return
      }
      if (unlinked) {
        toast.success(
          `Entrypoint removed (${targetProject}/entrypoints.json). Unlinked ${targetProject} from ${project} sharedModules — re-run discovery for ${project} to drop it from the graph.`,
        )
      } else {
        toast.success(`Entrypoint removed (${targetProject}/entrypoints.json)`)
      }
    },
    onError: (error) => {
      toast.error('Failed to remove entrypoint', {
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

  const openProjectInDisco = (targetProject: string) => {
    props.onOpenChange(false)
    navigate(`/ui/p/${targetProject}`)
  }

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
              <div className="flex items-start justify-between gap-2 rounded border border-coffee-500 p-3">
                <div className="min-w-0">
                  <div className="font-medium text-coffee-100 text-sm">
                    {selected.name ?? selected.address}
                  </div>
                  <div className="truncate font-mono text-coffee-300 text-xs">
                    {selected.address}
                  </div>
                </div>
                {isEntrypointOfOpenProject ? (
                  <button
                    type="button"
                    disabled={
                      removeMutation.isPending &&
                      removeMutation.variables?.targetProject === project
                    }
                    className="shrink-0 rounded border border-coffee-500 px-2 py-1 text-coffee-100 text-xs hover:bg-coffee-700 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() =>
                      removeMutation.mutate({ targetProject: project })
                    }
                    title={`Remove this address from ${project}/entrypoints.json`}
                  >
                    {removeMutation.isPending &&
                    removeMutation.variables?.targetProject === project
                      ? 'Removing…'
                      : 'Remove entrypoint'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="shrink-0 rounded border border-coffee-500 px-2 py-1 text-coffee-100 text-xs hover:bg-coffee-700"
                    onClick={() => openAddModal(project)}
                    title={`Add this address as an entrypoint of ${project}`}
                  >
                    Add as entrypoint
                  </button>
                )}
              </div>

              <Section
                title="Shared modules"
                description={`Projects linked to ${project} via sharedModules. Their entrypoints are pulled into ${project}'s discovery once it is re-discovered.`}
              >
                {sharedModuleProjects.length === 0 && (
                  <EmptyRow message="This address is not provided by any shared module of this project." />
                )}
                {sharedModuleProjects.length > 0 && entrypointUndiscovered && (
                  <div className="flex flex-col gap-2 rounded border border-amber-600/60 bg-amber-950/30 px-3 py-2">
                    <span className="text-amber-200 text-xs">
                      {`${project}'s discovery hasn't applied this yet — it still `}
                      {`discovers this address itself instead of referencing the `}
                      {`shared module. Re-discover ${project} to apply it.`}
                    </span>
                    <button
                      type="button"
                      disabled={
                        discoveryInFlight || refreshDiscoveriesMutation.isPending
                      }
                      className="self-start rounded border border-amber-500/70 bg-amber-900/40 px-2 py-1 text-amber-100 text-xs hover:bg-amber-800/50 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={() => refreshDiscoveriesMutation.mutate([project])}
                    >
                      {refreshDiscoveriesMutation.isPending
                        ? 'Re-discovering…'
                        : `Re-discover ${project}`}
                    </button>
                  </div>
                )}
                {sharedModuleProjects.map((entry) => {
                  const removingModule =
                    removeSharedModuleMutation.isPending &&
                    removeSharedModuleMutation.variables?.moduleProject ===
                      entry.project
                  return (
                    <div
                      key={entry.project}
                      className="flex items-center justify-between rounded border border-coffee-600 px-3 py-2"
                    >
                      <span className="flex items-center gap-2 text-coffee-100 text-sm">
                        {entry.project}
                        <OpenProjectArrow
                          project={entry.project}
                          onNavigate={openProjectInDisco}
                        />
                        {entry.hasEntrypoint && (
                          <span className="text-coffee-400 text-xs italic">
                            as entrypoint
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        {entry.hasEntrypoint && entrypointUndiscovered && (
                          <span
                            title={`This entrypoint is not reflected in ${project}'s discovered.json yet. Re-discover ${project} to apply it.`}
                            className="rounded border border-amber-500/70 bg-amber-900/30 px-1 py-px text-[10px] text-amber-200"
                          >
                            undiscovered
                          </span>
                        )}
                        {entry.hasEntrypoint && (
                          <button
                            type="button"
                            disabled={removeMutation.isPending}
                            className="rounded border border-coffee-500 px-2 py-1 text-coffee-200 text-xs hover:bg-coffee-700 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() =>
                              removeMutation.mutate({ targetProject: entry.project })
                            }
                          >
                            {removeMutation.isPending &&
                            removeMutation.variables?.targetProject ===
                              entry.project
                              ? 'Removing…'
                              : 'Remove entrypoint'}
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={removeSharedModuleMutation.isPending}
                          className="rounded border border-coffee-500 px-2 py-1 text-coffee-200 text-xs hover:bg-coffee-700 disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={() =>
                            removeSharedModuleMutation.mutate({
                              moduleProject: entry.project,
                            })
                          }
                          title={`Remove ${entry.project} from ${project}'s sharedModules`}
                        >
                          {removingModule ? 'Removing…' : 'Remove shared module'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </Section>

              <Section
                title="Other projects"
                description="Projects where this address also appears but which are not shared modules of this project."
              >
                {otherProjects.length === 0 && (
                  <EmptyRow message="No additional projects found." />
                )}
                {otherProjects.map((entry) => {
                  const addingThis =
                    addSharedModuleMutation.isPending &&
                    addSharedModuleMutation.variables?.moduleProject ===
                      entry.project
                  return (
                    <div
                      key={entry.project}
                      className="flex items-center justify-between gap-2 rounded border border-coffee-600 px-3 py-2"
                    >
                      <span className="flex items-center gap-2 text-coffee-100 text-sm">
                        {entry.project}
                        <OpenProjectArrow
                          project={entry.project}
                          onNavigate={openProjectInDisco}
                        />
                        {entry.hasEntrypoint && (
                          <span className="text-coffee-400 text-xs italic">
                            as entrypoint
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        {!entry.hasEntrypoint && (
                          <button
                            type="button"
                            className="rounded border border-coffee-500 px-2 py-1 text-coffee-200 text-xs hover:bg-coffee-700"
                            onClick={() => openAddModal(entry.project)}
                          >
                            Add as entrypoint
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={addSharedModuleMutation.isPending}
                          className="rounded border border-coffee-500 px-2 py-1 text-coffee-200 text-xs hover:bg-coffee-700 disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={() =>
                            addSharedModuleMutation.mutate({
                              moduleProject: entry.project,
                            })
                          }
                        >
                          {addingThis ? 'Adding…' : 'Add as shared module'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </Section>

              <Section
                title="Create new project"
                description="Start a brand-new discovery project with this address as an initial address, following the usual new-project flow."
              >
                <div className="flex items-center justify-between gap-2 rounded border border-coffee-600 px-3 py-2">
                  <span className="text-coffee-300 text-xs">
                    Opens the new project page prefilled with this address as an
                    initial address.
                  </span>
                  <button
                    type="button"
                    className="shrink-0 rounded border border-coffee-500 px-2 py-1 text-coffee-200 text-xs hover:bg-coffee-700"
                    onClick={() => {
                      props.onOpenChange(false)
                      navigate(
                        `/ui/new?address=${encodeURIComponent(selected.address)}`,
                      )
                    }}
                  >
                    Create new project
                  </button>
                </div>
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
              Writes to{' '}
              <span className="font-mono">
                {form.project.trim()}/entrypoints.json
              </span>
              {form.project.trim() !== project && (
                <>
                  {' '}
                  only. To pull it into <span className="font-mono">{project}</span>,
                  use "Add as shared module" and re-discover.
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

function OpenProjectArrow(props: {
  project: string
  onNavigate: (project: string) => void
}) {
  return (
    <button
      type="button"
      aria-label={`Open ${props.project} in Disco`}
      title={`Open ${props.project} in Disco`}
      className="shrink-0 rounded border border-coffee-600 px-1 py-px text-coffee-300 text-xs leading-none hover:bg-coffee-700 hover:text-coffee-100"
      onClick={() => props.onNavigate(props.project)}
    >
      ↗
    </button>
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
