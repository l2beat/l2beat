import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { cn } from '../../../utils/cn'
import { useProjectQueryOptions } from '../hooks/projectQuery'
import { NodeGraphPanel } from '../panel-nodes/NodesPanel'
import {
  permissionsStore,
  useStore,
  useStoreApi,
} from '../panel-nodes/store/store'
import { getColor } from '../panel-nodes/view/colors/colors'
import {
  arrangeByRole,
  buildPermissionNodes,
  summarizeRoles,
} from './permissionGraph'

// Repo layouts describe the values graph, so this one keeps its layout local.
// The WebGL renderer does not draw role colors, so the DOM one is used.
export function PermissionsPanel() {
  return (
    <NodeGraphPanel
      panelId="permissions"
      store={permissionsStore}
      buildNodes={buildPermissionNodes}
      showLayoutLibrary={false}
      renderer="dom"
      overlay={<RolesCard />}
    />
  )
}

function RolesCard() {
  const { project } = useParams()
  const { data } = useQuery(useProjectQueryOptions(project ?? ''))
  const roles = useMemo(() => (data ? summarizeRoles(data) : []), [data])
  const store = useStoreApi()
  const selectAndFocus = useStore((state) => state.selectAndFocus)
  const [collapsed, setCollapsed] = useState(false)

  if (roles.length === 0) {
    return null
  }

  return (
    <div className="absolute top-3 left-3 z-10 flex max-h-[calc(100%-120px)] w-60 flex-col rounded-lg border border-coffee-700 bg-coffee-900/95 font-medium text-coffee-200 text-xs shadow-lg">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 px-3 py-2.5"
      >
        <span className="text-sm">Roles</span>
        <span className="text-coffee-400">{roles.length}</span>
        <IconChevronDown
          className={cn('ml-auto size-3.5', collapsed && '-rotate-90')}
        />
      </button>
      {!collapsed && (
        <>
          <div className="min-h-0 overflow-y-auto px-1.5">
            {roles.map((role) => (
              <button
                key={role.role}
                type="button"
                title="Show this role"
                onClick={() => selectAndFocus(role.groupId)}
                className="flex w-full items-center gap-2.5 rounded px-1.5 py-1.5 text-left hover:bg-coffee-700"
              >
                <span
                  className="h-4 w-1 shrink-0 rounded-full"
                  style={{
                    background: getColor({
                      id: role.groupId,
                      color: role.color,
                      hueShift: 0,
                    }).color,
                  }}
                />
                <span className="truncate font-mono">{role.role}</span>
                <span className="ml-auto text-coffee-400 tabular-nums">
                  {role.permissionCount}
                </span>
              </button>
            ))}
          </div>
          <div className="border-coffee-700 border-t px-3 py-2 text-[11px] text-coffee-400">
            dashed = upgrade, solid = interact
          </div>
          <div className="px-2 pb-2">
            <button
              type="button"
              onClick={() => {
                const state = store.getState()
                state.setNodes(arrangeByRole(state.nodes))
              }}
              className="w-full rounded-md border border-coffee-600 bg-coffee-800 py-1.5 hover:bg-coffee-700"
            >
              Arrange by role
            </button>
          </div>
        </>
      )}
    </div>
  )
}
