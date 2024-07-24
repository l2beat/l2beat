'use client'
import { type DaBridge } from '@l2beat/config'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/app/_components/select'
interface Props {
  layerSlug: string
  bridges: DaBridge[]
  defaultValue: string
}

export function DaBridgeSelect({ layerSlug, bridges, defaultValue }: Props) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-2">
      <span>DA Bridge:</span>
      <Select
        defaultValue={defaultValue}
        onValueChange={(bridge) =>
          router.push(`/data-availability/projects/${layerSlug}/${bridge}`)
        }
      >
        <SelectTrigger
          autoFocus
          className="bg-zinc-300 data-[state=open]:bg-gray-200 dark:bg-zinc-800 dark:data-[state=open]:bg-zinc-700 md:bg-gray-100 md:dark:bg-zinc-900"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className="z-110 bg-zinc-300 dark:bg-zinc-800 md:bg-gray-100 md:dark:bg-zinc-900"
          align="start"
        >
          {bridges.map((bridge) => (
            <SelectItem
              key={bridge.id}
              value={bridge.display.slug}
              className="focus:bg-gray-200 dark:focus:bg-zinc-700"
            >
              {bridge.display.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
