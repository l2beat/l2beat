'use client'
import { type DaBridge } from '@l2beat/config'
import { useParams, useRouter } from 'next/navigation'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '~/app/_components/select'
interface Props {
  bridges: DaBridge[]
}

export function DaBridgeSelect({ bridges }: Props) {
  const router = useRouter()
  const params = useParams<{ layer: string; bridge: string }>()
  const selectedBridge = bridges.find(
    (bridge) => bridge.display.slug === params.bridge,
  )
  if (!selectedBridge) return null

  return (
    <div className="flex items-center gap-2">
      <span>DA Bridge:</span>
      <Select
        defaultValue={selectedBridge.display.slug} // TODO: defaultValue - find a way to pass it here and not mess up the loading state of select
        onValueChange={(bridge) =>
          router.push(`/data-availability/projects/${params.layer}/${bridge}`)
        }
      >
        <SelectTrigger
          autoFocus
          className="bg-zinc-300 dark:bg-zinc-800 md:dark:bg-zinc-900 md:bg-gray-100 data-[state=open]:bg-gray-200 dark:data-[state=open]:bg-zinc-700"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className="bg-zinc-300 dark:bg-zinc-800 md:dark:bg-zinc-900 md:bg-gray-100 z-110"
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
