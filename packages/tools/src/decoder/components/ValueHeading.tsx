import clsx from 'clsx'
import { Fragment } from 'react/jsx-runtime'

export interface ValueHeadingProps {
  stack: string[]
  type: string
  address?: string
  options?: string[]
  selectedOption?: string
  onSelect?: (selected: string) => void
}

export function ValueHeading(props: ValueHeadingProps) {
  return (
    <div>
      <span className="text-blue-400">{props.stack.join('.')}</span>
      <span className="pl-2 font-mono text-orange-500 text-sm">
        {props.type}
      </span>
      {props.address && (
        <a
          className="select-none pl-2 text-blue-400 text-sm underline"
          href={`https://etherscan.io/address/${props.address}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          etherscan
        </a>
      )}
      {props.options && (
        <span className="select-none pl-2 text-green-700 text-sm">
          [
          {props.options.map((option, i) => (
            <Fragment key={i}>
              <button
                className={clsx(
                  option === props.selectedOption && 'text-green-500 underline',
                )}
                onClick={() => props.onSelect?.(option)}
              >
                {option}
              </button>
              {i + 1 !== props.options?.length && ' | '}
            </Fragment>
          ))}
          ]
        </span>
      )}
    </div>
  )
}
