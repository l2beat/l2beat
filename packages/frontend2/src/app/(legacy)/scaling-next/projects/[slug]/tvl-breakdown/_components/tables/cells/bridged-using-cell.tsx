import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/app/_components/tooltip/tooltip'
import ArrowRightIcon from '~/icons/arrow-right.svg'
import { RoundedWarningIcon } from '~/icons/rounded-warning'

interface Props {
  bridge?: {
    name: string
    slug?: string
    warning?: string
  }
}

export function BridgedUsingCell(props: Props) {
  return (
    <div className="flex items-center gap-1">
      {props.bridge?.slug ? (
        <a
          className="flex items-center justify-start gap-1"
          href={`/bridges/projects/${props.bridge?.slug}`}
        >
          <span className="text-xs font-medium text-blue-700 underline dark:text-blue-500">
            {props.bridge?.name}
          </span>
          <ArrowRightIcon className="inline-block fill-blue-700 transition-transform dark:fill-blue-500" />
        </a>
      ) : props.bridge ? (
        <span className="text-xs font-medium">{props.bridge?.name}</span>
      ) : null}
      {props.bridge?.warning && (
        <Tooltip>
          <TooltipTrigger>
            <RoundedWarningIcon className="size-4" sentiment="bad" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-2">{props.bridge.warning}</div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
