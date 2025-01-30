import type { TokenBridge, TokenBridgedUsing } from '@l2beat/shared-pure'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { ArrowRightIcon } from '~/icons/arrow-right'
import { RoundedWarningIcon } from '~/icons/rounded-warning'

interface Props {
  bridgedUsing: TokenBridgedUsing
}

export function BridgedUsingCell(props: Props) {
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

function SingleBridge({ bridge }: { bridge: TokenBridge }) {
  if (bridge.slug) {
    return (
      <a
        className="flex items-center justify-start gap-1"
        href={`/bridges/projects/${bridge.slug}`}
      >
        <span className="text-xs font-medium text-link underline">
          {bridge.name}
        </span>
        <ArrowRightIcon className="inline-block fill-link transition-transform" />
      </a>
    )
  }

  return <span className="text-xs font-medium">{bridge.name}</span>
}

function MultipleBridge({ bridges }: { bridges: TokenBridge[] }) {
  return (
    <Tooltip>
      <TooltipTrigger className="text-xs font-medium">Multiple</TooltipTrigger>
      <TooltipContent>
        <ul>
          {bridges.map((bridge) => (
            <li key={bridge.name} className="text-xs font-medium">
              {bridge.name}
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  )
}
