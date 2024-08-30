import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import ArrowRightIcon from '~/icons/arrow-right.svg'
import { RoundedWarningIcon } from '~/icons/rounded-warning'

interface Props {
  bridgedUsing?: {
    bridges: { name: string; slug?: string }[]
    warning?: string
  }
}

export function BridgedUsingCell(props: Props) {
  const bridges = props.bridgedUsing?.bridges

  return (
    <div className="flex items-center gap-1">
      {bridges?.length === 1 ? (
        bridges[0]?.slug ? (
          <a
            className="flex items-center justify-start gap-1"
            href={`/bridges/projects/${props.bridgedUsing?.bridges[0]?.slug}`}
          >
            <span className="text-xs font-medium text-blue-700 underline dark:text-blue-500">
              {props.bridgedUsing?.bridges[0]?.name}
            </span>
            <ArrowRightIcon className="inline-block fill-blue-700 transition-transform dark:fill-blue-500" />
          </a>
        ) : (
          <span className="text-xs font-medium">{bridges[0]?.name}</span>
        )
      ) : (
        <Tooltip>
          <TooltipTrigger className="text-xs font-medium">
            Multiple
          </TooltipTrigger>
          <TooltipContent>
            <ul>
              {props.bridgedUsing?.bridges.map((bridge) => (
                <li key={bridge.name} className="text-xs font-medium">
                  {bridge.name}
                </li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      )}
      {props.bridgedUsing?.warning && (
        <Tooltip>
          <TooltipTrigger>
            <RoundedWarningIcon className="size-4" sentiment="bad" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-2">{props.bridgedUsing?.warning}</div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
