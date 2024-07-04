'use client'
import { type DaLayer } from '@l2beat/config'
import Link from 'next/link'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/app/_components/popover'
import ChevronIcon from '~/icons/chevron.svg'

interface Props {
  layer: DaLayer
  label: string
}

export function DaBridgeSelect({ layer, label }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span>DA Bridge:</span>
      <Popover>
        <PopoverTrigger>
          {label}
          <ChevronIcon className="group-data-[state=open]:-rotate-180 ease-out duration-300 hidden transition-transform md:block fill-black dark:fill-white" />
        </PopoverTrigger>
        <PopoverContent className="flex flex-col" align="start">
          {layer.bridges.map((bridge) => (
            <Link
              key={`${layer.id}-${bridge.id}`}
              className="w-full outline-none text-left font-semibold text-base gap-1.5 rounded-lg py-2 px-2.5 transition-colors dark:hover:bg-zinc-800 hover:bg-gray-400"
              href={`/data-availability/projects/${layer.id}/${bridge.id}`}
            >
              {bridge.display.name}
            </Link>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  )
}
