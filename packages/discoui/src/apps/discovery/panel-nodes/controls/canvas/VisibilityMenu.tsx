import { IconContractUnverified } from '../../../../../icons/IconContractUnverified'
import { IconShield } from '../../../../../icons/IconShield'
import { useStore } from '../../store/store'
import {
  getGraphProjection,
  isHideable,
} from '../../store/utils/graphProjection'
import { countCriticalLeaves } from '../../store/utils/securityPerimeter'
import { IconControlEye } from '../icons/IconControlEye'
import { IconControlEyeOff } from '../icons/IconControlEyeOff'
import { IconControlPerimeter } from '../icons/IconControlPerimeter'
import { ToolbarMenu } from '../ToolbarMenu'

export function VisibilityMenu() {
  const nodes = useStore((state) => state.nodes)
  const showHidden = useStore((state) => state.showHidden)
  const hideUnreachable = useStore((state) => state.hideUnreachable)
  const showSecurityPerimeter = useStore(
    (state) => state.userPreferences.showSecurityPerimeter,
  )
  const setPreferences = useStore((state) => state.setPreferences)
  const projection = getGraphProjection(nodes)
  const criticalCount = countCriticalLeaves(nodes, projection.hiddenNodeIds)

  const visibleUnreachableCount = projection.leafNodes.filter(
    (node) =>
      !node.isReachable &&
      !projection.hiddenNodeIds.has(node.id) &&
      isHideable(projection, node),
  ).length

  return (
    <ToolbarMenu
      label="Visibility"
      icon={<IconControlEye />}
      description="Hide or show nodes and fields across the whole graph."
      sections={[
        [
          {
            label: 'Show all hidden fields',
            icon: <IconControlEye />,
            count: projection.hiddenFieldCount,
            disabled: projection.hiddenFieldCount === 0,
            onSelect: showHidden,
          },
          {
            label: 'Hide unreachable nodes',
            icon: <IconControlEyeOff />,
            count: visibleUnreachableCount,
            disabled: visibleUnreachableCount === 0,
            onSelect: hideUnreachable,
          },
        ],
        [
          {
            label: showSecurityPerimeter
              ? 'Hide security perimeter'
              : 'Show security perimeter',
            icon: <IconControlPerimeter />,
            count: criticalCount > 0 ? criticalCount : undefined,
            disabled: criticalCount === 0,
            onSelect: () =>
              setPreferences({
                showSecurityPerimeter: !showSecurityPerimeter,
              }),
          },
        ],
      ]}
      footer={<HeaderBadgeKey />}
    />
  )
}

function HeaderBadgeKey() {
  return (
    <div className="flex flex-col gap-1 px-2 py-1.5 text-coffee-400 text-xs">
      <span>In a node's header</span>
      <span className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-aux-green" />
        Initial contract
      </span>
      <span className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-aux-orange" />
        Has a template
      </span>
      <span className="flex items-center gap-2">
        <IconShield className="-mx-0.5 size-3 text-aux-yellow" />
        Ossification-critical
      </span>
      <span className="flex items-center gap-2">
        <IconContractUnverified className="-mx-0.5 size-3 text-aux-red" />
        Unverified contract
      </span>
    </div>
  )
}
