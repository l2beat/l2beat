import type { TvsToken } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { EllipsisText } from '~/components/EllipsisText'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'

interface Props {
  bridgedUsing?: TvsToken['bridgedUsing']
}

export function BridgedUsingCell(props: Props) {
  if (!props.bridgedUsing) return null

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
        <EllipsisText
          className="text-link underline"
          accessoryRight={
            <ArrowRightIcon className="inline-block fill-current" />
          }
        >
          {bridge.name}
        </EllipsisText>
        <ArrowRightIcon className="inline-block fill-link" />
      </a>
    )
  }

  return <EllipsisText>{bridge.name}</EllipsisText>
}

function MultipleBridge({
  bridges,
}: {
  bridges: NonNullable<TvsToken['bridgedUsing']>['bridges']
}) {
  return (
    <Tooltip>
      <TooltipTrigger>Multiple</TooltipTrigger>
      <TooltipContent>
        <ul>
          {bridges.map((bridge) => (
            <li key={bridge.name}>{bridge.name}</li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  )
}
