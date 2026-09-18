import { Tooltip } from 'flowbite-react'

export function UnknownIcon({ tooltipContent }: { tooltipContent: string }) {
  return (
    <Tooltip content={tooltipContent}>
      <svg
        className="ml-2 h-8 w-8 text-red-500"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {' '}
        <path stroke="none" d="M0 0h24v24H0z" />{' '}
        <path d="M14 3v4a1 1 0 0 0 1 1h4" />{' '}
        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />{' '}
        <path d="M10 12l4 4m0 -4l-4 4" />
      </svg>
    </Tooltip>
  )
}
