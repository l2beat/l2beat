import { ServerIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { useSidebar } from '~/components/core/Sidebar'
import {
  type Environment,
  useEnvironment,
} from '~/components/environment/EnvironmentContext'

export function EnvironmentSelector() {
  const { environment, setEnvironment, config, allConfigs } = useEnvironment()
  const { state } = useSidebar()

  if (state === 'collapsed') {
    return (
      <div
        className="flex h-9 items-center justify-center"
        title={`Environment: ${config.label}`}
      >
        <span className="relative flex size-2.5">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${config.classNames.dot}`}
          />
          <span
            className={`relative inline-flex size-2.5 rounded-full ${config.classNames.dot}`}
          />
        </span>
      </div>
    )
  }

  return (
    <Select
      value={environment}
      onValueChange={(value) => setEnvironment(value as Environment)}
    >
      <SelectTrigger className="w-full" size="sm">
        <span className="flex items-center gap-2">
          <ServerIcon className="size-4" />
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent>
        {allConfigs.map(({ id, config }) => {
          return (
            <SelectItem key={id} value={id}>
              <span className="flex items-center gap-2">
                <span
                  className={`size-2 rounded-full ${config.classNames.dot}`}
                />
                <span>{config.label}</span>
              </span>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
