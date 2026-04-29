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
} from '~/components/environment-selector/EnvironmentContext'

const ENVIRONMENT_DOT_CLASS: Record<Environment, string> = {
  local: 'bg-sky-500',
  staging: 'bg-amber-500',
  production: 'bg-emerald-500',
}

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
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${ENVIRONMENT_DOT_CLASS[environment]}`}
          />
          <span
            className={`relative inline-flex size-2.5 rounded-full ${ENVIRONMENT_DOT_CLASS[environment]}`}
          />
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="px-2 text-muted-foreground text-xs">Environment</span>
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
                    className={`size-2 rounded-full ${ENVIRONMENT_DOT_CLASS[id]}`}
                  />
                  <span>{config.label}</span>
                </span>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
