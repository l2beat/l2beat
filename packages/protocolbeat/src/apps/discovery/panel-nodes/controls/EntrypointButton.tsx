import { useMemo, useState } from 'react'
import { IconFolder } from '../../../../icons/IconFolder'
import { cn } from '../../../../utils/cn'
import { useProjectData } from '../../hooks/useProjectData'
import { usePanelStore } from '../../store/panel-store'
import { useStore } from '../store/store'
import { getDeclaredEntrypointAddresses } from '../store/utils/entrypointGroups'
import {
  ControlDropdownButton,
  type DropdownOption,
} from './ControlDropdownButton'
import { ManageEntrypointsDialog } from './ManageEntrypointsDialog'

export function EntrypointButton({ className }: { className?: string }) {
  const [manageOpen, setManageOpen] = useState(false)
  const entrypointGroups = useStore((state) => state.entrypointGroups)
  const nodes = useStore((state) => state.nodes)
  const collapsedEntrypointGroups = useStore(
    (state) => state.collapsedEntrypointGroups,
  )
  const setEntrypointGroupsCollapsed = useStore(
    (state) => state.setEntrypointGroupsCollapsed,
  )
  const selectedAddress = usePanelStore((state) => state.selected)
  const { project, projectResponse } = useProjectData()

  const sharedModulesSet = useMemo(
    () => new Set(projectResponse.data?.sharedModules ?? []),
    [projectResponse.data?.sharedModules],
  )

  const nodeIds = useMemo(() => new Set(nodes.map((node) => node.id)), [nodes])
  // Only list entrypoint groups that actually have a contract/EOA present in
  // the opened project; declared entrypoints whose address isn't loaded here
  // would be no-ops to collapse and just clutter the menu.
  const presentGroups = useMemo(
    () =>
      entrypointGroups.filter(
        (group) =>
          getDeclaredEntrypointAddresses(group).some((address) =>
            nodeIds.has(address),
          ) || group.memberAddresses.some((address) => nodeIds.has(address)),
      ),
    [entrypointGroups, nodeIds],
  )

  // A declared entrypoint that is already part of another entrypoint's collapse
  // cluster (e.g. an owner multisig or signer EOA reachable from a gateway
  // entrypoint of the same module) is redundant in this menu: collapsing the
  // parent already hides it. Listing every nested entrypoint separately is what
  // makes modules like shared-sp1 explode into a dozen rows that don't collapse
  // the cluster. So we only surface "root" groups here; collapsing a root
  // collapses its whole subgraph.
  const rootGroups = useMemo(() => {
    return presentGroups.filter((group) => {
      const declared = getDeclaredEntrypointAddresses(group)
      if (declared.length === 0) {
        return true
      }
      const nested = declared.every((address) =>
        presentGroups.some(
          (other) =>
            other.id !== group.id &&
            // Only fold a group into another of the *same* module. A
            // cross-module reference (e.g. shared-sp1's gateway owning taiko's
            // multisig) must NOT hide taiko — it's its own module row.
            other.sourceProject === group.sourceProject &&
            other.memberAddresses.includes(address) &&
            !getDeclaredEntrypointAddresses(other).includes(address),
        ),
      )
      return !nested
    })
  }, [presentGroups])

  // One row per source project (module): collapsing a module folds every one of
  // its entrypoint clusters at once, down to the entrypoint nodes. Nested
  // modules (e.g. taiko pulled into the opened project) get their own line too.
  const moduleRows = useMemo(() => {
    const byProject = new Map<string, typeof rootGroups>()
    for (const group of rootGroups) {
      // The opened project is never a collapsible "module" of itself, even when
      // it declares its own entrypoints — those are just regular nodes here.
      if (group.sourceProject === project) {
        continue
      }
      const list = byProject.get(group.sourceProject) ?? []
      list.push(group)
      byProject.set(group.sourceProject, list)
    }
    return [...byProject.entries()]
      .map(([sourceProject, groups]) => ({ sourceProject, groups }))
      .sort((a, b) => a.sourceProject.localeCompare(b.sourceProject))
  }, [rootGroups, project])

  const options: DropdownOption[] = moduleRows.map(
    ({ sourceProject, groups }) => {
      const groupIds = groups.map((group) => group.id)
      const collapsedCount = groupIds.filter((id) =>
        collapsedEntrypointGroups.includes(id),
      ).length
      const allCollapsed = collapsedCount === groupIds.length
      const noneCollapsed = collapsedCount === 0
      // Distinct present nodes that fold away when the whole module collapses.
      const presentMembers = new Set<string>()
      for (const group of groups) {
        for (const address of group.memberAddresses) {
          if (nodeIds.has(address)) {
            presentMembers.add(address)
          }
        }
      }
      const clusterSize = presentMembers.size
      const notSharedModule =
        sourceProject !== project && !sharedModulesSet.has(sourceProject)
      return {
        label: sourceProject,
        content: (
          <>
            <span className="flex min-w-0 items-center gap-2">
              <span className="shrink-0 text-coffee-300">
                <IconFolder className="size-3.5" />
              </span>
              <span className="truncate">{sourceProject}</span>
              {notSharedModule && (
                <span
                  title={`${sourceProject} is not a shared module of ${project}. Add it as a shared module and re-discover to pull its contracts in.`}
                  className="shrink-0 rounded border border-amber-500/70 bg-amber-900/30 px-1 py-px text-[10px] text-amber-200"
                >
                  not a shared module
                </span>
              )}
              <span
                title={`${clusterSize} node${clusterSize === 1 ? '' : 's'} collapse with this module (down to its entrypoints)`}
                className="shrink-0 rounded-full bg-coffee-800 px-1.5 py-0.5 text-[11px] text-coffee-300/90 tabular-nums leading-none"
              >
                {clusterSize}
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                disabled={noneCollapsed}
                onClick={() => setEntrypointGroupsCollapsed(groupIds, false)}
                className="rounded border border-coffee-500 px-2 py-1 text-coffee-100 text-xs hover:bg-coffee-800 disabled:cursor-default disabled:border-coffee-700 disabled:text-coffee-500"
              >
                Expand
              </button>
              <button
                type="button"
                disabled={allCollapsed}
                onClick={() => setEntrypointGroupsCollapsed(groupIds, true)}
                className="rounded border border-coffee-500 px-2 py-1 text-coffee-100 text-xs hover:bg-coffee-800 disabled:cursor-default disabled:border-coffee-700 disabled:text-coffee-500"
              >
                Collapse
              </button>
            </span>
          </>
        ),
      }
    },
  )
  options.push({
    label: 'Manage entrypoints...',
    onSelect: () => setManageOpen(true),
    disabled: !selectedAddress,
  })

  return (
    <>
      <ControlDropdownButton
        label="Entrypoints"
        icon={<IconFolder className="size-3.5" />}
        className={cn('px-3 py-2.5', className)}
        options={options}
      />
      <ManageEntrypointsDialog open={manageOpen} onOpenChange={setManageOpen} />
    </>
  )
}
