'use client'
import Link from 'next/link'
import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/app/_components/popover'
import ChevronIcon from '~/icons/chevron.svg'
import { type DaProjectEntry } from '~/server/features/data-availability/get-da-project-entry'
interface Props {
  project: DaProjectEntry
}

export function DaBridgeSelect({ project }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex items-center gap-2">
      <span>DA Bridge:</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="dark:bg-zinc-800">
          {project.selectedBridge.name}
          <ChevronIcon className="group-data-[state=open]:-rotate-180 ease-out duration-300 transition-transform fill-black dark:fill-white" />
        </PopoverTrigger>
        <PopoverContent className="flex flex-col" align="start">
          {project.bridges.map((bridge) =>
            bridge.name === project.selectedBridge.name ? (
              <button
                key={bridge.id}
                onClick={() => setOpen(false)}
                className="w-full outline-none text-left font-semibold text-base gap-1.5 rounded-lg py-2 px-2.5 transition-colors dark:hover:bg-zinc-800 hover:bg-gray-400"
              >
                {bridge.name}
              </button>
            ) : (
              <Link
                key={bridge.id}
                className="w-full outline-none text-left font-semibold text-base gap-1.5 rounded-lg py-2 px-2.5 transition-colors dark:hover:bg-zinc-800 hover:bg-gray-400"
                href={`/data-availability/projects/${project.slug}/${bridge.slug}`}
              >
                {bridge.name}
              </Link>
            ),
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
