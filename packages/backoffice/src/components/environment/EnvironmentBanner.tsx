import { cn } from '~/utils/cn'
import { useEnvironment } from './EnvironmentContext'

export function EnvironmentBanner() {
  const { config } = useEnvironment()

  return (
    <div
      className={cn(
        'sticky top-0 z-999 flex h-environment-banner w-full items-center justify-center',
        config.classNames.dot,
      )}
    >
      <span className="font-medium text-sm text-white uppercase">
        {config.label}
      </span>
    </div>
  )
}
