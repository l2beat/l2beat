import type { TvsToken } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { EM_DASH } from '~/consts/characters'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'

interface Props {
  bridgedUsing?: TvsToken['bridgedUsing']
}

export function BridgedUsingCell(props: Props) {
  if (!props.bridgedUsing) return EM_DASH

  const bridges = props.bridgedUsing?.bridges

  const firstBridge = bridges?.[0]

  return (
    <div className="flex items-center gap-1">
      {bridges?.length === 1 && firstBridge ? (
        <SingleBridge bridge={firstBridge} />
      ) : (
        <MultipleBridge bridges={bridges ?? []} />
      )}
      {props.bridgedUsing?.warning && (
        <Tooltip>
          <TooltipTrigger>
            <RoundedWarningIcon className="size-4" sentiment="bad" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-2">{props.bridgedUsing.warning}</div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}

function SingleBridge({
  bridge,
}: {
  bridge: NonNullable<TvsToken['bridgedUsing']>['bridges'][number]
}) {
  if (bridge.slug) {
    return (
      <a
        className="flex items-center justify-start gap-1"
        href={`/bridges/projects/${bridge.slug}`}
      >
        <span className="font-medium text-link text-xs underline">
          {bridge.name}
        </span>
        <ArrowRightIcon className="inline-block fill-link transition-transform" />
      </a>
    )
  }

  return <span className="font-medium text-xs">{bridge.name}</span>
}

function MultipleBridge({
  bridges,
}: {
  bridges: NonNullable<TvsToken['bridgedUsing']>['bridges']
}) {
  return (
    <Tooltip>
      <TooltipTrigger className="font-medium text-xs">Multiple</TooltipTrigger>
      <TooltipContent>
        <ul>
          {bridges.map((bridge) => (
            <li key={bridge.name} className="font-medium text-xs">
              {bridge.name}
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  )
}
